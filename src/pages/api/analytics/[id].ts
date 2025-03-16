import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '@/lib/services/analyticsService';
import { ApiResponse, ListingAnalytics } from '@/lib/types/analytics';
import { format, subDays } from 'date-fns';

// Mock data generator for development purposes
const generateMockData = (listingId: string): ListingAnalytics => {
  return {
    listingId,
    performanceData: {
      views: 1245,
      uniqueVisitors: 876,
      averageTimeOnPage: 125, // seconds
      bounceRate: 35.2, // percentage
      conversionRate: 4.8, // percentage
      engagementByDay: Array.from({ length: 30 }, (_, i) => ({
        date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
        views: Math.floor(Math.random() * 100) + 20,
        leads: Math.floor(Math.random() * 10) + 1,
        shares: Math.floor(Math.random() * 5) + 1,
        comments: Math.floor(Math.random() * 8) + 1
      })),
      listingId
    },
    leads: Array.from({ length: 25 }, (_, i) => ({
      id: `lead-${i + 1}`,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      phone: i % 3 === 0 ? `+1 555-${100 + i}` : undefined,
      source: ['website', 'referral', 'social', 'email', 'direct'][i % 5],
      status: ['new', 'contacted', 'qualified', 'converted', 'lost'][i % 5] as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
      createdAt: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      listingId
    })),
    abTests: [
      {
        id: 'test-1',
        name: 'Title Optimization',
        description: 'Testing different title formats to improve click-through rates',
        hypothesis: 'Including price in the title will increase click-through rates',
        targetAudience: 'All visitors',
        status: 'completed',
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
        variants: [
          {
            id: 'variant-1',
            name: 'Original Title',
            description: 'Original listing title without price',
            views: 450,
            conversions: 18,
            conversionRate: 4.0,
            isControl: true
          },
          {
            id: 'variant-2',
            name: 'Title with Price',
            description: 'Listing title with price included',
            views: 462,
            conversions: 28,
            conversionRate: 6.1,
            isControl: false
          }
        ],
        listingId
      },
      {
        id: 'test-2',
        name: 'Description Length',
        description: 'Testing if shorter descriptions lead to better engagement',
        hypothesis: 'Shorter, more concise descriptions will lead to higher conversion rates',
        targetAudience: 'New visitors',
        status: 'running',
        startDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
        variants: [
          {
            id: 'variant-3',
            name: 'Long Description',
            description: 'Detailed property description with 300+ words',
            views: 210,
            conversions: 8,
            conversionRate: 3.8,
            isControl: true
          },
          {
            id: 'variant-4',
            name: 'Short Description',
            description: 'Concise property description with less than 150 words',
            views: 198,
            conversions: 11,
            conversionRate: 5.6,
            isControl: false
          }
        ],
        listingId
      }
    ],
    lastUpdated: new Date().toISOString()
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid listing ID',
      message: 'Please provide a valid listing ID'
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        // Get analytics data for the listing
        const response = await analyticsService.getListingAnalytics(id);
        
        // If no data found, generate mock data for development
        if (!response.success) {
          const mockData = generateMockData(id);
          await analyticsService.saveListingAnalytics(mockData);
          return res.status(200).json({
            success: true,
            data: mockData,
            message: 'Generated mock analytics data'
          });
        }
        
        return res.status(200).json(response);
        
      case 'POST':
        // Update analytics data
        if (!req.body) {
          return res.status(400).json({
            success: false,
            error: 'Missing request body',
            message: 'Please provide analytics data to update'
          });
        }
        
        const updateResponse = await analyticsService.saveListingAnalytics({
          ...req.body,
          listingId: id
        });
        
        return res.status(200).json(updateResponse);
        
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
          message: `The HTTP ${req.method} method is not supported for this route.`
        });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
} 