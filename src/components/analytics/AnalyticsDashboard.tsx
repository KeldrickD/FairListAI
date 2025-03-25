import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PerformanceMetrics } from './PerformanceMetrics'
import { EngagementChart } from './EngagementChart'
import { LeadGeneration } from './LeadGeneration'
import { ABTestingPanel } from './ABTestingPanel'
import { PlatformBreakdown } from './PlatformBreakdown'
import { useToast } from '@/components/ui/use-toast'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { CalendarIcon, DownloadIcon, RefreshIcon, Share2 } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { addDays, format, subDays } from 'date-fns'
import { ABTestingAnalysis } from './ABTestingAnalysis'
import { PredictiveAnalytics } from './PredictiveAnalytics'
import { EngagementHeatmap } from './EngagementHeatmap'
import { RealtimeActivityFeed } from './RealtimeActivityFeed'
import { useRealtimeAnalytics } from '@/lib/services/realtimeService'
import { AnalyticsData, DailyEngagement, ABTestResult, ListingPerformance } from '@/lib/types/analytics'

// Sample data types
export interface ListingAnalytics {
  id: string
  title: string
  createdAt: string
  views: number
  uniqueVisitors: number
  averageTimeOnPage: number
  bounceRate: number
  conversionRate: number
  leads: Lead[]
  socialShares: SocialShares
  engagementByDay: DailyEngagement[]
  abTests: ABTest[]
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  createdAt: string
  notes?: string
}

export interface SocialShares {
  facebook: number
  twitter: number
  linkedin: number
  instagram: number
  pinterest: number
  email: number
}

export interface DailyEngagement {
  date: string
  views: number
  leads: number
  shares: number
  comments: number
}

export interface ABTest {
  id: string
  name: string
  status: 'running' | 'completed' | 'paused'
  startDate: string
  endDate?: string
  variants: ABTestVariant[]
  winningVariantId?: string
}

export interface ABTestVariant {
  id: string
  name: string
  description: string
  views: number
  conversions: number
  conversionRate: number
  isControl: boolean
}

interface AnalyticsDashboardProps {
  listingId: string
  onRefresh?: () => void
}

export function AnalyticsDashboard({ listingId, onRefresh }: AnalyticsDashboardProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analytics, setAnalytics] = useState<ListingAnalytics | null>(null)
  const [selectedListing, setSelectedListing] = useState<string>(listingId)
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'leads' | 'shares' | 'comments'>('views')

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData()
  }, [listingId, dateRange, timeframe])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockAnalytics: ListingAnalytics = {
        id: listingId,
        title: "3 Bed, 2 Bath House in Downtown",
        createdAt: "2023-05-15T10:30:00Z",
        views: 1245,
        uniqueVisitors: 876,
        averageTimeOnPage: 127, // seconds
        bounceRate: 32.5, // percentage
        conversionRate: 4.8, // percentage
        leads: [
          { id: "1", name: "John Smith", email: "john@example.com", source: "website", status: "contacted", createdAt: "2023-05-16T14:22:00Z" },
          { id: "2", name: "Sarah Johnson", email: "sarah@example.com", phone: "555-123-4567", source: "facebook", status: "qualified", createdAt: "2023-05-17T09:15:00Z" },
          { id: "3", name: "Michael Brown", email: "michael@example.com", source: "zillow", status: "new", createdAt: "2023-05-18T16:40:00Z" },
          { id: "4", name: "Emily Davis", email: "emily@example.com", phone: "555-987-6543", source: "instagram", status: "converted", createdAt: "2023-05-20T11:05:00Z" },
          { id: "5", name: "David Wilson", email: "david@example.com", source: "email", status: "lost", createdAt: "2023-05-22T13:30:00Z" },
        ],
        socialShares: {
          facebook: 45,
          twitter: 23,
          linkedin: 17,
          instagram: 38,
          pinterest: 29,
          email: 12
        },
        engagementByDay: generateMockEngagementData(30),
        abTests: [
          {
            id: "test1",
            name: "Headline Optimization",
            status: "completed",
            startDate: "2023-05-15T00:00:00Z",
            endDate: "2023-05-29T23:59:59Z",
            variants: [
              { id: "var1", name: "Original", description: "3 Bed, 2 Bath House in Downtown", views: 623, conversions: 24, conversionRate: 3.85, isControl: true },
              { id: "var2", name: "Variant B", description: "Stunning 3 Bed Downtown Home with Modern Finishes", views: 622, conversions: 36, conversionRate: 5.79, isControl: false }
            ],
            winningVariantId: "var2"
          },
          {
            id: "test2",
            name: "Description Length",
            status: "running",
            startDate: "2023-06-01T00:00:00Z",
            variants: [
              { id: "var1", name: "Concise", description: "Short, punchy description focusing on key features", views: 312, conversions: 14, conversionRate: 4.49, isControl: true },
              { id: "var2", name: "Detailed", description: "Comprehensive description with neighborhood details", views: 311, conversions: 16, conversionRate: 5.14, isControl: false }
            ]
          }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate mock engagement data
  function generateMockEngagementData(days: number): DailyEngagement[] {
    const data: DailyEngagement[] = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // Generate random but somewhat realistic data
      const views = Math.floor(Math.random() * 80) + 20
      const leads = Math.floor(Math.random() * 5)
      const shares = Math.floor(Math.random() * 10)
      const comments = Math.floor(Math.random() * 8)
      
      data.push({
        date: date.toISOString().split('T')[0],
        views,
        leads,
        shares,
        comments
      })
    }
    
    return data
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchAnalyticsData()
    if (onRefresh) onRefresh()
    
    toast({
      title: "Refreshed",
      description: "Analytics data has been updated"
    })
  }

  // Calculate key metrics
  const calculateTotalLeads = () => {
    return analytics?.leads.length || 0
  }
  
  const calculateLeadConversionRate = () => {
    if (!analytics) return 0
    const convertedLeads = analytics.leads.filter(lead => lead.status === 'converted').length
    return (convertedLeads / analytics.leads.length) * 100
  }
  
  const calculateTotalEngagement = () => {
    if (!analytics) return 0
    return Object.values(analytics.socialShares).reduce((sum, count) => sum + count, 0)
  }

  // Filter data based on date range
  const filteredEngagementData = analytics?.engagementByDay.filter(day => {
    const date = new Date(day.date)
    return (!dateRange?.from || date >= dateRange.from) && 
           (!dateRange?.to || date <= dateRange.to)
  }) || []

  // Connect to real-time analytics
  const { isConnected, lastEvent, eventCount, connectToAnalytics, disconnectFromAnalytics } = useRealtimeAnalytics()

  // Effect to simulate data loading when date range changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setIsLoading(false)
    }
    
    loadData()
  }, [dateRange])
  
  // Connect to real-time analytics when component mounts
  useEffect(() => {
    connectToAnalytics()
    return () => {
      disconnectFromAnalytics()
    }
  }, [])

  if (!analytics) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh Data"}
          </Button>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your listing performance and optimize your marketing strategy.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <DatePickerWithRange 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportData}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleShareDashboard}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <PerformanceMetrics 
            views={filteredEngagementData.reduce((sum, day) => sum + day.views, 0)}
            uniqueVisitors={filteredEngagementData.reduce((sum, day) => sum + day.uniqueVisitors, 0)}
            averageTimeOnPage={filteredEngagementData.reduce((sum, day) => sum + day.averageTimeOnPage, 0) / filteredEngagementData.length}
            bounceRate={filteredEngagementData.reduce((sum, day) => sum + day.bounceRate, 0) / filteredEngagementData.length}
            conversionRate={filteredEngagementData.reduce((sum, day) => sum + day.leads, 0) / filteredEngagementData.reduce((sum, day) => sum + day.views, 0)}
            engagementByDay={filteredEngagementData.map(day => ({
              date: day.date,
              views: day.views,
              leads: day.leads
            }))}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EngagementChart 
              engagementData={filteredEngagementData}
              dateRange={dateRange}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Listings</CardTitle>
                <CardDescription>Listings with the highest conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.listingPerformance
                    .sort((a, b) => b.conversionRate - a.conversionRate)
                    .slice(0, 5)
                    .map((listing, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{listing.title}</div>
                            <div className="text-sm text-muted-foreground">{listing.views.toLocaleString()} views</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{(listing.conversionRate * 100).toFixed(1)}%</div>
                          <div className={`text-sm ${listing.weekOverWeekChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {listing.weekOverWeekChange >= 0 ? '+' : ''}{(listing.weekOverWeekChange * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Engagement Metrics</CardTitle>
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
                  </div>
                </CardHeader>
                <CardContent>
                  <EngagementHeatmap 
                    engagementData={analytics.engagementByDay}
                    metric={selectedMetric}
                    dateRange={dateRange}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Distribution</CardTitle>
                  <CardDescription>How users interact with your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['views', 'leads', 'shares', 'comments'].map((metric) => {
                      const total = filteredEngagementData.reduce((sum, day) => sum + day[metric as keyof DailyEngagement] as number, 0)
                      const percentage = total / filteredEngagementData.reduce((sum, day) => sum + day.views, 0) * 100
                      
                      return (
                        <div key={metric} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium capitalize">{metric}</div>
                            <div className="text-sm font-medium">{total.toLocaleString()}</div>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                metric === 'views' ? 'bg-blue-500' : 
                                metric === 'leads' ? 'bg-green-500' : 
                                metric === 'shares' ? 'bg-purple-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${metric === 'views' ? 100 : percentage}%` }}
                            ></div>
                          </div>
                          {metric !== 'views' && (
                            <div className="text-xs text-muted-foreground text-right">
                              {percentage.toFixed(1)}% of views
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <EngagementChart 
              engagementData={filteredEngagementData}
              dateRange={dateRange}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="testing">
          <ABTestingAnalysis testResults={analytics.abTests} />
        </TabsContent>
        
        <TabsContent value="predictions">
          <PredictiveAnalytics 
            historicalData={analytics.engagementByDay}
            listingPerformance={analytics.listingPerformance}
            dateRange={dateRange}
          />
        </TabsContent>
        
        <TabsContent value="realtime">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Real-time Activity</CardTitle>
                    <CardDescription>Live feed of user interactions</CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RealtimeActivityFeed 
                  isConnected={isConnected}
                  lastEvent={lastEvent}
                  eventCount={eventCount}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Active Users</CardTitle>
                <CardDescription>Users currently viewing your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="text-4xl font-bold">{Math.floor(15 + Math.random() * 10)}</div>
                    <div className="text-sm text-muted-foreground">Active users now</div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Currently Viewing</h4>
                    <div className="space-y-2">
                      {analytics.listingPerformance
                        .slice(0, 3)
                        .map((listing, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="text-sm">{listing.title}</div>
                            <div className="text-sm font-medium">{Math.floor(1 + Math.random() * 5)} users</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">User Locations</h4>
                    <div className="space-y-2">
                      {[
                        { location: 'United States', users: 8 },
                        { location: 'United Kingdom', users: 3 },
                        { location: 'Canada', users: 2 },
                        { location: 'Australia', users: 1 },
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="text-sm">{item.location}</div>
                          <div className="text-sm font-medium">{item.users} users</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 