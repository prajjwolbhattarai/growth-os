import React, { useState } from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { AttributionModel, FunnelStage } from '../types';
import Card from './ui/Card';

interface CustomerJourneyViewProps {
  data: Record<AttributionModel, FunnelStage[]>;
}

const CustomerJourneyView: React.FC<CustomerJourneyViewProps> = ({ data }) => {
  const [model, setModel] = useState<AttributionModel>(AttributionModel.LastTouch);
  const journeyData = data[model];
    
  const conversionRates = journeyData.slice(0, -1).map((stage, index) => {
    const nextStage = journeyData[index + 1];
    const rate = (nextStage.value / stage.value) * 100;
    return {
      from: stage.name,
      to: nextStage.name,
      rate: rate.toFixed(2)
    };
  });
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-slate-900">Customer Journey Funnel</h1>
        <div>
            <label htmlFor="attribution-model" className="block text-sm font-medium text-slate-700 mb-1">Attribution Model</label>
            <select 
                id="attribution-model"
                value={model} 
                onChange={(e) => setModel(e.target.value as AttributionModel)}
                className="w-full max-w-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
                {Object.values(AttributionModel).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
        </div>
      </div>
      <p className="text-slate-600 mb-8">Visualize the path from first ad impression to final conversion based on different models.</p>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Marketing & Sales Funnel ({model})</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <FunnelChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
              />
              <Funnel
                dataKey="value"
                data={journeyData}
                isAnimationActive
              >
                <LabelList 
                    position="right" 
                    fill="#334155" 
                    stroke="none" 
                    dataKey="name"
                    style={{'fontWeight': 'bold'}}
                 />
                 <LabelList 
                    position="center" 
                    fill="#fff" 
                    stroke="none" 
                    dataKey="value" 
                    formatter={(value: number) => value.toLocaleString('en-US')}
                    style={{'fontSize': '1.125rem', 'fontWeight': '600'}}
                 />

              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Stage-to-Stage Conversion Rates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversionRates.map(cr => (
                <Card 
                    key={`${cr.from}-${cr.to}`}
                    title={`${cr.from} → ${cr.to}`}
                    value={`${cr.rate}%`}
                    icon={<ConversionIcon />}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

const ConversionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);


export default CustomerJourneyView;
