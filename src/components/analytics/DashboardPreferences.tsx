import React, { useState } from 'react';
import { AnalyticsPreferences, DateRange } from '@/lib/types/analytics';
import { format } from 'date-fns';

interface DashboardPreferencesProps {
  preferences: AnalyticsPreferences | null;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onSave: (prefs: Partial<AnalyticsPreferences>) => Promise<boolean>;
}

export const DashboardPreferences: React.FC<DashboardPreferencesProps> = ({
  preferences,
  dateRange,
  onDateRangeChange,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [preferredChartType, setPreferredChartType] = useState<'line' | 'bar' | 'area'>(
    preferences?.preferredChartType || 'line'
  );
  const [emailFrequency, setEmailFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'never'>(
    preferences?.emailReportFrequency || 'weekly'
  );
  const [favoriteMetrics, setFavoriteMetrics] = useState<string[]>(
    preferences?.favoriteMetrics || ['views', 'leads', 'conversionRate']
  );
  
  // Handle checkbox change for favorite metrics
  const handleMetricChange = (metric: string) => {
    if (favoriteMetrics.includes(metric)) {
      setFavoriteMetrics(favoriteMetrics.filter(m => m !== metric));
    } else {
      setFavoriteMetrics([...favoriteMetrics, metric]);
    }
  };
  
  // Handle save preferences
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await onSave({
        preferredChartType,
        emailReportFrequency: emailFrequency,
        favoriteMetrics,
        defaultDateRange: dateRange
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Dashboard Preferences</h2>
        <p className="text-gray-500 mb-6">
          Customize your analytics dashboard experience. These settings will be saved for your next visit.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Default Date Range</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">From:</span>
              <span className="font-medium">{format(dateRange.from, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">To:</span>
              <span className="font-medium">{format(dateRange.to, 'MMMM d, yyyy')}</span>
            </div>
            <div className="mt-3">
              <button 
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  // This would open a date picker in a real implementation
                  onDateRangeChange({
                    from: new Date(new Date().setDate(new Date().getDate() - 30)),
                    to: new Date()
                  });
                }}
              >
                Change Date Range
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Preferred Chart Type</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="chartType" 
                value="line" 
                checked={preferredChartType === 'line'} 
                onChange={() => setPreferredChartType('line')}
                className="mr-2"
              />
              Line Chart
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="chartType" 
                value="bar" 
                checked={preferredChartType === 'bar'} 
                onChange={() => setPreferredChartType('bar')}
                className="mr-2"
              />
              Bar Chart
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="chartType" 
                value="area" 
                checked={preferredChartType === 'area'} 
                onChange={() => setPreferredChartType('area')}
                className="mr-2"
              />
              Area Chart
            </label>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Favorite Metrics</h3>
          <div className="space-y-2">
            {['views', 'leads', 'conversionRate', 'bounceRate', 'averageTimeOnPage'].map(metric => (
              <label key={metric} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={favoriteMetrics.includes(metric)} 
                  onChange={() => handleMetricChange(metric)}
                  className="mr-2"
                />
                {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Email Report Frequency</h3>
          <div className="space-y-2">
            {['daily', 'weekly', 'monthly', 'never'].map(frequency => (
              <label key={frequency} className="flex items-center">
                <input 
                  type="radio" 
                  name="emailFrequency" 
                  value={frequency} 
                  checked={emailFrequency === frequency} 
                  onChange={() => setEmailFrequency(frequency as any)}
                  className="mr-2"
                />
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}; 