

import React, { useState, useMemo, useCallback } from 'react';
import { Driver, Vehicle } from '../types';
import Modal from '../components/Modal';
import { DEFAULT_PLACEHOLDER_IMAGE_SIZE, DEFAULT_DRIVER_PLACEHOLDER_IMAGE_URL, ArrowDownTrayIcon } from '../constants';
import { exportToCsv } from '../services/reportService';


interface DriversPageProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  addDriver: (driver: Omit<Driver, 'id' | 'imageUrl'> & { imageUrl?: string }) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (driverId: string) => void;
}

const initialDriverFormState: Omit<Driver, 'id' | 'imageUrl'> = {
  name: '',
  licenseNumber: '',
  contact: '',
  assignedVehicleId: null,
  aadhaarNumber: '',
  panNumber: '',
  dlExpiryDate: '',
  dateOfBirth: '',
  address: '',
};

// Common style for input fields in dark theme
const inputFieldStyle = "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm rounded-lg p-2.5";
const labelStyle = "block text-sm font-medium text-gray-300 mb-1";
const buttonPrimaryStyle = "px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md transition-colors";
const buttonSecondaryStyle = "px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-sm transition-colors";


interface DriverFormProps {
  onSubmit: (driver: Omit<Driver, 'id' | 'imageUrl'> & { imageUrl?: string }) => void;
  onCancel: () => void;
  initialData?: Driver | null;
  vehicles: Vehicle[];
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit, onCancel, initialData, vehicles }) => {
  const [formData, setFormData] = useState<Omit<Driver, 'id' | 'imageUrl'>>(
    initialData ? { ...initialData } : initialDriverFormState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === "" && name === "assignedVehicleId" ? null : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.licenseNumber || !formData.contact) {
        alert("Please fill in Name, License Number, and Contact fields.");
        return;
    }
    const submitData: Omit<Driver, 'id' | 'imageUrl'> & { imageUrl?: string } = { ...formData };
    if (!initialData) { // Only set default for new drivers
        submitData.imageUrl = DEFAULT_DRIVER_PLACEHOLDER_IMAGE_URL.replace('D&font=', `${formData.name.charAt(0)}&font=`);
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelStyle}>Full Name *</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={`${inputFieldStyle} mt-1`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="licenseNumber" className={labelStyle}>License Number *</label>
          <input type="text" name="licenseNumber" id="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className={`${inputFieldStyle} mt-1`} />
        </div>
        <div>
          <label htmlFor="dlExpiryDate" className={labelStyle}>DL Expiry Date</label>
          <input type="date" name="dlExpiryDate" id="dlExpiryDate" value={formData.dlExpiryDate || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1 dark:[color-scheme:dark]`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact" className={labelStyle}>Contact (Phone/Email) *</label>
          <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className={`${inputFieldStyle} mt-1`} />
        </div>
         <div>
          <label htmlFor="dateOfBirth" className={labelStyle}>Date of Birth</label>
          <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1 dark:[color-scheme:dark]`} />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="aadhaarNumber" className={labelStyle}>Aadhaar Number</label>
          <input type="text" name="aadhaarNumber" id="aadhaarNumber" value={formData.aadhaarNumber || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1`} />
        </div>
        <div>
          <label htmlFor="panNumber" className={labelStyle}>PAN Number</label>
          <input type="text" name="panNumber" id="panNumber" value={formData.panNumber || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1`} />
        </div>
      </div>
      <div>
        <label htmlFor="address" className={labelStyle}>Address</label>
        <textarea name="address" id="address" value={formData.address || ''} onChange={handleChange} rows={3} className={`${inputFieldStyle} mt-1`} />
      </div>
      <div>
        <label htmlFor="assignedVehicleId" className={labelStyle}>Assign Vehicle (Optional)</label>
        <select 
          name="assignedVehicleId" 
          id="assignedVehicleId" 
          value={formData.assignedVehicleId || ""} 
          onChange={handleChange} 
          className={`${inputFieldStyle} mt-1 pr-8`}
        >
          <option value="">No Vehicle Assigned</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className={buttonSecondaryStyle}>Cancel</button>
        <button type="submit" className={buttonPrimaryStyle}>
          {initialData ? 'Update Driver' : 'Add Driver'}
        </button>
      </div>
    </form>
  );
};


const DriversPage: React.FC<DriversPageProps> = ({ drivers, vehicles, addDriver, updateDriver, deleteDriver }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openAddModal = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const handleFormSubmit = (driverData: Omit<Driver, 'id' | 'imageUrl'> & { imageUrl?: string}) => {
    if (editingDriver) {
      updateDriver({ ...editingDriver, ...driverData, imageUrl: editingDriver.imageUrl }); // Preserve existing image on edit for now
    } else {
      addDriver(driverData);
    }
    closeModal();
  };

  const handleDeleteDriver = (driverId: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      deleteDriver(driverId);
    }
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.aadhaarNumber && driver.aadhaarNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.panNumber && driver.panNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [drivers, searchTerm]);

  const getAssignedVehicleInfo = useCallback((vehicleId?: string | null): string => {
    if (!vehicleId) return "Unassigned";
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : "Vehicle not found";
  }, [vehicles]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch { return 'Invalid Date'; }
  };

  const handleDownloadReport = useCallback(() => {
    const dataToExport = filteredDrivers.map(d => ({
      name: d.name,
      licenseNumber: d.licenseNumber,
      dlExpiryDate: formatDate(d.dlExpiryDate),
      contact: d.contact,
      assignedVehicle: getAssignedVehicleInfo(d.assignedVehicleId),
      aadhaarNumber: d.aadhaarNumber || 'N/A',
      panNumber: d.panNumber || 'N/A',
      address: d.address || 'N/A'
    }));
    
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'licenseNumber', label: 'License Number' },
      { key: 'dlExpiryDate', label: 'DL Expiry' },
      { key: 'contact', label: 'Contact' },
      { key: 'assignedVehicle', label: 'Assigned Vehicle' },
      { key: 'aadhaarNumber', label: 'Aadhaar' },
      { key: 'panNumber', label: 'PAN' },
      { key: 'address', label: 'Address' },
    ];

    exportToCsv(`fleetpro_drivers_report_${new Date().toISOString().split('T')[0]}.csv`, dataToExport, headers);
  }, [filteredDrivers, getAssignedVehicleInfo]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-100">Manage Drivers</h1>
        <div className="flex items-center gap-4">
            <button onClick={handleDownloadReport} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center">
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Download Report
            </button>
            <button
              onClick={openAddModal}
              className={`${buttonPrimaryStyle} flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add New Driver
            </button>
        </div>
      </div>

       <input
        type="text"
        placeholder="Search drivers (name, license, Aadhaar, PAN)..."
        className={inputFieldStyle} 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => (
          <div key={driver.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all hover:shadow-2xl transform hover:-translate-y-1">
            <div className="p-5 flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4">
                <img 
                    src={driver.imageUrl || DEFAULT_DRIVER_PLACEHOLDER_IMAGE_URL.replace('D&font=', `${driver.name.charAt(0)}&font=`)} 
                    alt={driver.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 shadow-sm mb-3 sm:mb-0 shrink-0" 
                />
                <div className="flex-grow text-sm">
                    <h3 className="text-xl font-semibold text-gray-100">{driver.name}</h3>
                    <p className="text-gray-400">License: {driver.licenseNumber} (Exp: {formatDate(driver.dlExpiryDate)})</p>
                    <p className="text-gray-400">Contact: {driver.contact}</p>
                    <p className="text-gray-400">Aadhaar: {driver.aadhaarNumber || 'N/A'}</p>
                    <p className="text-gray-400">PAN: {driver.panNumber || 'N/A'}</p>
                     <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium truncate max-w-full inline-block ${driver.assignedVehicleId ? 'bg-primary-700 bg-opacity-40 text-primary-300' : 'bg-gray-600 bg-opacity-30 text-gray-400'}`}>
                            {getAssignedVehicleInfo(driver.assignedVehicleId)}
                        </span>
                    </div>
                </div>
            </div>
             <div className="px-5 pb-4 pt-2 border-t border-gray-700 bg-gray-750 flex justify-end space-x-2">
                <button onClick={() => openEditModal(driver)} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium py-1 px-3 rounded-md hover:bg-gray-700 transition-colors">Edit</button>
                <button onClick={() => handleDeleteDriver(driver.id)} className="text-sm text-red-400 hover:text-red-300 font-medium py-1 px-3 rounded-md hover:bg-gray-700 transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {filteredDrivers.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-12">No drivers found matching your search criteria.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingDriver ? 'Edit Driver' : 'Add New Driver'} size="lg">
        <DriverForm
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          initialData={editingDriver}
          vehicles={vehicles}
        />
      </Modal>
    </div>
  );
};

export default DriversPage;
