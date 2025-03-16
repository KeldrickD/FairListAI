import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '@/lib/services/analyticsService';
import { ApiResponse, AnalyticsPreferences } from '@/lib/types/analytics';
import { subDays } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<AnalyticsPreferences>>
) {
  const { userId } = req.query;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid user ID',
      message: 'Please provide a valid user ID'
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        // Get user preferences
        const response = await analyticsService.getAnalyticsPreferences(userId);
        
        // If no preferences found, return default preferences
        if (!response.success) {
          const defaultPreferences: AnalyticsPreferences = {
            userId,
            defaultDateRange: {
              from: subDays(new Date(), 30),
              to: new Date()
            },
            preferredChartType: 'line',
            favoriteMetrics: ['views', 'leads', 'conversionRate'],
            emailReportFrequency: 'weekly'
          };
          
          // Save default preferences
          await analyticsService.saveAnalyticsPreferences(defaultPreferences);
          
          return res.status(200).json({
            success: true,
            data: defaultPreferences,
            message: 'Using default preferences'
          });
        }
        
        return res.status(200).json(response);
        
      case 'POST':
      case 'PUT':
        // Update user preferences
        if (!req.body) {
          return res.status(400).json({
            success: false,
            error: 'Missing request body',
            message: 'Please provide preferences data to update'
          });
        }
        
        const updateResponse = await analyticsService.saveAnalyticsPreferences({
          ...req.body,
          userId
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