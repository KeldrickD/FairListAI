import React from 'react'
import { Card } from '@/components/ui/card'
import { DailyEngagement } from './AnalyticsDashboard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceMetricsProps {
  views: number
  uniqueVisitors: number
  averageTimeOnPage: number
  bounceRate: number
  conversionRate: number
  engagementByDay: DailyEngagement[]
}

export function PerformanceMetrics({
  views,
  uniqueVisitors,
  averageTimeOnPage,
  bounceRate,
  conversionRate,
  engagementByDay
}: PerformanceMetricsProps) {
  // Calculate trends (last 7 days vs previous 7 days)
  const calculateTrend = (data: DailyEngagement[], key: keyof DailyEngagement) => {
    if (data.length < 14) return 0
    
    const last7Days = data.slice(-7)
    const previous7Days = data.slice(-14, -7)
    
    const last7Sum = last7Days.reduce((sum, day) => sum + (day[key] as number), 0)
    const previous7Sum = previous7Days.reduce((sum, day) => sum + (day[key] as number), 0)
    
    if (previous7Sum === 0) return 100 // If previous period had 0, show 100% increase
    
    return ((last7Sum - previous7Sum) / previous7Sum) * 100
  }
  
  const viewsTrend = calculateTrend(engagementByDay, 'views')
  const leadsTrend = calculateTrend(engagementByDay, 'leads')
  
  // Format trend display
  const formatTrend = (trend: number) => {
    const prefix = trend >= 0 ? '+' : ''
    const className = trend >= 0 ? 'text-green-500' : 'text-red-500'
    return <span className={className}>{prefix}{trend.toFixed(1)}%</span>
  }
  
  // Prepare chart data
  const chartData = engagementByDay.map(day => ({
    date: day.date,
    Views: day.views,
    Leads: day.leads * 20, // Scale up for visibility
    Shares: day.shares * 10 // Scale up for visibility
  }))
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Traffic Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Views</span>
              <span className="font-medium">{views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Unique Visitors</span>
              <span className="font-medium">{uniqueVisitors.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Views per Visitor</span>
              <span className="font-medium">{(views / uniqueVisitors).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">7-Day Trend</span>
              <span className="font-medium">{formatTrend(viewsTrend)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Engagement Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Avg. Time on Page</span>
              <span className="font-medium">{Math.floor(averageTimeOnPage / 60)}m {averageTimeOnPage % 60}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Bounce Rate</span>
              <span className="font-medium">{bounceRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Conversion Rate</span>
              <span className="font-medium">{conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Lead Trend</span>
              <span className="font-medium">{formatTrend(leadsTrend)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Insights</h3>
          <div className="space-y-2 text-sm">
            <p>
              {viewsTrend >= 10 ? 
                '🚀 Your listing is gaining significant traction!' : 
                viewsTrend >= 0 ? 
                  '📈 Your listing is performing well.' : 
                  '📉 Your listing views are declining.'}
            </p>
            <p>
              {conversionRate >= 5 ? 
                '✨ Excellent conversion rate!' : 
                conversionRate >= 3 ? 
                  '👍 Good conversion rate.' : 
                  '💡 Consider optimizing your listing to improve conversions.'}
            </p>
            <p>
              {bounceRate <= 25 ? 
                '👏 Very low bounce rate!' : 
                bounceRate <= 40 ? 
                  '✅ Acceptable bounce rate.' : 
                  '⚠️ High bounce rate. Consider improving your listing content.'}
            </p>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Performance Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Leads') return [value / 20, name]
                  if (name === 'Shares') return [value / 10, name]
                  return [value, name]
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Views" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Leads" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Shares" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Note: Leads and Shares are scaled for better visibility in the chart
        </p>
      </Card>
    </div>
  )
} 