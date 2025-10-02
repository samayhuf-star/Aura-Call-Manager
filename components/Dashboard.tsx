import React, { useState, useCallback } from 'react';
import { StatCard } from './StatCard';
import { CallVolumeChart } from './CallVolumeChart';
import { CallsByCampaignChart } from './CallsBySourceChart';
import { RecentCallsTable } from './RecentCallsTable';
import { CallStatusPieChart } from './CallStatusPieChart';
import { PhoneIcon, CurrencyDollarIcon, ClockIcon, ChartBarIcon, SparklesIcon } from './icons/UIIcons';
import { mockRecentCalls } from '../data/mockData';
import { generateReportSummary } from '../services/geminiService';
import { marked } from 'marked';

const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoading(true);
        setSummary('');
        try {
            const result = await generateReportSummary(mockRecentCalls);
            const htmlResult = marked.parse(result);
            setSummary(htmlResult as string);
        } catch (error) {
            console.error(error);
            setSummary('<p class="text-red-400">Failed to generate summary.</p>');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary mt-1">Welcome back, here's your performance overview.</p>
                </div>
                <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <SparklesIcon className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Generating...' : 'Generate AI Summary'}
                </button>
            </div>

            {/* AI Summary Section */}
            {(isLoading || summary) && (
                <div className="bg-background-card p-6 rounded-xl shadow-lg">
                    {isLoading && <p className="text-text-secondary text-center">AI is analyzing your data...</p>}
                    {summary && !isLoading && (
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: summary }} />
                    )}
                </div>
            )}


            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Calls" value="1,428" change="+12.5%" changeType="increase" icon={<PhoneIcon />} />
                <StatCard title="Total Revenue" value="$21,840" change="+8.2%" changeType="increase" icon={<CurrencyDollarIcon />} />
                <StatCard title="Avg. Call Duration" value="4m 28s" change="-1.5%" changeType="decrease" icon={<ClockIcon />} />
                <StatCard title="Conversion Rate" value="28.4%" change="+3.1%" changeType="increase" icon={<ChartBarIcon />} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CallVolumeChart />
                </div>
                <CallStatusPieChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 <div className="lg:col-span-3">
                    <RecentCallsTable />
                 </div>
                 <div className="lg:col-span-2">
                    <CallsByCampaignChart />
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;