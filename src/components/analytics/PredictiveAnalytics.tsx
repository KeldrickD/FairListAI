import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DailyEngagement, ListingPerformance } from '@/lib/types/analytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, addDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon, AlertCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PredictiveAnalyticsProps {
  historicalData: DailyEngagement[];
  listingPerformance: ListingPerformance[];
  dateRange: { from: Date; to: Date };
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  historicalData,
  listingPerformance,
  dateRange
}) => {
  const [forecastPeriod, setForecastPeriod] = useState<'7' | '14' | '30'>('14');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'leads' | 'shares' | 'comments'>('views');
  
  // Generate forecast data based on historical trends
  const forecastData = useMemo(() => {
    if (!historicalData.length) return [];
    
    // Sort historical data by date
    const sortedData = [...historicalData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate average daily growth rate for the selected metric
    const growthRates: number[] = [];
    for (let i = 1; i < sortedData.length; i++) {
      const prev = sortedData[i-1][selectedMetric];
      const current = sortedData[i][selectedMetric];
      if (prev > 0) {
        growthRates.push((current - prev) / prev);
      }
    }
    
    // Calculate average growth rate, defaulting to a small positive value if no valid rates
    const avgGrowthRate = growthRates.length > 0 
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
      : 0.01;
    
    // Apply some smoothing to avoid extreme predictions
    const smoothedGrowthRate = Math.max(-0.1, Math.min(0.1, avgGrowthRate));
    
    // Get the last known value
    const lastKnownValue = sortedData[sortedData.length - 1][selectedMetric];
    const lastDate = parseISO(sortedData[sortedData.length - 1].date);
    
    // Generate forecast for the specified period
    const forecastDays = parseInt(forecastPeriod);
    const forecast = [];
    
    // Include the last 7 days of historical data for context
    const historicalContext = sortedData.slice(-7).map(day => ({
      date: day.date,
      actual: day[selectedMetric],
      forecast: null
    }));
    
    // Generate future forecast
    for (let i = 1; i <= forecastDays; i++) {
      const forecastDate = addDays(lastDate, i);
      const forecastValue = lastKnownValue * Math.pow(1 + smoothedGrowthRate, i);
      
      forecast.push({
        date: format(forecastDate, 'yyyy-MM-dd'),
        actual: null,
        forecast: Math.round(forecastValue)
      });
    }
    
    return [...historicalContext, ...forecast];
  }, [historicalData, selectedMetric, forecastPeriod]);
  
  // Calculate seasonal patterns
  const seasonalPatterns = useMemo(() => {
    if (!historicalData.length) return [];
    
    // Group data by day of week
    const dayOfWeekData: Record<number, number[]> = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []};
    
    historicalData.forEach(day => {
      const date = parseISO(day.date);
      const dayOfWeek = date.getDay();
      dayOfWeekData[dayOfWeek].push(day[selectedMetric]);
    });
    
    // Calculate average for each day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return Object.entries(dayOfWeekData).map(([day, values]) => {
      const avg = values.length > 0 
        ? values.reduce((sum, val) => sum + val, 0) / values.length 
        : 0;
      
      return {
        day: dayNames[parseInt(day)],
        average: Math.round(avg),
        values: values.length
      };
    });
  }, [historicalData, selectedMetric]);
  
  // Identify top performing listings
  const topPerformers = useMemo(() => {
    if (!listingPerformance.length) return [];
    
    return [...listingPerformance]
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 3)
      .map(listing => ({
        id: listing.id,
        title: listing.title,
        conversionRate: listing.conversionRate,
        trend: listing.weekOverWeekChange
      }));
  }, [listingPerformance]);
  
  // Calculate overall forecast metrics
  const forecastMetrics = useMemo(() => {
    if (!forecastData.length) return null;
    
    const historicalValues = forecastData
      .filter(d => d.actual !== null)
      .map(d => d.actual as number);
    
    const forecastValues = forecastData
      .filter(d => d.forecast !== null)
      .map(d => d.forecast as number);
    
    const lastHistorical = historicalValues[historicalValues.length - 1] || 0;
    const lastForecast = forecastValues[forecastValues.length - 1] || 0;
    
    const growth = lastHistorical > 0 
      ? ((lastForecast - lastHistorical) / lastHistorical) * 100 
      : 0;
    
    const totalForecast = forecastValues.reduce((sum, val) => sum + val, 0);
    
    return {
      growth: parseFloat(growth.toFixed(1)),
      totalForecast,
      averageForecast: Math.round(totalForecast / forecastValues.length),
      confidence: calculateConfidence(historicalData.length)
    };
  }, [forecastData, historicalData]);
  
  // Helper function to calculate confidence based on data amount
  function calculateConfidence(dataPointCount: number): 'low' | 'medium' | 'high' {
    if (dataPointCount < 14) return 'low';
    if (dataPointCount < 30) return 'medium';
    return 'high';
  }
  
  if (!historicalData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>Not enough data to generate predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-center">
            <div>
              <AlertCircleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Insufficient Historical Data</h3>
              <p className="text-sm text-gray-500 max-w-md">
                We need more historical data to generate accurate predictions. 
                Continue using the platform and check back in a few days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Predictive Analytics</CardTitle>
            <CardDescription>Forecast future performance based on historical trends</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="shares">Shares</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={forecastPeriod} onValueChange={(value: any) => setForecastPeriod(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Forecast period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="mb-4">
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="patterns">Seasonal Patterns</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Projected Growth</div>
                      <div className="text-2xl font-bold flex items-center">
                        {forecastMetrics?.growth}%
                        {forecastMetrics?.growth && forecastMetrics.growth > 0 ? (
                          <TrendingUpIcon className="h-5 w-5 text-green-500 ml-1" />
                        ) : (
                          <TrendingDownIcon className="h-5 w-5 text-red-500 ml-1" />
                        )}
                      </div>
                    </div>
                    <Badge variant={
                      forecastMetrics?.confidence === 'high' ? 'default' : 
                      forecastMetrics?.confidence === 'medium' ? 'secondary' : 'outline'
                    }>
                      {forecastMetrics?.confidence === 'high' ? 'High Confidence' : 
                       forecastMetrics?.confidence === 'medium' ? 'Medium Confidence' : 'Low Confidence'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">Total {selectedMetric} (Next {forecastPeriod} Days)</div>
                  <div className="text-2xl font-bold">{forecastMetrics?.totalForecast.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">Daily Average</div>
                  <div className="text-2xl font-bold">{forecastMetrics?.averageForecast.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={forecastData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => format(parseISO(date), 'MMMM d, yyyy')}
                      formatter={(value, name) => [value, name === 'actual' ? 'Actual' : 'Forecast']}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Actual" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Forecast" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    This forecast is based on {historicalData.length} days of historical data. 
                    {forecastMetrics?.confidence === 'low' && ' More data will improve forecast accuracy.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Day of Week Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={seasonalPatterns}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Average ' + selectedMetric]} />
                    <Legend />
                    <Bar dataKey="average" name={`Average ${selectedMetric}`} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Best Days</h4>
                    <div className="space-y-2">
                      {seasonalPatterns
                        .sort((a, b) => b.average - a.average)
                        .slice(0, 3)
                        .map((day, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="text-sm">{day.day}</div>
                            <div className="text-sm font-medium">{day.average.toLocaleString()} {selectedMetric}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Slowest Days</h4>
                    <div className="space-y-2">
                      {seasonalPatterns
                        .sort((a, b) => a.average - b.average)
                        .slice(0, 3)
                        .map((day, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="text-sm">{day.day}</div>
                            <div className="text-sm font-medium">{day.average.toLocaleString()} {selectedMetric}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-sm text-gray-500">
              <h4 className="font-medium mb-2">Insights:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Post new listings on {seasonalPatterns.sort((a, b) => b.average - a.average)[0]?.day} for maximum visibility.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Schedule social media promotions for {seasonalPatterns.sort((a, b) => b.average - a.average)[1]?.day} and {seasonalPatterns.sort((a, b) => b.average - a.average)[2]?.day} to boost engagement.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Consider special promotions on {seasonalPatterns.sort((a, b) => a.average - b.average)[0]?.day} to increase traffic on slower days.
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Top Performing Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((listing, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">{listing.title}</div>
                          <div className="text-xs text-gray-500">ID: {listing.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{(listing.conversionRate * 100).toFixed(1)}% conversion</div>
                          <div className="text-xs flex items-center justify-end">
                            {listing.trend > 0 ? (
                              <>
                                <TrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-green-500">+{(listing.trend * 100).toFixed(1)}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                                <span className="text-red-500">{(listing.trend * 100).toFixed(1)}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {topPerformers.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No performance data available yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Action Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {forecastMetrics?.growth && forecastMetrics.growth > 0 ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {forecastMetrics?.growth && forecastMetrics.growth > 0 
                            ? "Growth Trend Detected" 
                            : "Potential Growth Opportunity"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {forecastMetrics?.growth && forecastMetrics.growth > 0 
                            ? `Your ${selectedMetric} are projected to grow by ${forecastMetrics.growth}% in the next ${forecastPeriod} days. Continue your current strategy.` 
                            : `Consider refreshing your listings or increasing promotion to boost ${selectedMetric}.`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Optimize Posting Schedule</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Based on your data, the best days to post new listings are {seasonalPatterns.sort((a, b) => b.average - a.average)[0]?.day} and {seasonalPatterns.sort((a, b) => b.average - a.average)[1]?.day}.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Learn From Top Performers</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {topPerformers.length > 0 
                            ? `Analyze your top performing listings to identify common elements that drive conversions.` 
                            : `Start A/B testing different listing elements to identify what drives the best performance.`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Forecast Reliability</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {forecastMetrics?.confidence === 'high' 
                            ? "Your forecast has high confidence based on sufficient historical data." 
                            : `Your forecast has ${forecastMetrics?.confidence} confidence. Continue using the platform to improve prediction accuracy.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 