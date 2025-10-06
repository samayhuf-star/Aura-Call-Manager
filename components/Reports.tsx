import React, { useState, useMemo } from 'react';
import { Call, Campaign, Target, CallVolumeData } from '../types';
import { mockRecentCalls, mockCampaigns, mockTargets } from '../data/mockData';
import { StatCard } from './StatCard';
import { CallVolumeChart } from './CallVolumeChart';
import { PhoneIcon, CurrencyDollarIcon, ClockIcon, ChartBarIcon } from './icons/UIIcons';

const CALLS_PER_PAGE = 10;

const Reports: React.FC = () => {
  const [calls] = useState<Call[]>(mockRecentCalls);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [targets] = useState<Target[]>(mockTargets);

  const [filters, setFilters] = useState({
    campaignId: 'all',
    targetId: 'all',
    dateRange: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const campaignMap = useMemo(() => new Map(campaigns.map(c => [c.id, c.name])), [campaigns]);
  const targetMap = useMemo(() => new Map(targets.map(t => [t.id, t.name])), [targets]);

  const filteredCalls = useMemo(() => {
    let filtered = calls;

    if (filters.campaignId !== 'all') {
      filtered = filtered.filter(call => call.campaignId === filters.campaignId);
    }
    if (filters.targetId !== 'all') {
      filtered = filtered.filter(call => call.targetId === filters.targetId);
    }
    // Date range filtering logic would go here
    // For this example, we'll just use a placeholder
    if (filters.dateRange !== 'all') {
      // This is a mock filter. In a real app, you'd compare timestamps.
      const days = parseInt(filters.dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter(call => new Date(call.timestamp) > cutoff);
    }

    return filtered;
  }, [calls, filters]);

  const callVolumeData = useMemo((): CallVolumeData[] => {
    // Group calls by date string (e.g., "2023-10-27") to count calls per day.
    const dailyCalls = filteredCalls.reduce<Record<string, number>>((acc, call) => {
      const callDateKey = call.timestamp.substring(0, 10); // YYYY-MM-DD
      acc[callDateKey] = (acc[callDateKey] || 0) + 1;
      return acc;
    }, {});

    // Convert the aggregated data into an array, sort it by date, and format it for the chart.
    return Object.entries(dailyCalls)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      // FIX: Renamed `calls` to `callCount` to avoid shadowing the `calls` state variable, which was causing a type inference issue.
      .map(([dateKey, callCount]) => ({
        // Format the date for display (e.g., "Oct 27").
        // Adding 'T00:00:00Z' ensures date is parsed as UTC to avoid timezone issues.
        date: new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        calls: callCount,
      }));
  }, [filteredCalls]);

  const paginatedCalls = useMemo(() => {
    const startIndex = (currentPage - 1) * CALLS_PER_PAGE;
    return filteredCalls.slice(startIndex, startIndex + CALLS_PER_PAGE);
  }, [filteredCalls, currentPage]);

  const totalPages = Math.ceil(filteredCalls.length / CALLS_PER_PAGE);

  const summaryStats = useMemo(() => {
    return filteredCalls.reduce((acc, call) => {
        acc.totalCalls += 1;
        acc.totalRevenue += call.revenue;
        acc.totalDuration += call.duration;
        if(call.revenue > 0) acc.convertedCalls += 1;
        return acc;
    }, { totalCalls: 0, totalRevenue: 0, totalDuration: 0, convertedCalls: 0 });
  }, [filteredCalls]);

  const avgDuration = summaryStats.totalCalls > 0 ? (summaryStats.totalDuration / summaryStats.totalCalls) : 0;
  const conversionRate = summaryStats.totalCalls > 0 ? (summaryStats.convertedCalls / summaryStats.totalCalls) * 100 : 0;


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };
  
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Detailed Reports</h1>
        <p className="text-text-secondary mt-1">Filter and analyze your call data.</p>
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
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Calls" value={summaryStats.totalCalls.toLocaleString()} change="" changeType="increase" icon={<PhoneIcon />} />
          <StatCard title="Total Revenue" value={`$${summaryStats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} change="" changeType="increase" icon={<CurrencyDollarIcon />} />
          <StatCard title="Avg. Call Duration" value={formatDuration(avgDuration)} change="" changeType="decrease" icon={<ClockIcon />} />
          <StatCard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} change="" changeType="increase" icon={<ChartBarIcon />} />
      </div>

       {/* Charts */}
       <div className="grid grid-cols-1">
            <CallVolumeChart data={callVolumeData} />
       </div>

      {/* Detailed Call Log */}
      <div className="bg-background-card p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Call Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-text-secondary uppercase bg-background-light">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Caller ID</th>
                <th className="p-4">Campaign</th>
                <th className="p-4">Target</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCalls.map((call) => (
                <tr key={call.id} className="border-b border-border-color hover:bg-background-light">
                  <td className="p-4 text-sm text-text-secondary">{new Date(call.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-sm text-text-primary">{call.callerId}</td>
                  <td className="p-4 text-sm text-text-secondary">{campaignMap.get(call.campaignId) || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-secondary">{targetMap.get(call.targetId) || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-secondary">{formatDuration(call.duration)}</td>
                  <td className="p-4 text-sm text-text-secondary">{call.status}</td>
                  <td className="p-4 text-sm text-green-400 font-medium">${call.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-sm text-text-secondary">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-background-light rounded-md disabled:opacity-50">Previous</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-background-light rounded-md disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;