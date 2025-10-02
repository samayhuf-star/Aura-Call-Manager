import React from 'react';
import { TrackedNumber, NumberStatus } from '../types';
import { mockNumbers } from '../data/mockData';
import { PlusIcon } from './icons/UIIcons';

const statusColorMap: Record<NumberStatus, string> = {
  [NumberStatus.Assigned]: 'bg-blue-500/20 text-blue-400',
  [NumberStatus.Available]: 'bg-green-500/20 text-green-400',
};

const NumberRow: React.FC<{ number: TrackedNumber }> = ({ number }) => (
  <tr className="border-b border-border-color hover:bg-background-light">
    <td className="p-4 text-sm font-medium text-text-primary">{number.phoneNumber}</td>
    <td className="p-4 text-sm text-text-secondary">{number.source || 'N/A'}</td>
     <td className="p-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[number.status]}`}>
        {number.status}
      </span>
    </td>
    <td className="p-4 text-sm text-text-secondary">{number.forwardTo || 'N/A'}</td>
    <td className="p-4 text-sm text-text-secondary">
        <button className="text-brand-secondary hover:text-brand-primary">Configure</button>
    </td>
  </tr>
);

const Numbers: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Numbers</h1>
          <p className="text-text-secondary mt-1">Purchase and manage your tracking numbers.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Purchase Numbers
        </button>
      </div>

      {/* Numbers Table */}
      <div className="bg-background-card p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Your Numbers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-text-secondary uppercase bg-background-light">
              <tr>
                <th className="p-4">Tracking Number</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Forwards To</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockNumbers.map((number) => (
                <NumberRow key={number.id} number={number} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Numbers;
