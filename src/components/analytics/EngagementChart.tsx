import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DailyEngagement } from './AnalyticsDashboard'
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

interface EngagementChartProps {
  engagementData: DailyEngagement[]
  dateRange: { from: Date; to: Date }
}

export function EngagementChart({ engagementData, dateRange }: EngagementChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')
  const [metricType, setMetricType] = useState<'views' | 'leads' | 'shares' | 'comments'>('views')
  
  // Filter data by date range
  const filteredData = engagementData.filter(day => {
    const date = new Date(day.date)
    return date >= dateRange.from && date <= dateRange.to
  })
  
  // Calculate totals for summary
  const totalViews = filteredData.reduce((sum, day) => sum + day.views, 0)
  const totalLeads = filteredData.reduce((sum, day) => sum + day.leads, 0)
  const totalShares = filteredData.reduce((sum, day) => sum + day.shares, 0)
  const totalComments = filteredData.reduce((sum, day) => sum + day.comments, 0)
  
  // Calculate daily averages
  const days = filteredData.length || 1
  const avgViews = totalViews / days
  const avgLeads = totalLeads / days
  const avgShares = totalShares / days
  const avgComments = totalComments / days
  
  // Prepare chart data
  const chartData = filteredData.map(day => ({
    date: day.date,
    Views: day.views,
    Leads: day.leads,
    Shares: day.shares,
    Comments: day.comments
  }))
  
  // Prepare pie chart data
  const pieData = [
    { name: 'Views', value: totalViews, color: '#8884d8' },
    { name: 'Leads', value: totalLeads * 50, color: '#82ca9d' }, // Scale up for visibility
    { name: 'Shares', value: totalShares * 20, color: '#ffc658' }, // Scale up for visibility
    { name: 'Comments', value: totalComments * 20, color: '#ff8042' } // Scale up for visibility
  ]
  
  // Get metric display name
  const getMetricName = (metric: string) => {
    return metric.charAt(0).toUpperCase() + metric.slice(1)
  }
  
  // Render the appropriate chart based on type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={getMetricName(metricType)} 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={getMetricName(metricType)} 
              stroke="#8884d8" 
              fill="#8884d8" 
            />
          </AreaChart>
        )
      case 'bar':
        return (
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            <Tooltip />
            <Legend />
            <Bar 
              dataKey={getMetricName(metricType)} 
              fill="#8884d8" 
            />
          </BarChart>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Views</h3>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. {Math.round(avgViews)} per day
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Leads</h3>
          <p className="text-3xl font-bold">{totalLeads}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. {avgLeads.toFixed(1)} per day
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Shares</h3>
          <p className="text-3xl font-bold">{totalShares}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. {avgShares.toFixed(1)} per day
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Comments</h3>
          <p className="text-3xl font-bold">{totalComments}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. {avgComments.toFixed(1)} per day
          </p>
        </Card>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-lg font-medium">Engagement Metrics</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-[200px]">
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={metricType} onValueChange={(value) => setMetricType(value as any)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-[300px]">
                <TabsTrigger value="views">Views</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="shares">Shares</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Engagement Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => {
                  if (name === 'Leads') return [props.payload.value / 50, name]
                  if (name === 'Shares' || name === 'Comments') return [props.payload.value / 20, name]
                  return [value, name]
                }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Leads, Shares, and Comments are scaled for better visibility
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Engagement Insights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Views to Leads Ratio</h4>
              <p className="text-2xl font-bold">{totalLeads > 0 ? (totalViews / totalLeads).toFixed(1) : 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {totalLeads > 0 ? 
                  `It takes approximately ${Math.round(totalViews / totalLeads)} views to generate one lead` : 
                  'No leads generated yet'}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Engagement Rate</h4>
              <p className="text-2xl font-bold">
                {totalViews > 0 ? 
                  `${(((totalShares + totalComments) / totalViews) * 100).toFixed(2)}%` : 
                  'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                Percentage of views that resulted in shares or comments
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Best Performing Day</h4>
              {filteredData.length > 0 ? (
                <>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const bestDay = [...filteredData].sort((a, b) => 
                        (b.views + b.leads * 10 + b.shares * 5 + b.comments * 5) - 
                        (a.views + a.leads * 10 + a.shares * 5 + a.comments * 5)
                      )[0]
                      const date = new Date(bestDay.date)
                      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    })()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on combined engagement metrics
                  </p>
                </>
              ) : (
                <p className="text-sm">No data available</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 