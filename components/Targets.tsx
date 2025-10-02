import React, { useState } from 'react';
import { Target } from '../types';
import { mockTargets } from '../data/mockData';
import { PlusIcon } from './icons/UIIcons';

const statusColorMap: Record<Target['status'], string> = {
  Active: 'bg-green-500/20 text-green-400',
  Inactive: 'bg-gray-500/20 text-gray-400',
};

const TargetRow: React.FC<{ target: Target }> = ({ target }) => (
  <tr className="border-b border-border-color hover:bg-background-light">
    <td className="p-4 text-sm font-medium text-text-primary">{target.name}</td>
    <td className="p-4 text-sm text-text-secondary">{target.buyer}</td>
    <td className="p-4 text-sm text-text-secondary font-mono">{target.destination}</td>
    <td className="p-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[target.status]}`}>
        {target.status}
      </span>
    </td>
    <td className="p-4 text-sm text-text-secondary">
        <button className="text-brand-secondary hover:text-brand-primary">Edit</button>
    </td>
  </tr>
);

const Targets: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>(mockTargets);
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Targets</h1>
          <p className="text-text-secondary mt-1">Manage your call routing destinations.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Target
        </button>
      </div>

      {/* Targets Table */}
      <div className="bg-background-card p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4">All Targets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-text-secondary uppercase bg-background-light">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((target) => (
                <TargetRow key={target.id} target={target} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Targets;
