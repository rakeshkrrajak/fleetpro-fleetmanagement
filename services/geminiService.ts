

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { GroundingChunk, MockStop } from "../types";


const API_KEY = process.env.API_KEY;

// Only initialize 'ai' if the API_KEY is valid. This is crucial.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
      ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
      console.error("Failed to initialize GoogleGenAI, likely due to an invalid API Key format.", e);
      ai = null;
  }
} else {
  console.warn("API_KEY environment variable not found. Gemini API calls will be mocked.");
}

export const getMaintenanceAdviceFromGemini = async (
  make: string,
  model: string,
  year: number,
  mileage: number
): Promise<{ advice: string[]; sources: GroundingChunk[] | null; error?: string }> => {
  if (!ai) {
    console.warn("Gemini service not available. Returning mock maintenance advice.");
    const mockAdvice = [
      `For a ${year} ${make} ${model}, it is recommended to change the oil and filter every 7,500 to 10,000 km to ensure engine longevity.`,
      `Given the vehicle has ${mileage.toLocaleString()} km, a thorough inspection of the tire tread and pressure is advised. Consider rotation if not done recently.`,
      `At this mileage, it is crucial to have the brake pads, rotors, and brake fluid checked for wear and effectiveness.`,
      `Regularly check and top up all essential fluids, including coolant, brake fluid, power steering fluid, and windshield washer fluid.`,
      `Test the battery's health, especially if it's over 3 years old, to prevent unexpected starting issues.`,
      `*(This is mock data. Configure API_KEY in your environment for live advice.)*`
    ];
    return { advice: mockAdvice, sources: null, error: undefined };
  }
  
  const prompt = `Provide common maintenance advice for a ${year} ${make} ${model} with ${mileage} miles. 
Focus on typical checks, fluid changes, and part replacements for a vehicle of this age and mileage. 
Use Google Search for up-to-date information if relevant.
Respond with a valid JSON object in the following format only. Do not include any introductory or concluding paragraphs or markdown formatting like \`\`\`json.
{
  "advice": ["string (first advice point in a full sentence)", "string (second advice point in a full sentence)", "string (third advice point, etc.)"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
        temperature: 0.5, 
      }
    });
    
    const textResponse = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || null;

    if (!textResponse) {
      return { advice: [], sources: null, error: "No advice received from Gemini." };
    }
    
    let jsonStr = textResponse.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (!parsedData || !Array.isArray(parsedData.advice)) {
        throw new Error("Invalid JSON structure in Gemini response. 'advice' should be an array.");
    }
    
    return { advice: parsedData.advice, sources };
  } catch (error) {
    console.error("Error fetching maintenance advice from Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with Gemini API.";
    return { advice: [], sources: null, error: `Failed to get maintenance advice: ${errorMessage}` };
  }
};

export const getTripSuggestionsFromGemini = async (
  origin: string,
  destination: string,
  waypoints: string[], 
  vehicleType: string = "commercial truck" 
): Promise<{ 
  routeSuggestion?: string; 
  suggestedStops?: MockStop[]; 
  estimatedDistance?: string; 
  estimatedDuration?: string; 
  error?: string 
}> => {
  if (!ai) {
    console.warn("Gemini service not available. Returning mock trip suggestions.");
    return {
        routeSuggestion: `Mock Route: A standard highway route from ${origin} to ${destination} is suggested. This typically involves NH48 or relevant national highways. (This is mock data. Configure API_KEY in your environment for live suggestions.)`,
        suggestedStops: [
            { id: 'mock1', name: 'Mock Toll Plaza 1', type: 'Toll', estimatedCost: 120, notes: 'Near major junction', locationHint: 'Near major junction' },
            { id: 'mock2', name: 'Mock Fuel Stop (IOCL)', type: 'Fuel', notes: '24/7 facility with rest area', locationHint: '24/7 facility with rest area' },
            { id: 'mock3', name: 'Mock Toll Plaza 2', type: 'Toll', estimatedCost: 95, notes: 'State border crossing', locationHint: 'State border crossing' },
        ],
        estimatedDistance: `${Math.floor(400 + Math.random() * 200)} km`,
        estimatedDuration: `${Math.floor(8 + Math.random() * 4)} hours`,
        error: undefined
    };
  }

  let prompt = `Plan a route for a ${vehicleType} in India from ${origin} to ${destination}. `;
  if (waypoints.length > 0) {
    prompt += `The route must pass through the following waypoints in order: ${waypoints.join(', ')}. `;
  }
  prompt += `
Provide a brief textual route suggestion. 
Estimate the total distance (in km) and duration.
Suggest 2-3 potential toll plazas typically encountered on such a route, and 2-3 suitable locations or types of fuel stops for a ${vehicleType}.
Respond with a valid JSON object in the following format only. Do not include markdown formatting like \`\`\`json.
{
  "routeSuggestion": "string",
  "estimatedDistance": "string (e.g., '500 km')",
  "estimatedDuration": "string (e.g., '10 hours')",
  "suggestedStops": [
    {
      "id": "string (randomly generated)",
      "name": "string",
      "type": "Toll" | "Fuel" | "Rest Area" | "Other",
      "estimatedCost": "number (for tolls, in INR, optional)",
      "notes": "string (brief notes or location hint, optional)",
      "locationHint": "string (same as notes, optional)"
    }
  ]
}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.6,
        responseMimeType: "application/json",
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      return { error: "No suggestion received from Gemini." };
    }
    
    let jsonStr = textResponse.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (typeof parsedData.routeSuggestion !== 'string' || !Array.isArray(parsedData.suggestedStops)) {
        throw new Error("Invalid JSON structure in Gemini response.");
    }
    
    return { 
      routeSuggestion: parsedData.routeSuggestion, 
      suggestedStops: parsedData.suggestedStops, 
      estimatedDistance: parsedData.estimatedDistance, 
      estimatedDuration: parsedData.estimatedDuration 
    };

  } catch (error) {
    console.error("Error fetching trip suggestions from Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with Gemini API.";
    return { error: `Failed to get trip suggestions: ${errorMessage}` };
  }
};

export const getCostForecastFromGemini = async (
  summaryData: string
): Promise<{ forecast?: string; savingsAdvice?: string[]; error?: string }> => {
  if (!ai) {
    console.warn("Gemini service not available. Returning mock cost forecast.");
    return {
        forecast: `Based on the provided data, expect a slight increase in fuel costs next quarter due to seasonal demand. Maintenance costs may remain stable if preventive schedules are followed.`,
        savingsAdvice: [
            "Implement route optimization software to potentially reduce mileage by 5-10%.",
            "Negotiate bulk discounts for frequently replaced parts like tires and filters with a primary vendor.",
            "Conduct driver training on fuel-efficient driving techniques to reduce consumption."
        ],
        error: undefined,
    };
  }

  const prompt = `
Based on the following fleet cost summary data, provide a brief textual cost forecast for the next quarter and suggest 2-3 actionable, specific cost-saving measures for a fleet manager in India.
Respond with a valid JSON object in the following format only. Do not include markdown formatting like \`\`\`json.
{
  "forecast": "string (the forecast text, in one or two sentences)",
  "savingsAdvice": ["string (first specific saving advice)", "string (second specific saving advice)", "string (third specific saving advice, optional)"]
}

Fleet Cost Summary:
${summaryData}
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      return { forecast: "", savingsAdvice: [], error: "No forecast received from Gemini." };
    }

    let jsonStr = textResponse.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (typeof parsedData.forecast !== 'string' || !Array.isArray(parsedData.savingsAdvice)) {
        throw new Error("Invalid JSON structure in Gemini response.");
    }
    
    return { forecast: parsedData.forecast, savingsAdvice: parsedData.savingsAdvice };
  } catch (error) {
    console.error("Error fetching cost forecast from Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with Gemini API.";
    return { forecast: "", savingsAdvice: [], error: `Failed to get cost forecast: ${errorMessage}` };
  }
};