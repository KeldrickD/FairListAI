import React, { useMemo } from 'react';
import { DailyEngagement } from '@/lib/types/analytics';
import { format, parseISO, eachDayOfInterval, getDay, startOfWeek, addDays } from 'date-fns';

interface EngagementHeatmapProps {
  engagementData: DailyEngagement[];
  metric: 'views' | 'leads' | 'shares' | 'comments';
  dateRange: { from: Date; to: Date };
}

export const EngagementHeatmap: React.FC<EngagementHeatmapProps> = ({
  engagementData,
  metric,
  dateRange
}) => {
  // Generate heatmap data
  const heatmapData = useMemo(() => {
    // Get all days in the date range
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    
    // Create a 7x24 grid (days of week x hours of day)
    const grid: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));
    
    // Fill the grid with data
    engagementData.forEach(day => {
      const date = parseISO(day.date);
      const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
      
      // For this demo, we'll distribute the daily metric across hours based on a typical pattern
      // In a real implementation, you would have hourly data
      const hourlyDistribution = getHourlyDistribution(day[metric]);
      
      hourlyDistribution.forEach((value, hour) => {
        grid[dayOfWeek][hour] += value;
      });
    });
    
    return grid;
  }, [engagementData, metric, dateRange]);
  
  // Get the maximum value for color scaling
  const maxValue = useMemo(() => {
    return Math.max(...heatmapData.flat());
  }, [heatmapData]);
  
  // Get color for a cell based on its value
  const getCellColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    
    const intensity = Math.min(value / maxValue, 1);
    
    if (metric === 'views') {
      return `bg-blue-${Math.max(Math.floor(intensity * 9), 1)}00`;
    } else if (metric === 'leads') {
      return `bg-green-${Math.max(Math.floor(intensity * 9), 1)}00`;
    } else if (metric === 'shares') {
      return `bg-purple-${Math.max(Math.floor(intensity * 9), 1)}00`;
    } else {
      return `bg-yellow-${Math.max(Math.floor(intensity * 9), 1)}00`;
    }
  };
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Hours of the day
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Engagement Heatmap</h3>
        <div className="text-sm text-gray-500">
          Showing {metric} by day of week and hour
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex">
            <div className="w-12"></div>
            {hoursOfDay.map(hour => (
              <div key={hour} className="w-8 text-center text-xs text-gray-500">
                {hour}h
              </div>
            ))}
          </div>
          
          {daysOfWeek.map((day, dayIndex) => (
            <div key={day} className="flex items-center">
              <div className="w-12 text-xs text-gray-500 font-medium">{day}</div>
              {hoursOfDay.map(hour => {
                const value = heatmapData[dayIndex][hour];
                return (
                  <div
                    key={hour}
                    className={`w-8 h-8 ${getCellColor(value)} border border-white`}
                    title={`${day} ${hour}:00 - ${value} ${metric}`}
                  >
                    {value > 0 && (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white font-medium">
                        {value > 99 ? '99+' : value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>Lower</div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div
              key={i}
              className={`w-4 h-4 ${
                metric === 'views'
                  ? `bg-blue-${i}00`
                  : metric === 'leads'
                  ? `bg-green-${i}00`
                  : metric === 'shares'
                  ? `bg-purple-${i}00`
                  : `bg-yellow-${i}00`
              }`}
            ></div>
          ))}
        </div>
        <div>Higher</div>
      </div>
      
      <div className="text-xs text-gray-500 italic">
        This heatmap shows when your audience is most active. Use this data to time your updates and promotions.
      </div>
    </div>
  );
};

// Helper function to distribute a daily value across hours
// This is a simplified model - in a real implementation, you would have actual hourly data
function getHourlyDistribution(dailyValue: number): number[] {
  // Create a typical engagement pattern throughout the day
  // Higher engagement in morning, lunch time, and evening
  const pattern = [
    0.5, 0.3, 0.2, 0.1, 0.1, 0.2, // 0-5 (night/early morning)
    0.5, 1.5, 2.0, 2.0, 1.5, 1.5, // 6-11 (morning)
    2.0, 2.0, 1.5, 1.5, 1.5, 2.0, // 12-17 (afternoon)
    2.5, 2.5, 2.0, 1.5, 1.0, 0.5  // 18-23 (evening)
  ];
  
  // Normalize the pattern
  const sum = pattern.reduce((a, b) => a + b, 0);
  const normalizedPattern = pattern.map(v => v / sum);
  
  // Distribute the daily value according to the pattern
  return normalizedPattern.map(factor => Math.round(dailyValue * factor));
} 