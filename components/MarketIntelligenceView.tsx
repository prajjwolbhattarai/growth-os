
import React, { useState } from 'react';
import { MarketTrend, CompetitorInfo } from '../types';
import { getMarketTrends, analyzeCompetitor } from '../services/geminiService';

interface MarketIntelligenceViewProps {
  initialTrends: MarketTrend[];
  initialCompetitorInfo: CompetitorInfo;
}

const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({ initialTrends, initialCompetitorInfo }) => {
  const [trends, setTrends] = useState<MarketTrend[]>(initialTrends);
  const [competitorInfo, setCompetitorInfo] = useState<CompetitorInfo>(initialCompetitorInfo);
  const [domain, setDomain] = useState('competitor.com');
  
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [isCompetitorLoading, setIsCompetitorLoading] = useState(false);
  const [trendsError, setTrendsError] = useState<string|null>(null);
  const [competitorError, setCompetitorError] = useState<string|null>(null);
  
  const handleFetchTrends = async () => {
    setIsTrendsLoading(true);
    setTrendsError(null);
    try {
        const result = await getMarketTrends("B2B SaaS Marketing");
        setTrends(result);
    } catch(err) {
        setTrendsError(err instanceof Error ? err.message : "Failed to fetch trends.");
    } finally {
        setIsTrendsLoading(false);
    }
  };
  
  const handleAnalyzeCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setIsCompetitorLoading(true);
    setCompetitorError(null);
    try {
        const result = await analyzeCompetitor(domain);
        setCompetitorInfo(result);
    } catch(err) {
        setCompetitorError(err instanceof Error ? err.message : "Failed to analyze competitor.");
    } finally {
        setIsCompetitorLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Market & Competitor Intelligence</h1>
      <p className="text-slate-600 mb-8">Gain an edge with AI-powered insights into market trends and competitor strategies.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Industry Trends</h2>
            <button onClick={handleFetchTrends} disabled={isTrendsLoading} className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800 disabled:opacity-50">
                {isTrendsLoading ? 'Refreshing...' : 'Refresh Trends'}
            </button>
          </div>
          {trendsError && <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{trendsError}</div>}
          <div className="space-y-6">
            {trends.map(trend => (
              <div key={trend.title}>
                <h3 className="font-semibold text-slate-800">{trend.title} <span className="text-green-600">({trend.searchVolumeChange > 0 ? '+' : ''}{trend.searchVolumeChange}%)</span></h3>
                <p className="text-sm text-slate-600 mt-1">{trend.summary}</p>
                <SourceList sources={trend.sources} />
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Competitor Deep Dive</h2>
          <form onSubmit={handleAnalyzeCompetitor} className="flex gap-2 mb-6">
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="Enter competitor domain..."
              className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
            />
            <button type="submit" disabled={isCompetitorLoading || !domain} className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700 disabled:bg-slate-400">
              {isCompetitorLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
          {competitorError && <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{competitorError}</div>}
          {competitorInfo && (
            <div className="space-y-4 animate-fade-in">
              <InfoSection title="Summary">
                <p className="text-sm text-slate-600">{competitorInfo.summary}</p>
              </InfoSection>
              <InfoSection title="Primary Ad Platforms">
                <div className="flex flex-wrap gap-2">
                    {competitorInfo.adPlatforms.map(p => <span key={p} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">{p}</span>)}
                </div>
              </InfoSection>
              <InfoSection title="Messaging Strategies">
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    {competitorInfo.messagingStrategies.map(s => <li key={s}>{s}</li>)}
                </ul>
              </InfoSection>
               <InfoSection title="Recent Offers">
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    {competitorInfo.recentOffers.map(o => <li key={o}>{o}</li>)}
                </ul>
              </InfoSection>
              <SourceList sources={competitorInfo.sources} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-slate-700 mb-2">{title}</h4>
        {children}
    </div>
);

const SourceList: React.FC<{sources: {title: string, uri: string}[]}> = ({sources}) => {
    if (!sources || sources.length === 0) return null;
    return (
        <div className="mt-3 pt-3 border-t border-slate-200">
            <h5 className="text-xs font-semibold text-slate-500 mb-1">Sources:</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {sources.map((source, i) => (
                    <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue-600 hover:underline flex items-center gap-1">
                        <LinkIcon /> {source.title}
                    </a>
                ))}
            </div>
        </div>
    )
};

const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M7.75 3.25a.75.75 0 0 0-1.5 0v1.25a.75.75 0 0 0 1.5 0V3.25Zm-3 3.5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm3.75 3a.75.75 0 1 0-1.5 0v4.5a.75.75 0 1 0 1.5 0v-4.5Z" /><path fillRule="evenodd" d="M14 1.75a.75.75 0 0 1 .75.75v11a.75.75 0 0 1-1.5 0V3.31L3.31 14.25a.75.75 0 1 1-1.06-1.06L13.19 2.5H2.5a.75.75 0 0 1 0-1.5h11.5Z" /></svg>;


export default MarketIntelligenceView;
