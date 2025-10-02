import React, { useState, useEffect } from 'react';
import { TrackedNumber, Campaign } from '../types';
import { XIcon } from './icons/UIIcons';

interface AssignCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (numberId: string, campaignId: string) => void;
  number: TrackedNumber;
  campaigns: Campaign[];
}

const AssignCampaignModal: React.FC<AssignCampaignModalProps> = ({ isOpen, onClose, onSave, number, campaigns }) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');

  useEffect(() => {
    // Reset state when modal opens for a new number or is reopened
    if (isOpen && campaigns.length > 0) {
        setSelectedCampaignId(campaigns[0].id);
    }
  }, [isOpen, campaigns]);

  const handleSave = () => {
    if (selectedCampaignId) {
      onSave(number.id, selectedCampaignId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-background-card rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">Assign to Campaign</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-text-secondary">
            Assign the number <span className="font-mono text-text-primary">{number.phoneNumber}</span> to a campaign.
          </p>

          <div>
            <label htmlFor="campaignSelect" className="block text-sm font-medium text-text-secondary mb-1">Campaign</label>
            <select 
                id="campaignSelect"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none"
            >
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end items-center p-6 bg-background-light rounded-b-xl space-x-4">
            <button onClick={onClose} className="px-4 py-2 bg-background-card border border-border-color hover:bg-border-color text-text-primary font-semibold rounded-lg transition-all duration-300">
                Cancel
            </button>
            <button 
                onClick={handleSave} 
                disabled={!selectedCampaignId}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Assign Campaign
            </button>
        </div>
      </div>
      <style>{`
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default AssignCampaignModal;
