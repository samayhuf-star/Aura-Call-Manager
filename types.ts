export enum CallStatus {
  Answered = 'Answered',
  Missed = 'Missed',
  Voicemail = 'Voicemail',
  Failed = 'Failed',
}

export interface Call {
  id: string;
  callerId: string;
  source: string;
  duration: number; // in seconds
  status: CallStatus;
  cost: number;
  revenue: number;
  timestamp: string;
}

export interface CallVolumeData {
  date: string;
  calls: number;
}

export interface CallsBySourceData {
  source: string;
  calls: number;
}

export interface CallStatusData {
  name: CallStatus;
  value: number;
  // FIX: Add index signature for compatibility with the recharts library.
  [key: string]: string | number;
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  // FIX: Changed icon prop type to React.ReactElement to allow cloning it with new props.
  icon: React.ReactElement;
}
