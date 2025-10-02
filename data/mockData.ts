import { Call, CallStatus, CallVolumeData, CallsByCampaignData, CallStatusData, Campaign, CampaignStatus, TrackedNumber, NumberStatus, Target } from '../types';

export const mockTargets: Target[] = [
  { id: 't1', name: 'Main Sales Line', buyer: 'AuraCall Inc.', destination: '(555) 123-4567', status: 'Active' },
  { id: 't2', name: 'Support Queue', buyer: 'AuraCall Inc.', destination: '(555) 987-6543', status: 'Active' },
  { id: 't3', name: 'West Coast Sales', buyer: 'AuraCall Inc.', destination: '(555) 111-2222', status: 'Inactive' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'National TV Campaign Q4', status: CampaignStatus.Active, targetIds: ['t1', 't2'] },
  { id: 'c2', name: 'Google Ads - West Coast', status: CampaignStatus.Active, targetIds: ['t3'] },
  { id: 'c3', name: 'Facebook Lead Gen - Fall Promo', status: CampaignStatus.Paused, targetIds: ['t1'] },
  { id: 'c4', name: 'Direct Mail - Seniors', status: CampaignStatus.Ended, targetIds: ['t2'] },
  { id: 'c5', name: 'Website Call Button', status: CampaignStatus.Active, targetIds: ['t2'] },
];

export const mockNumbers: TrackedNumber[] = [
    { id: 'n1', phoneNumber: '(800) 555-0101', campaignId: 'c2', status: NumberStatus.Assigned },
    { id: 'n2', phoneNumber: '(800) 555-0102', campaignId: 'c3', status: NumberStatus.Assigned },
    { id: 'n3', phoneNumber: '(800) 555-0103', campaignId: 'c5', status: NumberStatus.Assigned },
    { id: 'n4', phoneNumber: '(800) 555-0104', campaignId: null, status: NumberStatus.Available },
    { id: 'n5', phoneNumber: '(800) 555-0105', campaignId: null, status: NumberStatus.Available },
    { id: 'n6', phoneNumber: '(800) 555-0106', campaignId: 'c4', status: NumberStatus.Assigned },
];

export const mockRecentCalls: Call[] = [
  { id: '1', callerId: '(555) 123-4567', campaignId: 'c2', targetId: 't3', duration: 320, status: CallStatus.Answered, cost: 2.50, revenue: 50.00, timestamp: '2023-10-27T10:00:00Z', recordingUrl: '/rec/1.mp3', notes: 'Customer was interested in the new X-1 model. Follow up next week.' },
  { id: '2', callerId: '(555) 987-6543', campaignId: 'c3', targetId: 't1', duration: 15, status: CallStatus.Missed, cost: 1.20, revenue: 0.00, timestamp: '2023-10-27T10:05:00Z', recordingUrl: null, notes: '' },
  { id: '3', callerId: '(555) 555-1212', campaignId: 'c5', targetId: 't2', duration: 180, status: CallStatus.Answered, cost: 0.00, revenue: 25.00, timestamp: '2023-10-27T10:10:00Z', recordingUrl: '/rec/3.mp3', notes: 'Inquired about pricing.' },
  { id: '4', callerId: '(555) 345-6789', campaignId: 'c2', targetId: 't3', duration: 600, status: CallStatus.Answered, cost: 2.50, revenue: 150.00, timestamp: '2023-10-27T10:15:00Z', recordingUrl: '/rec/4.mp3', notes: 'Converted to a sale. High value client.' },
  { id: '5', callerId: '(555) 234-5678', campaignId: 'c2', targetId: 't3', duration: 0, status: CallStatus.Failed, cost: 0.80, revenue: 0.00, timestamp: '2023-10-27T10:20:00Z', recordingUrl: null, notes: 'Call failed to connect.' },
  { id: '6', callerId: '(555) 876-5432', campaignId: 'c5', targetId: 't2', duration: 95, status: CallStatus.Voicemail, cost: 0.00, revenue: 0.00, timestamp: '2023-10-27T10:25:00Z', recordingUrl: '/rec/6.mp3', notes: '' },
  { id: '7', callerId: '(555) 111-2222', campaignId: 'c3', targetId: 't1', duration: 240, status: CallStatus.Answered, cost: 1.20, revenue: 40.00, timestamp: '2023-10-27T10:30:00Z', recordingUrl: '/rec/7.mp3', notes: 'Wants a demo scheduled for Friday.' },
  { id: '8', callerId: '(555) 444-3333', campaignId: 'c2', targetId: 't3', duration: 450, status: CallStatus.Answered, cost: 2.50, revenue: 80.00, timestamp: '2023-10-27T10:35:00Z', recordingUrl: '/rec/8.mp3', notes: '' },
  { id: '9', callerId: '(555) 999-8888', campaignId: 'c4', targetId: 't2', duration: 120, status: CallStatus.Answered, cost: 0.50, revenue: 20.00, timestamp: '2023-10-27T10:40:00Z', recordingUrl: null, notes: 'Mentioned the postcard they received.' },
  { id: '10', callerId: '(555) 777-6666', campaignId: 'c2', targetId: 't3', duration: 25, status: CallStatus.Missed, cost: 0.80, revenue: 0.00, timestamp: '2023-10-27T10:45:00Z', recordingUrl: null, notes: '' },
];

export const mockCallVolume: CallVolumeData[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls: Math.floor(Math.random() * 50) + 20,
    };
});

export const mockCallsByCampaign: CallsByCampaignData[] = [
  { campaign: 'Google Ads - West Coast', calls: 450 },
  { campaign: 'Facebook Lead Gen', calls: 300 },
  { campaign: 'Website Call Button', calls: 220 },
  { campaign: 'Direct Mail - Seniors', calls: 95 },
];

export const mockCallStatus: CallStatusData[] = [
    { name: CallStatus.Answered, value: 950 },
    { name: CallStatus.Missed, value: 250 },
    { name: CallStatus.Voicemail, value: 150 },
    { name: CallStatus.Failed, value: 78 },
];

export const generateAvailableNumbers = (areaCode: string, quantity: number): TrackedNumber[] => {
    const numbers: TrackedNumber[] = [];
    for (let i = 0; i < quantity * 2; i++) { // Generate more than requested to show a list
        const randomDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
        const number: TrackedNumber = {
            id: `new-${areaCode}-${i}`,
            phoneNumber: `(${areaCode}) ${randomDigits.substring(0, 3)}-${randomDigits.substring(3)}`,
            campaignId: null,
            status: NumberStatus.Available,
        };
        numbers.push(number);
    }
    return numbers;
};
