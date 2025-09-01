import React, { useState } from 'react';
import { Campaign, Platform } from '../types';
import { View } from '../App';

// A 16x16 grey square PNG, base64 encoded.
const GREY_SQUARE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAE0lEQVR42mNk+P//PwMMg3EDAAB2Bw4CbsiSogAAAABJRU5ErkJggg==';

interface CampaignCreatorViewProps {
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setActiveView: (view: View) => void;
}

const CampaignCreatorView: React.FC<CampaignCreatorViewProps> = ({ setCampaigns, setActiveView }) => {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.Google);
  const [budget, setBudget] =useState(1000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]);
  const [creativeText, setCreativeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCampaign: Campaign = {
        id: `${platform.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
        name,
        platform,
        status: 'Active',
        spend: 0,
        budget,
        startDate,
        endDate,
        impressions: 0,
        clicks: 0,
        roas: 0,
        creative: {
            text: creativeText,
            imageUrl: `https://picsum.photos/seed/${Math.random()}/400/200`,
            base64Image: GREY_SQUARE_B64,
        },
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    alert('Campaign created successfully!');
    setActiveView('campaigns');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Creator</h1>
      <p className="text-slate-600 mb-8">Launch a new campaign from scratch.</p>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200/75">
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormRow label="Campaign Name">
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg" placeholder="e.g., Q4 Product Launch"/>
            </FormRow>

            <FormRow label="Platform">
                <select value={platform} onChange={e => setPlatform(e.target.value as Platform)} className="w-full p-2 border border-slate-300 rounded-lg">
                    {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </FormRow>
            
            <FormRow label="Total Budget (€)">
                <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} required min="1" className="w-full p-2 border border-slate-300 rounded-lg"/>
            </FormRow>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormRow label="Start Date">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg"/>
                </FormRow>
                 <FormRow label="End Date">
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg"/>
                </FormRow>
            </div>
            
            <FormRow label="Ad Creative Text">
                <textarea value={creativeText} onChange={e => setCreativeText(e.target.value)} required rows={4} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Enter your ad copy here..."></textarea>
            </FormRow>
            
            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-brand-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-blue-700 transition-colors">
                    Create Campaign
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        {children}
    </div>
);


export default CampaignCreatorView;
