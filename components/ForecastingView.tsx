
import React, { useState, useMemo } from 'react';
import { ForecastDataPoint, Anomaly } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastingViewProps {
  forecastData: Record<'spend' | 'roas', ForecastDataPoint[]>;
  anomalies: Anomaly[];
}

const ForecastingView: React.FC<ForecastingViewProps> = ({ forecastData, anomalies }) => {
  const [kpi, setKpi] = useState<'spend' | 'roas'>('spend');

  const chartData = forecastData[kpi];
  const historicalData = chartData.filter(d => d.type === 'historical');
  const lastHistoricalValue = historicalData[historicalData.length - 1];
  const forecastWithInitial = [lastHistoricalValue, ...chartData.filter(d => d.type === 'forecasted')];
  
  const getSeverityChip = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Predictive Forecasting & Anomalies</h1>
      <p className="text-slate-600 mb-8">Forecast future performance and get alerted to unusual activity in your campaigns.</p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">14-Day KPI Forecast</h2>
            <select
              value={kpi}
              onChange={e => setKpi(e.target.value as 'spend' | 'roas')}
              className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
            >
              <option value="spend">Spend (€)</option>
              <option value="roas">ROAS (x)</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fill: '#64748b' }} fontSize={12} />
                <YAxis
                    tick={{ fill: '#64748b' }}
                    tickFormatter={value => (kpi === 'spend' ? `€${value / 1000}k` : `${value.toFixed(1)}x`)}
                    domain={['dataMin', 'auto']}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                    formatter={(value) => [kpi === 'spend' ? `€${(value as number).toLocaleString()}` : `${value}x`, kpi.toUpperCase()]}
                />
                <Legend />
                <Line type="monotone" dataKey="value" name="Historical" stroke="#0ea5e9" strokeWidth={2} data={historicalData} dot={false} />
                <Line type="monotone" dataKey="value" name="Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" data={forecastWithInitial} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Detected Anomalies</h2>
          <div className="space-y-4 overflow-y-auto">
            {anomalies.map(anomaly => (
              <div key={anomaly.id} className={`p-4 border-l-4 rounded-r-lg ${getSeverityChip(anomaly.severity)}`}>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-sm">{anomaly.campaignName}</p>
                    <span className="text-xs font-semibold">{anomaly.severity}</span>
                </div>
                <p className="text-sm mt-1">{anomaly.description}</p>
                <p className="text-xs text-slate-500 mt-2">{anomaly.date} - {anomaly.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingView;
