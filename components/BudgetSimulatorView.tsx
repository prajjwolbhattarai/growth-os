

import React, { useState, useMemo, useEffect } from 'react';
import { Campaign, BudgetSimulationResult } from '../types';
import { simulateBudget } from '../services/geminiService';

const BudgetSimulatorView: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0] || null);
  const [newBudget, setNewBudget] = useState<number>(selectedCampaign?.spend || 0);
  const [simulation, setSimulation] = useState<BudgetSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(!selectedCampaign && campaigns.length > 0) {
      setSelectedCampaign(campaigns[0]);
      setNewBudget(campaigns[0].spend);
    } else if (campaigns.length === 0) {
      setSelectedCampaign(null);
    }
  }, [campaigns, selectedCampaign]);


  const handleCampaignSelect = (campaign: Campaign | null) => {
    if (campaign) {
        setSelectedCampaign(campaign);
        setNewBudget(campaign.spend);
        setSimulation(null);
        setError(null);
    }
  };
  
  const handleSimulate = async () => {
    if (!selectedCampaign) return;
    setIsLoading(true);
    setError(null);
    setSimulation(null);
    try {
      const result = await simulateBudget(selectedCampaign, newBudget);
      setSimulation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const budgetChangePercent = useMemo(() => {
    if (!selectedCampaign || !selectedCampaign.spend) return 0;
    return ((newBudget - selectedCampaign.spend) / selectedCampaign.spend) * 100;
  }, [newBudget, selectedCampaign]);

  if (campaigns.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">"What If" Budget Simulator</h1>
        <p className="text-slate-600 mb-8">Predict the impact of budget changes on campaign performance using AI.</p>
        <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-slate-200/75">
            <p className="text-slate-500">Create a campaign to start using the budget simulator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">"What If" Budget Simulator</h1>
      <p className="text-slate-600 mb-8">Predict the impact of budget changes on campaign performance using AI.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Selection & Controls */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                <h2 className="text-xl font-bold text-slate-800 mb-4">1. Select Campaign</h2>
                <select 
                    onChange={(e) => handleCampaignSelect(campaigns.find(c => c.id === e.target.value) || null)}
                    value={selectedCampaign?.id || ''}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                >
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>)}
                </select>

                {selectedCampaign && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">2. Adjust Budget</h2>
                        <p className="text-sm text-slate-500 mb-4">Current Spend: {selectedCampaign.spend.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>

                        <div className="text-center mb-4">
                            <p className="text-3xl font-bold text-brand-blue-600">{newBudget.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                            <p className={`font-semibold ${budgetChangePercent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {budgetChangePercent >= 0 ? '+' : ''}{budgetChangePercent.toFixed(1)}%
                            </p>
                        </div>
                        
                        <input
                            type="range"
                            min={0}
                            max={selectedCampaign.spend * 3} // Allow up to 3x budget increase
                            step={100}
                            value={newBudget}
                            onChange={(e) => setNewBudget(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <button onClick={handleSimulate} disabled={isLoading} className="mt-6 w-full bg-brand-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                            {isLoading ? <><SpinnerIcon /> Simulating...</> : '🔮 Simulate Impact'}
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        {/* Simulation Results */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 min-h-full">
                <h2 className="text-xl font-bold text-slate-800 mb-4">3. Predicted Outcome</h2>
                {error && <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{error}</div>}
                
                {simulation && !isLoading ? (
                    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                        <ResultCard title="Current Results" campaign={selectedCampaign} />
                        <ResultCard title="Predicted Results" campaign={selectedCampaign} predictedData={simulation} isPredicted />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-slate-400">
                        <p>Adjust the budget and click "Simulate Impact" to see AI predictions.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

interface ResultCardProps {
    title: string;
    campaign: Campaign | null;
    predictedData?: BudgetSimulationResult | null;
    isPredicted?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, campaign, predictedData, isPredicted = false }) => {
    if (!campaign) {
        return null;
    }
    
    const data = {
        impressions: predictedData?.predictedImpressions ?? campaign.impressions,
        clicks: predictedData?.predictedClicks ?? campaign.clicks,
        roas: predictedData?.predictedRoas ?? campaign.roas
    };
    
    const original = {
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        roas: campaign.roas
    };

    const getChange = (current: number, originalValue: number) => {
        if (!isPredicted || originalValue === 0) return null;
        const change = ((current - originalValue) / originalValue) * 100;
        if (Math.abs(change) < 0.1) return null;
        return (
            <span className={`ml-2 text-xs font-bold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ({change >= 0 ? '+' : ''}{change.toFixed(1)}%)
            </span>
        );
    }

    return (
        <div className={`p-6 rounded-lg ${isPredicted ? 'bg-brand-blue-50 border-brand-blue-200' : 'bg-slate-50 border-slate-200'} border`}>
            <h3 className="font-bold text-lg text-slate-800 mb-4">{title}</h3>
            <div className="space-y-3">
                <div className="text-lg"><span className="font-semibold">{data.impressions.toLocaleString()}</span> Impressions {getChange(data.impressions, original.impressions)}</div>
                <div className="text-lg"><span className="font-semibold">{data.clicks.toLocaleString()}</span> Clicks {getChange(data.clicks, original.clicks)}</div>
                <div className="text-lg"><span className="font-semibold">{data.roas.toFixed(2)}x</span> ROAS {getChange(data.roas, original.roas)}</div>
            </div>
        </div>
    )
};


const SpinnerIcon = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default BudgetSimulatorView;