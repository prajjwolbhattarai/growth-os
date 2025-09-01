

import React, { useState } from 'react';
import { Integration, IntegrationCategory } from '../types';

interface IntegrationsViewProps {
  integrations: Integration[];
}

const IntegrationCard: React.FC<{ integration: Integration, onToggleConnect: (name: string) => void }> = ({ integration, onToggleConnect }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/75 flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-10 h-10 mr-4 flex items-center justify-center">
        <integration.logo className="h-8 w-8" />
      </div>
      <p className="font-semibold text-slate-800">{integration.name}</p>
    </div>
    {integration.isConnected ? (
      <button onClick={() => onToggleConnect(integration.name)} className="text-sm font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-full transition-colors">
        Disconnect
      </button>
    ) : (
      <button onClick={() => onToggleConnect(integration.name)} className="text-sm font-semibold text-brand-blue-600 bg-brand-blue-100 hover:bg-brand-blue-200 px-3 py-1.5 rounded-full transition-colors">
        Connect
      </button>
    )}
  </div>
);

const IntegrationsView: React.FC<IntegrationsViewProps> = ({ integrations: initialIntegrations }) => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  
  const handleToggleConnect = (name: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.name === name ? { ...int, isConnected: !int.isConnected } : int
      )
    );
  };

  const categories: IntegrationCategory[] = [
    'Advertising', 'Analytics', 'CRM', 'Email/SMS', 'E-commerce', 'Automation'
  ];

  const groupedIntegrations = integrations.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<IntegrationCategory, Integration[]>);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
      <p className="text-slate-600 mb-8">Connect your favorite marketing and data tools to unify your stack.</p>
      
      <div className="space-y-10">
        {categories.map(category => (
          groupedIntegrations[category] && (
            <div key={category}>
              <h2 className="text-xl font-bold text-slate-800 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedIntegrations[category].map(integration => (
                  <IntegrationCard key={integration.name} integration={integration} onToggleConnect={handleToggleConnect} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default IntegrationsView;