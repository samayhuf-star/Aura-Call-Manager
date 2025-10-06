import React, { useState, useMemo } from 'react';
import { Call, Campaign, Target, CallStatus } from '../types';
import { mockAllCalls, mockCampaigns, mockTargets } from '../data/mockData';
import { LogsIcon } from './icons/NavIcons';
import { SortUpIcon, SortDownIcon, SortIcon, PlayIcon } from './icons/UIIcons';

const CALLS_PER_PAGE = 15;

// Helper to format duration
const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
};

// Status colors
const statusColorMap: Record<CallStatus, string> = {
  [CallStatus.Answered]: 'bg-green-500/20 text-green-400',
  [CallStatus.Missed]: 'bg-yellow-500/20 text-yellow-400',
  [CallStatus.Voicemail]: 'bg-blue-500/20 text-blue-400',
  [CallStatus.Failed]: 'bg-red-500/20 text-red-400',
};

// Type definitions for sorting
type SortDirection = 'ascending' | 'descending';
type SortableCallKey = 'timestamp' | 'duration' | 'cost' | 'revenue';
interface SortConfig {
    key: SortableCallKey;
    direction: SortDirection;
}

// Reusable SortableHeader component
const SortableHeader: React.FC<{
    columnKey: SortableCallKey;
    title: string;
    sortConfig: SortConfig | null;
    requestSort: (key: SortableCallKey) => void;
    className?: string;
}> = ({ columnKey, title, sortConfig, requestSort, className }) => {
    const isSorted = sortConfig?.key === columnKey;
    const direction = isSorted ? sortConfig?.direction : undefined;

    return (
        <th className={`p-4 ${className}`}>
            <button
                type="button"
                onClick={() => requestSort(columnKey)}
                className="flex items-center space-x-1 group"
            >
                <span>{title}</span>
                <span className="text-text-secondary">
                    {isSorted ? (
                        direction === 'ascending' ? <SortUpIcon /> : <SortDownIcon />
                    ) : (
                       <SortIcon className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </span>
            </button>
        </th>
    );
};


const CallLogs: React.FC = () => {
    const [calls] = useState<Call[]>(mockAllCalls);
    const [campaigns] = useState<Campaign[]>(mockCampaigns);
    const [targets] = useState<Target[]>(mockTargets);
    
    const [filters, setFilters] = useState({
        campaignId: 'all',
        targetId: 'all',
        dateRange: 'all',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'timestamp', direction: 'descending' });

    const campaignMap = useMemo(() => new Map(campaigns.map(c => [c.id, c.name])), [campaigns]);
    const targetMap = useMemo(() => new Map(targets.map(t => [t.id, t.name])), [targets]);

    const filteredCalls = useMemo(() => {
        let filtered = [...calls]; // Create a mutable copy

        if (filters.campaignId !== 'all') {
            filtered = filtered.filter(call => call.campaignId === filters.campaignId);
        }
        if (filters.targetId !== 'all') {
            filtered = filtered.filter(call => call.targetId === filters.targetId);
        }
        if (filters.dateRange !== 'all') {
            const days = parseInt(filters.dateRange);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            filtered = filtered.filter(call => new Date(call.timestamp) > cutoff);
        }
        return filtered;
    }, [calls, filters]);

    const sortedCalls = useMemo(() => {
        let sortableItems = [...filteredCalls];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
    
                let comparison = 0;
                if (typeof valA === 'number' && typeof valB === 'number') {
                    comparison = valA - valB;
                } else {
                    // This handles string comparison for timestamp
                    comparison = String(valA).localeCompare(String(valB));
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredCalls, sortConfig]);

    const paginatedCalls = useMemo(() => {
        const startIndex = (currentPage - 1) * CALLS_PER_PAGE;
        return sortedCalls.slice(startIndex, startIndex + CALLS_PER_PAGE);
    }, [sortedCalls, currentPage]);

    const totalPages = Math.ceil(sortedCalls.length / CALLS_PER_PAGE);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const requestSort = (key: SortableCallKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handlePlayRecording = (url: string) => {
        // In a real app, this might open a modal with an audio player.
        // For now, we'll just open it in a new tab.
        window.open(url, '_blank');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <LogsIcon className="w-8 h-8 text-text-secondary" />
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Call Logs</h1>
                    <p className="text-text-secondary mt-1">A detailed record of all calls.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-background-card p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="campaignId" className="block text-sm font-medium text-text-secondary mb-1">Campaign</label>
                    <select name="campaignId" id="campaignId" value={filters.campaignId} onChange={handleFilterChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none">
                        <option value="all">All Campaigns</option>
                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="targetId" className="block text-sm font-medium text-text-secondary mb-1">Target</label>
                    <select name="targetId" id="targetId" value={filters.targetId} onChange={handleFilterChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none">
                        <option value="all">All Targets</option>
                        {targets.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="dateRange" className="block text-sm font-medium text-text-secondary mb-1">Date Range</label>
                    <select name="dateRange" id="dateRange" value={filters.dateRange} onChange={handleFilterChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none">
                        <option value="all">All Time</option>
                        <option value="1">Last 24 Hours</option>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Detailed Call Log Table */}
            <div className="bg-background-card rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-text-secondary uppercase bg-background-light">
                            <tr>
                                <SortableHeader columnKey="timestamp" title="Timestamp" sortConfig={sortConfig} requestSort={requestSort} className="p-4" />
                                <th className="p-4">Caller ID</th>
                                <th className="p-4">Campaign</th>
                                <th className="p-4">Target</th>
                                <th className="p-4">Status</th>
                                <SortableHeader columnKey="duration" title="Duration" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader columnKey="cost" title="Cost" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader columnKey="revenue" title="Revenue" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="p-4">Recording</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCalls.map((call) => (
                                <tr key={call.id} className="border-b border-border-color hover:bg-background-light">
                                    <td className="p-4 text-sm text-text-secondary whitespace-nowrap">{new Date(call.timestamp).toLocaleString()}</td>
                                    <td className="p-4 text-sm text-text-primary whitespace-nowrap">{call.callerId}</td>
                                    <td className="p-4 text-sm text-text-secondary whitespace-nowrap">{campaignMap.get(call.campaignId) || 'N/A'}</td>
                                    <td className="p-4 text-sm text-text-secondary whitespace-nowrap">{targetMap.get(call.targetId) || 'N/A'}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[call.status]}`}>
                                            {call.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-text-secondary">{formatDuration(call.duration)}</td>
                                    <td className="p-4 text-sm text-text-secondary">${call.cost.toFixed(2)}</td>
                                    <td className="p-4 text-sm text-green-400 font-medium">${call.revenue.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        {call.recordingUrl ? (
                                            <button onClick={() => handlePlayRecording(call.recordingUrl)} className="text-brand-secondary hover:text-brand-primary">
                                                <PlayIcon className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <span className="text-text-secondary/50">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 text-sm text-text-secondary border-t border-border-color">
                        <span>Showing <span className='font-medium text-text-primary'>{paginatedCalls.length}</span> of <span className='font-medium text-text-primary'>{sortedCalls.length}</span> results</span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-background-light rounded-md disabled:opacity-50 hover:bg-border-color">Previous</button>
                            <span className='px-2'>Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-background-light rounded-md disabled:opacity-50 hover:bg-border-color">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallLogs;
