import React from 'react';

const availableMetrics = [
    { name: 'Spend', id: 'spend' },
    { name: 'Impressions', id: 'impressions' },
    { name: 'Clicks', id: 'clicks' },
    { name: 'Conversions', id: 'conversions' },
    { name: 'LTV', id: 'ltv' },
    { name: 'Budget', id: 'budget' },
];

const KpiBuilderView: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Custom KPI Builder</h1>
      <p className="text-slate-600 mb-8">Define your own metrics using formulas to track what truly matters to your business.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                <h2 className="text-xl font-bold text-slate-800 mb-4">New KPI Formula</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">KPI Name</label>
                    <input type="text" placeholder="e.g., Blended CAC" className="w-full max-w-sm p-2 border border-slate-300 rounded-lg"/>
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Formula</label>
                    <div className="font-mono p-4 bg-slate-800 text-green-300 rounded-lg min-h-[100px]">
                        (SUM(spend) / SUM(conversions))
                    </div>
                </div>
                 <div className="mt-6 flex justify-end">
                    <button className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700 transition-colors">
                        Save KPI
                    </button>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Available Metrics</h2>
                <p className="text-sm text-slate-500 mb-4">Click to add to formula.</p>
                <div className="flex flex-wrap gap-2">
                    {availableMetrics.map(metric => (
                        <button key={metric.id} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-sm px-3 py-1 rounded-md">
                            {metric.name}
                        </button>
                    ))}
                </div>
                 <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">Functions</h2>
                 <div className="flex flex-wrap gap-2">
                     <button className="bg-sky-100 hover:bg-sky-200 text-sky-700 font-mono text-sm px-3 py-1 rounded-md">SUM()</button>
                     <button className="bg-sky-100 hover:bg-sky-200 text-sky-700 font-mono text-sm px-3 py-1 rounded-md">AVG()</button>
                     <button className="bg-sky-100 hover:bg-sky-200 text-sky-700 font-mono text-sm px-3 py-1 rounded-md">COUNT()</button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default KpiBuilderView;
