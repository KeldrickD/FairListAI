import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '@/lib/services/analyticsService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { type } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid listing ID',
      message: 'Please provide a valid listing ID'
    });
  }
  
  if (!type || typeof type !== 'string' || !['performance', 'leads', 'abtests'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid export type',
      message: 'Please provide a valid export type (performance, leads, or abtests)'
    });
  }
  
  try {
    // Get the CSV data
    const csvData = analyticsService.exportAnalyticsCSV(id, type as 'performance' | 'leads' | 'abtests');
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=listing_${id}_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Send the CSV data
    return res.status(200).send(csvData);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Export failed',
      message: error instanceof Error ? error.message : 'An unexpected error occurred during export'
    });
  }
} 