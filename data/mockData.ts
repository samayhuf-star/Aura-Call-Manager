import { Call, CallStatus, CallVolumeData, CallsBySourceData, CallStatusData } from '../types';

export const mockRecentCalls: Call[] = [
  { id: '1', callerId: '(555) 123-4567', source: 'Google Ads', duration: 320, status: CallStatus.Answered, cost: 2.50, revenue: 50.00, timestamp: '2023-10-27T10:00:00Z' },
  { id: '2', callerId: '(555) 987-6543', source: 'Facebook', duration: 15, status: CallStatus.Missed, cost: 1.20, revenue: 0.00, timestamp: '2023-10-27T10:05:00Z' },
  { id: '3', callerId: '(555) 555-1212', source: 'Website', duration: 180, status: CallStatus.Answered, cost: 0.00, revenue: 25.00, timestamp: '2023-10-27T10:10:00Z' },
  { id: '4', callerId: '(555) 345-6789', source: 'Google Ads', duration: 600, status: CallStatus.Answered, cost: 2.50, revenue: 150.00, timestamp: '2023-10-27T10:15:00Z' },
  { id: '5', callerId: '(555) 234-5678', source: 'Bing Ads', duration: 0, status: CallStatus.Failed, cost: 0.80, revenue: 0.00, timestamp: '2023-10-27T10:20:00Z' },
  { id: '6', callerId: '(555) 876-5432', source: 'Website', duration: 95, status: CallStatus.Voicemail, cost: 0.00, revenue: 0.00, timestamp: '2023-10-27T10:25:00Z' },
  { id: '7', callerId: '(555) 111-2222', source: 'Facebook', duration: 240, status: CallStatus.Answered, cost: 1.20, revenue: 40.00, timestamp: '2023-10-27T10:30:00Z' },
  { id: '8', callerId: '(555) 444-3333', source: 'Google Ads', duration: 450, status: CallStatus.Answered, cost: 2.50, revenue: 80.00, timestamp: '2023-10-27T10:35:00Z' },
  { id: '9', callerId: '(555) 999-8888', source: 'Direct Mail', duration: 120, status: CallStatus.Answered, cost: 0.50, revenue: 20.00, timestamp: '2023-10-27T10:40:00Z' },
  { id: '10', callerId: '(555) 777-6666', source: 'Bing Ads', duration: 25, status: CallStatus.Missed, cost: 0.80, revenue: 0.00, timestamp: '2023-10-27T10:45:00Z' },
];

export const mockCallVolume: CallVolumeData[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls: Math.floor(Math.random() * 50) + 20,
    };
});

export const mockCallsBySource: CallsBySourceData[] = [
  { source: 'Google Ads', calls: 450 },
  { source: 'Facebook', calls: 300 },
  { source: 'Website', calls: 220 },
  { source: 'Bing Ads', calls: 180 },
  { source: 'Direct Mail', calls: 95 },
];

export const mockCallStatus: CallStatusData[] = [
    { name: CallStatus.Answered, value: 950 },
    { name: CallStatus.Missed, value: 250 },
    { name: CallStatus.Voicemail, value: 150 },
    { name: CallStatus.Failed, value: 78 },
];
