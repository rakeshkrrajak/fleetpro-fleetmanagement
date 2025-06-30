import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MaintenanceTask, MaintenanceType, MaintenanceTaskStatus, Vehicle, Mechanic, MaintenancePart } from '../../types';
import Modal from '../../components/Modal';
import { ClipboardListIcon, WrenchIcon, ArrowDownTrayIcon } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../services/reportService';


const generateMockId = () => Math.random().toString(36).substring(2, 10);

interface MaintenanceTasksPageProps {
  tasks: MaintenanceTask[];
  vehicles: Vehicle[];
  mechanics: Mechanic[];
  addTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  updateTask: (task: MaintenanceTask) => void;
  deleteTask: (taskId: string) => void;
}

const initialTaskFormState: Omit<MaintenanceTask, 'id'> = {
  vehicleId: '',
  title: '',
  description: '',
  maintenanceType: MaintenanceType.PREVENTIVE,
  status: MaintenanceTaskStatus.SCHEDULED,
  scheduledDate: new Date().toISOString().split('T')[0],
  mechanicId: null,
  garageName: '',
  partsReplaced: [],
  laborCost: 0,
  partsCost: 0,
  totalCost: 0,
  odometerAtMaintenance: 0,
  notes: '',
};

// Common dark theme styles
const inputFieldStyle = "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm rounded-lg p-2.5";
const labelStyle = "block text-sm font-medium text-gray-300 mb-1";
const buttonPrimaryStyle = "px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md transition-colors";
const buttonSecondaryStyle = "px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-sm transition-colors";
const buttonSmallActionStyle = "text-xs py-1.5 px-3 rounded-md transition-colors";

interface TaskFormProps {
  onSubmit: (task: Omit<MaintenanceTask, 'id'>) => void;
  onCancel: () => void;
  initialData?: MaintenanceTask | null;
  vehicles: Vehicle[];
  mechanics: Mechanic[];
  vehicleIdFromQuery?: string | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData, vehicles, mechanics, vehicleIdFromQuery }) => {
  const [formData, setFormData] = useState<Omit<MaintenanceTask, 'id'>>(
    initialData ? JSON.parse(JSON.stringify(initialData)) :
    {...initialTaskFormState, vehicleId: vehicleIdFromQuery || ''}
  );

  useEffect(() => {
    if (initialData) {
        const numericFields: (keyof MaintenanceTask)[] = ['odometerAtMaintenance', 'laborCost', 'partsCost', 'totalCost'];
        const sanitizedInitialData = {...initialData};
        numericFields.forEach(field => {
            if (sanitizedInitialData[field] !== undefined && typeof sanitizedInitialData[field] === 'string') {
                (sanitizedInitialData as any)[field] = parseFloat(sanitizedInitialData[field] as string) || 0;
            } else if (sanitizedInitialData[field] === undefined) {
                 (sanitizedInitialData as any)[field] = 0;
            }
        });
        if (sanitizedInitialData.partsReplaced) {
            sanitizedInitialData.partsReplaced = sanitizedInitialData.partsReplaced.map(p => ({
                ...p,
                quantity: Number(p.quantity) || 1,
                cost: Number(p.cost) || 0
            }));
        }
        setFormData(sanitizedInitialData);
    } else if (vehicleIdFromQuery) {
        setFormData(prev => ({...prev, vehicleId: vehicleIdFromQuery}));
    }
  }, [initialData, vehicleIdFromQuery]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 :
               (name === 'mechanicId' && value === "") ? null : value,
    }));
  };

  const handlePartsChange = (index: number, field: keyof MaintenancePart, value: string | number) => {
    const newParts = [...(formData.partsReplaced || [])];
    const valToSet = (field === 'quantity' || field === 'cost') ? Number(value) || 0 : value;
    newParts[index] = { ...newParts[index], [field]: valToSet };
    setFormData(prev => ({ ...prev, partsReplaced: newParts }));
  };

  const addPart = () => {
    setFormData(prev => ({ ...prev, partsReplaced: [...(prev.partsReplaced || []), { name: '', quantity: 1, cost: 0 }] }));
  };

  const removePart = (index: number) => {
    setFormData(prev => ({ ...prev, partsReplaced: (prev.partsReplaced || []).filter((_, i) => i !== index) }));
  };

  useEffect(() => {
    const calculatedPartsCost = (formData.partsReplaced || []).reduce((sum, part) => sum + (part.cost || 0) * (part.quantity || 0), 0);
    const calculatedTotalCost = (formData.laborCost || 0) + calculatedPartsCost;
    setFormData(prev => ({
      ...prev,
      partsCost: calculatedPartsCost,
      totalCost: calculatedTotalCost
    }));
  }, [formData.partsReplaced, formData.laborCost]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.title || !formData.scheduledDate) {
      alert("Please fill Vehicle, Title, and Scheduled Date.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehicleId" className={labelStyle}>Vehicle *</label>
          <select name="vehicleId" id="vehicleId" value={formData.vehicleId} onChange={handleChange} required className={`${inputFieldStyle} mt-1 pr-8`}>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="title" className={labelStyle}>Task Title *</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={`${inputFieldStyle} mt-1`} />
        </div>
      </div>
      <div>
        <label htmlFor="description" className={labelStyle}>Description</label>
        <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={2} className={`${inputFieldStyle} mt-1`} />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="maintenanceType" className={labelStyle}>Maintenance Type *</label>
            <select name="maintenanceType" id="maintenanceType" value={formData.maintenanceType} onChange={handleChange} required className={`${inputFieldStyle} mt-1 pr-8`}>
                {Object.values(MaintenanceType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="status" className={labelStyle}>Status *</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} required className={`${inputFieldStyle} mt-1 pr-8`}>
                {Object.values(MaintenanceTaskStatus).map(st => <option key={st} value={st}>{st}</option>)}
            </select>
        </div>
         <div>
            <label htmlFor="odometerAtMaintenance" className={labelStyle}>Odometer Reading (km)</label>
            <input type="number" name="odometerAtMaintenance" id="odometerAtMaintenance" value={formData.odometerAtMaintenance || 0} onChange={handleChange} className={`${inputFieldStyle} mt-1`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="scheduledDate" className={labelStyle}>Scheduled Date *</label>
          <input type="date" name="scheduledDate" id="scheduledDate" value={formData.scheduledDate ? formData.scheduledDate.substring(0,10) : ''} onChange={handleChange} required className={`${inputFieldStyle} mt-1 dark:[color-scheme:dark]`} />
        </div>
        <div>
          <label htmlFor="completionDate" className={labelStyle}>Completion Date</label>
          <input type="date" name="completionDate" id="completionDate" value={formData.completionDate ? formData.completionDate.substring(0,10) : ''} onChange={handleChange} className={`${inputFieldStyle} mt-1 dark:[color-scheme:dark]`} />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mechanicId" className={labelStyle}>Assigned Mechanic/Vendor</label>
          <select name="mechanicId" id="mechanicId" value={formData.mechanicId || ""} onChange={handleChange} className={`${inputFieldStyle} mt-1 pr-8`}>
            <option value="">Select Mechanic/Vendor</option>
            {mechanics.map(m => <option key={m.id} value={m.id}>{m.name} ({m.isInternal ? "Internal" : "External"})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="garageName" className={labelStyle}>Garage Name (if not in directory)</label>
          <input type="text" name="garageName" id="garageName" value={formData.garageName || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1`} />
        </div>
      </div>

      <fieldset className="border border-gray-700 p-3 rounded-md">
        <legend className="text-md font-medium text-gray-300 px-1">Parts Replaced</legend>
        {(formData.partsReplaced || []).map((part, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2 p-2 border-b border-gray-700 last:border-b-0 items-center">
            <input type="text" placeholder="Part Name" value={part.name} onChange={(e) => handlePartsChange(index, 'name', e.target.value)} className={`md:col-span-3 ${inputFieldStyle}`} />
            <input type="number" placeholder="Qty" value={part.quantity} onChange={(e) => handlePartsChange(index, 'quantity', e.target.value)} min="1" className={`md:col-span-1 ${inputFieldStyle}`} />
            <input type="number" placeholder="Cost/Unit (₹)" value={part.cost || 0} onChange={(e) => handlePartsChange(index, 'cost', e.target.value)} min="0" step="0.01" className={`md:col-span-2 ${inputFieldStyle}`} />
            <button type="button" onClick={() => removePart(index)} className={`${buttonSmallActionStyle} text-red-400 hover:text-red-300 hover:bg-red-700 bg-opacity-20 md:col-span-1 self-center`}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addPart} className={`${buttonSmallActionStyle} mt-2 bg-sky-700 bg-opacity-50 text-sky-300 hover:bg-sky-600`}>Add Part</button>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="laborCost" className={labelStyle}>Labor Cost (₹)</label>
          <input type="number" name="laborCost" id="laborCost" value={formData.laborCost || 0} onChange={handleChange} min="0" step="0.01" className={`${inputFieldStyle} mt-1`} />
        </div>
        <div>
          <label className={labelStyle}>Total Parts Cost (₹)</label>
          <input type="text" value={(formData.partsCost || 0).toFixed(2)} readOnly className={`${inputFieldStyle} mt-1 bg-gray-600 cursor-not-allowed text-gray-400`} />
        </div>
        <div>
          <label className={labelStyle}>Total Maintenance Cost (₹)</label>
          <input type="text" value={(formData.totalCost || 0).toFixed(2)} readOnly className={`${inputFieldStyle} mt-1 bg-gray-600 cursor-not-allowed text-gray-400`} />
        </div>
      </div>
       <div>
        <label htmlFor="receiptFileName" className={labelStyle}>Receipt File Name (Mock)</label>
        <input type="text" name="receiptFileName" id="receiptFileName" value={formData.receiptFileName || ''} onChange={handleChange} className={`${inputFieldStyle} mt-1`} />
      </div>
      <div>
        <label htmlFor="notes" className={labelStyle}>Notes</label>
        <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className={`${inputFieldStyle} mt-1`} />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-4">
        <button type="button" onClick={onCancel} className={buttonSecondaryStyle}>Cancel</button>
        <button type="submit" className={buttonPrimaryStyle}>
          {initialData ? 'Update Task' : 'Schedule Task'}
        </button>
      </div>
    </form>
  );
};


const MaintenanceTasksPage: React.FC<MaintenanceTasksPageProps> = ({ tasks, vehicles, mechanics, addTask, updateTask, deleteTask }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const vehicleIdFromQuery = queryParams.get('vehicleId');
  const actionFromQuery = queryParams.get('action');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [filterVehicle, setFilterVehicle] = useState<string>(vehicleIdFromQuery || 'ALL');
  const [filterStatus, setFilterStatus] = useState<MaintenanceTaskStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<MaintenanceType | 'ALL'>('ALL');

  useEffect(() => {
    if (actionFromQuery === 'add' && vehicleIdFromQuery) {
        setEditingTask(null);
        setIsModalOpen(true);
        navigate(location.pathname, { replace: true });
    }
  }, [actionFromQuery, vehicleIdFromQuery, navigate, location.pathname]);


  const openAddModal = () => { setEditingTask(null); setIsModalOpen(true); };
  const openEditModal = (task: MaintenanceTask) => { setEditingTask(task); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingTask(null); };

  const handleFormSubmit = (taskData: Omit<MaintenanceTask, 'id'>) => {
    if (editingTask) {
      updateTask({ ...editingTask, ...taskData });
    } else {
      addTask(taskData);
    }
    closeModal();
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance task?')) {
      deleteTask(taskId);
    }
  };

  const getVehicleName = useCallback((vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'N/A';
  }, [vehicles]);
  const getMechanicName = useCallback((mechanicId?: string | null) => mechanics.find(m => m.id === mechanicId)?.name || 'N/A', [mechanics]);
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-IN') : 'N/A';

  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      (filterVehicle === 'ALL' || task.vehicleId === filterVehicle) &&
      (filterStatus === 'ALL' || task.status === filterStatus) &&
      (filterType === 'ALL' || task.maintenanceType === filterType)
    ).sort((a,b) => new Date(b.scheduledDate || 0).getTime() - new Date(a.scheduledDate || 0).getTime());
  }, [tasks, filterVehicle, filterStatus, filterType]);

  const handleDownloadReport = useCallback(() => {
    const dataToExport = filteredTasks.map(task => ({
      title: task.title,
      vehicle: getVehicleName(task.vehicleId),
      type: task.maintenanceType,
      status: task.status,
      scheduledDate: formatDate(task.scheduledDate),
      completionDate: formatDate(task.completionDate),
      mechanic: task.mechanicId ? getMechanicName(task.mechanicId) : task.garageName || 'N/A',
      totalCost: task.totalCost || 0,
      odometer: task.odometerAtMaintenance || 'N/A'
    }));
    
    const headers = [
      { key: 'title', label: 'Title' },
      { key: 'vehicle', label: 'Vehicle' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status' },
      { key: 'scheduledDate', label: 'Scheduled Date' },
      { key: 'completionDate', label: 'Completion Date' },
      { key: 'mechanic', label: 'Mechanic/Vendor' },
      { key: 'totalCost', label: 'Total Cost (INR)' },
      { key: 'odometer', label: 'Odometer (km)' },
    ];

    exportToCsv(`fleetpro_maintenance_report_${new Date().toISOString().split('T')[0]}.csv`, dataToExport, headers);
  }, [filteredTasks, getVehicleName, getMechanicName, formatDate]);


 const getStatusPillClass = (status: MaintenanceTaskStatus) => {
    switch (status) {
      case MaintenanceTaskStatus.SCHEDULED: return 'bg-blue-700 bg-opacity-30 text-blue-300';
      case MaintenanceTaskStatus.IN_PROGRESS: return 'bg-yellow-700 bg-opacity-30 text-yellow-300';
      case MaintenanceTaskStatus.COMPLETED: return 'bg-green-700 bg-opacity-30 text-green-300';
      case MaintenanceTaskStatus.CANCELLED: return 'bg-red-700 bg-opacity-30 text-red-300';
      case MaintenanceTaskStatus.AWAITING_PARTS: return 'bg-orange-700 bg-opacity-30 text-orange-300';
      case MaintenanceTaskStatus.PENDING_APPROVAL: return 'bg-purple-700 bg-opacity-30 text-purple-300';
      default: return 'bg-gray-700 bg-opacity-30 text-gray-300';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center">
            <ClipboardListIcon className="w-8 h-8 mr-3 text-primary-400"/> Maintenance Tasks
        </h1>
        <div className="flex items-center gap-4">
            <button onClick={handleDownloadReport} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Download Report
            </button>
            <button onClick={openAddModal} className={`${buttonPrimaryStyle} flex items-center`}>
                <WrenchIcon className="w-5 h-5 mr-2" />
                Schedule New Task
            </button>
        </div>
      </div>
      <p className="text-sm text-gray-400 -mt-4 mb-6">Log, track, and manage all vehicle maintenance activities.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg shadow">
        <div>
          <label htmlFor="filterVehicle" className={labelStyle}>Filter by Vehicle</label>
          <select id="filterVehicle" value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)} className={`${inputFieldStyle} mt-1 pr-8`}>
            <option value="ALL">All Vehicles</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterStatus" className={labelStyle}>Filter by Status</label>
          <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as MaintenanceTaskStatus | 'ALL')} className={`${inputFieldStyle} mt-1 pr-8`}>
            <option value="ALL">All Statuses</option>
            {Object.values(MaintenanceTaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterType" className={labelStyle}>Filter by Type</label>
          <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value as MaintenanceType | 'ALL')} className={`${inputFieldStyle} mt-1 pr-8`}>
            <option value="ALL">All Types</option>
            {Object.values(MaintenanceType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

       <div className="bg-gray-800 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scheduled</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mechanic/Vendor</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Cost (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-100">{task.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{getVehicleName(task.vehicleId)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{task.maintenanceType}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(task.status)}`}>{task.status}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{formatDate(task.scheduledDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{formatDate(task.completionDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{task.mechanicId ? getMechanicName(task.mechanicId) : task.garageName || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-100 font-semibold text-right">{task.totalCost ? task.totalCost.toLocaleString() : '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => openEditModal(task)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                  <button onClick={() => handleDelete(task.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-500">No maintenance tasks found matching filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

       <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? 'Edit Maintenance Task' : 'Schedule New Task'} size="2xl">
        <TaskForm
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          initialData={editingTask}
          vehicles={vehicles}
          mechanics={mechanics}
          vehicleIdFromQuery={vehicleIdFromQuery}
        />
      </Modal>

    </div>
  );
};

export default MaintenanceTasksPage;
