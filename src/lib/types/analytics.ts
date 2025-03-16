// Analytics data types for the application

// Date range type for filtering analytics data
export interface DateRange {
  from: Date;
  to: Date;
}

// Daily engagement metrics
export interface DailyEngagement {
  date: string;
  views: number;
  uniqueVisitors: number;
  leads: number;
  shares: number;
  comments: number;
  averageTimeOnPage: number;
  bounceRate: number;
}

// Lead information
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
  listingId: string;
}

// A/B Testing types
export interface ABVariant {
  id: string;
  name: string;
  description: string;
  views: number;
  conversions: number;
  conversionRate: number;
  isControl: boolean;
}

export type ABTestStatus = 'running' | 'paused' | 'completed';

export interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  variants: ABVariant[];
  winningVariantId?: string;
}

// Performance metrics
export interface PerformanceData {
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number; // seconds
  bounceRate: number; // percentage
  conversionRate: number; // percentage
  engagementByDay: DailyEngagement[];
  listingId: string;
}

// Complete analytics data for a listing
export interface ListingAnalytics {
  id: string;
  title: string;
  createdAt: string;
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  leads: Lead[];
  socialShares: SocialShares;
  engagementByDay: DailyEngagement[];
  abTests: ABTest[];
  performanceData: {
    views: number;
    uniqueVisitors: number;
    conversionRate: number;
    engagementByDay: {
      date: string;
      views: number;
      leads: number;
      shares: number;
      comments: number;
    }[];
  };
}

// User preferences for analytics dashboard
export interface AnalyticsPreferences {
  userId: string;
  defaultDateRange: DateRange;
  preferredChartType: 'line' | 'bar' | 'area';
  favoriteMetrics: string[];
  emailReportFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ABTestVariant {
  name: string;
  views: number;
  conversions: number;
}

export interface ABTestResult {
  id: string;
  testName: string;
  status: 'active' | 'completed';
  startDate: string;
  endDate: string | null;
  variantA: ABTestVariant;
  variantB: ABTestVariant;
}

export interface ListingPerformance {
  id: string;
  title: string;
  views: number;
  leads: number;
  conversionRate: number;
  weekOverWeekChange: number;
}

export interface AnalyticsData {
  dailyEngagement: DailyEngagement[];
  abTestResults: ABTestResult[];
  listingPerformance: ListingPerformance[];
}

export interface SocialShares {
  facebook: number;
  twitter: number;
  linkedin: number;
  instagram: number;
  pinterest: number;
  email: number;
} 