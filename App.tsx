

import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import MapOverviewPage from './pages/MapOverviewPage';
import CompliancePage from './pages/CompliancePage';
import SettingsPage from './pages/SettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import TripsPage from './pages/TripsPage'; 
import TelematicsAlertsPage from './pages/TelematicsAlertsPage'; 
import TelematicsDashboardPage from './pages/TelematicsDashboardPage';
import TelematicsEmailLogPage from './pages/TelematicsEmailLogPage';

import FleetOverviewDashboardPage from './pages/FleetOverviewDashboardPage';
import AdvancedFleetInsightsPage from './pages/AdvancedFleetInsightsPage';
import SafetyComplianceDashboardPage from './pages/SafetyComplianceDashboardPage'; 


// Cost Management Pages
import CostDashboardPage from './pages/cost_management/CostDashboardPage';
import CostCategoriesPage from './pages/cost_management/CostCategoriesPage';
import VehicleCostEntryPage from './pages/cost_management/VehicleCostEntryPage';
import FuelLogPage from './pages/cost_management/FuelLogPage';
import FuelDashboardPage from './pages/cost_management/FuelDashboardPage';

// Maintenance Management Pages
import MaintenanceDashboardPage from './pages/maintenance/MaintenanceDashboardPage';
import MaintenanceTasksPage from './pages/maintenance/MaintenanceTasksPage';
import MechanicsDirectoryPage from './pages/maintenance/MechanicsDirectoryPage';

// Wholesale Finance App components
import WholesaleSidebar from './components/WholesaleSidebar';
import WholesaleDashboardPage from './pages/wholesale/WholesaleDashboardPage';
import DealershipsPage from './pages/wholesale/DealershipsPage';
import CreditLinesPage from './pages/wholesale/CreditLinesPage';
import InventoryPage from './pages/wholesale/InventoryPage';
import AuditsPage from './pages/wholesale/AuditsPage';


import { 
  // FleetPro Types
  Vehicle, Driver, User, Trip, TelematicsAlert, AlertType, 
  VehicleStatus, DocumentType, VehicleDocument, 
  UserRole, UserStatus, TripStatus, CostCategory, CostEntry, FuelLogEntry, FuelType,
  MaintenanceTask, MaintenanceType, MaintenanceTaskStatus, Mechanic, MaintenancePart,
  SimulatedEmail,
  // Wholesale Finance Types
  Dealership, DealershipStatus, CreditLine, CreditLineStatus, InventoryUnit, InventoryUnitStatus, HypothecationStatus, Audit, AuditStatus, AuditedVehicle
} from './types';
import { 
  // FleetPro Constants
  MOCK_DRIVERS_COUNT, MOCK_VEHICLES_COUNT, MOCK_USERS_COUNT, MOCK_TRIPS_COUNT,
  MOCK_ALERTS_MAX_PER_VEHICLE,
  DEFAULT_PLACEHOLDER_IMAGE_SIZE, DEFAULT_DRIVER_PLACEHOLDER_IMAGE_URL,
  TELEMETRY_SIMULATION_INTERVAL, ALERT_GENERATION_INTERVAL, MAX_SIMULATED_SPEED_KMPH, MIN_SIMULATED_SPEED_KMPH, SPEEDING_THRESHOLD_KMPH, IDLE_SPEED_THRESHOLD_KMPH,
  MOCK_COST_CATEGORIES_COUNT, MOCK_COST_ENTRIES_COUNT, MOCK_FUEL_LOGS_COUNT,
  MOCK_MAINTENANCE_TASKS_COUNT, MOCK_MECHANICS_COUNT, MAINTENANCE_DUE_DAYS_THRESHOLD,
  BANGALORE_CENTER_LAT, BANGALORE_CENTER_LON, 
  BANGALORE_MAP_COORD_VARIATION_LAT, BANGALORE_MAP_COORD_VARIATION_LON,
  TELEMETRY_MAP_UPDATE_STEP,
  MOCK_INITIAL_EMAILS_TO_GENERATE, MAX_SIMULATED_EMAILS,
  // Wholesale Finance Constants
  MOCK_DEALERSHIPS_COUNT, MOCK_INVENTORY_UNITS_PER_DEALER, MOCK_AUDITS_COUNT
} from './constants';

const generateMockId = () => Math.random().toString(36).substring(2, 10);
const generateVin = () => `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

const generateFutureDate = (days: number, fromDate?: Date): string => {
  const date = fromDate ? new Date(fromDate) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const generatePastDate = (days: number, includeTime = false): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return includeTime ? date.toISOString() : date.toISOString().split('T')[0];
}

// Helper function to get descriptive text for vehicle image placeholders
const getVehicleImageText = (make: string, model: string): string => {
  const lcMake = make.toLowerCase();
  const lcModel = model.toLowerCase();

  // Specific models from the generation list for more accuracy
  if (lcMake === 'ford' && lcModel === 'transit') return "Ford Transit Van";
  if (lcMake === 'tata' && lcModel === 'nexon') return "Tata Nexon SUV";
  if (lcMake === 'mahindra' && lcModel === 'xuv700') return "Mahindra XUV700";
  if (lcMake === 'maruti suzuki' && lcModel === 'swift') return "Maruti Swift";
  if (lcMake === 'hyundai' && lcModel === 'creta') return "Hyundai Creta";
  if (lcMake === 'ashok leyland' && lcModel === 'dost') return "AL Dost LCV";
  if (lcMake === 'eicher' && lcModel.startsWith('pro')) return `Eicher ${model}`;
  if (lcMake === 'volvo' && lcModel.startsWith('fm')) return `Volvo ${model} Truck`;
  if (lcMake === 'bharatbenz') return `${make} Truck`;
  if (lcMake === 'scania' && lcModel.startsWith('r')) return `Scania ${model} Truck`;
  if (lcMake === 'man' && lcModel.startsWith('cla')) return `MAN ${model} Truck`;
  if (lcMake === 'force' && lcModel === 'traveller') return "Force Traveller Van";
  if (lcMake === 'isuzu' && lcModel === 'd-max') return "Isuzu D-Max Pickup";
  if (lcMake === 'sml isuzu' && lcModel.startsWith('samrat')) return `SML ${model}`;
  if (lcMake === 'piaggio' && lcModel === 'ape') return "Piaggio Ape";
  if (lcMake === 'atul auto' && lcModel === 'gem') return "Atul Gem";
  if (lcMake === 'kia' && lcModel === 'seltos') return "Kia Seltos SUV";

  // General categories as fallback
  if (['ashok leyland', 'eicher', 'volvo', 'bharatbenz', 'scania', 'man', 'sml isuzu'].includes(lcMake)) return `${make} Truck`;
  if (['tata', 'mahindra'].includes(lcMake) && (lcModel.includes('truck') || lcModel.includes('tipper') || lcModel.includes('lorry') || lcModel.includes('cargo') || lcModel.includes('yodha') || lcModel.includes('intra') || lcModel.includes('furio') || lcModel.includes('jayo'))) return `${make} Truck`;
  if (['xuv', 'safari', 'harrier', 'compass', 'thar', 'fortuner', 'endeavour', 'kushaq', 'taigun', 'sonet', 'venue', 'brezza'].some(suv => lcModel.includes(suv))) return `${make} SUV`;
  if (['swift', 'baleno', 'i20', 'polo', 'verna', 'city', 'amaze', 'ciaz', 'tiago', 'altroz', 'glanza', 'dzire', 'ignis', 'celerio', 'wagonr', 's-presso', 'alto'].some(car => lcModel.includes(car))) return `${make} Car`;
  if (['van', 'eeco', 'omni', 'winger', 'supro', 'ace'].some(van => lcModel.includes(van))) return `${make} Van`;
  
  // Default to Make and Model if no specific category found
  return `${make} ${model}`;
};


const App: React.FC = () => {
  // Fleet Management State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]); 
  const [telematicsAlerts, setTelematicsAlerts] = useState<TelematicsAlert[]>([]);
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>([]);
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);
  const [fuelLogEntries, setFuelLogEntries] = useState<FuelLogEntry[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  
  // Wholesale Finance State
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [creditLines, setCreditLines] = useState<CreditLine[]>([]);
  const [inventory, setInventory] = useState<InventoryUnit[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);


  const [isLoading, setIsLoading] = useState(true);
  const [currentApp, setCurrentApp] = useState<'fleet' | 'wholesale'>('fleet');


  useEffect(() => {
    // ---- FLEETPRO MOCK DATA GENERATION ----
    
    // Cost Categories
    const initialCostCategories: CostCategory[] = [
        { id: 'cat-fuel', name: 'Fuel', isSystemDefined: true, description: 'All fuel-related expenses.' },
        { id: 'cat-maintenance', name: 'Maintenance & Repairs', isSystemDefined: true, description: 'Scheduled and unscheduled maintenance costs.' },
        { id: 'cat-tolls', name: 'Tolls & Fastag', isSystemDefined: false, description: 'Highway tolls and Fastag recharges.' },
        { id: 'cat-insurance', name: 'Insurance', isSystemDefined: false, description: 'Vehicle insurance premiums.' },
        { id: 'cat-fines', name: 'Fines & Penalties', isSystemDefined: false, description: 'Traffic violation fines and other penalties.' },
    ];

    // Mechanics
    const initialMechanics: Mechanic[] = Array.from({ length: MOCK_MECHANICS_COUNT }, (_, i) => ({
        id: generateMockId(),
        name: ['Speedy Lube', 'AutoCare Experts', 'In-House Team A', 'Wheel Masters', 'Engine Wizards'][i % 5],
        contactPerson: ['Mr. Sharma', 'Ravi', 'Team Lead', 'Suresh', 'Anand'][i % 5],
        phoneNumber: `987654321${i}`,
        isInternal: i === 2,
        specialties: i === 0 ? ['Oil Change', 'Tires'] : i === 1 ? ['Brakes', 'AC'] : ['General', 'Engine'],
        rating: 3.5 + Math.random() * 1.5,
    }));
    
    // Vehicles
    const vehicleMakesAndModels = [
        { make: "Tata", models: ["Ace", "Intra", "Yodha", "Nexon", "Harrier"] },
        { make: "Ashok Leyland", models: ["Dost", "Bada Dost", "Partner", "Ecomet"] },
        { make: 'Mahindra', models: ["Bolero", "Scorpio", "XUV700", "Jayo", "Furio"] },
        { make: 'Maruti Suzuki', models: ["Eeco", "Super Carry", "Swift", "Dzire"] },
        { make: 'BharatBenz', models: ["1015R", "1617R", "3528C"] },
        { make: 'Eicher', models: ["Pro 2049", "Pro 3015", "Pro 6028"] },
        { make: 'Ford', models: ["Transit"] },
    ];

    const initialVehicles: Vehicle[] = Array.from({ length: MOCK_VEHICLES_COUNT }, (_, i) => {
        const makeModelInfo = vehicleMakesAndModels[i % vehicleMakesAndModels.length];
        const make = makeModelInfo.make;
        const model = makeModelInfo.models[i % makeModelInfo.models.length];
        const year = 2018 + (i % 6);
        const status = Object.values(VehicleStatus)[i % Object.values(VehicleStatus).length];
        
        const pucExpiryDays = Math.random() > 0.8 ? -10 : Math.floor(Math.random() * 100);
        const insuranceExpiryDays = Math.random() > 0.8 ? -20 : Math.floor(Math.random() * 365);
        const fitnessExpiryDays = Math.random() > 0.8 ? -5 : Math.floor(Math.random() * 730);

        return {
            id: generateMockId(),
            vin: generateVin(),
            make,
            model,
            year,
            licensePlate: `KA${String(i + 1).padStart(2, '0')}AB${String(1000 + i).padStart(4, '0')}`,
            status,
            mileage: 20000 + Math.floor(Math.random() * 150000),
            imageUrl: `https://placehold.co/600x400/1f2937/9ca3af?text=${encodeURIComponent(getVehicleImageText(make, model))}`,
            rcNumber: `RC${String(100000 + i)}`,
            rcExpiryDate: generateFutureDate(365 * 2), // Typically long validity
            pucExpiryDate: generateFutureDate(pucExpiryDays),
            insurancePolicyNumber: `POL${String(987654 - i)}`,
            insuranceExpiryDate: generateFutureDate(insuranceExpiryDays),
            fitnessCertificateNumber: `FIT${String(12345 + i)}`,
            fitnessExpiryDate: generateFutureDate(fitnessExpiryDays),
            fastagId: `FASTAG${String(1000000 + i)}`,
            isAIS140Compliant: Math.random() > 0.3,
            lastKnownLocation: {
                lat: BANGALORE_CENTER_LAT + (Math.random() - 0.5) * BANGALORE_MAP_COORD_VARIATION_LAT * 2,
                lon: BANGALORE_CENTER_LON + (Math.random() - 0.5) * BANGALORE_MAP_COORD_VARIATION_LON * 2,
                timestamp: new Date().toISOString()
            },
            currentSpeedKmph: status === VehicleStatus.ACTIVE ? Math.floor(Math.random() * MAX_SIMULATED_SPEED_KMPH) : 0,
            isIgnitionOn: status === VehicleStatus.ACTIVE ? Math.random() > 0.2 : false,
            documents: [],
            nextMaintenanceDueDate: generateFutureDate(Math.floor(Math.random() * 180)),
            nextMaintenanceMileage: 25000 + Math.floor(Math.random() * 150000),
            lastMaintenanceDate: generatePastDate(Math.floor(Math.random() * 180)),
        };
    });

    // Drivers
    const driverNames = ["Rajesh Kumar", "Priya Sharma", "Amit Singh", "Sunita Devi", "Vikram Rathod", "Anjali Mehta", "Sanjay Patel", "Deepa Rao", "Manoj Gupta"];
    const initialDrivers: Driver[] = Array.from({ length: MOCK_DRIVERS_COUNT }, (_, i) => ({
        id: generateMockId(),
        name: driverNames[i % driverNames.length],
        licenseNumber: `DL${String(10000 + i).padStart(8, '0')}`,
        contact: `+91987654321${i}`,
        assignedVehicleId: i < MOCK_VEHICLES_COUNT ? initialVehicles[i].id : null,
        imageUrl: DEFAULT_DRIVER_PLACEHOLDER_IMAGE_URL.replace('D&font=', `${driverNames[i % driverNames.length].charAt(0)}&font=`),
        dlExpiryDate: generateFutureDate(Math.floor(Math.random() * 730)),
        aadhaarNumber: `${String(1000 + i).padStart(4, '0')} ${String(2000 + i).padStart(4, '0')} ${String(3000 + i).padStart(4, '0')}`,
        panNumber: `ABCDE${String(1234+i)}F`,
        email: `${driverNames[i % driverNames.length].split(' ')[0].toLowerCase()}${i}@example.com`,
    }));

    // Users
    const initialUsers: User[] = Array.from({ length: MOCK_USERS_COUNT }, (_, i) => {
        const roles = [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.DRIVER, UserRole.MECHANIC_USER];
        const userNames = ["Admin User", "Fleet Manager User", "Driver User", "Mechanic User"];
        return {
            id: generateMockId(),
            name: userNames[i],
            email: `${userNames[i].replace(' ','').toLowerCase()}@fleetpro.com`,
            role: roles[i],
            status: UserStatus.ACTIVE,
            createdAt: generatePastDate(i * 10)
        };
    });

    // Fuel Logs
    const initialFuelLogs: FuelLogEntry[] = Array.from({ length: MOCK_FUEL_LOGS_COUNT }, (_, i) => {
        const vehicle = initialVehicles[i % initialVehicles.length];
        const fuelType = [FuelType.DIESEL, FuelType.PETROL, FuelType.CNG][i % 3];
        const quantity = 20 + Math.random() * 30;
        const costPerUnit = fuelType === FuelType.DIESEL ? 90 + Math.random() * 5 : fuelType === FuelType.PETROL ? 100 + Math.random() * 5 : 80 + Math.random() * 5;
        return {
            id: generateMockId(),
            vehicleId: vehicle.id,
            date: generatePastDate(i * 5),
            fuelType,
            quantity,
            costPerUnit,
            totalCost: quantity * costPerUnit,
            odometerReading: vehicle.mileage - (i * 250),
            stationName: `Indian Oil ${i}`,
            fuelBillFileName: `fuel_bill_${2024+i}.pdf`
        };
    });

    // Cost Entries (non-fuel)
    const initialCostEntries: CostEntry[] = Array.from({ length: MOCK_COST_ENTRIES_COUNT }, (_, i) => {
        const nonFuelCategories = initialCostCategories.filter(c => c.name !== 'Fuel');
        return {
            id: generateMockId(),
            date: generatePastDate(i * 10),
            costCategoryId: nonFuelCategories[i % nonFuelCategories.length].id,
            vehicleId: initialVehicles[i % initialVehicles.length].id,
            amount: 500 + Math.random() * 5000,
            description: `Cost entry #${i}`,
            vendor: ['Tire World', 'Quick Service Auto', 'Parts Galaxy', 'Highway Toll Plaza'][i % 4],
            receiptFileName: `INV${1000 + i}.pdf`,
        };
    });

    // Maintenance Tasks
    const initialMaintenanceTasks: MaintenanceTask[] = Array.from({ length: MOCK_MAINTENANCE_TASKS_COUNT }, (_, i) => {
        const vehicle = initialVehicles[i % initialVehicles.length];
        const status = Object.values(MaintenanceTaskStatus)[i % Object.values(MaintenanceTaskStatus).length];
        const parts: MaintenancePart[] = [{ name: 'Oil Filter', quantity: 1, cost: 350 }, { name: 'Engine Oil', quantity: 5, cost: 400 }];
        const partsCost = parts.reduce((sum, p) => sum + (p.cost || 0) * p.quantity, 0);
        const laborCost = 500 + Math.random() * 1500;
        return {
            id: generateMockId(),
            vehicleId: vehicle.id,
            title: ['Engine Oil Change', 'Brake Pad Replacement', 'AC Service', 'Tire Rotation', 'Annual Inspection'][i % 5],
            maintenanceType: Object.values(MaintenanceType)[i % Object.values(MaintenanceType).length],
            status,
            scheduledDate: generatePastDate(30 - i),
            completionDate: status === MaintenanceTaskStatus.COMPLETED ? generatePastDate(30 - i - 2) : undefined,
            mechanicId: initialMechanics[i % initialMechanics.length].id,
            odometerAtMaintenance: vehicle.mileage - (i * 1000),
            partsReplaced: parts,
            laborCost,
            partsCost,
            totalCost: laborCost + partsCost,
        };
    });

    // Trips
    const initialTrips: Trip[] = Array.from({ length: MOCK_TRIPS_COUNT }, (_, i) => ({
        id: generateMockId(),
        tripName: `Trip from ${['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Pune'][i%5]} to ${['Bangalore', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow'][i%5]}`,
        vehicleId: initialVehicles[i % initialVehicles.length].id,
        driverId: initialDrivers[i % initialDrivers.length].id,
        origin: ['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Pune'][i%5],
        destination: ['Bangalore', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow'][i%5],
        waypoints: [{ id: generateMockId(), address: 'Intermediate City', sequence: 1 }],
        scheduledStartDate: generatePastDate(5 - i),
        status: Object.values(TripStatus)[i % Object.values(TripStatus).length],
        estimatedDistanceKm: 500 + Math.random() * 1000,
    }));

    // Alerts
    const initialAlerts: TelematicsAlert[] = [];
    initialVehicles.forEach(vehicle => {
        for (let i = 0; i < MOCK_ALERTS_MAX_PER_VEHICLE; i++) {
            const alertType = Object.values(AlertType)[Math.floor(Math.random() * Object.values(AlertType).length)];
            initialAlerts.push({
                id: generateMockId(),
                vehicleId: vehicle.id,
                vehicleName: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
                type: alertType,
                timestamp: generatePastDate(i * 2),
                details: `Mock alert for ${alertType}`,
                isAcknowledged: Math.random() > 0.5
            });
        }
    });

    // Emails
    const initialEmails: SimulatedEmail[] = Array.from({ length: MOCK_INITIAL_EMAILS_TO_GENERATE }, (_, i) => {
        const alert = initialAlerts[i % initialAlerts.length];
        const driver = initialDrivers.find(d => d.assignedVehicleId === alert.vehicleId);
        return {
            id: generateMockId(),
            recipient: driver?.email || `unknown.driver@example.com`,
            subject: `[${alert.type}] Alert for Vehicle ${alert.vehicleName}`,
            body: `Dear Driver,\n\nThis is a notification for a ${alert.type} event.\nDetails: ${alert.details}\nTimestamp: ${alert.timestamp}\n\nPlease take appropriate action.\n\nThanks,\nFleetPro System`,
            timestamp: alert.timestamp,
            vehicleId: alert.vehicleId,
            alertType: alert.type
        };
    });
    
    // Set all FleetPro states
    setVehicles(initialVehicles);
    setDrivers(initialDrivers);
    setUsers(initialUsers);
    setTrips(initialTrips);
    setTelematicsAlerts(initialAlerts);
    setSimulatedEmails(initialEmails);
    setCostCategories(initialCostCategories);
    setCostEntries(initialCostEntries);
    setFuelLogEntries(initialFuelLogs);
    setMaintenanceTasks(initialMaintenanceTasks);
    setMechanics(initialMechanics);


    // ---- WHOLESALE FINANCE MOCK DATA GENERATION ----
    const initialDealerships: Dealership[] = [];
    const initialCreditLines: CreditLine[] = [];
    const initialInventory: InventoryUnit[] = [];

    const dealerNames = ["Prestige Motors", "Capital Auto", "Sunrise Cars", "Galaxy Trucks", "Pioneer Commercials", "National Auto", "Metro Vehicles", "United Dealers"];
    const dealerLocations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata", "Ahmedabad"];

    for (let i = 0; i < MOCK_DEALERSHIPS_COUNT; i++) {
        const dealerId = generateMockId();
        const creditLineId = generateMockId();
        const totalLimit = (50 + Math.floor(Math.random() * 150)) * 100000; // 50 Lakhs to 2 Crores
        
        const creditLine: CreditLine = {
            id: creditLineId,
            dealershipId: dealerId,
            totalLimit: totalLimit,
            availableCredit: totalLimit, // Initially full
            interestRate: 11.5 + Math.random() * 2,
            status: CreditLineStatus.ACTIVE,
            interestAccrued: 0
        };

        const dealership: Dealership = {
            id: dealerId,
            name: dealerNames[i % dealerNames.length],
            dealerPrincipal: `Mr. ${['Sharma', 'Verma', 'Patel', 'Reddy'][i % 4]}`,
            location: dealerLocations[i % dealerLocations.length],
            status: DealershipStatus.ACTIVE,
            agreementDate: generatePastDate(100 + i * 50),
            creditLineId: creditLineId
        };
        initialDealerships.push(dealership);
        initialCreditLines.push(creditLine);
    }
    
    initialDealerships.forEach(dealer => {
        const creditLine = initialCreditLines.find(cl => cl.dealershipId === dealer.id);
        if (!creditLine) return;
        
        let usedCredit = 0;
        for (let i = 0; i < MOCK_INVENTORY_UNITS_PER_DEALER; i++) {
            const isSold = Math.random() < 0.4;
            const fundingDate = generatePastDate(10 + Math.floor(Math.random() * 80));
            const financedAmount = (5 + Math.floor(Math.random() * 20)) * 100000; // 5 to 25 Lakhs
            
            const daysInStock = isSold ? 
                (new Date(generateFutureDate(0, new Date(fundingDate))).getTime() - new Date(fundingDate).getTime()) / (1000 * 3600 * 24)
                : (new Date().getTime() - new Date(fundingDate).getTime()) / (1000 * 3600 * 24);

            const inventoryUnit: InventoryUnit = {
                vin: generateVin(),
                dealershipId: dealer.id,
                oemInvoiceNumber: `OEM-INV-${Math.floor(10000 + Math.random() * 90000)}`,
                make: ["Tata", "Ashok Leyland", "Eicher", "BharatBenz"][i % 4],
                model: ["Ace", "Dost", "Pro 2049", "1015R"][i % 4],
                year: 2023,
                financedAmount,
                fundingDate,
                status: isSold ? InventoryUnitStatus.REPAID : InventoryUnitStatus.IN_STOCK,
                daysInStock: Math.floor(daysInStock),
                hypothecationStatus: HypothecationStatus.COMPLETED,
                repaymentDate: isSold ? generateFutureDate(0, new Date(fundingDate)) : undefined,
                repaymentAmount: isSold ? financedAmount * 1.02 : undefined // Small markup
            };
            
            if(!isSold) {
                usedCredit += financedAmount;
            }
            initialInventory.push(inventoryUnit);
        }
        creditLine.availableCredit -= usedCredit;
    });

    const initialAudits: Audit[] = [];
    for(let i=0; i<MOCK_AUDITS_COUNT; i++) {
        const dealer = initialDealerships[i % initialDealerships.length];
        const dealerInventory = initialInventory.filter(inv => inv.dealershipId === dealer.id && inv.status === InventoryUnitStatus.IN_STOCK);
        
        const auditedVehicles: AuditedVehicle[] = dealerInventory.map(inv => ({
            vin: inv.vin,
            verificationStatus: Math.random() > 0.1 ? "Verified" : "Missing",
            notes: ""
        }));

        initialAudits.push({
            id: generateMockId(),
            dealershipId: dealer.id,
            auditDate: i < 2 ? generatePastDate(10 + i * 15) : generateFutureDate(5 + i*5),
            auditorName: ["PwC Audit Team", "Internal Auditor"][i%2],
            status: i < 2 ? AuditStatus.COMPLETED : AuditStatus.SCHEDULED,
            auditedVehicles
        });
    }

    setDealerships(initialDealerships);
    setCreditLines(initialCreditLines);
    setInventory(initialInventory);
    setAudits(initialAudits);
    
    setIsLoading(false);
  }, []);

  // Interval for simulating vehicle telemetry and alerts
  useEffect(() => {
    if (currentApp !== 'fleet') return; // Only run simulation for the FleetPro app

    const simulationInterval = setInterval(() => {
      let newAlerts: TelematicsAlert[] = [];
      setVehicles(prevVehicles =>
        prevVehicles.map(v => {
          // Telemetry update logic
          if (v.status !== VehicleStatus.ACTIVE || !v.lastKnownLocation) {
            return v;
          }
          // Simple random walk for location
          const latChange = (Math.random() - 0.5) * TELEMETRY_MAP_UPDATE_STEP;
          const lonChange = (Math.random() - 0.5) * TELEMETRY_MAP_UPDATE_STEP;
          
          let newLat = v.lastKnownLocation.lat + latChange;
          let newLon = v.lastKnownLocation.lon + lonChange;

          // Keep within Bangalore-ish bounds to prevent them from flying off the map
          if (newLat > BANGALORE_CENTER_LAT + BANGALORE_MAP_COORD_VARIATION_LAT || newLat < BANGALORE_CENTER_LAT - BANGALORE_MAP_COORD_VARIATION_LAT) {
              newLat = v.lastKnownLocation.lat - latChange; // reverse direction
          }
           if (newLon > BANGALORE_CENTER_LON + BANGALORE_MAP_COORD_VARIATION_LON || newLon < BANGALORE_CENTER_LON - BANGALORE_MAP_COORD_VARIATION_LON) {
              newLon = v.lastKnownLocation.lon - lonChange; // reverse direction
          }

          const newSpeed = Math.floor(Math.random() * MAX_SIMULATED_SPEED_KMPH);
          const newIgnition = newSpeed > IDLE_SPEED_THRESHOLD_KMPH;

          // Alert generation logic - every vehicle has a small chance to generate an alert each tick
          if (Math.random() < 0.1) { // 10% chance per vehicle per tick
                const alertTypes = [AlertType.SPEEDING, AlertType.HARSH_BRAKING, AlertType.IDLING];
                const newAlertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
                
                const newAlert: TelematicsAlert = {
                    id: generateMockId(),
                    vehicleId: v.id,
                    vehicleName: `${v.make} ${v.model} (${v.licensePlate})`,
                    type: newAlertType,
                    timestamp: new Date().toISOString(),
                    details: `Simulated ${newAlertType} event detected.`,
                    isAcknowledged: false,
                    location: {lat: newLat, lon: newLon},
                };
                newAlerts.push(newAlert);
          }

          return {
            ...v,
            currentSpeedKmph: newSpeed,
            isIgnitionOn: newIgnition,
            lastKnownLocation: {
              lat: newLat,
              lon: newLon,
              timestamp: new Date().toISOString(),
            },
          };
        })
      );
      
      if (newAlerts.length > 0) {
          setTelematicsAlerts(prevAlerts => [...newAlerts, ...prevAlerts].slice(0, MAX_SIMULATED_EMAILS)); // also cap the number of alerts
      }

    }, TELEMETRY_SIMULATION_INTERVAL);

    return () => {
      clearInterval(simulationInterval);
    };
  }, [currentApp]); // Only depends on currentApp to start/stop the simulation


  // --- FLEETPRO CALLBACKS ---
  // (addVehicle, updateVehicle, deleteVehicle, etc. remain here)
  const addVehicle = useCallback(() => {}, []);
  const updateVehicle = useCallback(() => {}, []);
  const deleteVehicle = useCallback(() => {}, []);
  const addDriver = useCallback(() => {}, []);
  const updateDriver = useCallback(() => {}, []);
  const deleteDriver = useCallback(() => {}, []);
  const addUser = useCallback(() => {}, []);
  const updateUser = useCallback(() => {}, []);
  const toggleUserStatus = useCallback(() => {}, []);
  const addTrip = useCallback(() => {}, []);
  const updateTrip = useCallback(() => {}, []);
  const cancelTrip = useCallback(() => {}, []);
  const acknowledgeAlert = useCallback(() => {}, []);
  const addCostCategory = useCallback(() => {}, []);
  const updateCostCategory = useCallback(() => {}, []);
  const deleteCostCategory = useCallback(() => {}, []);
  const addCostEntry = useCallback(() => {}, []);
  const updateCostEntry = useCallback(() => {}, []);
  const deleteCostEntry = useCallback(() => {}, []);
  const addFuelLogEntry = useCallback(() => {}, []);
  const updateFuelLogEntry = useCallback(() => {}, []);
  const deleteFuelLogEntry = useCallback(() => {}, []);
  const addMaintenanceTask = useCallback(() => {}, []);
  const updateMaintenanceTask = useCallback(() => {}, []);
  const deleteMaintenanceTask = useCallback(() => {}, []);
  const addMechanic = useCallback(() => {}, []);
  const updateMechanic = useCallback(() => {}, []);
  const deleteMechanic = useCallback(() => {}, []);

  // --- WHOLESALE FINANCE CALLBACKS ---

  const addDealership = useCallback((dealershipData: Omit<Dealership, 'id'>) => {
    const newId = generateMockId();
    setDealerships(prev => [...prev, { ...dealershipData, id: newId }]);
  }, []);

  const fundNewInventory = useCallback((inventoryData: Omit<InventoryUnit, 'daysInStock'>) => {
    const inventoryWithDays: InventoryUnit = {
      ...inventoryData,
      daysInStock: 0,
    };
    setInventory(prev => [...prev, inventoryWithDays]);
    
    // Update credit line
    setCreditLines(prevLines => prevLines.map(line => {
      if (line.dealershipId === inventoryData.dealershipId) {
        return {
          ...line,
          availableCredit: line.availableCredit - inventoryData.financedAmount,
        };
      }
      return line;
    }));
  }, []);

  const markInventoryAsRepaid = useCallback((vin: string, dealershipId: string, repaymentAmount: number) => {
    let financedAmount = 0;
    setInventory(prevInventory => prevInventory.map(unit => {
      if (unit.vin === vin) {
        financedAmount = unit.financedAmount; // Capture the financed amount before updating
        return {
          ...unit,
          status: InventoryUnitStatus.REPAID,
          repaymentDate: new Date().toISOString(),
          repaymentAmount,
        };
      }
      return unit;
    }));

    // Restore credit line
    setCreditLines(prevLines => prevLines.map(line => {
      if (line.dealershipId === dealershipId) {
        return {
          ...line,
          availableCredit: line.availableCredit + financedAmount,
        };
      }
      return line;
    }));
  }, []);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        <p className="ml-4 text-xl text-gray-300">Loading Application Data...</p>
      </div>
    );
  }
  
  const CostManagementLayout: React.FC = () => ( <div className="space-y-8"> <Outlet /> </div> );
  const MaintenanceManagementLayout: React.FC = () => ( <div className="space-y-8"> <Outlet /> </div> );
  const SafetyComplianceLayout: React.FC = () => ( <div className="space-y-8"> <Outlet /> </div> );
  const TelematicsLayout: React.FC = () => ( <div className="space-y-8"> <Outlet /> </div> );


  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {currentApp === 'fleet' ? (
        <Sidebar currentApp={currentApp} setCurrentApp={setCurrentApp} />
      ) : (
        <WholesaleSidebar currentApp={currentApp} setCurrentApp={setCurrentApp} />
      )}
      
      <main className="flex-1 ml-72 p-8 overflow-y-auto bg-gray-850">
        {currentApp === 'fleet' ? (
          <Routes>
            <Route path="/" element={<DashboardPage vehicles={vehicles} drivers={drivers} alerts={telematicsAlerts} maintenanceTasks={maintenanceTasks} />} />
            <Route path="/fleet-overview" element={<FleetOverviewDashboardPage vehicles={vehicles} drivers={drivers} alerts={telematicsAlerts} maintenanceTasks={maintenanceTasks} costEntries={costEntries} fuelLogs={fuelLogEntries} />} />
            <Route path="/advanced-insights" element={ <AdvancedFleetInsightsPage vehicles={vehicles} drivers={drivers} maintenanceTasks={maintenanceTasks} fuelLogs={fuelLogEntries} costEntries={costEntries}/>} />
            <Route path="/vehicles" element={<VehiclesPage vehicles={vehicles} drivers={drivers} maintenanceTasks={maintenanceTasks} addVehicle={addVehicle} updateVehicle={updateVehicle} deleteVehicle={deleteVehicle}/>} />
            <Route path="/drivers" element={<DriversPage drivers={drivers} vehicles={vehicles} addDriver={addDriver} updateDriver={updateDriver} deleteDriver={deleteDriver} />} />
            <Route path="/trips" element={<TripsPage trips={trips} vehicles={vehicles} drivers={drivers} costCategories={costCategories} addTrip={addTrip} updateTrip={updateTrip} cancelTrip={cancelTrip}/>} />
            <Route path="/maintenance" element={<MaintenanceManagementLayout />}>
              <Route index element={<Navigate to="dashboard" />} /> 
              <Route path="dashboard" element={<MaintenanceDashboardPage vehicles={vehicles} maintenanceTasks={maintenanceTasks} mechanics={mechanics}/>} />
              <Route path="tasks" element={<MaintenanceTasksPage tasks={maintenanceTasks} vehicles={vehicles} mechanics={mechanics} addTask={addMaintenanceTask} updateTask={updateMaintenanceTask} deleteTask={deleteMaintenanceTask}/>} />
              <Route path="mechanics" element={<MechanicsDirectoryPage mechanics={mechanics} addMechanic={addMechanic} updateMechanic={updateMechanic} deleteMechanic={deleteMechanic}/>} />
            </Route>
            <Route path="/telematics" element={<TelematicsLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<TelematicsDashboardPage alerts={telematicsAlerts} vehicles={vehicles}/>} />
              <Route path="log" element={<TelematicsAlertsPage alerts={telematicsAlerts} vehicles={vehicles} acknowledgeAlert={acknowledgeAlert} />} />
              <Route path="email-log" element={<TelematicsEmailLogPage emails={simulatedEmails} vehicles={vehicles}/>} />
            </Route>
            <Route path="/safety" element={<SafetyComplianceLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<SafetyComplianceDashboardPage vehicles={vehicles} drivers={drivers} alerts={telematicsAlerts} />} />
              <Route path="documents" element={<CompliancePage vehicles={vehicles} />} />
            </Route>
            <Route path="/user-management" element={<UserManagementPage users={users} addUser={addUser} updateUser={updateUser} toggleUserStatus={toggleUserStatus}/>} />
            <Route path="/map" element={<MapOverviewPage vehicles={vehicles} alerts={telematicsAlerts} />} />
            <Route path="/costs" element={<CostManagementLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<CostDashboardPage costEntries={costEntries} fuelLogs={fuelLogEntries} vehicles={vehicles} costCategories={costCategories} />} />
              <Route path="fuel-dashboard" element={<FuelDashboardPage fuelLogs={fuelLogEntries} vehicles={vehicles} />} />
              <Route path="categories" element={<CostCategoriesPage categories={costCategories} addCategory={addCostCategory} updateCategory={updateCostCategory} deleteCategory={deleteCostCategory}/>} />
              <Route path="vehicle-entry" element={<VehicleCostEntryPage costEntries={costEntries} vehicles={vehicles} categories={costCategories} addCostEntry={addCostEntry} updateCostEntry={updateCostEntry} deleteCostEntry={deleteCostEntry} />} />
              <Route path="fuel-log" element={<FuelLogPage fuelLogs={fuelLogEntries} vehicles={vehicles} addFuelLog={addFuelLogEntry} updateFuelLog={updateFuelLogEntry} deleteFuelLog={deleteFuelLogEntry}/>} />
            </Route>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
              <Route path="/" element={<Navigate to="/wholesale/dashboard" />} />
              <Route path="/wholesale/dashboard" element={<WholesaleDashboardPage dealerships={dealerships} creditLines={creditLines} inventory={inventory} audits={audits}/>} />
              <Route path="/wholesale/dealerships" element={<DealershipsPage dealerships={dealerships} creditLines={creditLines} inventory={inventory} addDealership={addDealership} />} />
              <Route path="/wholesale/credit-lines" element={<CreditLinesPage creditLines={creditLines} dealerships={dealerships} />} />
              <Route path="/wholesale/inventory" element={<InventoryPage inventory={inventory} dealerships={dealerships} fundNewInventory={fundNewInventory} markInventoryAsRepaid={markInventoryAsRepaid} />} />
              <Route path="/wholesale/audits" element={<AuditsPage audits={audits} dealerships={dealerships} />} />
              <Route path="*" element={<Navigate to="/wholesale/dashboard" />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default App;