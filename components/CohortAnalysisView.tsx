import React from 'react';
import { CohortData } from '../types';

const CohortAnalysisView: React.FC<{ cohortData: CohortData[] }> = ({ cohortData }) => {
  const maxWeeks = Math.max(...cohortData.map(c => c.retention.length));
  const weekHeaders = Array.from({ length: maxWeeks }, (_, i) => `W${i}`);

  const getCellColor = (percentage: number) => {
    if (percentage > 80) return 'bg-teal-600';
    if (percentage > 60) return 'bg-teal-500';
    if (percentage > 40) return 'bg-teal-400';
    if (percentage > 20) return 'bg-teal-300';
    if (percentage > 0) return 'bg-teal-200';
    return 'bg-slate-100';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Cohort Analysis</h1>
      <p className="text-slate-600 mb-8">Measure user retention and LTV progression by acquisition cohort.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/75 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Cohort</th>
              <th scope="col" className="px-6 py-3">Users</th>
              {weekHeaders.map(week => (
                <th key={week} scope="col" className="px-6 py-3 text-center">{week}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cohortData.map(cohort => (
              <tr key={cohort.cohort} className="bg-white">
                <td className="px-6 py-4 font-semibold text-slate-800">{cohort.cohort}</td>
                <td className="px-6 py-4 text-slate-600">{cohort.users.toLocaleString()}</td>
                {cohort.retention.map((percentage, index) => (
                  <td key={index} className="p-0">
                    <div className={`w-full h-full p-4 text-center text-white font-semibold ${getCellColor(percentage)}`}>
                      {percentage}%
                    </div>
                  </td>
                ))}
                {/* Fill remaining cells */}
                {Array.from({ length: maxWeeks - cohort.retention.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="p-4 bg-slate-50"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="mt-4 text-xs text-slate-500">
          * Retention heatmap shows the percentage of users from a cohort who were active in the weeks following their acquisition.
      </div>
    </div>
  );
};

export default CohortAnalysisView;
