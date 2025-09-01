import React, { useState, useMemo } from 'react';
import { Campaign, Platform } from '../types';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardInsights } from '../services/geminiService';
import Modal from './ui/Modal';

type WidgetType = 'kpi' | 'chart' | 'table' | 'insights';

type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  w: number; // width in grid columns
  h: number; // height in grid rows
  kpi?: 'spend' | 'impressions' | 'clicks' | 'roas';
};

const initialWidgets: Widget[] = [
    { id: 'kpi-spend', type: 'kpi', title: 'Total Spend', w: 1, h: 1, kpi: 'spend' },
    { id: 'kpi-impressions', type: 'kpi', title: 'Impressions', w: 1, h: 1, kpi: 'impressions' },
    { id: 'kpi-clicks', type: 'kpi', title: 'Total Clicks', w: 1, h: 1, kpi: 'clicks' },
    { id: 'kpi-roas', type: 'kpi', title: 'Average ROAS', w: 1, h: 1, kpi: 'roas' },
    { id: 'chart-performance', type: 'chart', title: 'Performance by Platform', w: 4, h: 2 },
    { id: 'table-top-campaigns', type: 'table', title: 'Top Campaigns by ROAS', w: 2, h: 2 },
    { id: 'insights-ai', type: 'insights', title: 'AI-Powered Insights', w: 2, h: 2 },
];

const DashboardView: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addWidget = (type: WidgetType, options?: Partial<Widget>) => {
    const newWidget: Widget = {
        id: `${type}-${Date.now()}`,
        type: type,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        w: type === 'chart' ? 4 : 2,
        h: type === 'chart' || type === 'table' || type === 'insights' ? 2 : 1,
        ...options,
    };
    if (type === 'kpi') {
        newWidget.w = 1;
        newWidget.h = 1;
        newWidget.title = options?.title || 'New KPI';
    }
    setWidgets(prev => [...prev, newWidget]);
    setIsModalOpen(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-600">A high-level view of your cross-platform marketing performance.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700 transition-colors flex items-center gap-2">
            <PlusIcon /> Add Widget
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[140px]">
        {widgets.map(widget => (
          <WidgetWrapper key={widget.id} widget={widget} onRemove={removeWidget}>
            <WidgetRenderer widget={widget} campaigns={campaigns} />
          </WidgetWrapper>
        ))}
      </div>
      
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Widget">
          <div className="p-2">
            <p className="text-slate-600 mb-4">Select a widget type to add to your dashboard.</p>
            <div className="space-y-3">
                <button onClick={() => addWidget('kpi', {title: 'New KPI', kpi: 'spend'})} className="w-full text-left p-3 border rounded-lg hover:bg-slate-50">KPI Card</button>
                <button onClick={() => addWidget('chart')} className="w-full text-left p-3 border rounded-lg hover:bg-slate-50">Chart</button>
                <button onClick={() => addWidget('table')} className="w-full text-left p-3 border rounded-lg hover:bg-slate-50">Table</button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

const WidgetWrapper: React.FC<{ widget: Widget; children: React.ReactNode; onRemove: (id: string) => void }> = ({ widget, children, onRemove }) => (
    <div 
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 flex flex-col"
        style={{ gridColumn: `span ${widget.w}`, gridRow: `span ${widget.h}`}}
    >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">{widget.title}</h2>
            <button onClick={() => onRemove(widget.id)} className="text-slate-400 hover:text-slate-600">
                <CloseIcon />
            </button>
        </div>
        <div className="flex-1 overflow-hidden">
            {children}
        </div>
    </div>
);

const WidgetRenderer: React.FC<{ widget: Widget; campaigns: Campaign[] }> = ({ widget, campaigns }) => {
    switch (widget.type) {
        case 'kpi': return <KpiWidget campaigns={campaigns} kpi={widget.kpi} />;
        case 'chart': return <ChartWidget campaigns={campaigns} />;
        case 'table': return <TableWidget campaigns={campaigns} />;
        case 'insights': return <InsightsWidget campaigns={campaigns} />;
        default: return <div>Unknown widget type</div>;
    }
};

interface IKpiData {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ReactNode;
}

const KpiWidget: React.FC<{ campaigns: Campaign[], kpi?: 'spend' | 'impressions' | 'clicks' | 'roas' }> = ({ campaigns, kpi }) => {
    const kpiData: IKpiData = useMemo(() => {
        if (campaigns.length === 0) return { value: '€0.00', change: '+0%', changeType: 'positive', icon: <SpendIcon /> };
        
        switch (kpi) {
            case 'spend': {
              const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
              return { value: totalSpend.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }), change: '+5.2%', changeType: 'negative', icon: <SpendIcon /> };
            }
            case 'impressions': {
              const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
              return { value: totalImpressions.toLocaleString(), change: '+12.1%', changeType: 'positive', icon: <ImpressionsIcon /> };
            }
            case 'clicks': {
              const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
              return { value: totalClicks.toLocaleString(), change: '+8.7%', changeType: 'positive', icon: <ClicksIcon /> };
            }
            case 'roas': {
               const avgRoas = campaigns.length > 0 ? campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length : 0;
               return { value: `${avgRoas.toFixed(2)}x`, change: '-0.3x', changeType: 'negative', icon: <RoasIcon /> };
            }
            default: return { value: 'N/A', change: '', changeType: 'positive', icon: <RoasIcon /> };
        }
    }, [campaigns, kpi]);

    // KpiWidget now renders its own content, since WidgetWrapper handles the card-like container
    return (
        <div className="h-full flex flex-col justify-center">
            <div className="flex items-center">
                 <div className="w-10 h-10 rounded-full bg-brand-blue-100 flex items-center justify-center mr-4">
                    {kpiData.icon}
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{kpiData.value}</p>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ml-auto ${kpiData.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {kpiData.change}
                </div>
            </div>
        </div>
    );
};

const ChartWidget: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
    const chartData = useMemo(() => {
        return Object.values(Platform).map(platform => {
            const platformCampaigns = campaigns.filter(c => c.platform === platform);
            if (platformCampaigns.length === 0) return null;
            const spend = platformCampaigns.reduce((sum, c) => sum + c.spend, 0);
            const roas = platformCampaigns.length > 0 ? platformCampaigns.reduce((sum, c) => sum + c.roas, 0) / platformCampaigns.length : 0;
            return { name: platform.replace(' Ads', ''), spend, roas: parseFloat(roas.toFixed(2)) };
        }).filter(Boolean);
    }, [campaigns]);

    return (
        <div className="w-full h-full">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} fontSize={12} />
                    <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" tick={{ fill: '#64748b' }} tickFormatter={(value) => `€${value/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#22c55e" tick={{ fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} formatter={(value, name) => name === 'spend' ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value as number) : value}/>
                    <Legend />
                    <Bar yAxisId="left" dataKey="spend" fill="#0ea5e9" name="Spend (€)" />
                    <Bar yAxisId="right" dataKey="roas" fill="#22c55e" name="ROAS (x)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const TableWidget: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
    const topCampaigns = useMemo(() => {
        return [...campaigns].sort((a,b) => b.roas - a.roas).slice(0, 5);
    }, [campaigns]);
    return (
        <div className="overflow-y-auto h-full">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-2">Campaign</th>
                        <th className="px-4 py-2 text-right">ROAS</th>
                    </tr>
                </thead>
                <tbody>
                    {topCampaigns.map(c => (
                        <tr key={c.id} className="border-b">
                            <td className="px-4 py-2 font-medium text-slate-800">{c.name}</td>
                            <td className="px-4 py-2 text-right font-mono text-green-600">{c.roas.toFixed(2)}x</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const InsightsWidget: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const [insights, setInsights] = useState<{insight: string, priority: 'High' | 'Medium' | 'Low'}[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const result = await getDashboardInsights(campaigns);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
    return (
        <div className="flex flex-col h-full">
            <button onClick={handleGetInsights} disabled={isLoading || campaigns.length === 0} className="w-full bg-brand-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mb-4">
              {isLoading ? <><SpinnerIcon />Analyzing...</> : '✨ Generate Insights'}
            </button>
            <div className="flex-1 overflow-y-auto">
              {error && <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{error}</div>}
              {insights && (
                <ul className="space-y-3">
                  {insights.map((insight, i) => {
                     const priorityStyles = {
                        High: 'bg-red-100 text-red-800 border-red-200',
                        Medium: 'bg-amber-100 text-amber-800 border-amber-200',
                        Low: 'bg-sky-100 text-sky-800 border-sky-200',
                    };
                    return (
                        <li key={i} className={`p-3 border rounded-lg ${priorityStyles[insight.priority]}`}>
                            <p className="font-semibold text-sm mb-1 flex items-center">{insight.priority} Priority</p>
                            <p className="text-sm">{insight.insight}</p>
                        </li>
                    );
                  })}
                </ul>
              )}
              {!insights && !isLoading && !error && (
                  <div className="flex items-center justify-center h-full text-center text-slate-400">
                      <p>Click to generate AI analysis.</p>
                  </div>
              )}
            </div>
        </div>
    );
}

// --- Icons ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
const SpinnerIcon = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const SpendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const ImpressionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ClicksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51-2.222m2.51 2.222l2.222-2.51m-2.222 2.51l2.222 2.51M3 10.5a8.458 8.458 0 015.042-7.672L3 3m0 7.5l-2.222-2.51m2.222 2.51L3 13.172m0-2.672l2.51 2.222m-2.51-2.222L.778 7.988m12.758 1.414l-2.222 2.51m2.222-2.51l2.51-2.222M13.5 10.5h.008v.008h-.008v-.008z" /></svg>;
const RoasIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

export default DashboardView;
