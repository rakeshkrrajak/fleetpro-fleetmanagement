

import React, { useState, useMemo, useCallback } from 'react';
import { Vehicle, VehicleStatus, DocumentType, VehicleDocument, Driver, MaintenanceTask, MaintenanceTaskStatus } from '../types';
import Modal from '../components/Modal';
import GeminiMaintenanceAdvisor from '../components/GeminiMaintenanceAdvisor';
import { Link, useNavigate } from 'react-router-dom'; 
import { ArrowDownTrayIcon } from '../constants';
import { exportToCsv } from '../services/reportService';

interface VehiclesPageProps {
  vehicles: Vehicle[];
  drivers: Driver[]; 
  maintenanceTasks: MaintenanceTask[]; 
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'imageUrl' | 'documents' | 'lastKnownLocation' | 'currentSpeedKmph' | 'isIgnitionOn'> & { documents?: Partial<VehicleDocument>[]; isAIS140Compliant?: boolean, driverIdToAssign?: string | null }) => void;
  updateVehicle: (vehicle: Vehicle & { driverIdToAssign?: string | null }) => void;
  deleteVehicle: (vehicleId: string) => void;
}

const initialVehicleFormState: Omit<Vehicle, 'id' | 'imageUrl' | 'documents' | 'lastKnownLocation' | 'currentSpeedKmph' | 'isIgnitionOn'> & { isAIS140Compliant?: boolean; driverIdToAssign?: string | null } = {
  vin: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  status: VehicleStatus.ACTIVE,
  mileage: 0,
  rcNumber: '',
  rcExpiryDate: '',
  insurancePolicyNumber: '',
  insuranceExpiryDate: '',
  fitnessCertificateNumber: '',
  fitnessExpiryDate: '',
  pucCertificateNumber: '',
  pucExpiryDate: '',
  fastagId: '',
  isAIS140Compliant: false,
  driverIdToAssign: null, 
  nextMaintenanceDueDate: '',
  nextMaintenanceMileage: 0,
};

// Common style for input fields in dark theme
const inputFieldStyle = "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm rounded-lg p-2.5";
const labelStyle = "block text-sm font-medium text-gray-300 mb-1";

interface VehicleFormProps {
  onSubmit: (vehicle: Omit<Vehicle, 'id' | 'imageUrl' | 'documents' | 'lastKnownLocation' | 'currentSpeedKmph' | 'isIgnitionOn'> & { isAIS140Compliant?: boolean, driverIdToAssign?: string | null }) => void;
  onCancel: () => void;
  initialData?: Vehicle | null;
  drivers: Driver[]; 
  vehicles: Vehicle[]; 
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, onCancel, initialData, drivers, vehicles }) => {
  const getInitialDriverId = () => {
    if (!initialData) return null;
    const assignedDriver = drivers.find(d => d.assignedVehicleId === initialData.id);
    return assignedDriver ? assignedDriver.id : null;
  };
  
  const [formData, setFormData] = useState<Omit<Vehicle, 'id' | 'imageUrl' | 'documents' | 'lastKnownLocation' | 'currentSpeedKmph' | 'isIgnitionOn'> & { isAIS140Compliant?: boolean, driverIdToAssign?: string | null }>(
    initialData
      ? { ...initialVehicleFormState, ...initialData, isAIS140Compliant: initialData.isAIS140Compliant || false, driverIdToAssign: getInitialDriverId() }
      : initialVehicleFormState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'driverIdToAssign') {
        setFormData(prev => ({ ...prev, [name]: value === "" ? null : value }));
    } else {
        setFormData(prev => ({
        ...prev,
        [name]: (name === 'year' || name === 'mileage' || name === 'nextMaintenanceMileage') ? parseInt(value, 10) || 0 : value
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vin || !formData.make || !formData.model || formData.year <= 1900 || !formData.licensePlate) {
        alert("Please fill in all required fields correctly (VIN, Make, Model, Year, License Plate).");
        return;
    }
    const dateFields = ['rcExpiryDate', 'insuranceExpiryDate', 'fitnessExpiryDate', 'pucExpiryDate', 'nextMaintenanceDueDate'];
    for (const field of dateFields) {
      if (formData[field as keyof typeof formData] && isNaN(new Date(formData[field as keyof typeof formData] as string).getTime())) {
        alert(`Please enter a valid date for ${field}.`);
        return;
      }
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="vin" className={labelStyle}>VIN *</label>
          <input type="text" name="vin" id="vin" value={formData.vin} onChange={handleChange} required className={inputFieldStyle} />
        </div>
        <div>
          <label htmlFor="licensePlate" className={labelStyle}>License Plate *</label>
          <input type="text" name="licensePlate" id="licensePlate" value={formData.licensePlate} onChange={handleChange} required className={inputFieldStyle} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="make" className={labelStyle}>Make *</label>
          <input type="text" name="make" id="make" value={formData.make} onChange={handleChange} required className={inputFieldStyle} />
        </div>
        <div>
          <label htmlFor="model" className={labelStyle}>Model *</label>
          <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} required className={inputFieldStyle} />
        </div>
        <div>
            <label htmlFor="year" className={labelStyle}>Year *</label>
            <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} required className={inputFieldStyle} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="mileage" className={labelStyle}>Mileage *</label>
            <input type="number" name="mileage" id="mileage" value={formData.mileage} onChange={handleChange} required className={inputFieldStyle} />
        </div>
        <div>
            <label htmlFor="status" className={labelStyle}>Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className={`${inputFieldStyle} pr-8`}>
            {Object.values(VehicleStatus).map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
            </select>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-200 pt-4 border-t border-gray-700 mt-6">Driver Assignment</h4>
      <div>
        <label htmlFor="driverIdToAssign" className={labelStyle}>Assign Driver</label>
        <select 
          name="driverIdToAssign" 
          id="driverIdToAssign" 
          value={formData.driverIdToAssign || ""} 
          onChange={handleChange} 
          className={`${inputFieldStyle} pr-8`}
        >
          <option value="">None - Unassign Driver</option>
          {drivers.map(driver => {
            let label = driver.name;
            if (driver.assignedVehicleId) {
                if (initialData && driver.assignedVehicleId === initialData.id) {
                    // This driver is assigned to the vehicle being edited
                } else {
                    const assignedV = vehicles.find(v => v.id === driver.assignedVehicleId);
                    label += ` (Assigned to ${assignedV ? `${assignedV.make} ${assignedV.model} - ${assignedV.licensePlate}` : 'another vehicle'})`;
                }
            } else {
                label += " (Available)";
            }
            return <option key={driver.id} value={driver.id}>{label}</option>;
          })}
        </select>
      </div>

      <h4 className="text-lg font-semibold text-gray-200 pt-4 border-t border-gray-700 mt-6">Document Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="rcNumber" className={labelStyle}>RC Number</label>
          <input type="text" name="rcNumber" id="rcNumber" value={formData.rcNumber || ''} onChange={handleChange} className={inputFieldStyle} />
        </div>
        <div>
          <label htmlFor="rcExpiryDate" className={labelStyle}>RC Expiry Date</label>
          <input type="date" name="rcExpiryDate" id="rcExpiryDate" value={formData.rcExpiryDate || ''} onChange={handleChange} className={`${inputFieldStyle} dark:[color-scheme:dark]`} />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="insurancePolicyNumber" className={labelStyle}>Insurance Policy No.</label>
          <input type="text" name="insurancePolicyNumber" id="insurancePolicyNumber" value={formData.insurancePolicyNumber || ''} onChange={handleChange} className={inputFieldStyle} />
        </div>
        <div>
          <label htmlFor="insuranceExpiryDate" className={labelStyle}>Insurance Expiry Date</label>
          <input type="date" name="insuranceExpiryDate" id="insuranceExpiryDate" value={formData.insuranceExpiryDate || ''} onChange={handleChange} className={`${inputFieldStyle} dark:[color-scheme:dark]`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fitnessCertificateNumber" className={labelStyle}>Fitness Certificate No.</label>
          <input type="text" name="fitnessCertificateNumber" id="fitnessCertificateNumber" value={formData.fitnessCertificateNumber || ''} onChange={handleChange} className={inputFieldStyle} />
        </div>
        <div>
          <label htmlFor="fitnessExpiryDate" className={labelStyle}>Fitness Expiry Date</label>
          <input type="date" name="fitnessExpiryDate" id="fitnessExpiryDate" value={formData.fitnessExpiryDate || ''} onChange={handleChange} className={`${inputFieldStyle} dark:[color-scheme:dark]`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pucCertificateNumber" className={labelStyle}>PUC Certificate No.</label>
          <input type="text" name="pucCertificateNumber" id="pucCertificateNumber" value={formData.pucCertificateNumber || ''} onChange={handleChange} className={inputFieldStyle} />
        </div>
        <div>
          <label htmlFor="pucExpiryDate" className={labelStyle}>PUC Expiry Date</label>
          <input type="date" name="pucExpiryDate" id="pucExpiryDate" value={formData.pucExpiryDate || ''} onChange={handleChange} className={`${inputFieldStyle} dark:[color-scheme:dark]`} />
        </div>
      </div>
      <div>
        <label htmlFor="fastagId" className={labelStyle}>FASTag ID</label>
        <input type="text" name="fastagId" id="fastagId" value={formData.fastagId || ''} onChange={handleChange} className={inputFieldStyle} />
      </div>

      <h4 className="text-lg font-semibold text-gray-200 pt-4 border-t border-gray-700 mt-6">Maintenance Scheduling</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nextMaintenanceDueDate" className={labelStyle}>Next Maintenance Due Date</label>
          <input type="date" name="nextMaintenanceDueDate" id="nextMaintenanceDueDate" value={formData.nextMaintenanceDueDate || ''} onChange={handleChange} className={`${inputFieldStyle} dark:[color-scheme:dark]`} />
        </div>
        <div>
          <label htmlFor="nextMaintenanceMileage" className={labelStyle}>Next Maintenance Mileage (km)</label>
          <input type="number" name="nextMaintenanceMileage" id="nextMaintenanceMileage" value={formData.nextMaintenanceMileage || 0} onChange={handleChange} className={inputFieldStyle} />
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-200 pt-4 border-t border-gray-700 mt-6">Telematics</h4>
        <div className="flex items-center">
            <input
                type="checkbox"
                name="isAIS140Compliant"
                id="isAIS140Compliant"
                checked={formData.isAIS140Compliant || false}
                onChange={handleChange}
                className="h-4 w-4 text-primary-500 bg-gray-600 border-gray-500 rounded focus:ring-primary-600 focus:ring-offset-gray-800"
            />
            <label htmlFor="isAIS140Compliant" className="ml-2 block text-sm text-gray-300">
                AIS 140 Compliant Device Installed
            </label>
        </div>
      
      <div className="flex justify-end space-x-4 pt-6">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-sm transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md transition-colors">
          {initialData ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};

interface SelectedVehicleDisplay extends Vehicle {
  _assignedDriverName?: string;
  _recentMaintenanceTasks?: MaintenanceTask[];
}

const getVehicleCategory = (vehicle: Vehicle): string => {
    const makeModel = `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()}`;
    if (makeModel.includes('truck') || makeModel.includes('lorry') || makeModel.includes('eicher') || makeModel.includes('volvo') || makeModel.includes('bharatbenz') || makeModel.includes('scania') || makeModel.includes('man') || makeModel.includes('dost') || makeModel.includes('samrat')) {
      return "Trucks";
    }
    if (makeModel.includes('van') || makeModel.includes('transit') || makeModel.includes('traveller') || makeModel.includes('ape') || makeModel.includes('gem') || makeModel.includes('piaggio')) {
      return "Vans & LCVs";
    }
    if (makeModel.includes('car') || makeModel.includes('suv') || makeModel.includes('sedan') || makeModel.includes('hatchback') || makeModel.includes('nexon') || makeModel.includes('xuv') || makeModel.includes('swift') || makeModel.includes('creta') || makeModel.includes('seltos')) {
      return "Cars & SUVs";
    }
    return "Other Vehicles";
};


const VehiclesPage: React.FC<VehiclesPageProps> = ({ vehicles, drivers, maintenanceTasks, addVehicle, updateVehicle, deleteVehicle }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicleDisplay | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openAddModal = () => { setEditingVehicle(null); setIsModalOpen(true); };
  const openEditModal = (vehicle: Vehicle) => { setEditingVehicle(vehicle); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingVehicle(null); };
  
  const viewVehicleDetails = (vehicle: Vehicle) => {
    const assignedDriver = drivers.find(d => d.assignedVehicleId === vehicle.id);
    const recentTasks = maintenanceTasks
      .filter(task => task.vehicleId === vehicle.id)
      .sort((a,b) => new Date(b.scheduledDate || b.completionDate || 0).getTime() - new Date(a.scheduledDate || a.completionDate || 0).getTime())
      .slice(0, 3); 

    setSelectedVehicle({ ...vehicle, _assignedDriverName: assignedDriver ? assignedDriver.name : "None", _recentMaintenanceTasks: recentTasks });
  };
  const closeVehicleDetails = () => setSelectedVehicle(null);

  const handleFormSubmit = (vehicleData: Omit<Vehicle, 'id' | 'imageUrl' | 'documents' | 'lastKnownLocation' | 'currentSpeedKmph' | 'isIgnitionOn'> & { isAIS140Compliant?: boolean, driverIdToAssign?: string | null }) => {
    if (editingVehicle) {
      updateVehicle({ ...editingVehicle, ...vehicleData, isAIS140Compliant: vehicleData.isAIS140Compliant || false, driverIdToAssign: vehicleData.driverIdToAssign });
    } else {
      addVehicle(vehicleData);
    }
    closeModal();
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
        deleteVehicle(vehicleId);
        if (selectedVehicle?.id === vehicleId) setSelectedVehicle(null);
    }
  };

  const handleScheduleMaintenance = (vehicleId: string) => {
    navigate(`/maintenance/tasks?action=add&vehicleId=${vehicleId}`);
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.rcNumber && vehicle.rcNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [vehicles, searchTerm]);
  
  const getAssignedDriverName = useCallback((vehicleId: string): string => {
    const driver = drivers.find(d => d.assignedVehicleId === vehicleId);
    return driver ? driver.name : "None";
  }, [drivers]);

  const handleDownloadReport = useCallback(() => {
    const dataToExport = filteredVehicles.map(v => ({
      vin: v.vin,
      licensePlate: v.licensePlate,
      make: v.make,
      model: v.model,
      year: v.year,
      status: v.status,
      mileage: v.mileage,
      assignedDriverName: getAssignedDriverName(v.id),
      rcNumber: v.rcNumber || 'N/A',
      rcExpiryDate: v.rcExpiryDate || 'N/A',
      insurancePolicyNumber: v.insurancePolicyNumber || 'N/A',
      insuranceExpiryDate: v.insuranceExpiryDate || 'N/A',
      fitnessCertificateNumber: v.fitnessCertificateNumber || 'N/A',
      fitnessExpiryDate: v.fitnessExpiryDate || 'N/A',
      pucCertificateNumber: v.pucCertificateNumber || 'N/A',
      pucExpiryDate: v.pucExpiryDate || 'N/A',
      isAIS140Compliant: v.isAIS140Compliant ? 'Yes' : 'No',
    }));

    const headers = [
      { key: 'vin', label: 'VIN' },
      { key: 'licensePlate', label: 'License Plate' },
      { key: 'make', label: 'Make' },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year' },
      { key: 'status', label: 'Status' },
      { key: 'mileage', label: 'Mileage (km)' },
      { key: 'assignedDriverName', label: 'Assigned Driver' },
      { key: 'rcNumber', label: 'RC Number' },
      { key: 'rcExpiryDate', label: 'RC Expiry' },
      { key: 'insurancePolicyNumber', label: 'Insurance Policy No.' },
      { key: 'insuranceExpiryDate', label: 'Insurance Expiry' },
      { key: 'fitnessCertificateNumber', label: 'Fitness Cert No.' },
      { key: 'fitnessExpiryDate', label: 'Fitness Expiry' },
      { key: 'pucCertificateNumber', label: 'PUC Cert No.' },
      { key: 'pucExpiryDate', label: 'PUC Expiry' },
      { key: 'isAIS140Compliant', label: 'AIS 140 Compliant' },
    ];
    
    exportToCsv(`fleetpro_vehicles_report_${new Date().toISOString().split('T')[0]}.csv`, dataToExport, headers);
  }, [filteredVehicles, getAssignedDriverName]);


  const categorizedVehicles = useMemo(() => {
    const categories: Record<string, Vehicle[]> = {
      "Trucks": [],
      "Vans & LCVs": [],
      "Cars & SUVs": [],
      "Other Vehicles": [],
    };
    filteredVehicles.forEach(vehicle => {
      const category = getVehicleCategory(vehicle);
      categories[category].push(vehicle);
    });
    return Object.entries(categories).filter(([_, vArray]) => vArray.length > 0);
  }, [filteredVehicles]);


 const getStatusPillClass = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE: return 'bg-green-700 bg-opacity-30 text-green-300';
      case VehicleStatus.MAINTENANCE: return 'bg-amber-700 bg-opacity-30 text-amber-300';
      case VehicleStatus.INACTIVE: return 'bg-red-700 bg-opacity-30 text-red-300';
      case VehicleStatus.RETIRED: return 'bg-gray-600 bg-opacity-30 text-gray-400';
      default: return 'bg-gray-700 bg-opacity-30 text-gray-300';
    }
  };
  
  const getMaintTaskStatusPillClass = (status: MaintenanceTaskStatus) => {
    switch (status) {
      case MaintenanceTaskStatus.SCHEDULED: return 'bg-blue-700 bg-opacity-30 text-blue-300';
      case MaintenanceTaskStatus.IN_PROGRESS: return 'bg-yellow-700 bg-opacity-30 text-yellow-300';
      case MaintenanceTaskStatus.COMPLETED: return 'bg-green-700 bg-opacity-30 text-green-300';
      case MaintenanceTaskStatus.CANCELLED: return 'bg-red-700 bg-opacity-30 text-red-300';
      case MaintenanceTaskStatus.AWAITING_PARTS: return 'bg-orange-700 bg-opacity-30 text-orange-300';
      default: return 'bg-gray-700 bg-opacity-30 text-gray-300';
    }
  };


  const handleCardImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = `https://placehold.co/320x240/1f2937/4b5563?text=Vehicle&font=montserrat`; };
  const handleDetailImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = `https://placehold.co/160x160/1f2937/4b5563?text=Vehicle&font=montserrat`; };

  const formatDate = (dateString?: string, includeTime = false) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        options.hour12 = true;
      }
      return date.toLocaleDateString('en-IN', options);
    } catch (e) { return 'Invalid Date'; }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-100">Manage Vehicles</h1>
        <div className="flex items-center gap-4">
            <button onClick={handleDownloadReport} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center">
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Download Report
            </button>
            <button onClick={openAddModal} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Add New Vehicle
            </button>
        </div>
      </div>

      <input type="text" placeholder="Search vehicles (make, model, VIN, plate, RC No.)..." className={`${inputFieldStyle} w-full p-3 text-base`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {selectedVehicle ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-start"> 
                <div>
                    <h2 className="text-3xl font-bold text-primary-400">{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</h2>
                    <p className="text-md text-gray-400">VIN: {selectedVehicle.vin} | Plate: {selectedVehicle.licensePlate}</p>
                    <p className="text-md text-gray-400">Mileage: {selectedVehicle.mileage.toLocaleString()} km</p>
                    <p className="text-md text-gray-300 font-medium">Assigned Driver: <span className="font-normal text-gray-400">{ selectedVehicle._assignedDriverName || "None" }</span></p>
                    <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium ${getStatusPillClass(selectedVehicle.status)}`}>{selectedVehicle.status}</span>
                </div>
                <button onClick={closeVehicleDetails} className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                    <img 
                        src={selectedVehicle.imageUrl || `https://placehold.co/400x300/1f2937/4b5563?text=${selectedVehicle.make.charAt(0)}&font=montserrat`} 
                        alt={`${selectedVehicle.make} ${selectedVehicle.model}`} 
                        className="w-full h-auto rounded-lg object-cover shadow-lg border-2 border-gray-700"
                        onError={handleDetailImageError}
                    />
                     {selectedVehicle.isAIS140Compliant && (
                        <div className="mt-3 flex items-center text-xs text-green-400 bg-green-800 bg-opacity-50 px-2 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1.5"><path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.72 4.79-1.91-1.91a.75.75 0 0 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.25-5.5Z" clipRule="evenodd" /></svg>
                            AIS 140 Compliant
                        </div>
                    )}
                </div>

                <div className="md:col-span-2 space-y-5">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-200 mb-1">Key Information</h4>
                        <ul className="text-sm text-gray-400 space-y-0.5">
                            <li><strong className="text-gray-300">RC No:</strong> {selectedVehicle.rcNumber || 'N/A'} (Exp: {formatDate(selectedVehicle.rcExpiryDate, false)})</li>
                            <li><strong className="text-gray-300">Insurance:</strong> {selectedVehicle.insurancePolicyNumber || 'N/A'} (Exp: {formatDate(selectedVehicle.insuranceExpiryDate, false)})</li>
                            <li><strong className="text-gray-300">Fitness Cert:</strong> {selectedVehicle.fitnessCertificateNumber || 'N/A'} (Exp: {formatDate(selectedVehicle.fitnessExpiryDate, false)})</li>
                            <li><strong className="text-gray-300">PUC Cert:</strong> {selectedVehicle.pucCertificateNumber || 'N/A'} (Exp: {formatDate(selectedVehicle.pucExpiryDate, false)})</li>
                            <li><strong className="text-gray-300">FASTag ID:</strong> {selectedVehicle.fastagId || 'N/A'}</li>
                            <li><strong className="text-gray-300">Next Maint. Due:</strong> {formatDate(selectedVehicle.nextMaintenanceDueDate, false) || 'N/A'}</li>
                            <li><strong className="text-gray-300">Next Maint. Mileage:</strong> {selectedVehicle.nextMaintenanceMileage ? selectedVehicle.nextMaintenanceMileage.toLocaleString() + ' km' : 'N/A'}</li>
                            <li><strong className="text-gray-300">Last Telemetry:</strong> Speed: {selectedVehicle.currentSpeedKmph ?? 'N/A'} km/h, Ignition: {selectedVehicle.isIgnitionOn ? 'On' : 'Off'}</li>
                            <li><strong className="text-gray-300">Location:</strong> {selectedVehicle.lastKnownLocation ? `${selectedVehicle.lastKnownLocation.lat.toFixed(4)}, ${selectedVehicle.lastKnownLocation.lon.toFixed(4)} at ${formatDate(selectedVehicle.lastKnownLocation.timestamp, true)}` : 'N/A'}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {selectedVehicle.documents && selectedVehicle.documents.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-gray-200 mb-2">Vehicle Documents</h4>
                <ul className="space-y-1 text-sm">
                  {selectedVehicle.documents.map(doc => (
                    <li key={doc.id} className="text-gray-400">
                      <span className="font-medium text-gray-300">{doc.type}:</span> {doc.number || 'N/A'} (Expires: {formatDate(doc.expiryDate, false)})
                      {doc.fileName && <a href={doc.documentUrl || '#'} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary-400 hover:text-primary-300 text-xs">(View)</a>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedVehicle._recentMaintenanceTasks && selectedVehicle._recentMaintenanceTasks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-gray-200 mb-2">Recent Maintenance</h4>
                <ul className="space-y-2 text-sm">
                  {selectedVehicle._recentMaintenanceTasks.map(task => (
                    <li key={task.id} className="p-2 bg-gray-750 rounded-md"> {/* Assuming gray-750 exists or is similar to gray-700/800 */}
                      <Link to={`/maintenance/tasks?taskId=${task.id}`} className="font-medium text-primary-400 hover:underline">{task.title}</Link>
                      <p className="text-xs text-gray-400">Status: <span className={`font-semibold ${getMaintTaskStatusPillClass(task.status).split(' ')[1]}`}>{task.status}</span> | Scheduled: {formatDate(task.scheduledDate, false)}</p>
                      {task.completionDate && <p className="text-xs text-gray-400">Completed: {formatDate(task.completionDate, false)}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <GeminiMaintenanceAdvisor vehicle={selectedVehicle} />

            <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => openEditModal(selectedVehicle)} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">Edit Vehicle</button>
                <button onClick={() => handleDeleteVehicle(selectedVehicle.id)} className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">Delete Vehicle</button>
                <button
                 onClick={() => handleScheduleMaintenance(selectedVehicle.id)}
                 className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                >
                 Schedule Maintenance
                </button>
            </div>
        </div>
      ) : (
        categorizedVehicles.map(([category, categoryVehicles]) => (
            <div key={category} className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700">
                    {category} ({categoryVehicles.length})
                </h2>
                {categoryVehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryVehicles.map(vehicle => (
                            <div key={vehicle.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
                            <img 
                                src={vehicle.imageUrl || `https://placehold.co/320x240/1f2937/4b5563?text=${vehicle.make.charAt(0)}&font=montserrat`} 
                                alt={`${vehicle.make} ${vehicle.model}`} 
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                                onError={handleCardImageError}
                            />
                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-gray-100 truncate group-hover:text-primary-400 transition-colors">{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                                <p className="text-sm text-gray-400">VIN: {vehicle.vin}</p>
                                <p className="text-sm text-gray-400">Plate: {vehicle.licensePlate}</p>
                                <p className="text-sm text-gray-400">Mileage: {vehicle.mileage.toLocaleString()} km</p>
                                <div className="mt-2 mb-3">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusPillClass(vehicle.status)}`}>{vehicle.status}</span>
                                    {vehicle.isAIS140Compliant && <span className="ml-2 text-xs px-2 py-1 rounded-full font-medium bg-green-800 bg-opacity-50 text-green-300">AIS 140</span>}
                                </div>
                                <p className="text-xs text-gray-500">Driver: {getAssignedDriverName(vehicle.id)}</p>
                            </div>
                            <div className="px-5 pb-5 pt-2 border-t border-gray-700 flex justify-start space-x-2">
                                <button onClick={() => viewVehicleDetails(vehicle)} className="text-sm text-primary-400 hover:text-primary-300 font-medium py-1 px-3 rounded-md hover:bg-gray-700 transition-colors">View Details</button>
                                <button onClick={() => openEditModal(vehicle)} className="text-sm text-amber-400 hover:text-amber-300 font-medium py-1 px-3 rounded-md hover:bg-gray-700 transition-colors">Edit</button>
                            </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-12 text-lg">No vehicles in this category matching your search.</p>
                )}
            </div>
        ))
      )}
      {categorizedVehicles.length === 0 && !selectedVehicle && (
          <p className="col-span-full text-center text-gray-500 py-12 text-lg">No vehicles found matching your search criteria.</p>
      )}


      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'} size="3xl">
        <VehicleForm 
            onSubmit={handleFormSubmit} 
            onCancel={closeModal} 
            initialData={editingVehicle}
            drivers={drivers}
            vehicles={vehicles}
        />
      </Modal>
    </div>
  );
};

export default VehiclesPage;