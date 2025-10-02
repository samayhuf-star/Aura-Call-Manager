export enum CallStatus {
  Answered = 'Answered',
  Missed = 'Missed',
  Voicemail = 'Voicemail',
  Failed = 'Failed',
}

export interface Target {
  id: string;
  name: string;
  buyer: string;
  destination: string;
  status: 'Active' | 'Inactive';
}

export interface Call {
  id: string;
  callerId: string;
  duration: number; // in seconds
  status: CallStatus;
  cost: number;
  revenue: number;
  timestamp: string;
  recordingUrl?: string | null;
  notes?: string;
  campaignId: string;
  targetId: string;
}

export interface CallVolumeData {
  date: string;
  calls: number;
}

export interface CallsByCampaignData {
  campaign: string;
  calls: number;
}

export interface CallStatusData {
  name: CallStatus;
  value: number;
  // FIX: Add index signature for compatibility with the recharts library.
  [key:string]: string | number;
}

export enum CampaignStatus {
  Active = 'Active',
  Paused = 'Paused',
  Ended = 'Ended',
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  targetIds: string[];
}

export enum NumberStatus {
    Available = 'Available',
    Assigned = 'Assigned',
}

export interface TrackedNumber {
    id: string;
    phoneNumber: string;
    campaignId: string | null;
    status: NumberStatus;
}


export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  // FIX: Updated the icon prop type to be more specific about accepting a className, resolving a TypeScript error when using React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
}
