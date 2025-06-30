

import React from 'react';
import { Vehicle, Driver, VehicleStatus, TelematicsAlert, MaintenanceTask, MaintenanceTaskStatus } from '../types';
import { TruckIcon, UserGroupIcon, CogIcon, ShieldCheckIcon, BellAlertIcon, WrenchIcon, ClipboardListIcon } from '../constants'; 

interface DashboardPageProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  alerts: TelematicsAlert[];
  maintenanceTasks: MaintenanceTask[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string; 
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, accentColor, subtext }) => (
  <div className={`bg-gray-800 p-6 rounded-xl shadow-xl flex items-center space-x-4 border-l-4 ${accentColor.split(' ')[1].replace('text-', 'border-')}`}> {/* Ensure border color is derived correctly */}
    <div className={`shrink-0 p-3 bg-gray-700 rounded-lg ${accentColor.split(' ')[0]}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-3xl font-semibold text-gray-100">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>} {/* Adjusted from text-gray-500 */}
    </div>
  </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ vehicles, drivers, alerts, maintenanceTasks }) => {
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length;
  
  const vehiclesInMaintenance = vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length;

  const totalDrivers = drivers.length;
  const unassignedDrivers = drivers.filter(d => !d.assignedVehicleId).length;
  const unacknowledgedAlertsCount = alerts.filter(alert => !alert.isAcknowledged).length;
  
  const pendingMaintenanceTasks = maintenanceTasks.filter(
    task => task.status === MaintenanceTaskStatus.SCHEDULED || task.status === MaintenanceTaskStatus.AWAITING_PARTS || task.status === MaintenanceTaskStatus.PENDING_APPROVAL
  ).length;

  const getDaysUntilExpiry = (expiryDate?: string): number | null => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0,0,0,0); 
    const expDate = new Date(expiryDate);
    if (isNaN(expDate.getTime())) return null;
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const documentsExpiringSoonCount = vehicles.reduce((count, vehicle) => {
    const docDates = [
      vehicle.rcExpiryDate, 
      vehicle.insuranceExpiryDate, 
      vehicle.fitnessExpiryDate, 
      vehicle.pucExpiryDate
    ];
    for (const dateStr of docDates) {
      const days = getDaysUntilExpiry(dateStr);
      if (days !== null && days <= 30 && days >=0) { 
        return count + 1;
      }
    }
    return count;
  }, 0);

  const getStatusPillClass = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE: return 'bg-green-700 bg-opacity-30 text-green-300';
      case VehicleStatus.MAINTENANCE: return 'bg-amber-700 bg-opacity-30 text-amber-300';
      case VehicleStatus.INACTIVE: return 'bg-red-700 bg-opacity-30 text-red-300';
      case VehicleStatus.RETIRED: return 'bg-gray-600 bg-opacity-30 text-gray-400';
      default: return 'bg-gray-700 bg-opacity-30 text-gray-300';
    }
  };


  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-gray-100">Fleet Dashboard</h1>
        <p className="text-gray-400 mt-2 text-lg">Welcome! Here's a high-level overview of your fleet's performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Vehicles" 
          value={totalVehicles} 
          icon={<TruckIcon className="w-8 h-8" />}
          accentColor="text-primary-400 border-primary-500"
        />
        <StatCard 
          title="Active Vehicles" 
          value={activeVehicles} 
          icon={<TruckIcon className="w-8 h-8" />}
          accentColor="text-green-400 border-green-500"
        />
        <StatCard 
          title="Vehicles in Maintenance" 
          value={vehiclesInMaintenance} 
          icon={<WrenchIcon className="w-8 h-8" />}
          accentColor="text-amber-400 border-amber-500"
        />
         <StatCard 
          title="Pending Maintenance Tasks" 
          value={pendingMaintenanceTasks} 
          icon={<ClipboardListIcon className="w-8 h-8" />}
          accentColor="text-yellow-400 border-yellow-500"
          subtext="Scheduled/Awaiting Parts"
        />
        <StatCard 
          title="Total Drivers" 
          value={totalDrivers} 
          icon={<UserGroupIcon className="w-8 h-8" />}
          accentColor="text-indigo-400 border-indigo-500"
        />
         <StatCard 
          title="Unassigned Drivers" 
          value={unassignedDrivers} 
          icon={<UserGroupIcon className="w-8 h-8" />}
          accentColor="text-orange-400 border-orange-500" 
        />
        <StatCard 
          title="Documents Expiring Soon" 
          value={documentsExpiringSoonCount} 
          icon={<ShieldCheckIcon className="w-8 h-8" />}
          accentColor="text-red-400 border-red-500"
          subtext="(Next 30 days)"
        />
        <StatCard
            title="Active Alerts"
            value={unacknowledgedAlertsCount}
            icon={<BellAlertIcon className="w-8 h-8" />}
            accentColor="text-pink-400 border-pink-500"
            subtext="Unacknowledged"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">Recently Added Vehicles</h2>
          {vehicles.slice(-3).reverse().map(vehicle => ( 
            <div key={vehicle.id} className="flex items-center space-x-4 py-4 border-b border-gray-700 last:border-b-0">
              <img 
                src={vehicle.imageUrl} 
                alt={`${vehicle.make} ${vehicle.model}`} 
                className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/64x64/374151/9ca3af?text=V&font=montserrat`; }}
              />
              <div className="flex-grow">
                <p className="font-semibold text-lg text-gray-200">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                <p className="text-sm text-gray-400">VIN: {vehicle.vin} - Plate: {vehicle.licensePlate}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusPillClass(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
          ))}
          {vehicles.length === 0 && <p className="text-gray-500">No vehicles yet.</p>}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">Recent Drivers</h2>
          {drivers.slice(-3).reverse().map(driver => ( 
            <div key={driver.id} className="flex items-center space-x-4 py-4 border-b border-gray-700 last:border-b-0">
              <img 
                src={driver.imageUrl || `https://placehold.co/64x64/075985/e0f2fe?text=${driver.name.charAt(0)}&font=montserrat`} 
                alt={driver.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-700" 
              />
              <div className="flex-grow">
                <p className="font-semibold text-lg text-gray-200">{driver.name}</p>
                <p className="text-sm text-gray-400">License: {driver.licenseNumber}</p>
              </div>
               <span className={`text-xs px-3 py-1 rounded-full font-medium ${driver.assignedVehicleId ? 'bg-primary-700 bg-opacity-40 text-primary-300' : 'bg-gray-600 bg-opacity-30 text-gray-400'}`}>
                {driver.assignedVehicleId ? 'Assigned' : 'Unassigned'}
               </span>
            </div>
          ))}
          {drivers.length === 0 && <p className="text-gray-500">No drivers yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;