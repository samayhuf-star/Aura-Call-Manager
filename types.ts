import React from 'react';

export enum CallStatus {
  Answered = 'Answered',
  Missed = 'Missed',
  Voicemail = 'Voicemail',
  Failed = 'Failed',
}

export interface Call {
  id: string;
  callerId: string;
  campaignId: string;
  targetId: string;
  duration: number; // in seconds
  status: CallStatus;
  cost: number;
  revenue: number;
  timestamp: string; // ISO string
  recordingUrl: string | null;
  notes: string;
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
  name: string;
  value: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactElement;
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
  routingType: 'Round Robin' | 'Priority';
  offerName: string;
  country: string;
  recordingEnabled: boolean;
  liveCalls: number;
  callsLastHour: number;
  callsLastDay: number;
  callsLastMonth: number;
  trackingId?: string;
  reportDuplicateOn?: 'Connect' | 'Payout';
  routePreviousCallsTo?: 'Normally' | 'To Original' | 'To Different';
  handleAnonymousCallsAsDuplicate?: boolean;
  payoutOncePerCaller?: boolean;
  trimSilence?: boolean;
  targetDialAttempts?: number;
  stirShakenAttestation?: 'Account Disabled' | 'Enabled' | 'Disabled' | 'Account';
}


export enum NumberStatus {
    Assigned = 'Assigned',
    Available = 'Available',
}

export interface TrackedNumber {
    id: string;
    phoneNumber: string;
    status: NumberStatus;
    campaignId: string | null;
}

export interface Target {
    id: string;
    name: string;
    buyer: string;
    destination: string; // phone number
    status: 'Active' | 'Inactive';
}

export interface RoutingRule {
    id: string;
    priority: number;
    criteria: Array<{
        type: 'DayOfWeek' | 'TimeOfDay' | 'CallerID';
        value: any;
    }>;
    action: 'RouteTo' | 'Block';
    actionValue: string; // Target Group ID or null
}

export interface TargetGroup {
    id: string;
    name: string;
    targets: Array<{
        targetId: string;
        weight: number;
    }>;
}
