import React from 'react';
import { StatCardProps } from '../types';

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
  const changeIcon = changeType === 'increase' ? '▲' : '▼';

  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-text-secondary">{title}</h3>
            <div className="text-brand-secondary">
                 {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
        </div>
        <div>
            <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
            {change && (
                <p className={`text-sm mt-1 flex items-center ${changeColor}`}>
                    {changeIcon} {change} vs last month
                </p>
            )}
        </div>
    </div>
  );
};
