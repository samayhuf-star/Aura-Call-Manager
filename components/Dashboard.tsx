import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StatCard } from './StatCard';
import { CallVolumeChart } from './CallVolumeChart';
import { CallsByCampaignChart } from './CallsBySourceChart';
import { RecentCallsTable } from './RecentCallsTable';
import { CallStatusPieChart } from './CallStatusPieChart';
import { PhoneIcon, CurrencyDollarIcon, ClockIcon, ChartBarIcon, SparklesIcon } from './icons/UIIcons';
import { 
    mockRecentCalls as initialRecentCalls, 
    mockCallVolume as initialCallVolume,
    mockCampaigns,
    mockTargets
} from '../data/mockData';
import { generateReportSummary } from '../services/geminiService';
import { marked } from 'marked';
import { Call, CallStatus, CallStatusData, CallVolumeData, CallsByCampaignData } from '../types';

const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
};

const createRandomCall = (existingCalls: Call[]): Call => {
    const campaign = mockCampaigns[Math.floor(Math.random() * mockCampaigns.length)];
    const target = mockTargets.find(t => campaign.targetIds.includes(t.id)) || mockTargets[0];
    const statusValues = Object.values(CallStatus);
    const status = statusValues[Math.floor(Math.random() * statusValues.length)];
    const duration = status === CallStatus.Answered ? Math.floor(Math.random() * 500) + 30 : Math.floor(Math.random() * 30);

    // Simulate duplicates by sometimes reusing a caller ID from recent calls
    let callerId = `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (Math.random() < 0.2 && existingCalls.length > 0) { // 20% chance to be a potential duplicate
        callerId = existingCalls[Math.floor(Math.random() * Math.min(existingCalls.length, 10))].callerId;
    }

    const newCallTimestamp = new Date();
    let isDuplicate = false;
    const duplicateWindow = campaign.duplicate_window_minutes;

    if (duplicateWindow && duplicateWindow > 0) {
        const windowMilliseconds = duplicateWindow * 60 * 1000;
        const duplicateFound = existingCalls.some(
            (call) =>
                call.callerId === callerId &&
                call.campaignId === campaign.id &&
                (newCallTimestamp.getTime() - new Date(call.timestamp).getTime()) < windowMilliseconds
        );
        if (duplicateFound) {
            isDuplicate = true;
        }
    }

    // A call is "converted" (generates revenue) if it is answered and NOT a duplicate.
    let revenue = 0;
    if (status === CallStatus.Answered && !isDuplicate && Math.random() > 0.4) {
        revenue = Math.floor(Math.random() * 80) + 10;
    }

    return {
      id: `call-${Date.now()}-${Math.random()}`,
      callerId,
      campaignId: campaign.id,
      targetId: target.id,
      duration,
      status,
      cost: Math.random() * 2.5,
      revenue,
      timestamp: newCallTimestamp.toISOString(),
      recordingUrl: status === CallStatus.Answered || status === CallStatus.Voicemail ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : null,
      notes: isDuplicate ? 'Flagged as potential duplicate call within the configured window.' : ''
    };
};

const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // State for all dynamic data
    const [recentCalls, setRecentCalls] = useState<Call[]>(initialRecentCalls);
    const [callVolume, setCallVolume] = useState<CallVolumeData[]>(initialCallVolume);

    const stats = useMemo(() => {
        const totalCalls = recentCalls.length;
        if (totalCalls === 0) {
            return {
                calls: "0",
                revenue: "$0.00",
                avgDuration: "0m 0s",
                conversionRate: "0.0%",
            };
        }
        const totalRevenue = recentCalls.reduce((sum, call) => sum + call.revenue, 0);
        const totalDuration = recentCalls.reduce((sum, call) => sum + call.duration, 0);
        const convertedCalls = recentCalls.filter(c => c.revenue > 0).length;

        const avgDurationSec = totalDuration / totalCalls;
        const conversionRate = (convertedCalls / totalCalls) * 100;

        return {
            calls: totalCalls.toLocaleString(),
            revenue: `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
            avgDuration: formatDuration(avgDurationSec),
            conversionRate: `${conversionRate.toFixed(1)}%`
        };
    }, [recentCalls]);
    
    const callsByCampaign = useMemo((): CallsByCampaignData[] => {
        // FIX: Explicitly typing the accumulator `acc` ensures that TypeScript correctly infers
        // the return type of `reduce` as `Record<string, number>`, resolving downstream type errors.
        const campaignCounts = recentCalls.reduce((acc: Record<string, number>, call) => {
            const campaignName = mockCampaigns.find(c => c.id === call.campaignId)?.name || 'Unknown';
            acc[campaignName] = (acc[campaignName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(campaignCounts)
            .map(([campaign, calls]) => ({ campaign, calls }))
            .sort((a,b) => b.calls - a.calls);
    }, [recentCalls]);
    
    const callStatus = useMemo((): CallStatusData[] => {
        const statusCounts = recentCalls.reduce((acc, call) => {
            acc[call.status] = (acc[call.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: CallStatus.Answered, value: statusCounts[CallStatus.Answered] || 0 },
            { name: CallStatus.Missed, value: statusCounts[CallStatus.Missed] || 0 },
            { name: CallStatus.Voicemail, value: statusCounts[CallStatus.Voicemail] || 0 },
            { name: CallStatus.Failed, value: statusCounts[CallStatus.Failed] || 0 },
        ];
    }, [recentCalls]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Atomically update recentCalls
            setRecentCalls(prevCalls => {
                const newCall = createRandomCall(prevCalls);
                return [newCall, ...prevCalls.slice(0, 49)];
            });

            // Update call volume chart (retains random nature for visual effect)
            setCallVolume(prev => {
                const newVolume = [...prev.slice(1)];
                newVolume.push({
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    calls: Math.floor(Math.random() * 50) + 20,
                });
                return newVolume;
            });

        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoading(true);
        setSummary('');
        try {
            const result = await generateReportSummary(recentCalls);
            const htmlResult = marked.parse(result);
            setSummary(htmlResult as string);
        } catch (error) {
            console.error("Error generating AI summary:", error);
            const errorMessage = `
                <div class="flex flex-col items-center justify-center text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 class="text-lg font-semibold text-text-primary">Unable to Generate Summary</h3>
                    <p class="text-text-secondary mt-1 text-sm">
                        An error occurred while communicating with the AI service. Please check your network connection and API key configuration, then try again.
                    </p>
                </div>
            `;
            setSummary(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [recentCalls]);

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
                <StatCard title="Total Calls" value={stats.calls} change="" changeType="increase" icon={<PhoneIcon />} />
                <StatCard title="Total Revenue" value={stats.revenue} change="" changeType="increase" icon={<CurrencyDollarIcon />} />
                <StatCard title="Avg. Call Duration" value={stats.avgDuration} change="" changeType="decrease" icon={<ClockIcon />} />
                <StatCard title="Conversion Rate" value={stats.conversionRate} change="" changeType="increase" icon={<ChartBarIcon />} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CallVolumeChart data={callVolume} />
                </div>
                <CallStatusPieChart data={callStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 <div className="lg:col-span-3">
                    <RecentCallsTable calls={recentCalls} />
                 </div>
                 <div className="lg:col-span-2">
                    <CallsByCampaignChart data={callsByCampaign} />
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;