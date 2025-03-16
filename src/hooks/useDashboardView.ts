import { useState, useEffect } from 'react';

// Define the available dashboard view types
export type DashboardViewType = 'standard' | 'agent' | 'owner' | 'admin';

// Define the components visible in each view
interface DashboardViewConfig {
  showPerformanceMetrics: boolean;
  showEngagementChart: boolean;
  showLeadGeneration: boolean;
  showABTesting: boolean;
  showExportOptions: boolean;
  showEmailReports: boolean;
  showPreferences: boolean;
  allowDataEditing: boolean;
}

// Default configurations for each view type
const viewConfigs: Record<DashboardViewType, DashboardViewConfig> = {
  standard: {
    showPerformanceMetrics: true,
    showEngagementChart: true,
    showLeadGeneration: true,
    showABTesting: false,
    showExportOptions: true,
    showEmailReports: true,
    showPreferences: true,
    allowDataEditing: false
  },
  agent: {
    showPerformanceMetrics: true,
    showEngagementChart: true,
    showLeadGeneration: true,
    showABTesting: true,
    showExportOptions: true,
    showEmailReports: true,
    showPreferences: true,
    allowDataEditing: false
  },
  owner: {
    showPerformanceMetrics: true,
    showEngagementChart: true,
    showLeadGeneration: true,
    showABTesting: true,
    showExportOptions: true,
    showEmailReports: true,
    showPreferences: true,
    allowDataEditing: true
  },
  admin: {
    showPerformanceMetrics: true,
    showEngagementChart: true,
    showLeadGeneration: true,
    showABTesting: true,
    showExportOptions: true,
    showEmailReports: true,
    showPreferences: true,
    allowDataEditing: true
  }
};

interface UseDashboardViewProps {
  initialViewType?: DashboardViewType;
}

interface UseDashboardViewReturn {
  viewType: DashboardViewType;
  setViewType: (viewType: DashboardViewType) => void;
  viewConfig: DashboardViewConfig;
  availableViewTypes: DashboardViewType[];
}

export const useDashboardView = ({
  initialViewType = 'standard'
}: UseDashboardViewProps = {}): UseDashboardViewReturn => {
  // State for the current view type
  const [viewType, setViewType] = useState<DashboardViewType>(initialViewType);
  
  // Get the configuration for the current view type
  const viewConfig = viewConfigs[viewType];
  
  // Define the available view types
  const availableViewTypes: DashboardViewType[] = ['standard', 'agent', 'owner', 'admin'];
  
  // Persist the view type in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_view_type', viewType);
    }
  }, [viewType]);
  
  // Load the view type from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedViewType = localStorage.getItem('dashboard_view_type') as DashboardViewType | null;
      
      if (savedViewType && availableViewTypes.includes(savedViewType)) {
        setViewType(savedViewType);
      }
    }
  }, []);
  
  return {
    viewType,
    setViewType,
    viewConfig,
    availableViewTypes
  };
}; 