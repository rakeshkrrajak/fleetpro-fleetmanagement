
export enum VehicleStatus {
  ACTIVE = 'Active',
  MAINTENANCE = 'Maintenance',
  INACTIVE = 'Inactive',
  RETIRED = 'Retired', 
}

export enum DocumentType {
  RC = "Registration Certificate",
  INSURANCE = "Insurance",
  FITNESS = "Fitness Certificate",
  PUC = "PUC Certificate",
  OTHER = "Other",
}

export interface VehicleDocument {
  id: string;
  type: DocumentType;
  number?: string;
  expiryDate?: string; 
  documentUrl?: string; 
  uploadedAt: string; 
  fileName?: string; 
}

// Maintenance Related Types
export enum MaintenanceType {
  PREVENTIVE = "Preventive", // Regular service based on schedule (e.g., oil change)
  CORRECTIVE = "Corrective", // Fix after a breakdown
  PREDICTIVE = "Predictive", // Based on usage data and history (future enhancement)
  EMERGENCY = "Emergency",   // Breakdown on road
  INSPECTION = "Inspection", // General inspection
  UPGRADE = "Upgrade",       // Component upgrade
}

export enum MaintenanceTaskStatus {
  SCHEDULED = "Scheduled",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  AWAITING_PARTS = "Awaiting Parts",
  PENDING_APPROVAL = "Pending Approval",
}

export interface MaintenancePart {
  name: string;
  quantity: number;
  cost?: number; // Cost per unit
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  title: string; // e.g., "Oil Change", "Brake Pad Replacement"
  description?: string;
  maintenanceType: MaintenanceType;
  status: MaintenanceTaskStatus;
  scheduledDate?: string; // ISO Date string
  completionDate?: string; // ISO Date string
  odometerAtMaintenance?: number;
  mechanicId?: string | null; // Links to Mechanic
  garageName?: string; // If external or no specific mechanic entry
  partsReplaced?: MaintenancePart[];
  laborCost?: number;
  partsCost?: number; // Sum of MaintenancePart costs (can be auto-calculated)
  totalCost?: number; // laborCost + partsCost (can be auto-calculated)
  receiptFileName?: string; 
  notes?: string;
  raisedBy?: string; // Driver ID, User ID, or "System"
  approvedBy?: string; // User ID
}

export interface Mechanic {
  id: string;
  name: string; // Can be individual or garage name
  contactPerson?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  specialties?: string[]; // e.g., ["Engine", "Tires", "AC"]
  rating?: number; // 1-5
  notes?: string;
  isInternal: boolean; // Differentiates between in-house team and external vendors
}


export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: VehicleStatus;
  mileage: number;
  imageUrl?: string; 

  // India-specific fields
  rcNumber?: string;
  rcExpiryDate?: string; 
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string; 
  fitnessCertificateNumber?: string;
  fitnessExpiryDate?: string; 
  pucCertificateNumber?: string;
  pucExpiryDate?: string; 
  fastagId?: string;

  // Store documents related to vehicle
  documents?: VehicleDocument[]; 

  // GPS & Telematics Fields
  lastKnownLocation?: { lat: number; lon: number; timestamp: string };
  currentSpeedKmph?: number;
  isIgnitionOn?: boolean;
  isAIS140Compliant?: boolean;

  // Maintenance Scheduling Fields
  nextMaintenanceDueDate?: string; // For time-based reminders
  nextMaintenanceMileage?: number; // For mileage-based reminders
  lastMaintenanceDate?: string;
  lastMaintenanceMileage?: number;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  contact: string;
  assignedVehicleId?: string | null;
  imageUrl?: string;
  email?: string; // Added for email simulation

  // India-specific fields
  aadhaarNumber?: string;
  panNumber?: string;
  dlExpiryDate?: string; 
  dateOfBirth?: string; 
  address?: string;
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  children?: NavigationItem[]; // For sub-menus
}

export interface GroundingChunk {
  web?: {
    uri?: string; 
    title?: string; 
  };
  retrievedContext?: {
    uri?: string; 
    title?: string; 
  };
}

// For User & Role Management
export enum UserRole {
  ADMIN = "Admin",
  FLEET_MANAGER = "Fleet Manager",
  DRIVER = "Driver",
  MECHANIC_USER = "Mechanic User", // If mechanics have system access
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; 
}

// For Trip & Route Management
export interface Waypoint {
  id: string;
  address: string; 
  purpose?: string;
  sequence: number; 
  estimatedArrivalTime?: string; 
  estimatedDepartureTime?: string; 
  notes?: string;
}

export enum TripStatus {
  PLANNED = "Planned",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  DELAYED = "Delayed",
}

export interface MockStop {
  id: string;
  name: string;
  type: 'Toll' | 'Fuel' | 'Rest Area' | 'Other';
  estimatedCost?: number; 
  notes?: string; 
  locationHint?: string; 
}

export interface Trip {
  id: string;
  tripName: string;
  vehicleId: string | null;
  driverId: string | null;
  origin: string;
  destination: string;
  waypoints: Waypoint[];
  scheduledStartDate: string; 
  scheduledEndDate?: string; 
  actualStartDate?: string;
  actualEndDate?: string;
  status: TripStatus;
  estimatedDistanceKm?: number;
  estimatedDuration?: string; 
  routeSuggestion?: string; 
  suggestedStops?: MockStop[];
  tripCosts?: CostEntry[]; // Added for trip-based cost logging
}

// For Telematics & Alerts
export enum AlertType {
  SPEEDING = "Speeding",
  IDLING = "Excessive Idling",
  HARSH_BRAKING = "Harsh Braking",
  UNAUTHORIZED_USE = "Unauthorized Use",
  GEOFENCE_ENTRY = "Geofence Entry",
  GEOFENCE_EXIT = "Geofence Exit",
  DEVICE_OFFLINE = "Device Offline",
  COST_EXCEEDED_LIMIT = "Cost Exceeded Limit", 
  INSURANCE_PERMIT_RENEWAL = "Insurance/Permit Renewal Due",
  MAINTENANCE_DUE = "Maintenance Due", // New Alert Type
  MAINTENANCE_OVERDUE = "Maintenance Overdue", // New Alert Type
}

export interface TelematicsAlert { 
  id: string;
  vehicleId?: string | null; 
  vehicleName?: string; 
  type: AlertType;
  timestamp: string; // ISO date string
  location?: { lat: number; lon: number };
  details: string; 
  isAcknowledged: boolean;
  relatedCostEntryId?: string; 
  relatedMaintenanceTaskId?: string; // Link to maintenance task if applicable
}

// For Cost Management
export interface CostCategory {
  id: string;
  name: string;
  description?: string;
  isSystemDefined?: boolean; 
}

export interface CostEntry {
  id: string;
  date: string; // ISO Date string for when the cost was incurred
  costCategoryId: string;
  vehicleId?: string | null; 
  tripId?: string | null;    
  maintenanceTaskId?: string | null; // Link to maintenance task if cost originated there
  amount: number;
  description?: string;
  vendor?: string;          
  receiptFileName?: string; 
}

export enum FuelType {
  PETROL = "Petrol",
  DIESEL = "Diesel",
  CNG = "CNG",
  ELECTRIC = "Electric", 
  OTHER = "Other"
}

export interface FuelLogEntry {
  id: string;
  vehicleId: string;
  date: string; // ISO Date string
  fuelType: FuelType;
  quantity: number; 
  costPerUnit: number; 
  totalCost: number; 
  odometerReading: number;
  stationName?: string;
  fuelBillFileName?: string; 
}

export interface SimulatedEmail {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  vehicleId?: string | null; 
  alertType?: AlertType;
}

// --- WHOLESALE FINANCE SYSTEM ---

// --- Main Entities ---

export enum DealershipStatus {
  ACTIVE = "Active",
  ONBOARDING = "Onboarding",
  SUSPENDED = "Suspended",
  INACTIVE = "Inactive",
}

export interface Dealership {
  id: string;
  name: string;
  dealerPrincipal: string;
  location: string;
  status: DealershipStatus;
  agreementDate: string; // ISO Date string
  creditLineId: string | null;
  auditHistoryIds?: string[]; // IDs linking to Audit objects
}

export enum CreditLineStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  SUSPENDED = "Suspended",
  UNDER_REVIEW = "Under Review",
}

export interface CreditLine {
  id: string;
  dealershipId: string;
  totalLimit: number;
  availableCredit: number;
  interestRate: number; // Annual percentage rate (APR)
  interestAccrued?: number; // Total interest accumulated
  lastInterestCalculationDate?: string; // ISO Date string
  status: CreditLineStatus;
}

export enum InventoryUnitStatus {
  PENDING_FUNDING = "Pending Funding",
  IN_STOCK = "In Stock",
  SOLD_PENDING_PAYMENT = "Sold - Pending Payment",
  REPAID = "Repaid",
  AUDIT_MISSING = "Audit - Missing",
}

export enum HypothecationStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  NOC_ISSUED = "NOC Issued",
}

export interface InventoryUnit {
  vin: string; // VIN is the primary unique identifier for a vehicle
  dealershipId: string;
  oemInvoiceNumber: string;
  make: string;
  model: string;
  year: number;
  financedAmount: number;
  fundingDate: string; // ISO Date string
  repaymentDate?: string; // ISO Date string
  repaymentAmount?: number;
  status: InventoryUnitStatus;
  daysInStock: number;
  hypothecationStatus: HypothecationStatus;
  documents?: { // For vehicle-specific docs
    invoiceUrl?: string;
    form20Url?: string;
  };
}

// --- Supporting Entities ---
export enum AuditStatus {
  SCHEDULED = "Scheduled",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface AuditedVehicle {
  vin: string;
  verificationStatus: "Verified" | "Missing" | "Sold - Unreported";
  notes?: string;
}

export interface Audit {
  id: string;
  dealershipId: string;
  auditDate: string; // ISO Date string
  auditorName: string;
  status: AuditStatus;
  auditedVehicles: AuditedVehicle[];
}
