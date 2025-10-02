import React from 'react';
import { Call, CallStatus } from '../types';
import { mockRecentCalls } from '../data/mockData';

const statusColorMap: Record<CallStatus, string> = {
  [CallStatus.Answered]: 'bg-green-500/20 text-green-400',
  [CallStatus.Missed]: 'bg-yellow-500/20 text-yellow-400',
  [CallStatus.Voicemail]: 'bg-blue-500/20 text-blue-400',
  [CallStatus.Failed]: 'bg-red-500/20 text-red-400',
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const TableRow: React.FC<{ call: Call }> = ({ call }) => (
  <tr className="border-b border-border-color hover:bg-background-light">
    <td className="p-4 text-sm text-text-primary">{call.callerId}</td>
    <td className="p-4 text-sm text-text-secondary">{call.source}</td>
    <td className="p-4 text-sm text-text-secondary">{formatDuration(call.duration)}</td>
    <td className="p-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[call.status]}`}>
        {call.status}
      </span>
    </td>
    <td className="p-4 text-sm text-text-secondary">${call.cost.toFixed(2)}</td>
    <td className="p-4 text-sm text-green-400 font-medium">${call.revenue.toFixed(2)}</td>
  </tr>
);

export const RecentCallsTable: React.FC = () => {
  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Calls</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-text-secondary uppercase bg-background-light">
            <tr>
              <th className="p-4">Caller ID</th>
              <th className="p-4">Source</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {mockRecentCalls.slice(0, 10).map((call) => (
              <TableRow key={call.id} call={call} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
