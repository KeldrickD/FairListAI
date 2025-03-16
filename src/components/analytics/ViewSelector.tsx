import React from 'react';
import { DashboardViewType } from '@/hooks/useDashboardView';

interface ViewSelectorProps {
  viewType: DashboardViewType;
  setViewType: (viewType: DashboardViewType) => void;
  availableViewTypes: DashboardViewType[];
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewType,
  setViewType,
  availableViewTypes
}) => {
  // View type descriptions
  const viewDescriptions: Record<DashboardViewType, string> = {
    standard: 'Basic analytics with performance metrics and engagement data',
    agent: 'Agent view with lead management and A/B testing features',
    owner: 'Property owner view with full analytics and data editing capabilities',
    admin: 'Administrator view with complete access to all features and settings'
  };
  
  // View type icons
  const viewIcons: Record<DashboardViewType, React.ReactNode> = {
    standard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    agent: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    owner: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    admin: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Dashboard View</h2>
      <p className="text-gray-500 mb-6">
        Select a dashboard view based on your role or the information you want to see.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {availableViewTypes.map((type) => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={`p-4 rounded-lg border ${
              viewType === type
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            } transition-colors duration-200 text-left`}
          >
            <div className="flex items-center mb-2">
              <div className={`mr-2 ${viewType === type ? 'text-blue-500' : 'text-gray-500'}`}>
                {viewIcons[type]}
              </div>
              <h3 className="font-medium capitalize">{type} View</h3>
            </div>
            <p className="text-sm text-gray-500">{viewDescriptions[type]}</p>
          </button>
        ))}
      </div>
    </div>
  );
}; 