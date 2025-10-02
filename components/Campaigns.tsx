import React from 'react';
import { Campaign, CampaignStatus } from '../types';
import { mockCampaigns } from '../data/mockData';
import { PlusIcon } from './icons/UIIcons';

const statusColorMap: Record<CampaignStatus, string> = {
  [CampaignStatus.Active]: 'bg-green-500/20 text-green-400',
  [CampaignStatus.Paused]: 'bg-yellow-500/20 text-yellow-400',
  [CampaignStatus.Ended]: 'bg-gray-500/20 text-gray-400',
};

const CampaignRow: React.FC<{ campaign: Campaign }> = ({ campaign }) => (
  <tr className="border-b border-border-color hover:bg-background-light">
    <td className="p-4 text-sm font-medium text-text-primary">{campaign.name}</td>
    <td className="p-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[campaign.status]}`}>
        {campaign.status}
      </span>
    </td>
    <td className="p-4 text-sm text-text-secondary">{campaign.numbers}</td>
    <td className="p-4 text-sm text-text-secondary">{campaign.calls.toLocaleString()}</td>
    <td className="p-4 text-sm text-text-secondary">${campaign.cpa.toFixed(2)}</td>
    <td className="p-4 text-sm text-text-secondary">
        <button className="text-brand-secondary hover:text-brand-primary">Edit</button>
    </td>
  </tr>
);

const Campaigns: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Campaigns</h1>
          <p className="text-text-secondary mt-1">Manage your call tracking campaigns.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-background-card p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4">All Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-text-secondary uppercase bg-background-light">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Numbers</th>
                <th className="p-4">Total Calls</th>
                <th className="p-4">Avg. CPA</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
