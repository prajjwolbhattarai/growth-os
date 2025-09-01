import React from 'react';

const WorkflowBuilderView: React.FC = () => {
  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Workflow Builder</h1>
      <p className="text-slate-600 mb-8">Automate your marketing tasks with a visual workflow editor.</p>
      
      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Components Panel */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-200/75 p-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Components</h2>
          <div className="space-y-4">
            <DraggableComponent title="Trigger: New Lead" description="Starts when a new lead is added." />
            <DraggableComponent title="Action: Send Email" description="Sends an email via Customer.io." />
            <DraggableComponent title="Action: Add to Sheet" description="Adds a row to Google Sheets." />
            <DraggableComponent title="Condition: If/Else" description="Branch based on lead score." />
            <DraggableComponent title="Delay" description="Wait for a specified time." />
          </div>
        </div>

        {/* Canvas Panel */}
        <div className="col-span-9 bg-slate-100 rounded-xl shadow-inner border border-slate-200/75 relative overflow-hidden">
          {/* Background Grid */}
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
                <p className="text-lg font-semibold">Drag components here to build your workflow</p>
                <p className="text-sm">This is a visual placeholder for the workflow canvas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DraggableComponent: React.FC<{title: string, description: string}> = ({title, description}) => (
    <div className="p-3 border border-slate-300 bg-white rounded-lg cursor-grab active:cursor-grabbing shadow-sm">
        <p className="font-bold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);

export default WorkflowBuilderView;
