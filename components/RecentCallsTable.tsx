import React, { useState, useMemo } from 'react';
import { Call, CallStatus } from '../types';
import { mockRecentCalls, mockCampaigns, mockTargets } from '../data/mockData';
import { ArrowDownTrayIcon, ChevronDownIcon, PlayIcon } from './icons/UIIcons';
import { exportToCSV } from '../utils/export';

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

const ExpandedRowContent: React.FC<{ call: Call }> = ({ call }) => {
    return (
        <div className="bg-background-dark p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Call Details</h4>
                <div className="text-sm space-y-2 text-text-secondary">
                    <p><span className="font-medium text-text-primary">Call ID:</span> {call.id}</p>
                    <p><span className="font-medium text-text-primary">Timestamp:</span> {new Date(call.timestamp).toLocaleString()}</p>
                </div>
            </div>
            <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Call Recording</h4>
                {call.recordingUrl ? (
                    <div className="flex items-center gap-3 bg-background-light p-2 rounded-lg">
                        <button className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-brand-primary">
                            <PlayIcon className="w-5 h-5" />
                        </button>
                        <div className="w-full h-2 bg-border-color rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-brand-secondary"></div>
                        </div>
                        <span className="text-xs text-text-secondary font-mono">01:45 / {formatDuration(call.duration)}</span>
                    </div>
                ) : (
                    <p className="text-sm text-text-secondary italic">No recording available for this call.</p>
                )}

                <h4 className="text-md font-semibold text-text-primary mt-4 mb-2">Caller Notes</h4>
                <textarea
                    rows={3}
                    className="w-full bg-background-light border border-border-color rounded-lg p-2 text-sm text-text-primary focus:ring-2 focus:ring-brand-primary outline-none"
                    defaultValue={call.notes || ''}
                    placeholder="Add notes for this caller..."
                />
            </div>
        </div>
    );
};

export const RecentCallsTable: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const campaignMap = useMemo(() => new Map(mockCampaigns.map(c => [c.id, c.name])), []);
  const targetMap = useMemo(() => new Map(mockTargets.map(t => [t.id, t.name])), []);


  const handleToggleRow = (id: string) => {
    setExpandedRow(currentId => (currentId === id ? null : id));
  };

  const handleExport = () => {
    const dataToExport = mockRecentCalls.slice(0, 10).map(call => ({
      'Caller ID': call.callerId,
      'Campaign': campaignMap.get(call.campaignId) || 'N/A',
      'Target': targetMap.get(call.targetId) || 'N/A',
      'Duration': formatDuration(call.duration),
      'Status': call.status,
      'Cost ($)': call.cost.toFixed(2),
      'Revenue ($)': call.revenue.toFixed(2),
      'Timestamp': call.timestamp,
    }));
    exportToCSV(dataToExport, 'recent-calls.csv');
  };

  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Calls</h3>
        <button
            onClick={handleExport}
            className="flex items-center px-3 py-1.5 bg-background-light border border-border-color text-sm text-text-secondary font-medium rounded-md hover:bg-border-color transition-colors"
            >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-text-secondary uppercase bg-background-light">
            <tr>
              <th className="p-4">Caller ID</th>
              <th className="p-4">Campaign</th>
              <th className="p-4">Target</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4">Revenue</th>
              <th className="p-4 w-12" aria-label="Expand row"></th>
            </tr>
          </thead>
          <tbody>
            {mockRecentCalls.slice(0, 10).map((call) => (
              <React.Fragment key={call.id}>
                <tr 
                  className="border-b border-border-color hover:bg-background-light cursor-pointer"
                  onClick={() => handleToggleRow(call.id)}
                  aria-expanded={expandedRow === call.id}
                >
                  <td className="p-4 text-sm text-text-primary">{call.callerId}</td>
                  <td className="p-4 text-sm text-text-secondary">{campaignMap.get(call.campaignId) || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-secondary">{targetMap.get(call.targetId) || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-secondary">{formatDuration(call.duration)}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[call.status]}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-green-400 font-medium">${call.revenue.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${expandedRow === call.id ? 'transform rotate-180' : ''}`} />
                  </td>
                </tr>
                {expandedRow === call.id && (
                    <tr className="bg-background-dark border-b border-border-color">
                        <td colSpan={7}>
                            <ExpandedRowContent call={call} />
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
