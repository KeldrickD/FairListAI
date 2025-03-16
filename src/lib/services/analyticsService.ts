import { 
  ListingAnalytics, 
  PerformanceData, 
  Lead, 
  ABTest, 
  DateRange,
  ApiResponse,
  AnalyticsPreferences
} from '../types/analytics';
import { format, isWithinInterval, parseISO } from 'date-fns';

// This would be replaced with actual database calls in a production environment
// For now, we'll use localStorage in the browser for persistence
class AnalyticsService {
  private storagePrefix = 'fairlist_analytics_';
  
  // Helper method to check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
  
  // Get analytics data for a specific listing
  async getListingAnalytics(listingId: string): Promise<ApiResponse<ListingAnalytics>> {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot access localStorage on server');
      }
      
      const storedData = localStorage.getItem(`${this.storagePrefix}listing_${listingId}`);
      
      if (!storedData) {
        return {
          success: false,
          error: 'No analytics data found for this listing',
          message: 'Please check the listing ID or generate analytics data first'
        };
      }
      
      return {
        success: true,
        data: JSON.parse(storedData) as ListingAnalytics
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return {
        success: false,
        error: 'Failed to fetch analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Save analytics data for a listing
  async saveListingAnalytics(data: ListingAnalytics): Promise<ApiResponse<ListingAnalytics>> {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot access localStorage on server');
      }
      
      // Update the lastUpdated timestamp
      const updatedData = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(
        `${this.storagePrefix}listing_${data.listingId}`, 
        JSON.stringify(updatedData)
      );
      
      return {
        success: true,
        data: updatedData,
        message: 'Analytics data saved successfully'
      };
    } catch (error) {
      console.error('Error saving analytics data:', error);
      return {
        success: false,
        error: 'Failed to save analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Get performance data filtered by date range
  async getPerformanceData(
    listingId: string, 
    dateRange?: DateRange
  ): Promise<ApiResponse<PerformanceData>> {
    try {
      const response = await this.getListingAnalytics(listingId);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: 'No performance data found',
          message: response.message || 'Failed to retrieve performance data'
        };
      }
      
      const performanceData = response.data.performanceData;
      
      // If date range is provided, filter the engagement data
      if (dateRange) {
        const filteredEngagementData = performanceData.engagementByDay.filter(day => {
          const date = parseISO(day.date);
          return isWithinInterval(date, { 
            start: dateRange.from, 
            end: dateRange.to 
          });
        });
        
        return {
          success: true,
          data: {
            ...performanceData,
            engagementByDay: filteredEngagementData
          }
        };
      }
      
      return {
        success: true,
        data: performanceData
      };
    } catch (error) {
      console.error('Error fetching performance data:', error);
      return {
        success: false,
        error: 'Failed to fetch performance data',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Get leads for a listing
  async getLeads(listingId: string): Promise<ApiResponse<Lead[]>> {
    try {
      const response = await this.getListingAnalytics(listingId);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: 'No leads found',
          message: response.message || 'Failed to retrieve leads'
        };
      }
      
      return {
        success: true,
        data: response.data.leads
      };
    } catch (error) {
      console.error('Error fetching leads:', error);
      return {
        success: false,
        error: 'Failed to fetch leads',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Get A/B tests for a listing
  async getABTests(listingId: string): Promise<ApiResponse<ABTest[]>> {
    try {
      const response = await this.getListingAnalytics(listingId);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: 'No A/B tests found',
          message: response.message || 'Failed to retrieve A/B tests'
        };
      }
      
      return {
        success: true,
        data: response.data.abTests
      };
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      return {
        success: false,
        error: 'Failed to fetch A/B tests',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Save user preferences for analytics dashboard
  async saveAnalyticsPreferences(
    preferences: AnalyticsPreferences
  ): Promise<ApiResponse<AnalyticsPreferences>> {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot access localStorage on server');
      }
      
      localStorage.setItem(
        `${this.storagePrefix}preferences_${preferences.userId}`, 
        JSON.stringify(preferences)
      );
      
      return {
        success: true,
        data: preferences,
        message: 'Preferences saved successfully'
      };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return {
        success: false,
        error: 'Failed to save preferences',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Get user preferences for analytics dashboard
  async getAnalyticsPreferences(userId: string): Promise<ApiResponse<AnalyticsPreferences>> {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot access localStorage on server');
      }
      
      const storedPreferences = localStorage.getItem(`${this.storagePrefix}preferences_${userId}`);
      
      if (!storedPreferences) {
        return {
          success: false,
          error: 'No preferences found',
          message: 'User preferences have not been set'
        };
      }
      
      return {
        success: true,
        data: JSON.parse(storedPreferences) as AnalyticsPreferences
      };
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return {
        success: false,
        error: 'Failed to fetch preferences',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Export analytics data as CSV
  exportAnalyticsCSV(listingId: string, dataType: 'performance' | 'leads' | 'abtests'): string {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot access localStorage on server');
      }
      
      const storedData = localStorage.getItem(`${this.storagePrefix}listing_${listingId}`);
      
      if (!storedData) {
        throw new Error('No analytics data found for this listing');
      }
      
      const analyticsData = JSON.parse(storedData) as ListingAnalytics;
      let csvContent = '';
      
      switch (dataType) {
        case 'performance':
          // Header row
          csvContent = 'Date,Views,Leads,Shares,Comments\n';
          // Data rows
          analyticsData.performanceData.engagementByDay.forEach(day => {
            csvContent += `${day.date},${day.views},${day.leads},${day.shares},${day.comments}\n`;
          });
          break;
          
        case 'leads':
          // Header row
          csvContent = 'ID,Name,Email,Phone,Source,Status,Created At\n';
          // Data rows
          analyticsData.leads.forEach(lead => {
            csvContent += `${lead.id},${lead.name},${lead.email},${lead.phone || ''},${lead.source},${lead.status},${lead.createdAt}\n`;
          });
          break;
          
        case 'abtests':
          // Header row
          csvContent = 'Test ID,Test Name,Variant ID,Variant Name,Views,Conversions,Conversion Rate,Is Control\n';
          // Data rows
          analyticsData.abTests.forEach(test => {
            test.variants.forEach(variant => {
              csvContent += `${test.id},${test.name},${variant.id},${variant.name},${variant.views},${variant.conversions},${variant.conversionRate},${variant.isControl}\n`;
            });
          });
          break;
          
        default:
          throw new Error('Invalid data type for export');
      }
      
      return csvContent;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }
  
  // Generate a report for email
  generateEmailReport(listingId: string): string {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot access localStorage on server');
      }
      
      const storedData = localStorage.getItem(`${this.storagePrefix}listing_${listingId}`);
      
      if (!storedData) {
        throw new Error('No analytics data found for this listing');
      }
      
      const analyticsData = JSON.parse(storedData) as ListingAnalytics;
      const performanceData = analyticsData.performanceData;
      
      // Calculate some summary statistics
      const totalLeads = analyticsData.leads.length;
      const convertedLeads = analyticsData.leads.filter(lead => lead.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      
      // Generate a simple HTML report
      const report = `
        <h1>Analytics Report for Listing ${listingId}</h1>
        <p>Generated on: ${format(new Date(), 'MMMM dd, yyyy')}</p>
        
        <h2>Performance Summary</h2>
        <ul>
          <li>Total Views: ${performanceData.views}</li>
          <li>Unique Visitors: ${performanceData.uniqueVisitors}</li>
          <li>Average Time on Page: ${Math.floor(performanceData.averageTimeOnPage / 60)}m ${performanceData.averageTimeOnPage % 60}s</li>
          <li>Bounce Rate: ${performanceData.bounceRate.toFixed(1)}%</li>
          <li>Conversion Rate: ${performanceData.conversionRate.toFixed(1)}%</li>
        </ul>
        
        <h2>Lead Generation</h2>
        <ul>
          <li>Total Leads: ${totalLeads}</li>
          <li>Converted Leads: ${convertedLeads}</li>
          <li>Lead Conversion Rate: ${conversionRate.toFixed(1)}%</li>
        </ul>
        
        <h2>A/B Testing Results</h2>
        <ul>
          ${analyticsData.abTests.map(test => `
            <li>
              <strong>${test.name}</strong> (${test.status})
              <ul>
                ${test.variants.map(variant => `
                  <li>${variant.name}: ${variant.conversionRate.toFixed(1)}% conversion rate (${variant.conversions}/${variant.views})</li>
                `).join('')}
              </ul>
            </li>
          `).join('')}
        </ul>
        
        <p>View full analytics at: <a href="https://fairlistai.com/analytics/${listingId}">https://fairlistai.com/analytics/${listingId}</a></p>
      `;
      
      return report;
    } catch (error) {
      console.error('Error generating email report:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const analyticsService = new AnalyticsService(); 