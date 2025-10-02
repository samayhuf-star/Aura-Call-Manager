import React from 'react';
import { ChartBarIcon, PhoneIcon, CurrencyDollarIcon, ClockIcon, LocationMarkerIcon } from './icons/UIIcons'; 
import { ReportsIcon } from './icons/NavIcons'; 

interface ReportCardProps {
    title: string;
    description: string;
    // FIX: Updated the icon prop type to be more specific, allowing `React.cloneElement` to correctly type-check the `className` prop.
    icon: React.ReactElement<{ className?: string }>;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon }) => (
    <div className="bg-background-card p-6 rounded-xl shadow-lg flex flex-col items-start transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
         <div className="p-3 rounded-lg bg-brand-secondary/10 text-brand-secondary mb-4">
            {React.cloneElement(icon, { className: 'w-8 h-8' })}
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
    </div>
);


const Reports: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
        <p className="text-text-secondary mt-1">Dive deep into your call data with detailed reports.</p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
            title="Performance by Source"
            description="Analyze call volume, duration, and conversion rates for each traffic source."
            icon={<ChartBarIcon />}
        />
        <ReportCard 
            title="Detailed Call Log"
            description="View a comprehensive log of all inbound calls with filtering and export options."
            icon={<ReportsIcon />}
        />
         <ReportCard 
            title="Agent Performance"
            description="Track key metrics for your sales or support agents, including calls handled and outcomes."
            icon={<PhoneIcon />}
        />
         <ReportCard 
            title="Geographic Report"
            description="Visualize call data on a map to identify high-performing regions."
            icon={<LocationMarkerIcon />}
        />
        <ReportCard 
            title="Conversion & Revenue"
            description="Connect calls to revenue and track your return on investment (ROI)."
            icon={<CurrencyDollarIcon />}
        />
         <ReportCard 
            title="Time-of-Day Analysis"
            description="Identify peak call times to optimize staffing and campaign schedules."
            icon={<ClockIcon />}
        />
      </div>
    </div>
  );
};

export default Reports;
