import { useState, useEffect, useCallback } from 'react';
import { 
  ListingAnalytics, 
  PerformanceData, 
  Lead, 
  ABTest, 
  DateRange,
  AnalyticsPreferences
} from '@/lib/types/analytics';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

interface UseAnalyticsProps {
  listingId?: string;
  initialDateRange?: DateRange;
}

interface UseAnalyticsReturn {
  // Data states
  analytics: ListingAnalytics | null;
  performanceData: PerformanceData | null;
  leads: Lead[] | null;
  abTests: ABTest[] | null;
  preferences: AnalyticsPreferences | null;
  
  // Loading states
  isLoading: boolean;
  isExporting: boolean;
  isSendingEmail: boolean;
  
  // Error states
  error: string | null;
  
  // Date range
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  
  // Actions
  refreshData: () => Promise<void>;
  exportData: (type: 'performance' | 'leads' | 'abtests') => Promise<void>;
  sendEmailReport: (email: string) => Promise<boolean>;
  savePreferences: (prefs: Partial<AnalyticsPreferences>) => Promise<boolean>;
}

export const useAnalytics = ({ 
  listingId,
  initialDateRange
}: UseAnalyticsProps): UseAnalyticsReturn => {
  // Get the router for navigation
  const router = useRouter();
  
  // Data states
  const [analytics, setAnalytics] = useState<ListingAnalytics | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [abTests, setAbTests] = useState<ABTest[] | null>(null);
  const [preferences, setPreferences] = useState<AnalyticsPreferences | null>(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Date range state with default values
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    }
  );
  
  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!listingId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analytics/${listingId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch analytics data');
      }
      
      setAnalytics(data.data);
      setPerformanceData(data.data.performanceData);
      setLeads(data.data.leads);
      setAbTests(data.data.abTests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [listingId]);
  
  // Fetch user preferences
  const fetchPreferences = useCallback(async () => {
    // In a real app, you would get the user ID from authentication
    const userId = 'current-user';
    
    try {
      const response = await fetch(`/api/analytics/preferences/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setPreferences(data.data);
        
        // Update date range from preferences if available
        if (data.data.defaultDateRange && !initialDateRange) {
          setDateRange(data.data.defaultDateRange);
        }
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
      // Don't show an error toast for preferences, as it's not critical
    }
  }, [initialDateRange]);
  
  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);
  
  // Export data as CSV
  const exportData = useCallback(async (type: 'performance' | 'leads' | 'abtests') => {
    if (!listingId) return;
    
    setIsExporting(true);
    
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = `/api/analytics/export/${listingId}?type=${type}`;
      link.download = `listing_${listingId}_${type}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  }, [listingId]);
  
  // Send email report
  const sendEmailReport = useCallback(async (email: string): Promise<boolean> => {
    if (!listingId) return false;
    
    setIsSendingEmail(true);
    
    try {
      const response = await fetch(`/api/analytics/email-report/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send email report');
      }
      
      toast.success('Email report sent successfully');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email report');
      toast.error('Failed to send email report');
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  }, [listingId]);
  
  // Save user preferences
  const savePreferences = useCallback(async (prefs: Partial<AnalyticsPreferences>): Promise<boolean> => {
    // In a real app, you would get the user ID from authentication
    const userId = 'current-user';
    
    try {
      const response = await fetch(`/api/analytics/preferences/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...preferences,
          ...prefs,
          userId
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to save preferences');
      }
      
      setPreferences(data.data);
      toast.success('Preferences saved successfully');
      return true;
    } catch (err) {
      toast.error('Failed to save preferences');
      return false;
    }
  }, [preferences]);
  
  // Initial data fetch
  useEffect(() => {
    if (listingId) {
      fetchAnalytics();
      fetchPreferences();
    }
  }, [listingId, fetchAnalytics, fetchPreferences]);
  
  // Update performance data when date range changes
  useEffect(() => {
    if (!analytics || !dateRange) return;
    
    // Filter performance data based on date range
    const filteredEngagementData = analytics.performanceData.engagementByDay.filter(day => {
      const date = new Date(day.date);
      return (!dateRange.from || date >= dateRange.from) && 
             (!dateRange.to || date <= dateRange.to);
    });
    
    setPerformanceData({
      ...analytics.performanceData,
      engagementByDay: filteredEngagementData
    });
    
    // Save date range to preferences if it's changed by the user (not on initial load)
    if (preferences) {
      savePreferences({ defaultDateRange: dateRange });
    }
  }, [dateRange, analytics, preferences, savePreferences]);
  
  return {
    // Data states
    analytics,
    performanceData,
    leads,
    abTests,
    preferences,
    
    // Loading states
    isLoading,
    isExporting,
    isSendingEmail,
    
    // Error state
    error,
    
    // Date range
    dateRange,
    setDateRange,
    
    // Actions
    refreshData,
    exportData,
    sendEmailReport,
    savePreferences
  };
}; 