
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AIAnalysisView from './components/AIAnalysisView';
import CampaignsView from './components/CampaignsView';
import CustomerJourneyView from './components/CustomerJourneyView';
import ReportsView from './components/ReportsView';
import AudienceOverlapView from './components/AudienceOverlapView';
import BudgetSimulatorView from './components/BudgetSimulatorView';
import AIChatView from './components/AIChatView';
import AssetLibraryView from './components/AssetLibraryView';
import GrowthOpportunityView from './components/GrowthOpportunityView';
import SettingsView from './components/SettingsView';
import IntegrationsView from './components/IntegrationsView';
import CampaignCreatorView from './components/CampaignCreatorView';
import WorkflowBuilderView from './components/WorkflowBuilderView';
import ChurnPredictionView from './components/ChurnPredictionView';
import SegmentationView from './components/SegmentationView';
import ExperimentTrackerView from './components/ExperimentTrackerView';
import CohortAnalysisView from './components/CohortAnalysisView';
import KpiBuilderView from './components/KpiBuilderView';
import AdCreativeStudioView from './components/AdCreativeStudioView';
import ForecastingView from './components/ForecastingView';
import MarketIntelligenceView from './components/MarketIntelligenceView';
import { mockCampaigns, mockAttributionData, mockAudienceData, mockOverlapData, mockIntegrations, mockUsers, mockChurnableUsers, mockExperiments, mockCohortData, mockSegments, mockWebhooks, mockForecastData, mockAnomalies, mockMarketTrends, mockCompetitorInfo } from './constants';
import { Campaign } from './types';


export type View = 'dashboard' | 'campaigns' | 'journey' | 'reports' | 'asset-library' | 'ai-analysis' | 'growth-opportunities' | 'audience-overlap' | 'budget-simulator' | 'ai-chat' | 'integrations' | 'settings' | 'campaign-creator' | 'workflow-builder' | 'churn-prediction' | 'segmentation' | 'experiment-tracker' | 'cohort-analysis' | 'kpi-builder' | 'ad-creative-studio' | 'forecasting' | 'market-intelligence';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView campaigns={campaigns} />;
      case 'campaigns':
        return <CampaignsView campaigns={campaigns} />;
      case 'journey':
        return <CustomerJourneyView data={mockAttributionData} />;
      case 'reports':
        return <ReportsView campaigns={campaigns} />;
      case 'asset-library':
        return <AssetLibraryView campaigns={campaigns} />;
      case 'ai-analysis':
        return <AIAnalysisView campaigns={campaigns} />;
      case 'growth-opportunities':
        return <GrowthOpportunityView campaigns={campaigns} />;
      case 'audience-overlap':
        return <AudienceOverlapView audiences={mockAudienceData} overlaps={mockOverlapData} />;
      case 'budget-simulator':
        return <BudgetSimulatorView campaigns={campaigns} />;
      case 'ai-chat':
        return <AIChatView campaigns={campaigns} />;
      case 'campaign-creator':
        return <CampaignCreatorView setCampaigns={setCampaigns} setActiveView={setActiveView} />;
       case 'workflow-builder':
        return <WorkflowBuilderView />;
      case 'integrations':
        return <IntegrationsView integrations={mockIntegrations} />;
      case 'settings':
        return <SettingsView users={mockUsers} webhooks={mockWebhooks} />;
      // Existing Feature Views
      case 'churn-prediction':
        return <ChurnPredictionView users={mockChurnableUsers} />;
      case 'segmentation':
        return <SegmentationView initialSegments={mockSegments} />;
      case 'experiment-tracker':
        return <ExperimentTrackerView initialExperiments={mockExperiments} />;
      case 'cohort-analysis':
        return <CohortAnalysisView cohortData={mockCohortData} />;
      case 'kpi-builder':
        return <KpiBuilderView />;
      // --- New Feature Views ---
      case 'ad-creative-studio':
        return <AdCreativeStudioView />;
      case 'forecasting':
        return <ForecastingView forecastData={mockForecastData} anomalies={mockAnomalies} />;
      case 'market-intelligence':
        return <MarketIntelligenceView initialTrends={mockMarketTrends} initialCompetitorInfo={mockCompetitorInfo} />;
      default:
        return <DashboardView campaigns={campaigns} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-blue-50 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
