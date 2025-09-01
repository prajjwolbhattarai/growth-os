
import React from 'react';
import { View } from '../App';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-brand-blue-100 text-brand-blue-700 font-semibold'
        : 'text-slate-600 hover:bg-brand-blue-100/50 hover:text-brand-blue-600'
    }`}
  >
    <span className="mr-3 h-6 w-6">{icon}</span>
    <span>{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navSections = [
    {
      title: 'Analytics',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'campaigns', label: 'Campaigns', icon: <CampaignsIcon /> },
        { id: 'forecasting', label: 'Forecasting', icon: <ForecastingIcon /> },
      ],
    },
     {
      title: 'Lifecycle',
      items: [
        { id: 'journey', label: 'Customer Journey', icon: <JourneyIcon /> },
        { id: 'churn-prediction', label: 'Churn Prediction', icon: <ChurnIcon /> },
        { id: 'segmentation', label: 'Dynamic Segments', icon: <SegmentationIcon /> },
      ],
    },
    {
      title: 'Creative',
      items: [
        { id: 'ad-creative-studio', label: 'Ad Creative Studio', icon: <AdStudioIcon /> },
        { id: 'asset-library', label: 'Asset Library', icon: <AssetLibraryIcon /> },
        { id: 'ai-analysis', label: 'AI Creative Analysis', icon: <AIIcon /> },
      ],
    },
     {
      title: 'Creation',
      items: [
        { id: 'campaign-creator', label: 'Campaign Creator', icon: <CreateIcon /> },
        { id: 'workflow-builder', label: 'Workflow Builder', icon: <WorkflowIcon /> },
      ],
    },
    {
      title: 'Growth',
      items: [
        { id: 'market-intelligence', label: 'Market Intelligence', icon: <MarketIntelIcon /> },
        { id: 'growth-opportunities', label: 'Opportunity Finder', icon: <GrowthIcon /> },
        { id: 'audience-overlap', label: 'Audience Overlap', icon: <AudienceIcon /> },
        { id: 'budget-simulator', label: 'Budget Simulator', icon: <SimulatorIcon /> },
        { id: 'experiment-tracker', label: 'Experiment Tracker', icon: <ExperimentIcon /> },
        { id: 'cohort-analysis', label: 'Cohort Analysis', icon: <CohortIcon /> },
      ],
    },
    {
      title: 'Data',
      items: [
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
        { id: 'kpi-builder', label: 'KPI Builder', icon: <KpiBuilderIcon /> },
      ],
    },
    {
      title: 'Pro Tools',
      items: [{ id: 'ai-chat', label: 'AI Chat Assistant', icon: <AIChatIcon /> }],
    },
     {
      title: 'Configuration',
      items: [
        { id: 'integrations', label: 'Integrations', icon: <IntegrationsIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
       ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/75 p-4 flex flex-col">
      <div className="flex items-center mb-8 px-2">
        <div className="w-10 h-10 bg-brand-blue-600 rounded-lg flex items-center justify-center mr-3">
          <UcihLogo />
        </div>
        <div className='flex items-center'>
            <h1 className="text-xl font-bold text-slate-800 mr-2">UCIH</h1>
            <span className="text-xs font-bold text-white bg-brand-blue-600 px-2 py-0.5 rounded-full">PRO</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navSections.map(section => (
          <div key={section.title} className="mb-4">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{section.title}</p>
            <ul>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeView === item.id}
                  onClick={() => setActiveView(item.id as View)}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto p-4 bg-green-100 rounded-lg border border-green-200 text-center">
        <div className="flex items-center justify-center text-green-800">
            <CheckBadgeIcon />
            <p className="text-sm font-semibold ml-2">Pro Plan Active</p>
        </div>
        <p className="text-xs text-green-700 mt-1">All features unlocked.</p>
      </div>
    </aside>
  );
};

// --- ICONS ---
const ForecastingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 17.25 8.955-8.955a1.125 1.125 0 0 1 1.591 0l3.033 3.033a1.125 1.125 0 0 0 1.591 0l3.033-3.033" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5" /></svg>;
const AdStudioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01M16.5 12h.01M7.5 12h.01" /></svg>;
const MarketIntelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c1.355 0 2.707-.156 4.022-.449M3.284 14.253a9.004 9.004 0 0 1 0-4.506M20.716 14.253a9.004 9.004 0 0 0 0-4.506M12 3a9.004 9.004 0 0 0-8.716 6.747M12 3a9.004 9.004 0 0 1 8.716 6.747M12 3c-1.355 0-2.707.156-4.022.449M4.022 19.551A9.004 9.004 0 0 1 12 15a9.004 9.004 0 0 1 7.978 4.551M4.022 4.449A9.004 9.004 0 0 0 12 9a9.004 9.004 0 0 0 7.978-4.551" /></svg>;
const ChurnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H21" /></svg>;
const SegmentationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>;
const ExperimentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.038-.502.097-.748.172M9.75 3.104c.251.038.502.097.748.172m0 0a2.25 2.25 0 0 0 4.5 0l-8.47-4.236a2.25 2.25 0 0 0-2.12 0l-8.47 4.236a2.25 2.25 0 0 0 4.5 0M9.75 8.818c1.295.648 2.844.648 4.14 0m-4.14 0v5.714a2.25 2.25 0 0 0 .659 1.591L14.25 14.5M14.25 14.5c-.251.038-.502.097-.748.172m.748-.172c.251.038.502.097.748.172m0 0a2.25 2.25 0 0 0 4.5 0l-8.47-4.236a2.25 2.25 0 0 0-2.12 0l-8.47 4.236a2.25 2.25 0 0 0 4.5 0" /></svg>;
const CohortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5-6H21m-21-6H21" /></svg>;
const KpiBuilderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM12 6.75h5.25v11.25H6.75V6.75H12Z" /></svg>;
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const WorkflowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;
const UcihLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>;
const CampaignsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.17 48.17 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>;
const JourneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 18.375c1.422-2.336 2.25-5.32 2.25-8.625A11.23 11.23 0 0 0 8.35 3.375m-3.9 15c-1.422-2.336-2.25-5.32-2.25-8.625A11.23 11.23 0 0 1 6.15 3.375m10.2 15c1.422-2.336 2.25-5.32 2.25-8.625a11.23 11.23 0 0 0-1.1-6.375m3.9 15c1.422-2.336 2.25-5.32 2.25-8.625a11.23 11.23 0 0 0-1.1-6.375" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>;
const AIChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ReportsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>;
const AudienceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.289 2.72a3 3 0 0 1-4.682-2.72m-3.056 3.228a9.094 9.094 0 0 1 3.741-.479m10.5 0a9.11 9.11 0 0 1-3.228 2.54M6.74 18.72v-7.218a2.25 2.25 0 0 1 .58-1.589l5.424-6.326a2.25 2.25 0 0 1 3.42 0l5.424 6.326a2.25 2.25 0 0 1 .58 1.589v7.218M4.5 18.72a9.094 9.094 0 0 0-3.741-.479 3 3 0 0 0 4.682-2.72m7.289 2.72a3 3 0 0 1 4.682-2.72m3.056 3.228a9.094 9.094 0 0 1-3.741-.479M4.5 18.72v-7.218a2.25 2.25 0 0 1 .58-1.589l5.424-6.326a2.25 2.25 0 0 1 3.42 0l5.424 6.326a2.25 2.25 0 0 1 .58 1.589v7.218" /></svg>;
const SimulatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const AssetLibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>;
const GrowthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28L21 21M12 3v18m9-9H3" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227a48.11 48.11 0 0 1 5.105 0c.55.22 1.02.685 1.11 1.227.09.542.023 1.11-.214 1.623l-3.32 6.845a48.51 48.51 0 0 1-5.105 0l-3.32-6.845a1.8 1.8 0 0 1-.214-1.623Zm-1.84 8.016a5.25 5.25 0 0 1 9.998 0L15.42 21a2.25 2.25 0 0 1-2.033 1.5H10.613a2.25 2.25 0 0 1-2.033-1.5l-3.08-9.044Z" /></svg>;
const IntegrationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25a.75.75 0 0 1-.75-.75V10.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v9.75a.75.75 0 0 1-.75.75Zm4.5-15a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm-15 0a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75v-3Z" /></svg>;

export default Sidebar;
