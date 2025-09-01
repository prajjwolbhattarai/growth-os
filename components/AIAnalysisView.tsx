
import React, { useState } from 'react';
import { Campaign, AIAnalysisResult, SentimentAnalysisResult } from '../types';
import { critiqueCreative, analyzeSentiment } from '../services/geminiService';
import Card from './ui/Card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface AIAnalysisViewProps {
  campaigns: Campaign[];
}

const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({ campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0] || null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysisResult | null>(null);
  const [isSentimentLoading, setIsSentimentLoading] = useState(false);
  const [sentimentError, setSentimentError] = useState<string | null>(null);


  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setAnalysis(null);
    setError(null);
    setSentimentAnalysis(null);
    setSentimentError(null);
  }

  const handleAnalyzeCreative = async () => {
    if (!selectedCampaign) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const result = await critiqueCreative(selectedCampaign.creative.text, selectedCampaign.creative.base64Image);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalyzeSentiment = async () => {
    if (!selectedCampaign?.comments) return;

    setIsSentimentLoading(true);
    setSentimentError(null);
    setSentimentAnalysis(null);

    try {
        const result = await analyzeSentiment(selectedCampaign.comments.map(c => c.text));
        setSentimentAnalysis(result);
    } catch (err) {
        setSentimentError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setIsSentimentLoading(false);
    }
  };

  const sentimentData = sentimentAnalysis ? [
    { name: 'Positive', value: sentimentAnalysis.positive, fill: '#22c55e'},
    { name: 'Neutral', value: sentimentAnalysis.neutral, fill: '#a1a1aa' },
    { name: 'Negative', value: sentimentAnalysis.negative, fill: '#ef4444' },
  ] : [];


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">AI-Powered Campaign Analysis</h1>
      <p className="text-slate-600 mb-8">Get instant, expert feedback on your ad creatives to boost performance.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Campaign Selector */}
        <div className="lg:w-1/3">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Select a Campaign to Analyze</h2>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {campaigns.length > 0 ? campaigns.map(campaign => (
              <div key={campaign.id} onClick={() => handleCampaignSelect(campaign)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCampaign?.id === campaign.id ? 'border-brand-blue-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-brand-blue-400'}`}>
                <p className="font-bold text-slate-800">{campaign.name}</p>
                <p className="text-sm text-slate-500">{campaign.platform}</p>
              </div>
            )) : <p className="text-slate-500">No campaigns available. Create one to get started.</p>}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="lg:w-2/3">
          {selectedCampaign ? (
            <div className="space-y-6">
                {/* Creative Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Creative Preview & Analysis</h2>
                    <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50 flex gap-4">
                        <img src={selectedCampaign.creative.imageUrl} alt="Creative" className="w-48 h-24 object-cover rounded-md flex-shrink-0" />
                        <p className="text-sm text-slate-600 italic">"{selectedCampaign.creative.text}"</p>
                    </div>

                    <button onClick={handleAnalyzeCreative} disabled={isLoading} className="w-full bg-brand-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? <><SpinnerIcon />Analyzing Creative...</> : 'Analyze Creative with AI'}
                    </button>
                    
                    {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{error}</div>}

                    {analysis && !isLoading && (
                        <div className="mt-6 space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card title="Engagement Prediction" value={analysis.engagementPrediction} icon={<EngagementIcon />} />
                            <Card title="Compliance Score" value={`${analysis.complianceScore}/100`} icon={<ComplianceIcon />} />
                        </div>
                        <AnalysisSection title="Headline Feedback" content={analysis.headlineFeedback} />
                        <AnalysisSection title="Body Copy Feedback" content={analysis.bodyCopyFeedback} />
                        <AnalysisSection title="Visual Feedback" content={analysis.visualFeedback} />
                        <AnalysisSection title="Actionable Suggestions">
                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                                {analysis.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                            </ul>
                        </AnalysisSection>
                        </div>
                    )}
                </div>

                {/* Sentiment Analysis */}
                {selectedCampaign.comments && selectedCampaign.comments.length > 0 && (
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Social Comment Sentiment</h2>
                         <button onClick={handleAnalyzeSentiment} disabled={isSentimentLoading} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                            {isSentimentLoading ? <><SpinnerIcon />Analyzing Sentiment...</> : 'Analyze Comment Sentiment'}
                         </button>
                         {sentimentError && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{sentimentError}</div>}
                         {sentimentAnalysis && !isSentimentLoading && (
                            <div className="mt-6 animate-fade-in flex flex-col sm:flex-row items-center gap-4">
                                <div style={{width: 200, height: 200}}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                 {sentimentData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.fill} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-700">AI Summary</h3>
                                    <p className="text-sm text-slate-600">{sentimentAnalysis.summary}</p>
                                </div>
                            </div>
                         )}
                     </div>
                )}


            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
              <p className="text-slate-500">Select a campaign to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalysisSection: React.FC<{ title: string; content?: string, children?: React.ReactNode }> = ({ title, content, children }) => (
    <div>
        <h3 className="text-md font-semibold text-slate-700 mb-1">{title}</h3>
        {content && <p className="text-slate-600 text-sm">{content}</p>}
        {children}
    </div>
);

const SpinnerIcon = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const EngagementIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ComplianceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

export default AIAnalysisView;