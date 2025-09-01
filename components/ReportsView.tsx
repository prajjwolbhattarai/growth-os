import React, { useState, useMemo } from 'react';
import { Campaign, Platform } from '../types';

interface ReportsViewProps {
  campaigns: Campaign[];
}

type CheckboxState = {
  [key in Platform]: boolean;
};

const ReportsView: React.FC<ReportsViewProps> = ({ campaigns }) => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const initialPlatformState = Object.values(Platform).reduce((acc, p) => ({...acc, [p]: true}), {} as CheckboxState);
  const [selectedPlatforms, setSelectedPlatforms] = useState<CheckboxState>(initialPlatformState);
  const [report, setReport] = useState<Campaign[] | null>(null);

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const generateReport = () => {
    const activePlatforms = Object.entries(selectedPlatforms)
        .filter(([, isSelected]) => isSelected)
        .map(([platform]) => platform);
    
    const filteredData = campaigns.filter(c => activePlatforms.includes(c.platform));
    setReport(filteredData);
  };
  
  const handleDownloadCSV = () => {
    if (!report) return;

    const headers = ['ID', 'Name', 'Platform', 'Status', 'Spend', 'Budget', 'Start Date', 'End Date', 'Impressions', 'Clicks', 'ROAS'];
    const csvRows = [headers.join(',')];

    for (const campaign of report) {
        const values = [
            campaign.id,
            `"${campaign.name.replace(/"/g, '""')}"`, // Handle quotes in names
            campaign.platform,
            campaign.status,
            campaign.spend,
            campaign.budget,
            campaign.startDate,
            campaign.endDate,
            campaign.impressions,
            campaign.clicks,
            campaign.roas
        ].join(',');
        csvRows.push(values);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ucih_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSpend = useMemo(() => 
    report?.reduce((sum, c) => sum + c.spend, 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
  , [report]);
  
  const totalClicks = useMemo(() => 
    report?.reduce((sum, c) => sum + c.clicks, 0).toLocaleString('de-DE')
  , [report]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Advanced Reporting</h1>
      <p className="text-slate-600 mb-8">Generate and export custom cross-platform performance reports.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Configure Report</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500">
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_90_days">Last 90 Days</option>
                <option value="all_time">All Time</option>
              </select>
            </div>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Platforms</label>
                <div className="space-y-2">
                    {Object.values(Platform).map(platform => (
                        <div key={platform} className="flex items-center">
                            <input
                                id={platform}
                                type="checkbox"
                                checked={selectedPlatforms[platform]}
                                onChange={() => handlePlatformChange(platform)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500"
                            />
                            <label htmlFor={platform} className="ml-2 block text-sm text-slate-900">{platform}</label>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={generateReport} disabled={campaigns.length === 0} className="w-full bg-brand-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
              Generate Report
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 min-h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Report Preview</h2>
            {report ? (
              <div>
                <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                    <div>
                        <p className="text-sm text-slate-500">Report for: <span className="font-semibold text-slate-700">{dateRange.replace(/_/g, ' ')}</span></p>
                        <p className="text-sm text-slate-500">Totals: <span className="font-semibold text-slate-700">{totalSpend} Spend</span>, <span className="font-semibold text-slate-700">{totalClicks} Clicks</span></p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleDownloadCSV} className="bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <DownloadIcon /> Download CSV
                        </button>
                        <button className="bg-slate-700 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center">
                            <DownloadIcon /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                        <th scope="col" className="px-4 py-2">Campaign</th>
                        <th scope="col" className="px-4 py-2">Platform</th>
                        <th scope="col" className="px-4 py-2 text-right">Spend</th>
                        <th scope="col" className="px-4 py-2 text-right">Clicks</th>
                        <th scope="col" className="px-4 py-2 text-right">ROAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map(c => (
                        <tr key={c.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium text-slate-900">{c.name}</td>
                            <td className="px-4 py-2">{c.platform}</td>
                            <td className="px-4 py-2 text-right font-mono">{c.spend.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                            <td className="px-4 py-2 text-right font-mono">{c.clicks.toLocaleString('de-DE')}</td>
                            <td className="px-4 py-2 text-right font-mono">{c.roas.toFixed(2)}x</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-slate-500">
                <p>Configure your report options and click "Generate Report" to see a preview.</p>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
    </svg>
);


export default ReportsView;