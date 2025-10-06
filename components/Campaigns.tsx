import React, { useState, useMemo } from 'react';
import { Campaign, CampaignStatus, NumberStatus } from '../types';
import { mockCampaigns as initialMockCampaigns, mockNumbers } from '../data/mockData';
import CampaignModal from './CampaignModal';
import {
    PlusIcon,
    ManageCampaignsIcon,
    SearchIcon,
    EditIcon,
    DuplicateIcon,
    ReportIcon,
    AnalyticsIcon,
    PlayIcon,
    TrashIcon,
    SortUpIcon,
    SortDownIcon,
    SortIcon,
} from './icons/UIIcons';

const statusColorMap: Record<CampaignStatus, string> = {
  [CampaignStatus.Active]: 'bg-green-400 text-green-900',
  [CampaignStatus.Paused]: 'bg-yellow-400 text-yellow-900',
  [CampaignStatus.Ended]: 'bg-gray-500 text-gray-100',
};

const USAFlag: React.FC = () => <span className="text-lg" role="img" aria-label="USA Flag">🇺🇸</span>;

const campaignTotals: Record<string, number> = {
  c1: 11, c2: 53626, c3: 19, c4: 0, c5: 3563, c6: 41, c7: 0, c8: 4592,
  c9: 23, c10: 0, c11: 65912, c12: 61, c13: 8150, c14: 80, c15: 1261, c16: 0,
};

type SortDirection = 'ascending' | 'descending';
type SortableCampaignKey = keyof Campaign | 'total';
interface SortConfig {
    key: SortableCampaignKey;
    direction: SortDirection;
}

const SortableHeader: React.FC<{
    columnKey: SortableCampaignKey;
    title: string;
    sortConfig: SortConfig | null;
    requestSort: (key: SortableCampaignKey) => void;
    className?: string;
}> = ({ columnKey, title, sortConfig, requestSort, className }) => {
    const isSorted = sortConfig?.key === columnKey;
    const direction = isSorted ? sortConfig?.direction : undefined;

    return (
        <th className={`p-4 ${className}`}>
            <button
                type="button"
                onClick={() => requestSort(columnKey)}
                className="flex items-center space-x-1 group"
            >
                <span>{title}</span>
                <span className="text-text-secondary">
                    {isSorted ? (
                        direction === 'ascending' ? <SortUpIcon /> : <SortDownIcon />
                    ) : (
                       <SortIcon className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </span>
            </button>
        </th>
    );
};


const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialMockCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

  const sortedCampaigns = useMemo(() => {
    let sortableItems = [...filteredCampaigns];
    if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
            const getSortValue = (item: Campaign, key: SortableCampaignKey) => {
                if (key === 'total') {
                    return campaignTotals[item.id] || 0;
                }
                return item[key as keyof Campaign];
            };

            const valA = getSortValue(a, sortConfig.key);
            const valB = getSortValue(b, sortConfig.key);

            let comparison = 0;
            if (typeof valA === 'number' && typeof valB === 'number') {
                comparison = valA - valB;
            } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                comparison = valA === valB ? 0 : valA ? 1 : -1;
            } else {
                comparison = String(valA).localeCompare(String(valB));
            }
            
            return sortConfig.direction === 'ascending' ? comparison : -comparison;
        });
    }
    return sortableItems;
}, [filteredCampaigns, sortConfig]);

  const requestSort = (key: SortableCampaignKey) => {
      let direction: SortDirection = 'ascending';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
      }
      setSortConfig({ key, direction });
  };

  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleSaveCampaign = (campaignData: Campaign, assignedNumberIds: string[]) => {
      const campaignIdToSave = campaignData.id || `c${Date.now()}`;
      const newCampaignData = { ...campaignData, id: campaignIdToSave };

      if (campaignData.id) {
        setCampaigns(campaigns.map(c => c.id === campaignData.id ? newCampaignData : c));
      } else {
        setCampaigns([...campaigns, newCampaignData]);
        initialMockCampaigns.push(newCampaignData);
      }

      const updatedNumbers = mockNumbers.map(num => {
          if (assignedNumberIds.includes(num.id)) {
              return { ...num, campaignId: campaignIdToSave, status: NumberStatus.Assigned };
          }
          if (num.campaignId === campaignIdToSave && !assignedNumberIds.includes(num.id)) {
              return { ...num, campaignId: null, status: NumberStatus.Available };
          }
          return num;
      });
      
      mockNumbers.length = 0;
      mockNumbers.push(...updatedNumbers);

      handleCloseModal();
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-background-dark text-text-primary min-h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
                <ManageCampaignsIcon className="w-8 h-8 text-text-secondary" />
                <h1 className="text-2xl font-bold">Manage Campaigns</h1>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-background-dark border border-border-color rounded-md pl-10 pr-4 py-2 w-48 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                </div>
                <button className="bg-background-card border border-border-color rounded-md px-4 py-2 text-sm font-medium hover:bg-border-color">
                    All
                </button>
            </div>
        </div>

        <div className="mb-6">
            <button
                onClick={handleOpenCreateModal}
                className="flex items-center px-4 py-1.5 border-2 border-green-600/80 text-green-500 rounded-md text-sm font-semibold hover:bg-green-600 hover:text-white transition-colors"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                CREATE CAMPAIGN
            </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left">
            <thead className="text-xs text-text-secondary uppercase">
              <tr className="bg-background-dark">
                  <SortableHeader columnKey="status" title="Status" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="name" title="Name" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="offerName" title="Offer Name" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="country" title="Country" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="recordingEnabled" title="Recording" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="liveCalls" title="Live" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="callsLastHour" title="Hour" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="callsLastDay" title="Day" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="callsLastMonth" title="Month" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader columnKey="total" title="Total" sortConfig={sortConfig} requestSort={requestSort} />
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background-light">
              {sortedCampaigns.map((campaign) => (
                 <tr key={campaign.id} className="border-b border-background-dark hover:bg-background-card/50">
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${statusColorMap[campaign.status]}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-text-primary">{campaign.name}</td>
                    <td className="p-4 text-sm text-text-secondary">{campaign.offerName}</td>
                    <td className="p-4"><USAFlag /></td>
                    <td className="p-4 text-sm text-text-secondary">{campaign.recordingEnabled ? 'Yes' : 'No'}</td>
                    <td className="p-4 text-sm text-text-secondary">{campaign.liveCalls}</td>
                    <td className="p-4 text-sm text-text-secondary">{campaign.callsLastHour}</td>
                    <td className="p-4 text-sm text-text-secondary">{campaign.callsLastDay}</td>
                    <td className="p-4 text-sm text-text-secondary">{campaign.callsLastMonth}</td>
                    <td className="p-4 text-sm text-text-primary font-medium">{(campaignTotals[campaign.id] || 0).toLocaleString()}</td>
                    <td className="p-4">
                        <div className="flex items-center space-x-3 text-text-secondary">
                           <button onClick={() => handleOpenEditModal(campaign)} className="hover:text-brand-primary"><EditIcon /></button>
                           <button className="hover:text-brand-primary"><DuplicateIcon /></button>
                           <button className="hover:text-brand-primary"><ReportIcon /></button>
                           <button className="hover:text-brand-primary"><AnalyticsIcon /></button>
                           <button className="hover:text-brand-primary"><PlayIcon /></button>
                           <button className="hover:text-red-500"><TrashIcon /></button>
                        </div>
                    </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CampaignModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCampaign}
        campaign={editingCampaign}
      />
    </>
  );
};

export default Campaigns;
