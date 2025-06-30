import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';
import { NavigationItem } from '../types';
import FleetProLogo from './FleetProLogo'; // Import the new logo component
import AppSwitcher from './AppSwitcher';

interface SidebarProps {
  currentApp: 'fleet' | 'wholesale';
  setCurrentApp: (app: 'fleet' | 'wholesale') => void;
}

const SidebarNavLink: React.FC<{ item: NavigationItem; isSubItem?: boolean }> = ({ item, isSubItem = false }) => {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"} 
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out group ${
          isActive ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-700 hover:text-gray-100 text-gray-300'
        } ${isSubItem ? 'pl-10 text-sm' : 'text-base'}`
      }
    >
      <item.icon className={`w-5 h-5 ${isSubItem ? 'w-4 h-4' : 'w-5 h-5'} transition-colors duration-200 ease-in-out ${
        'text-gray-400 group-hover:text-primary-400'
      }`} />
      <span className="font-medium">{item.name}</span>
    </NavLink>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentApp, setCurrentApp }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
    const activeParent = NAVIGATION_ITEMS.find(item => item.children?.some(child => location.pathname.startsWith(child.path)));
    return activeParent ? { [activeParent.name]: true } : {};
  });

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };
  
  React.useEffect(() => {
    const activeParent = NAVIGATION_ITEMS.find(item => item.children?.some(child => location.pathname.startsWith(child.path)));
    if (activeParent && !openSubmenus[activeParent.name]) {
      setOpenSubmenus(prev => ({ ...prev, [activeParent.name]: true }));
    }
  }, [location.pathname, openSubmenus]);


  return (
    <div className="w-72 h-screen bg-gray-800 text-gray-100 flex flex-col fixed top-0 left-0 shadow-2xl">
      {/* Updated Sidebar Header to use the Logo */}
      <div className="p-5 flex items-center justify-start border-b border-gray-700 h-[73px]"> {/* Adjusted padding/height slightly for logo */}
        <FleetProLogo />
      </div>

      <AppSwitcher currentApp={currentApp} setCurrentApp={setCurrentApp} />
      
      <nav className="flex-grow p-5 space-y-2 overflow-y-auto border-t border-gray-700">
        {NAVIGATION_ITEMS.map((item: NavigationItem) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out group text-base font-medium ${
                     openSubmenus[item.name] || location.pathname.startsWith(item.path) ? 'bg-gray-700 text-primary-300' : 'hover:bg-gray-700 hover:text-gray-100 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 transition-colors duration-200 ease-in-out ${
                        openSubmenus[item.name] || location.pathname.startsWith(item.path) ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'
                    }`} />
                    <span>{item.name}</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transform transition-transform duration-200 ${openSubmenus[item.name] ? 'rotate-90' : ''} ${
                         openSubmenus[item.name] || location.pathname.startsWith(item.path) ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'
                    }`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {openSubmenus[item.name] && (
                  <div className="mt-2 space-y-1 pl-4 border-l border-gray-700 ml-2">
                    {item.children.map(childItem => (
                      <SidebarNavLink key={childItem.name} item={childItem} isSubItem />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <SidebarNavLink item={item} />
            )}
          </div>
        ))}
      </nav>
      <div className="p-5 border-t border-gray-700 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} FleetPro. Precision Fleet Management.
      </div>
    </div>
  );
};

export default Sidebar;