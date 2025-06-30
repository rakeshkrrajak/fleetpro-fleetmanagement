

import React, { useState, useMemo, useCallback } from 'react';
import { FuelLogEntry, Vehicle, FuelType } from '../../types';
import Modal from '../../components/Modal';
import { FireIcon, ArrowDownTrayIcon } from '../../constants';
import { exportToCsv } from '../../services/reportService';


interface FuelLogPageProps {
  fuelLogs: FuelLogEntry[];
  vehicles: Vehicle[];
  addFuelLog: (log: Omit<FuelLogEntry, 'id' | 'totalCost'>) => void;
  updateFuelLog: (log: FuelLogEntry) => void;
  deleteFuelLog: (logId: string) => void;
}

const initialFuelLogFormState: Omit<FuelLogEntry, 'id' | 'totalCost'> = {
  vehicleId: '',
  date: new Date().toISOString().split('T')[0],
  fuelType: FuelType.DIESEL,
  quantity: 0,
  costPerUnit: 0,
  odometerReading: 0,
  stationName: '',
  fuelBillFileName: '',
};

// Common dark theme styles
const inputFieldStyle = "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm rounded-lg p-2.5";
const labelStyle = "block text-sm font-medium text-gray-300 mb-1";
const buttonPrimaryStyle = "px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md transition-colors";
const buttonSecondaryStyle = "px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-sm transition-colors";


interface FuelLogFormProps {
  onSubmit: (log: Omit<FuelLogEntry, 'id' | 'totalCost'>) => void;
  onCancel: () => void;
  initialData?: FuelLogEntry | null;
  vehicles: Vehicle[];
}

const FuelLogForm: React.FC<FuelLogFormProps> = ({ onSubmit, onCancel, initialData, vehicles }) => {
  const [formData, setFormData] = useState<Omit<FuelLogEntry, 'id' | 'totalCost'>>(
    initialData ? { ...initialData } : initialFuelLogFormState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || formData.quantity <= 0 || formData.costPerUnit <= 0 || formData.odometerReading <= 0) {
      alert("Please fill all required fields with valid values (Vehicle, Quantity, Cost/Unit, Odometer).");
      return;
    }
    onSubmit(formData);
  };
  
  const totalCostDisplay = useMemo(() => {
    return (formData.quantity * formData.costPerUnit).toFixed(2);
  }, [formData.quantity, formData.costPerUnit]);


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehicleId" className={labelStyle}>Vehicle *</label>
          <select name="vehicleId" id="vehicleId" value={formData.vehicleId} onChange={handleChange} required className={`${inputFieldStyle} mt-1 pr-8`}>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className={labelStyle}>Date *</label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className={`${inputFieldStyle} mt-1 dark:[color-scheme:dark]`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="fuelType" className={labelStyle}>Fuel Type *</label>
          <select name="fuelType" id="fuelType" value={formData.fuelType} onChange={handleChange} required className={`${inputFieldStyle} mt-1 pr-8`}>
            {Object.values(FuelType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className={labelStyle}>Quantity (Liters/kWh) *</label>
          <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required min="0.01" step="0.01" className={`${inputFieldStyle} mt-1`} />
        </div>
        <div>
          <label htmlFor="costPerUnit" className={labelStyle}>Cost per Unit (₹) *</label>
          <input type="number" name="costPerUnit" id="costPerUnit" value={formData.costPerUnit} onChange={handleChange} required min="0.01" step="0.01" className={`${inputFieldStyle} mt-1`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="odometerReading" className={labelStyle}>Odometer Reading (km) *</label>
          <input type="number" name="odometerReading" id="odometerReading" value={formData.odometerReading} onChange={handleChange} required min="0" className={`${inputFieldStyle} mt-1`} />
        </div>
        <div>
          <label className={labelStyle}>Total Cost (₹)</label>
          <input type="text" value={totalCostDisplay} readOnly className={`${inputFieldStyle} mt-1 bg-gray-600 cursor-not-allowed text-gray-400`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stationName" className={labelStyle}>Fuel Station Name</label>
          <input type="text" name="stationName" id="stationName" value={formData.stationName || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1`} />
        </div>
        <div>
          <label htmlFor="fuelBillFileName" className={labelStyle}>Fuel Bill File Name (Mock)</label>
          <input type="text" name="fuelBillFileName" id="fuelBillFileName" value={formData.fuelBillFileName || ''} placeholder="e.g., fuel_slip.png" className={`${inputFieldStyle} mt-1`} />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className={buttonSecondaryStyle}>Cancel</button>
        <button type="submit" className={buttonPrimaryStyle}>{initialData ? 'Update Log' : 'Add Fuel Log'}</button>
      </div>
    </form>
  );
};


const FuelLogPage: React.FC<FuelLogPageProps> = ({ fuelLogs, vehicles, addFuelLog, updateFuelLog, deleteFuelLog }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FuelLogEntry | null>(null);
  const [filterVehicleId, setFilterVehicleId] = useState<string>('ALL');

  const openAddModal = () => { setEditingLog(null); setIsModalOpen(true); };
  const openEditModal = (log: FuelLogEntry) => { setEditingLog(log); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingLog(null); };

  const handleFormSubmit = (logData: Omit<FuelLogEntry, 'id' | 'totalCost'>) => {
    if (editingLog) {
      updateFuelLog({ ...editingLog, ...logData });
    } else {
      addFuelLog(logData);
    }
    closeModal();
  };

  const handleDeleteLog = (logId: string) => {
    if (window.confirm('Are you sure you want to delete this fuel log?')) {
      deleteFuelLog(logId);
    }
  };

  const calculateFuelEfficiency = useCallback((vehicleId: string, currentLog: FuelLogEntry): string => {
    const vehicleFuelLogs = fuelLogs
      .filter(log => log.vehicleId === vehicleId && log.id !== currentLog.id && new Date(log.date) < new Date(currentLog.date))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
    
    const previousLog = vehicleFuelLogs.find(log => log.odometerReading < currentLog.odometerReading);

    if (previousLog && currentLog.fuelType !== FuelType.ELECTRIC) {
      const distance = currentLog.odometerReading - previousLog.odometerReading;
      const fuelConsumed = currentLog.quantity; 
      if (distance > 0 && fuelConsumed > 0) {
        return `${(distance / fuelConsumed).toFixed(2)} km/L`;
      }
    }
    return 'N/A';
  }, [fuelLogs]);

  const filteredFuelLogs = useMemo(() => {
    return fuelLogs.filter(log => 
        (filterVehicleId === 'ALL' || log.vehicleId === filterVehicleId)
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [fuelLogs, filterVehicleId]);

  const getVehicleName = useCallback((vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'N/A';
  }, [vehicles]);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN');
  
  const handleDownloadReport = useCallback(() => {
    const dataToExport = filteredFuelLogs.map(log => ({
      date: formatDate(log.date),
      vehicle: getVehicleName(log.vehicleId),
      fuelType: log.fuelType,
      quantity: log.quantity.toFixed(2),
      costPerUnit: log.costPerUnit.toFixed(2),
      totalCost: log.totalCost.toFixed(2),
      odometerReading: log.odometerReading,
      efficiency: calculateFuelEfficiency(log.vehicleId, log),
      stationName: log.stationName || 'N/A',
    }));

    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'vehicle', label: 'Vehicle' },
      { key: 'fuelType', label: 'Fuel Type' },
      { key: 'quantity', label: 'Quantity (L/kWh)' },
      { key: 'costPerUnit', label: 'Cost/Unit (INR)' },
      { key: 'totalCost', label: 'Total Cost (INR)' },
      { key: 'odometerReading', label: 'Odometer (km)' },
      { key: 'efficiency', label: 'Efficiency (km/L)' },
      { key: 'stationName', label: 'Station Name' },
    ];
    
    exportToCsv(`fleetpro_fuel_log_${new Date().toISOString().split('T')[0]}.csv`, dataToExport, headers);
  }, [filteredFuelLogs, getVehicleName, calculateFuelEfficiency]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center">
            <FireIcon className="w-8 h-8 mr-3 text-primary-400"/>Fuel Log Management
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={handleDownloadReport} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download Report
          </button>
          <button onClick={openAddModal} className={`${buttonPrimaryStyle} flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
            Add Fuel Entry
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-400 -mt-4 mb-6">Track fuel consumption, costs, and efficiency for your fleet.</p>

      <div className="p-4 bg-gray-800 rounded-lg shadow">
          <label htmlFor="filterVehicleId" className={labelStyle}>Filter by Vehicle</label>
          <select id="filterVehicleId" value={filterVehicleId} onChange={(e) => setFilterVehicleId(e.target.value)} className={`${inputFieldStyle} mt-1 w-full md:w-1/3 pr-8`}>
            <option value="ALL">All Vehicles</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
          </select>
      </div>

      <div className="bg-gray-800 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fuel Type</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Qty (L/kWh)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Cost/Unit (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Odometer (km)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Efficiency</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Station</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bill File</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredFuelLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatDate(log.date)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{vehicles.find(v => v.id === log.vehicleId)?.licensePlate || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.fuelType}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{log.quantity.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{log.costPerUnit.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-100 text-right">{log.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{log.odometerReading.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{calculateFuelEfficiency(log.vehicleId, log)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{log.stationName || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{log.fuelBillFileName || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => openEditModal(log)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                  <button onClick={() => handleDeleteLog(log.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {filteredFuelLogs.length === 0 && (
                <tr><td colSpan={11} className="text-center py-10 text-gray-500">No fuel log entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingLog ? 'Edit Fuel Log' : 'Add Fuel Log Entry'} size="lg">
        <FuelLogForm onSubmit={handleFormSubmit} onCancel={closeModal} initialData={editingLog} vehicles={vehicles} />
      </Modal>
    </div>
  );
};

export default FuelLogPage;
