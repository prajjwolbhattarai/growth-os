import React, { useState, useMemo } from 'react';
import { Campaign, Platform } from '../types';

type SortKey = 'name' | 'status' | 'spend' | 'impressions' | 'clicks' | 'roas' | 'ctr' | 'cpc';
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortKey | null;
  direction: SortDirection;
}

const PlatformIcon: React.FC<{ platform: Platform }> = ({ platform }) => {
  const Svg = {
    [Platform.Google]: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.54,11.23h0c0-.75-.06-1.48-.18-2.2H12v4.16h5.36c-.22,1.35-.89,2.5-1.9,3.25v2.7h3.46c2.02-1.86,3.18-4.59,3.18-7.91Z" style={{fill: '#4285f4'}}></path><path d="M12,22c2.7,0,4.96-.89,6.62-2.41l-3.46-2.7c-.9,.6-2.05,.96-3.16,.96-2.43,0-4.48-1.64-5.21-3.84H3.27v2.79c1.53,3.03,4.64,5.1,8.73,5.1Z" style={{fill: '#34a853'}}></path><path d="M6.79,14.01c-.18-.54-.27-1.11-.27-1.71s.09-1.17,.27-1.71V7.81H3.27c-.64,1.28-1,2.68-1,4.19s.36,2.91,1,4.19l3.52-2.79Z" style={{fill: '#fbbc05'}}></path><path d="M12,5.78c1.46,0,2.78,.5,3.82,1.5l3.07-3.07C16.96,2.29,14.7,1,12,1,7.91,1,4.8,3.06,3.27,6.09l3.52,2.79c.73-2.2,2.78-3.84,5.21-3.84Z" style={{fill: '#ea4335'}}></path></svg>,
    [Platform.Meta]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2c-.55,0-1,.45-1,1v2h3v3h-3v6.95c5.05-.5,9-4.76,9-9.8Z"></path></svg>,
    [Platform.LinkedIn]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-sky-700"><path d="M19,3a2,2,0,0,1,2,2v14a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V5A2,2,0,0,1,5,3H19m-8.5,15v-7h-2v7h2m-1-8.22c.66,0,1.2-.54,1.2-1.2s-.54-1.2-1.2-1.2-1.2,.54-1.2,1.2,.54,1.2,1.2,1.2m7.5,8.22v-4.5c0-2.21-1.28-3.07-2.75-3.07-1.22,0-1.89,.68-2.25,1.25V11h-2v7h2v-4.16c0-.83,.41-1.64,1.25-1.64s1.25,.81,1.25,1.64V18h2Z"></path></svg>,
    [Platform.Twitter]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>,
    [Platform.Reddit]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-orange-500"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8Zm-1-12h2v2h-2v-2Zm-2,4h6v6h-6v-6Zm2,2v2h2v-2h-2Zm-4.5-2.5c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5,.67-1.5,1.5,.67,1.5,1.5,1.5Zm9,0c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5,.67-1.5,1.5,.67,1.5,1.5,1.5Z"></path></svg>,
    [Platform.Spotify]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm4.89,12.11c-.23,.36-.69,.49-1.05,.25-2.62-1.61-5.92-1.98-9.9-.99-.42,.1-.84-.13-.94-.55-.1-.42,.13-.84,.55-.94,4.35-1.08,8.02-.67,10.91,1.1,.37,.23,.49,.69,.27,1.05v-.02Zm-1.2-2.37c-.28,.44-.82,.58-1.26,.3-2.9-1.78-7.2-2.28-10.68-1.25-.5,.14-1.02-.16-1.15-.65s.16-1.02,.65-1.15c3.9-.94,8.71-.53,11.96,1.49,.44,.28,.58,.82,.3,1.26v-.01Zm-1.31-2.48c-3.35-2.07-8.83-2.28-12.42-1.25-.58,.16-1.19-.2-1.35-.78-.16-.58,.2-1.19,.78-1.35,4.12-1.16,10.16-.91,14.06,1.47,.52,.32,.71,.96,.39,1.48-.32,.52-.96,.71-1.48,.39h.02Z"></path></svg>,
    [Platform.TikTok]: () => <svg viewBox="0 0 28 28" fill="currentColor" className="text-black"><path fill="#FF0050" d="M22.99 11.23c-.02-1.7-.89-3.29-2.2-4.25a.86.86 0 00-.9.13L18 8.4a7.08 7.08 0 01-1.4-3.82c0-.47-.39-.85-.86-.85h-3.6c-.47 0-.86.38-.86.85v11.5a4.49 4.49 0 01-4.48 4.48A4.49 4.49 0 012 16.1a4.49 4.49 0 014.48-4.48c.38 0 .76.05 1.12.14V8.45c0-.47-.38-.85-.85-.85H3.1c-.47 0-.85.38-.85.85C2.25 15.33 7.84 22 15.14 22a7.1 7.1 0 007.1-7.1v-3.2a.86.86 0 00-.25-.67z"></path><path fill="#00F2EA" d="M22.99 11.23c-.02-1.7-.89-3.29-2.2-4.25a.86.86 0 00-.9.13L18 8.4a7.08 7.08 0 01-1.4-3.82c0-.47-.39-.85-.86-.85h-3.6c-.47 0-.86.38-.86.85v11.5a4.49 4.49 0 01-4.48 4.48A4.49 4.49 0 012 16.1a4.49 4.49 0 014.48-4.48c.38 0 .76.05 1.12.14V8.45c0-.47-.38-.85-.85-.85H3.1c-.47 0-.85.38-.85.85C2.25 15.33 7.84 22 15.14 22a7.1 7.1 0 007.1-7.1v-3.2a.86.86 0 00-.25-.67zM19.1 14.53a4.34 4.34 0 11-8.68 0V5.1h2.75v8.78a.86.86 0 00.86.86c.47 0 .85-.38.85-.86v-8.78h2.75v9.43z"></path></svg>,
    [Platform.Apple]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M17.5,22c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5,2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5Zm-11-2.5c0,1.38-1.12,2.5-2.5,2.5S1.5,20.88,1.5,19.5,2.62,17,4,17s2.5,1.12,2.5,2.5Zm11.8-4.5H6.7c-.55,0-1,.45-1,1s.45,1,1,1h11.1c.55,0,1-.45,1-1s-.45-1-1-1Zm-1-4H7.2c-.55,0-1,.45-1,1s.45,1,1,1h10.6c.55,0,1-.45,1-1s-.45-1-1-1ZM19,2H5C3.34,2,2,3.34,2,5v4.1c0,.55,.45,1,1,1s1-.45,1-1V5c0-.55,.45-1,1-1H19c.55,0,1,.45,1,1v14c0,.55-.45,1-1,1h-1.1c-.55,0-1,.45-1,1s.45,1,1,1H19c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3Z"></path></svg>,
  }[platform];

  return <div className="w-5 h-5 mr-3 rounded-full flex items-center justify-center overflow-hidden"><Svg /></div>;
};

const StatusIndicator: React.FC<{ status: 'Active' | 'Paused' | 'Ended' }> = ({ status }) => {
  const color = {
    Active: 'bg-green-500',
    Paused: 'bg-slate-400',
    Ended: 'bg-red-500',
  }[status];
  return <div className="flex items-center"><span className={`h-2.5 w-2.5 rounded-full mr-2 ${color}`}></span>{status}</div>;
};

const BudgetProgressBar: React.FC<{spend: number, budget: number}> = ({ spend, budget }) => {
  const percentage = budget > 0 ? (spend / budget) * 100 : 0;
  const color = percentage > 100 ? 'bg-red-500' : percentage > 85 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
    </div>
  );
};

const CampaignsView: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Paused' | 'Ended'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'roas', direction: 'descending' });

  const processedCampaigns = useMemo(() => {
    let filteredCampaigns = [...campaigns];

    // Filter by search term
    if (searchTerm) {
      filteredCampaigns = filteredCampaigns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Filter by platform
    if (platformFilter !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.platform === platformFilter);
    }
    // Filter by status
    if (statusFilter !== 'all') {
        filteredCampaigns = filteredCampaigns.filter(c => c.status === statusFilter);
    }
    
    // Sort
    if (sortConfig.key) {
        filteredCampaigns.sort((a, b) => {
            const getSortValue = (c: Campaign, key: SortKey) => {
                if(key === 'ctr') return c.impressions > 0 ? (c.clicks / c.impressions) : 0;
                if(key === 'cpc') return c.clicks > 0 ? (c.spend / c.clicks) : 0;
                const value = c[key as keyof Campaign];
                return typeof value === 'string' ? value.toLowerCase() : value;
            }
            const aValue = getSortValue(a, sortConfig.key as SortKey);
            const bValue = getSortValue(b, sortConfig.key as SortKey);

            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }

    return filteredCampaigns;
  }, [campaigns, searchTerm, platformFilter, statusFilter, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      setSortConfig({ key: null, direction: 'ascending' });
      return;
    }
    setSortConfig({ key, direction });
  };
  
  const SortableTh: React.FC<{ label: string; sortKey: SortKey, textAlign?: 'text-right' | 'text-left' }> = ({ label, sortKey, textAlign = 'text-left'}) => (
    <th scope="col" className={`px-6 py-3 ${textAlign}`}>
        <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 group whitespace-nowrap">
            {label}
            <span className={`transition-opacity ${sortConfig.key === sortKey ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}>
                {sortConfig.direction === 'ascending' && sortConfig.key === sortKey ? '▲' : '▼'}
            </span>
        </button>
    </th>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Management</h1>
      <p className="text-slate-600 mb-8">A unified view of all campaigns across your connected platforms.</p>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
        />
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as any)} className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500">
            <option value="all">All Platforms</option>
            {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500">
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Ended">Ended</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/75 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <SortableTh label="Campaign" sortKey="name" />
              <SortableTh label="Status" sortKey="status" />
              <th scope="col" className="px-6 py-3">Budget Usage</th>
              <SortableTh label="Spend" sortKey="spend" textAlign="text-right" />
              <SortableTh label="Impressions" sortKey="impressions" textAlign="text-right" />
              <SortableTh label="Clicks" sortKey="clicks" textAlign="text-right" />
              <SortableTh label="CTR" sortKey="ctr" textAlign="text-right" />
              <SortableTh label="CPC" sortKey="cpc" textAlign="text-right" />
              <SortableTh label="ROAS" sortKey="roas" textAlign="text-right" />
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedCampaigns.map(campaign => {
              const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
              const cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
              const budgetUsage = campaign.budget > 0 ? (campaign.spend / campaign.budget) * 100 : 0;

              return (
                <tr key={campaign.id} className="bg-white border-b hover:bg-slate-50">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                    <PlatformIcon platform={campaign.platform} />
                    <div>
                        <div className="text-base font-semibold">{campaign.name}</div>
                        <div className="font-normal text-slate-500">{campaign.platform}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <StatusIndicator status={campaign.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BudgetProgressBar spend={campaign.spend} budget={campaign.budget} />
                      <span className="font-mono text-xs w-10 text-right">{budgetUsage.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{campaign.spend.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="px-6 py-4 text-right font-mono">{campaign.impressions.toLocaleString('de-DE')}</td>
                  <td className="px-6 py-4 text-right font-mono">{campaign.clicks.toLocaleString('de-DE')}</td>
                  <td className="px-6 py-4 text-right font-mono">{ctr.toFixed(2)}%</td>
                  <td className="px-6 py-4 text-right font-mono">{cpc.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="px-6 py-4 text-right font-mono text-green-600 font-semibold">{campaign.roas.toFixed(2)}x</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <a href="#" title="View on Platform" className="text-slate-400 hover:text-brand-blue-600"><LinkIcon /></a>
                        <button title="View in Asset Library" className="text-slate-400 hover:text-brand-blue-600"><AssetLibraryIcon/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {processedCampaigns.length === 0 && (
            <div className="text-center p-8 text-slate-500">
                {campaigns.length === 0 
                    ? "No campaigns found. Go to the Campaign Creator to add one!"
                    : `No campaigns found for the current filters.`
                }
            </div>
        )}
      </div>
    </div>
  );
};

const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.665l3-3Z" /><path d="M8.603 14.53a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 0 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.665l-3 3Z" /></svg>;
const AssetLibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h3.879a1.5 1.5 0 0 1 1.06.44l2.82 2.82a1.5 1.5 0 0 1 .44 1.06V15.5A2.25 2.25 0 0 1 10.5 17.75h-6A2.25 2.25 0 0 1 2.25 15.5v-11ZM11.25 4.5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-.75-.75Z" /><path d="M14.75 5.25a.75.75 0 0 0-1.5 0v10a.75.75 0 0 0 1.5 0v-10Z" /><path d="M16.75 5.25a.75.75 0 0 0-1.5 0v10a.75.75 0 0 0 1.5 0v-10Z" /></svg>

export default CampaignsView;
