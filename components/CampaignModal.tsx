import React, { useState, useEffect, useMemo } from 'react';
import { Campaign, CampaignStatus, TrackedNumber, Target } from '../types';
import { mockTargets, mockNumbers } from '../data/mockData';
import { XIcon, QuestionMarkCircleIcon } from './icons/UIIcons';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Campaign, assignedNumberIds: string[]) => void;
  campaign: Campaign | null;
}

const defaultFormData: Omit<Campaign, 'id' | 'liveCalls' | 'callsLastHour' | 'callsLastDay' | 'callsLastMonth' > = {
    name: '',
    status: CampaignStatus.Active,
    targetIds: [],
    routingType: 'Round Robin',
    offerName: '',
    country: 'US',
    recordingEnabled: true,
    trackingId: '',
    reportDuplicateOn: 'Connect',
    routePreviousCallsTo: 'Normally',
    handleAnonymousCallsAsDuplicate: true,
    payoutOncePerCaller: false,
    trimSilence: true,
    targetDialAttempts: 3,
    stirShakenAttestation: 'Account',
};

// --- Reusable Form Components ---

const FormSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mt-6 ${className}`}>
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <div className="border-t border-border-color/50">
            {children}
        </div>
    </div>
);


const FormRow: React.FC<{ label: string; tooltip: string; children: React.ReactNode; }> = ({ label, tooltip, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border-color/50">
        <label className="flex items-center text-sm font-medium text-text-secondary mb-2 sm:mb-0">
            {label}
            <span title={tooltip} className="ml-1.5">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
            </span>
        </label>
        <div className="w-full sm:w-1/2 md:w-3/5 lg:w-1/2">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-background-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
    </label>
);

const SegmentedControl: React.FC<{
  name: string;
  options: string[];
  value: string;
  onValueChange: (name: string, value: string) => void;
}> = ({ name, options, value, onValueChange }) => (
    <div className="inline-flex rounded-md" role="group">
        {options.map((option, index) => (
            <button
                key={option}
                type="button"
                onClick={() => onValueChange(name, option)}
                className={`px-4 py-2 text-sm font-medium transition-colors
                    ${value === option ? 'bg-brand-primary text-white z-10' : 'bg-background-light text-text-secondary hover:bg-border-color'}
                    ${index === 0 ? 'rounded-l-lg' : ''}
                    ${index === options.length - 1 ? 'rounded-r-lg' : ''}
                    border border-border-color -ml-px
                `}
            >
                {option.startsWith('Account') ? `Account Setting (${option.split(' ')[1]})` : option.replace('To ', '')}
            </button>
        ))}
    </div>
);

// --- Main Modal Component ---

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave, campaign }) => {
  const [formData, setFormData] = useState<Partial<Campaign>>(defaultFormData);
  const [assignedNumberIds, setAssignedNumberIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
        const initialFormData = campaign ? { ...campaign } : { ...defaultFormData };
        setFormData(initialFormData);

        const currentCampaignNumbers = campaign
            ? mockNumbers.filter(n => n.campaignId === campaign.id).map(n => n.id)
            : [];
        setAssignedNumberIds(currentCampaignNumbers);
    }
  }, [campaign, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({ 
        ...prev, 
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSegmentChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTargetChange = (targetId: string) => {
    setFormData(prev => {
        const currentTargetIds = prev.targetIds || [];
        const newTargetIds = currentTargetIds.includes(targetId)
            ? currentTargetIds.filter(id => id !== targetId)
            : [...currentTargetIds, targetId];
        return { ...prev, targetIds: newTargetIds };
    });
  };

  const handleNumberChange = (numberId: string) => {
      setAssignedNumberIds(prev =>
          prev.includes(numberId)
              ? prev.filter(id => id !== numberId)
              : [...prev, numberId]
      );
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Campaign, assignedNumberIds);
  };

  const availableNumbersForAssignment = useMemo(() => {
    return mockNumbers.filter(n => n.campaignId === null || n.campaignId === campaign?.id);
  }, [campaign]);


  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <form onSubmit={handleSubmit} className="bg-background-dark rounded-xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">
            {campaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 py-6 space-y-2 overflow-y-auto">
            <FormSection title="General Info">
                {campaign && (
                    <FormRow label="Campaign ID" tooltip="The unique identifier for this campaign.">
                        <div className="flex items-center">
                            <span className="text-sm text-text-secondary font-mono mr-2">{campaign.id}</span>
                             <button type="button" onClick={() => navigator.clipboard.writeText(campaign.id)} className="text-xs text-brand-secondary hover:underline">Copy</button>
                        </div>
                    </FormRow>
                )}
                <FormRow label="Campaign Name" tooltip="The name for your campaign.">
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none" required />
                </FormRow>
                <FormRow label="Tracking ID" tooltip="An optional ID for your own internal tracking purposes.">
                    <input type="text" name="trackingId" value={formData.trackingId || ''} onChange={handleChange} placeholder="my_tracking_id - Optional" className="w-full bg-background-light border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                </FormRow>
                <FormRow label="Number Format" tooltip="The standard format for phone numbers.">
                     <p className="text-sm text-text-secondary font-mono">(nnn) nnn-nnnn</p>
                </FormRow>
            </FormSection>

            <FormSection title="Routing & Targets">
                <FormRow label="Targets" tooltip="Select one or more targets to route calls to for this campaign.">
                    <div className="w-full max-h-36 overflow-y-auto bg-background-light p-2 rounded-lg border border-border-color space-y-1">
                        {mockTargets.map(target => (
                            <div key={target.id} className="flex items-center p-1.5 rounded-md hover:bg-border-color/50">
                                <input
                                    id={`target-${target.id}`}
                                    type="checkbox"
                                    checked={formData.targetIds?.includes(target.id) || false}
                                    onChange={() => handleTargetChange(target.id)}
                                    className="h-4 w-4 rounded bg-background-dark border-border-color text-brand-primary focus:ring-brand-primary cursor-pointer"
                                />
                                <label htmlFor={`target-${target.id}`} className="ml-3 block text-sm font-medium text-text-primary cursor-pointer">
                                    {target.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </FormRow>
                 <FormRow label="Routing Type" tooltip="How calls are distributed among selected targets.">
                    <select name="routingType" value={formData.routingType} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                        <option value="Round Robin">Round Robin</option>
                        <option value="Priority">Priority</option>
                    </select>
                </FormRow>
                <FormRow label="Route Previously Connected Calls" tooltip="How to handle calls from numbers that have connected before.">
                    <SegmentedControl name="routePreviousCallsTo" value={formData.routePreviousCallsTo || 'Normally'} onValueChange={handleSegmentChange} options={['Normally', 'To Original', 'To Different']} />
                </FormRow>
            </FormSection>
            
            <FormSection title="Tracking Numbers">
                <FormRow label="Assign Numbers" tooltip="Assign tracking numbers to this campaign.">
                    <div className="w-full max-h-36 overflow-y-auto bg-background-light p-2 rounded-lg border border-border-color space-y-1">
                        {availableNumbersForAssignment.map(num => (
                             <div key={num.id} className="flex items-center p-1.5 rounded-md hover:bg-border-color/50">
                                <input
                                    id={`number-${num.id}`}
                                    type="checkbox"
                                    checked={assignedNumberIds.includes(num.id)}
                                    onChange={() => handleNumberChange(num.id)}
                                    className="h-4 w-4 rounded bg-background-dark border-border-color text-brand-primary focus:ring-brand-primary cursor-pointer"
                                />
                                <label htmlFor={`number-${num.id}`} className="ml-3 block text-sm font-medium text-text-primary font-mono cursor-pointer">
                                    {num.phoneNumber}
                                </label>
                            </div>
                        ))}
                         {availableNumbersForAssignment.length === 0 && (
                            <p className="p-2 text-sm text-text-secondary text-center">No numbers available for assignment.</p>
                         )}
                    </div>
                </FormRow>
            </FormSection>

            <FormSection title="Duplicate Handling & Payouts">
                 <FormRow label="Report Duplicate Calls On" tooltip="Determines when a duplicate call is reported.">
                    <select name="reportDuplicateOn" value={formData.reportDuplicateOn} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                        <option value="Connect">Connect</option>
                        <option value="Payout">Payout</option>
                    </select>
                </FormRow>
                 <FormRow label="Handle Anonymous Calls as Duplicate" tooltip="If enabled, treats all anonymous calls as duplicates of each other.">
                    <ToggleSwitch name="handleAnonymousCallsAsDuplicate" checked={formData.handleAnonymousCallsAsDuplicate || false} onChange={handleChange} />
                </FormRow>
                <FormRow label="Payout Once Per Caller" tooltip="If enabled, a payout will only be recorded once for each unique caller ID.">
                    <ToggleSwitch name="payoutOncePerCaller" checked={formData.payoutOncePerCaller || false} onChange={handleChange} />
                </FormRow>
            </FormSection>

            <FormSection title="Call Handling & Compliance">
                <FormRow label="Record Calls" tooltip="Enable or disable call recording for this campaign.">
                    <ToggleSwitch name="recordingEnabled" checked={formData.recordingEnabled || false} onChange={handleChange} />
                </FormRow>
                <FormRow label="Trim Silence" tooltip="Automatically remove long periods of silence from the beginning and end of call recordings.">
                    <ToggleSwitch name="trimSilence" checked={formData.trimSilence || false} onChange={handleChange} />
                </FormRow>
                <FormRow label="Target Dial Attempts" tooltip="The number of times to attempt dialing a target before failing over.">
                    <input type="number" name="targetDialAttempts" value={formData.targetDialAttempts || 1} onChange={handleChange} min="1" max="10" className="w-24 bg-background-light border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                </FormRow>
                <FormRow label="Require Stir/Shaken Attestation" tooltip="Enforce STIR/SHAKEN compliance for incoming calls.">
                    <SegmentedControl name="stirShakenAttestation" value={formData.stirShakenAttestation || 'Account'} onValueChange={handleSegmentChange} options={['Account Disabled', 'Enabled', 'Disabled']} />
                </FormRow>
            </FormSection>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-6 py-4 bg-background-dark border-t border-border-color mt-auto">
          <button type="submit" className="px-6 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300">
            SAVE
          </button>
        </div>
      </form>
    </div>
    <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
    `}</style>
    </>
  );
};

export default CampaignModal;
