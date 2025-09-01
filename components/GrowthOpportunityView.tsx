import React, { useState } from 'react';
import { Campaign, GrowthOpportunity } from '../types';
import { findGrowthOpportunities } from '../services/geminiService';

const OpportunityCard: React.FC<{ opportunity: GrowthOpportunity, campaigns: Campaign[] }> = ({ opportunity, campaigns }) => {
    const priorityStyles = {
        High: 'bg-red-100 text-red-800 border-red-300',
        Medium: 'bg-amber-100 text-amber-800 border-amber-300',
        Low: 'bg-sky-100 text-sky-800 border-sky-300',
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800">{opportunity.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityStyles[opportunity.potentialImpact]}`}>{opportunity.potentialImpact} Impact</span>
            </div>
            <p className="text-slate-600 mb-4">{opportunity.description}</p>
            
            <div className="mb-4">
                <h4 className="font-semibold text-slate-700 mb-2">Suggested Actions</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {opportunity.suggestedActions.map((action, i) => <li key={i}>{action}</li>)}
                </ul>
            </div>
            
            {opportunity.relevantCampaigns.length > 0 && (
                 <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Relevant Campaigns</h4>
                    <div className="flex flex-wrap gap-2">
                        {opportunity.relevantCampaigns.map(id => {
                            const campaign = campaigns.find(c => c.id === id);
                            return campaign ? (
                                <span key={id} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">{campaign.name}</span>
                            ) : null;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};


const GrowthOpportunityView: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const [opportunities, setOpportunities] = useState<GrowthOpportunity[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    setOpportunities(null);
    try {
      const result = await findGrowthOpportunities(campaigns);
      setOpportunities(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Growth Opportunity Finder</h1>
      <p className="text-slate-600 mb-6">Use AI to scan your portfolio for hidden growth opportunities and strategic insights.</p>
      
      <div className="mb-8">
        <button 
            onClick={handleFindOpportunities} 
            disabled={isLoading || campaigns.length === 0}
            className="bg-brand-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md"
        >
            {isLoading ? <><SpinnerIcon />Analyzing for Opportunities...</> : '✨ Find Growth Opportunities'}
        </button>
      </div>

      <div>
        {error && <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">{error}</div>}
        
        {opportunities && (
            <div className="space-y-6 animate-fade-in">
                {opportunities.map((opp, i) => <OpportunityCard key={i} opportunity={opp} campaigns={campaigns} />)}
            </div>
        )}
        
        {!opportunities && !isLoading && !error && (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200/75 text-slate-500">
                <p>
                    {campaigns.length > 0 
                        ? 'Click the button to let AI find strategic growth opportunities in your campaign data.'
                        : 'Create a campaign to start finding growth opportunities.'}
                </p>
            </div>
        )}

        {isLoading && (
             <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200/75 text-slate-500">
                <div className="flex justify-center mb-4"><SpinnerIcon isBlue /></div>
                <p className="font-semibold text-slate-600">AI is analyzing your campaigns...</p>
                <p className="text-sm">This may take a moment.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const SpinnerIcon: React.FC<{isBlue?: boolean}> = ({ isBlue }) => <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${isBlue ? 'text-brand-blue-600' : 'text-white'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default GrowthOpportunityView;