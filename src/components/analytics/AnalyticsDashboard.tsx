import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PerformanceMetrics } from './PerformanceMetrics'
import { EngagementChart } from './EngagementChart'
import { LeadGeneration } from './LeadGeneration'
import { ABTestingPanel } from './ABTestingPanel'
import { PlatformBreakdown } from './PlatformBreakdown'
import { DateRangePicker } from './DateRangePicker'
import { useToast } from '@/components/ui/use-toast'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { CalendarIcon, DownloadIcon, RefreshIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

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
              { id: "var1", name: "Original", description: "3 Bed, 2 Bath House in Downtown", views: 623, conversions: 24, conversionRate: 3.85 },
              { id: "var2", name: "Variant B", description: "Stunning 3 Bed Downtown Home with Modern Finishes", views: 622, conversions: 36, conversionRate: 5.79 }
            ],
            winningVariantId: "var2"
          },
          {
            id: "test2",
            name: "Description Length",
            status: "running",
            startDate: "2023-06-01T00:00:00Z",
            variants: [
              { id: "var1", name: "Concise", description: "Short, punchy description focusing on key features", views: 312, conversions: 14, conversionRate: 4.49 },
              { id: "var2", name: "Detailed", description: "Comprehensive description with neighborhood details", views: 311, conversions: 16, conversionRate: 5.14 }
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
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={selectedListing} onValueChange={setSelectedListing}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select Listing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={listingId}>Current Listing</SelectItem>
              <SelectItem value="all">All Listings</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
          />
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Key metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Views</h3>
          <p className="text-3xl font-bold">{analytics.views.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.uniqueVisitors.toLocaleString()} unique visitors
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Leads Generated</h3>
          <p className="text-3xl font-bold">{calculateTotalLeads()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {calculateLeadConversionRate().toFixed(1)}% conversion rate
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg. Time on Page</h3>
          <p className="text-3xl font-bold">{Math.floor(analytics.averageTimeOnPage / 60)}m {analytics.averageTimeOnPage % 60}s</p>
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.bounceRate.toFixed(1)}% bounce rate
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Social Engagement</h3>
          <p className="text-3xl font-bold">{calculateTotalEngagement()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Across all platforms
          </p>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <PerformanceMetrics 
            views={analytics.views}
            uniqueVisitors={analytics.uniqueVisitors}
            averageTimeOnPage={analytics.averageTimeOnPage}
            bounceRate={analytics.bounceRate}
            conversionRate={analytics.conversionRate}
            engagementByDay={filteredEngagementData}
          />
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          <EngagementChart 
            engagementData={filteredEngagementData}
            dateRange={dateRange}
          />
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-6">
          <LeadGeneration 
            leads={analytics.leads}
            conversionRate={analytics.conversionRate}
          />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <PlatformBreakdown 
            socialShares={analytics.socialShares}
          />
        </TabsContent>
        
        <TabsContent value="ab-testing" className="space-y-6">
          <ABTestingPanel 
            abTests={analytics.abTests}
            listingId={listingId}
            onTestCreated={fetchAnalyticsData}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
} 