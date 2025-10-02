import React, { useState } from 'react';
import { LogoIcon, DashboardIcon, CampaignsIcon, NumbersIcon, ReportsIcon, SettingsIcon } from './icons/NavIcons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, isCollapsed, onClick }) => {
  return (
    <button onClick={onClick} className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-left ${active ? 'bg-brand-primary text-white' : 'text-text-secondary hover:bg-background-light hover:text-white'}`}>
      {icon}
      {!isCollapsed && <span className="ml-4 font-medium">{label}</span>}
    </button>
  );
};

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex flex-col bg-background-dark border-r border-border-color p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center mb-8" >
        <div className="p-1 rounded-lg bg-white/10">
            <LogoIcon className="w-8 h-8 text-brand-primary" />
        </div>
        {!isCollapsed && <span className="text-xl font-bold ml-3 text-white">AuraCall</span>}
      </div>

      <nav className="flex-1">
        <NavItem icon={<DashboardIcon />} label="Dashboard" active={activePage === 'Dashboard'} isCollapsed={isCollapsed} onClick={() => onNavigate('Dashboard')} />
        <NavItem icon={<CampaignsIcon />} label="Campaigns" active={activePage === 'Campaigns'} isCollapsed={isCollapsed} onClick={() => onNavigate('Campaigns')} />
        <NavItem icon={<NumbersIcon />} label="Numbers" active={activePage === 'Numbers'} isCollapsed={isCollapsed} onClick={() => onNavigate('Numbers')} />
        <NavItem icon={<ReportsIcon />} label="Reports" active={activePage === 'Reports'} isCollapsed={isCollapsed} onClick={() => onNavigate('Reports')} />
      </nav>

      <div>
        <NavItem icon={<SettingsIcon />} label="Settings" active={activePage === 'Settings'} isCollapsed={isCollapsed} onClick={() => onNavigate('Settings')} />
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full mt-4 p-3 flex items-center text-text-secondary hover:bg-background-light hover:text-white rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isCollapsed ? 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /> : 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            }
          </svg>
          {!isCollapsed && <span className="ml-4 font-medium">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
