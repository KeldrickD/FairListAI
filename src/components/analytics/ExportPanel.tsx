import React from 'react';

interface ExportPanelProps {
  onExport: (type: 'performance' | 'leads' | 'abtests') => Promise<void>;
  isExporting: boolean;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport,
  isExporting
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Export Analytics Data</h2>
        <p className="text-gray-500 mb-6">
          Export your analytics data in CSV format for further analysis in spreadsheet applications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Performance Data</h3>
          <p className="text-sm text-gray-500 mb-4">
            Export daily views, leads, shares, and comments data for your listing.
          </p>
          <button 
            onClick={() => onExport('performance')}
            disabled={isExporting}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isExporting ? 'Exporting...' : 'Export Performance Data'}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Lead Data</h3>
          <p className="text-sm text-gray-500 mb-4">
            Export information about leads generated from your listing, including contact details and status.
          </p>
          <button 
            onClick={() => onExport('leads')}
            disabled={isExporting}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isExporting ? 'Exporting...' : 'Export Lead Data'}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">A/B Testing Data</h3>
          <p className="text-sm text-gray-500 mb-4">
            Export results from your A/B tests, including variant performance and conversion rates.
          </p>
          <button 
            onClick={() => onExport('abtests')}
            disabled={isExporting}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isExporting ? 'Exporting...' : 'Export A/B Test Data'}
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Export Format Information</p>
            <p className="mt-1 text-sm">
              All data is exported in CSV format, which can be opened in Excel, Google Sheets, or any spreadsheet application.
              The export includes all data within your selected date range.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 