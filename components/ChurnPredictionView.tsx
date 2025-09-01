import React, { useState } from 'react';
import { ChurnableUser, ChurnPredictionResult } from '../types';
import { predictChurn } from '../services/geminiService';
import Card from './ui/Card';

const ChurnPredictionView: React.FC<{ users: ChurnableUser[] }> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<ChurnableUser | null>(users[0] || null);
  const [prediction, setPrediction] = useState<ChurnPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectUser = (user: ChurnableUser) => {
    setSelectedUser(user);
    setPrediction(null);
    setError(null);
  };

  const handlePredictChurn = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictChurn(selectedUser);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: ChurnPredictionResult['riskLevel']) => {
    switch (risk) {
      case 'Very High': return 'bg-red-500 text-white';
      case 'High': return 'bg-red-200 text-red-800';
      case 'Medium': return 'bg-amber-200 text-amber-800';
      case 'Low': return 'bg-green-200 text-green-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Churn Prediction Engine</h1>
      <p className="text-slate-600 mb-8">Use AI to identify customers at risk of churning and get actionable retention advice.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Select a User to Analyze</h2>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {users.map(user => (
              <div key={user.id} onClick={() => handleSelectUser(user)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedUser?.id === user.id ? 'border-brand-blue-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-brand-blue-400'}`}>
                <div className="flex items-center">
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
              <h2 className="text-xl font-bold text-slate-800 mb-4">User Snapshot & Prediction</h2>
              <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center mb-4">
                  <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-slate-600">{selectedUser.plan} Plan</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-500">LTV</p>
                    <p className="text-lg font-bold">€{selectedUser.ltv.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Sessions</p>
                    <p className="text-lg font-bold">{selectedUser.sessions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Last Seen</p>
                    <p className="text-lg font-bold">{selectedUser.lastSeen}</p>
                  </div>
                </div>
              </div>

              <button onClick={handlePredictChurn} disabled={isLoading} className="w-full bg-brand-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading ? <><SpinnerIcon /> Predicting Churn...</> : '🤖 Predict Churn Risk'}
              </button>

              {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">{error}</div>}

              {prediction && !isLoading && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: getRiskColor(prediction.riskLevel).split(' ')[0]}}>
                      <p className={`text-sm font-semibold uppercase tracking-wider ${getRiskColor(prediction.riskLevel).split(' ')[1]}`}>Risk Level</p>
                      <p className={`text-3xl font-bold ${getRiskColor(prediction.riskLevel).split(' ')[1]}`}>{prediction.riskLevel}</p>
                      <p className={`text-sm ${getRiskColor(prediction.riskLevel).split(' ')[1]}`}>{(prediction.churnProbability * 100).toFixed(1)}% Churn Probability</p>
                  </div>
                  <Card title="Key Churn Factors" icon={<FactorsIcon />}>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {prediction.keyFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                    </ul>
                  </Card>
                  <Card title="Suggested Retention Action" icon={<ActionIcon />}>
                    <p className="text-slate-700">{prediction.suggestedAction}</p>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
              <p className="text-slate-500">Select a user to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpinnerIcon = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const FactorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ActionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 15.75l-2.43-2.43M11.25 15.75L13.5 13.5M11.25 15.75v-4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default ChurnPredictionView;
