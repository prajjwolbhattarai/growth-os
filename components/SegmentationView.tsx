import React, { useState } from 'react';
import { DynamicSegment, SegmentRule, SegmentMetric, SegmentOperator } from '../types';

const SegmentationView: React.FC<{initialSegments: DynamicSegment[]}> = ({ initialSegments }) => {
    const [segments, setSegments] = useState<DynamicSegment[]>(initialSegments);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Dynamic Segmentation</h1>
      <p className="text-slate-600 mb-8">Create and manage live audience segments based on user behavior and attributes.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Your Segments</h2>
            {segments.map(segment => (
                <div key={segment.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{segment.name}</h3>
                            <p className="text-sm text-slate-500">{segment.userCount.toLocaleString()} Users</p>
                        </div>
                        <div className="flex items-center gap-2">
                             {segment.syncedTo.map(platform => (
                                <span key={platform} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">Synced to {platform}</span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Rules:</p>
                        <div className="space-y-2">
                            {segment.rules.map((rule, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">{rule.metric}</span>
                                    <span className="font-mono">{rule.operator}</span>
                                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">{rule.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 sticky top-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Create New Segment</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Segment Name</label>
                        <input type="text" placeholder="e.g., At-Risk Whales" className="w-full p-2 border border-slate-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rules</label>
                        <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
                            {/* Rule Builder Placeholder */}
                            <RuleBuilderRow />
                            <RuleBuilderRow metric="lastSeenDays" operator=">" value="30" />
                             <button className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800">+ AND</button>
                        </div>
                    </div>
                    <button className="w-full bg-brand-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-blue-700 transition-colors">
                        Create Segment
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


const RuleBuilderRow: React.FC<{metric?: SegmentMetric, operator?: SegmentOperator, value?: string | number}> = ({metric = 'ltv', operator = '>', value = '1000'}) => {
    return (
        <div className="flex items-center gap-2">
            <select defaultValue={metric} className="p-2 border border-slate-300 rounded-lg text-sm w-1/3">
                <option value="ltv">LTV (€)</option>
                <option value="sessions">Sessions</option>
                <option value="lastSeenDays">Last Seen (Days)</option>
                <option value="plan">Plan</option>
            </select>
            <select defaultValue={operator} className="p-2 border border-slate-300 rounded-lg text-sm">
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="=">=</option>
                <option value="!=">!=</option>
            </select>
            <input type="text" defaultValue={value} className="p-2 border border-slate-300 rounded-lg text-sm w-1/3"/>
        </div>
    )
}


export default SegmentationView;
