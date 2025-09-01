import React, { useState } from 'react';
import { Experiment } from '../types';

const ExperimentTrackerView: React.FC<{ initialExperiments: Experiment[] }> = ({ initialExperiments }) => {
  const [experiments, setExperiments] = useState<Experiment[]>(initialExperiments);

  const getStatusChip = (status: Experiment['status']) => {
    switch (status) {
      case 'Running': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  const getWinnerChip = (winner?: 'Control' | 'Variant A') => {
      if (!winner) return null;
      return winner === 'Variant A' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800';
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Growth Experiment Tracker</h1>
            <p className="text-slate-600">Log all A/B tests and experiments to measure impact on key KPIs.</p>
        </div>
        <button className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700 transition-colors flex items-center gap-2">
            <PlusIcon /> Log New Experiment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/75 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Experiment</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Primary KPI</th>
              <th scope="col" className="px-6 py-3">Timeline</th>
              <th scope="col" className="px-6 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map(exp => (
              <tr key={exp.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{exp.name}</p>
                  <p className="text-xs text-slate-500 max-w-sm truncate">{exp.hypothesis}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChip(exp.status)}`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{exp.primaryKpi}</td>
                <td className="px-6 py-4 text-slate-600">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</td>
                <td className="px-6 py-4">
                    {exp.status === 'Completed' ? (
                        <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${getWinnerChip(exp.winner)}`}>{exp.winner} Won</span>
                            <p className="text-xs text-slate-500">{exp.resultSummary}</p>
                        </div>
                    ) : (
                        <span className="text-slate-400 italic">In progress...</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>;

export default ExperimentTrackerView;
