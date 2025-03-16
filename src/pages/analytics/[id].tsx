import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '@/components/layout/MainLayout'
import { PerformanceMetrics } from '@/components/analytics/PerformanceMetrics'
import { EngagementChart } from '@/components/analytics/EngagementChart'
import { LeadGeneration } from '@/components/analytics/LeadGeneration'
import { ABTestingPanel } from '@/components/analytics/ABTestingPanel'
import { format, subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'

// Define types for the mock data
interface DailyEngagement {
  date: string
  views: number
  leads: number
  shares: number
  comments: number
}

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  createdAt: string
}

interface ABVariant {
  id: string
  name: string
  description: string
  views: number
  conversions: number
  conversionRate: number
  isControl: boolean
}

interface ABTest {
  id: string
  name: string
  description: string
  hypothesis: string
  targetAudience?: string
  status: 'running' | 'paused' | 'completed'
  startDate: string
  endDate?: string
  variants: ABVariant[]
}

const ListingAnalyticsPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  
  // State for date range with non-null assertion
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  
  // Mock data for the analytics components
  const mockData = {
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
    })) as DailyEngagement[],
    leads: Array.from({ length: 25 }, (_, i) => ({
      id: `lead-${i + 1}`,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      phone: i % 3 === 0 ? `+1 555-${100 + i}` : undefined,
      source: ['website', 'referral', 'social', 'email', 'direct'][i % 5],
      status: ['new', 'contacted', 'qualified', 'converted', 'lost'][i % 5] as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
      createdAt: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd\'T\'HH:mm:ss')
    })) as Lead[],
    abTests: [
      {
        id: 'test-1',
        name: 'Title Optimization',
        description: 'Testing different title formats to improve click-through rates',
        hypothesis: 'Including price in the title will increase click-through rates',
        targetAudience: 'All visitors',
        status: 'completed' as const,
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
        ]
      },
      {
        id: 'test-2',
        name: 'Description Length',
        description: 'Testing if shorter descriptions lead to better engagement',
        hypothesis: 'Shorter, more concise descriptions will lead to higher conversion rates',
        targetAudience: 'New visitors',
        status: 'running' as const,
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
        ]
      }
    ] as ABTest[]
  }
  
  // Filter data based on date range
  const filteredEngagementData = mockData.engagementByDay.filter(day => {
    const date = new Date(day.date)
    return (!dateRange?.from || date >= dateRange.from) && 
           (!dateRange?.to || date <= dateRange.to)
  })
  
  if (!id || typeof id !== 'string') {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
            <p className="text-gray-500 mb-6">
              The listing ID is missing or invalid. Please select a valid listing.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }
  
  return (
    <>
      <Head>
        <title>Listing Analytics | FairListAI</title>
        <meta name="description" content="View detailed analytics for your property listing" />
      </Head>
      
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
            <p className="mb-4">Viewing analytics for listing ID: {id}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Views</h3>
                <p className="text-3xl font-bold">{mockData.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{mockData.uniqueVisitors.toLocaleString()} unique visitors</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Leads Generated</h3>
                <p className="text-3xl font-bold">{mockData.leads.length}</p>
                <p className="text-xs text-gray-500 mt-1">{mockData.conversionRate}% conversion rate</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Time on Page</h3>
                <p className="text-3xl font-bold">{Math.floor(mockData.averageTimeOnPage / 60)}m {mockData.averageTimeOnPage % 60}s</p>
                <p className="text-xs text-gray-500 mt-1">{mockData.bounceRate}% bounce rate</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Social Engagement</h3>
                <p className="text-3xl font-bold">164</p>
                <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
            <PerformanceMetrics 
              views={mockData.views}
              uniqueVisitors={mockData.uniqueVisitors}
              averageTimeOnPage={mockData.averageTimeOnPage}
              bounceRate={mockData.bounceRate}
              conversionRate={mockData.conversionRate}
              engagementByDay={filteredEngagementData}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Engagement Analysis</h2>
            <EngagementChart 
              engagementData={filteredEngagementData}
              dateRange={dateRange}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Lead Management</h2>
            <LeadGeneration 
              leads={mockData.leads}
              conversionRate={mockData.conversionRate}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">A/B Testing</h2>
            <ABTestingPanel 
              tests={mockData.abTests}
              listingId={id}
            />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Analytics Dashboard Complete!</h2>
            <p className="text-gray-500 mb-4">
              All components of the analytics dashboard have been successfully integrated.
              You can now track performance metrics, engagement, leads, and A/B tests for your listings.
            </p>
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ListingAnalyticsPage 