import React, { useState, useMemo } from 'react';
import { Campaign, Platform } from '../types';

type SortKey = 'roas' | 'spend' | 'clicks' | 'name';

const getRoasBorderColor = (roas: number): string => {
    if (roas >= 4.0) return 'border-green-500';
    if (roas >= 2.5) return 'border-amber-500';
    return 'border-red-500';
};

const AssetCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
    const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200/75 overflow-hidden flex flex-col border-l-4 ${getRoasBorderColor(campaign.roas)}`}>
            <img src={campaign.creative.imageUrl} alt={campaign.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800">{campaign.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{campaign.platform}</p>
                <p className="text-sm text-slate-600 italic flex-grow">"{campaign.creative.text}"</p>
                <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                        <span className="font-semibold text-slate-700">ROAS:</span>
                        <span className="font-mono ml-1">{campaign.roas.toFixed(2)}x</span>
                    </div>
                     <div>
                        <span className="font-semibold text-slate-700">Spend:</span>
                        <span className="font-mono ml-1">{campaign.spend.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                     <div>
                        <span className="font-semibold text-slate-700">Clicks:</span>
                        <span className="font-mono ml-1">{campaign.clicks.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-slate-700">CPC:</span>
                        <span className="font-mono ml-1">{cpc.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AssetLibraryView: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const [sortKey, setSortKey] = useState<SortKey>('roas');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  const filteredAndSortedCampaigns = useMemo(() => {
    let processedCampaigns = [...campaigns];

    if (platformFilter !== 'all') {
      processedCampaigns = processedCampaigns.filter(c => c.platform === platformFilter);
    }
    
    processedCampaigns.sort((a, b) => {
        let valA, valB;
        if (sortKey === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
        } else {
            valA = a[sortKey];
            valB = b[sortKey];
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return processedCampaigns;
  }, [campaigns, sortKey, sortOrder, platformFilter]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Asset Library</h1>
      <p className="text-slate-600 mb-8">Browse all creative assets and their performance metrics in one place.</p>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/75 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
            <label htmlFor="platform-filter" className="text-sm font-medium text-slate-700">Platform:</label>
            <select
                id="platform-filter"
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value as Platform | 'all')}
                className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
                <option value="all">All Platforms</option>
                {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
        <div className="flex items-center gap-4">
             <label htmlFor="sort-key" className="text-sm font-medium text-slate-700">Sort By:</label>
            <select
                id="sort-key"
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                 className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
                <option value="roas">ROAS</option>
                <option value="spend">Spend</option>
                <option value="clicks">Clicks</option>
                <option value="name">Name</option>
            </select>
             <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100"
                aria-label="Toggle sort order"
            >
                {sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedCampaigns.map(campaign => <AssetCard key={campaign.id} campaign={campaign} />)}
      </div>
       {filteredAndSortedCampaigns.length === 0 && (
            <div className="text-center p-8 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200/75">
                <p>No assets found for the selected platform or no campaigns exist.</p>
            </div>
        )}
    </div>
  );
};

const SortAscIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 10 3ZM5.22 5.22a.75.75 0 0 1 0 1.06L9.47 10.53a.75.75 0 0 1 0-1.06L5.22 5.22ZM14.78 5.22a.75.75 0 0 1-1.06 0L9.47 9.47a.75.75 0 0 1 1.06 0l4.25-4.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" /></svg>;
const SortDescIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v12.5a.75.75 0 0 1-.75.75ZM5.22 14.78a.75.75 0 0 1 0-1.06L9.47 9.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L10 10.53l-4.22 4.25a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" /></svg>;

export default AssetLibraryView;
