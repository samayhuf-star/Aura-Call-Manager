import { Call, CallStatus, Campaign, CampaignStatus, Target, TrackedNumber, NumberStatus, CallVolumeData, CallsByCampaignData, CallStatusData } from '../types';

export const mockTargets: Target[] = [
  { id: 't1', name: 'Primary Sales Team', buyer: 'In-House', destination: '(800) 555-0101', status: 'Active' },
  { id: 't2', name: 'West Coast Sales', buyer: 'In-House', destination: '(800) 555-0102', status: 'Active' },
  { id: 't3', name: 'East Coast Sales', buyer: 'In-House', destination: '(800) 555-0103', status: 'Active' },
  { id: 't4', name: 'After-Hours Support', buyer: 'Partner A', destination: '(888) 555-0104', status: 'Active' },
  { id: 't5', name: 'Lead Gen Partner B', buyer: 'Partner B', destination: '(888) 555-0105', status: 'Inactive' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Google Ads - National', status: CampaignStatus.Active, targetIds: ['t1', 't2', 't3'], routingType: 'Round Robin', offerName: 'General Inquiry', country: 'US', recordingEnabled: true, liveCalls: 2, callsLastHour: 5, callsLastDay: 120, callsLastMonth: 3400, duplicate_window_minutes: 30 },
  { id: 'c2', name: 'Facebook Ads - West Coast', status: CampaignStatus.Active, targetIds: ['t2'], routingType: 'Priority', offerName: 'West Coast Promo', country: 'US', recordingEnabled: true, liveCalls: 1, callsLastHour: 3, callsLastDay: 80, callsLastMonth: 2100, duplicate_window_minutes: 60 },
  { id: 'c3', name: 'Bing Ads - East Coast', status: CampaignStatus.Paused, targetIds: ['t3'], routingType: 'Priority', offerName: 'East Coast Promo', country: 'US', recordingEnabled: false, liveCalls: 0, callsLastHour: 0, callsLastDay: 15, callsLastMonth: 500 },
  { id: 'c4', name: 'Q1 Print Campaign', status: CampaignStatus.Ended, targetIds: ['t1'], routingType: 'Priority', offerName: 'Print Ad Promo', country: 'US', recordingEnabled: true, liveCalls: 0, callsLastHour: 0, callsLastDay: 0, callsLastMonth: 850 },
  { id: 'c5', name: 'Website "Contact Us"', status: CampaignStatus.Active, targetIds: ['t1', 't4'], routingType: 'Priority', offerName: 'Website Inquiry', country: 'US', recordingEnabled: true, liveCalls: 0, callsLastHour: 1, callsLastDay: 30, callsLastMonth: 900 },
];


export const mockNumbers: TrackedNumber[] = [
    { id: 'n1', phoneNumber: '(800) 123-4567', status: NumberStatus.Assigned, campaignId: 'c1' },
    { id: 'n2', phoneNumber: '(800) 234-5678', status: NumberStatus.Assigned, campaignId: 'c2' },
    { id: 'n3', phoneNumber: '(800) 345-6789', status: NumberStatus.Assigned, campaignId: 'c3' },
    { id: 'n4', phoneNumber: '(888) 456-7890', status: NumberStatus.Available, campaignId: null },
    { id: 'n5', phoneNumber: '(888) 567-8901', status: NumberStatus.Available, campaignId: null },
    { id: 'n6', phoneNumber: '(800) 678-9012', status: NumberStatus.Assigned, campaignId: 'c1' },
];


const generateMockCalls = (count: number): Call[] => {
    const calls: Call[] = [];
    for (let i = 0; i < count; i++) {
        const campaign = mockCampaigns[Math.floor(Math.random() * mockCampaigns.length)];
        const target = mockTargets.find(t => campaign.targetIds.includes(t.id)) || mockTargets[0];
        const statusValues = Object.values(CallStatus);
        const status = statusValues[Math.floor(Math.random() * statusValues.length)];
        const duration = status === CallStatus.Answered ? Math.floor(Math.random() * 500) + 30 : Math.floor(Math.random() * 30);
        const revenue = status === CallStatus.Answered && Math.random() > 0.4 ? Math.floor(Math.random() * 80) + 10 : 0;
        
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24));


        calls.push({
            id: `call-${Date.now()}-${i}`,
            callerId: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
            campaignId: campaign.id,
            targetId: target.id,
            duration: duration,
            status: status,
            cost: Math.random() * 2.5,
            revenue: revenue,
            timestamp: timestamp.toISOString(),
            recordingUrl: status === CallStatus.Answered || status === CallStatus.Voicemail ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : null,
            notes: ''
        });
    }
    return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const mockRecentCalls: Call[] = generateMockCalls(50);

// Generate a larger set for the detailed call log page
export const mockAllCalls: Call[] = generateMockCalls(200);

export const mockCallVolume: CallVolumeData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calls: Math.floor(Math.random() * 80) + 20,
    };
});

const campaignCounts = mockRecentCalls.reduce((acc, call) => {
    const campaignName = mockCampaigns.find(c => c.id === call.campaignId)?.name || 'Unknown';
    acc[campaignName] = (acc[campaignName] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

export const mockCallsByCampaign: CallsByCampaignData[] = Object.entries(campaignCounts)
    .map(([campaign, calls]) => ({ campaign, calls }))
    .sort((a,b) => b.calls - a.calls);


const statusCounts = mockRecentCalls.reduce((acc, call) => {
    acc[call.status] = (acc[call.status] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

export const mockCallStatus: CallStatusData[] = [
    { name: CallStatus.Answered, value: statusCounts[CallStatus.Answered] || 0 },
    { name: CallStatus.Missed, value: statusCounts[CallStatus.Missed] || 0 },
    { name: CallStatus.Voicemail, value: statusCounts[CallStatus.Voicemail] || 0 },
    { name: CallStatus.Failed, value: statusCounts[CallStatus.Failed] || 0 },
];


export const generateAvailableNumbers = (areaCode: string, quantity: number): TrackedNumber[] => {
    const numbers: TrackedNumber[] = [];
    for (let i = 0; i < quantity * 2; i++) { // Generate more than needed to simulate a search
        const randomSuffix = Math.floor(1000000 + Math.random() * 9000000).toString();
        const phoneNumber = `(${areaCode}) ${randomSuffix.substring(0, 3)}-${randomSuffix.substring(3, 7)}`;
        if (!mockNumbers.some(n => n.phoneNumber === phoneNumber)) {
            numbers.push({
                id: `new-n-${Date.now()}-${i}`,
                phoneNumber: phoneNumber,
                status: NumberStatus.Available,
                campaignId: null
            });
        }
        if(numbers.length >= quantity) break;
    }
    return numbers;
}