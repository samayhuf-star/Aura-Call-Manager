import React, { useState, useMemo } from 'react';
import { TrackedNumber, NumberStatus } from '../types';
import { mockNumbers as initialMockNumbers, mockCampaigns } from '../data/mockData';
import { PlusIcon } from './icons/UIIcons';
import PurchaseNumbersModal from './PurchaseNumbersModal';
import AssignCampaignModal from './AssignSourceModal';

const statusColorMap: Record<NumberStatus, string> = {
  [NumberStatus.Assigned]: 'bg-blue-500/20 text-blue-400',
  [NumberStatus.Available]: 'bg-green-500/20 text-green-400',
};

const NumberRow: React.FC<{ number: TrackedNumber; onConfigureClick: (number: TrackedNumber) => void; campaignName: string; }> = ({ number, onConfigureClick, campaignName }) => (
  <tr className="border-b border-border-color hover:bg-background-light">
    <td className="p-4 text-sm font-medium text-text-primary">{number.phoneNumber}</td>
    <td className="p-4 text-sm text-text-secondary">{campaignName}</td>
     <td className="p-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[number.status]}`}>
        {number.status}
      </span>
    </td>
    <td className="p-4 text-sm text-text-secondary">
        <button 
          onClick={() => {
            if (number.status === NumberStatus.Available) {
              onConfigureClick(number);
            } else {
              // In a real app, this would open a more detailed configuration modal
              alert('Configuration for already assigned numbers is not yet implemented.');
            }
          }}
          className="text-brand-secondary hover:text-brand-primary disabled:text-text-secondary disabled:cursor-not-allowed"
        >
          {number.status === NumberStatus.Available ? 'Assign Campaign' : 'Configure'}
        </button>
    </td>
  </tr>
);

const Numbers: React.FC = () => {
  const [numbers, setNumbers] = useState<TrackedNumber[]>(initialMockNumbers);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<TrackedNumber | null>(null);

  const campaignMap = useMemo(() => new Map(mockCampaigns.map(c => [c.id, c.name])), []);

  const handlePurchaseNumbers = (purchasedNumbers: TrackedNumber[]) => {
    // In a real app, you would update the state with the new numbers from an API response
    const newNumbers = purchasedNumbers.map(n => ({ ...n, status: NumberStatus.Available as NumberStatus }));
    setNumbers(prev => [...prev, ...newNumbers]);
    alert(`${purchasedNumbers.length} number(s) purchased successfully!`);
    setIsPurchaseModalOpen(false);
  }

  const handleOpenAssignModal = (number: TrackedNumber) => {
    setSelectedNumber(number);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedNumber(null);
  }

  const handleAssignCampaign = (numberId: string, campaignId: string) => {
    setNumbers(currentNumbers => 
      currentNumbers.map(num => 
        num.id === numberId 
          ? { ...num, campaignId: campaignId, status: NumberStatus.Assigned } 
          : num
      )
    );
    handleCloseAssignModal();
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Numbers</h1>
            <p className="text-text-secondary mt-1">Purchase and manage your tracking numbers.</p>
          </div>
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Purchase Numbers
          </button>
        </div>

        {/* Numbers Table */}
        <div className="bg-background-card p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Your Numbers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-text-secondary uppercase bg-background-light">
                <tr>
                  <th className="p-4">Tracking Number</th>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((number) => (
                  <NumberRow 
                    key={number.id} 
                    number={number} 
                    onConfigureClick={handleOpenAssignModal}
                    campaignName={number.campaignId ? campaignMap.get(number.campaignId) || 'N/A' : 'N/A'}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PurchaseNumbersModal 
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchase={handlePurchaseNumbers}
      />
      {selectedNumber && (
        <AssignCampaignModal
          isOpen={isAssignModalOpen}
          onClose={handleCloseAssignModal}
          onSave={handleAssignCampaign}
          number={selectedNumber}
          campaigns={mockCampaigns}
        />
      )}
    </>
  );
};

export default Numbers;