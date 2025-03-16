import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '@/components/layout/MainLayout'
import { PerformanceMetrics } from '@/components/analytics/PerformanceMetrics'
import { EngagementChart } from '@/components/analytics/EngagementChart'
import { LeadGeneration } from '@/components/analytics/LeadGeneration'
import { ABTestingPanel } from '@/components/analytics/ABTestingPanel'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Toaster } from 'react-hot-toast'
import { DashboardPreferences } from '@/components/analytics/DashboardPreferences'
import { ExportPanel } from '@/components/analytics/ExportPanel'
import { EmailReportForm } from '@/components/analytics/EmailReportForm'
import { ViewSelector } from '@/components/analytics/ViewSelector'
import { useDashboardView } from '@/hooks/useDashboardView'

// Loading skeleton component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
      ))}
    </div>
    <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
    <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
    <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
    <div className="bg-gray-200 h-64 rounded-lg"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
    <div className="flex items-center">
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <p className="font-medium">{message}</p>
    </div>
    <div className="mt-3">
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  </div>
);

const ListingAnalyticsPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'preferences' | 'export' | 'email' | 'views'>('dashboard');
  
  // Use our custom dashboard view hook
  const {
    viewType,
    setViewType,
    viewConfig,
    availableViewTypes
  } = useDashboardView();
  
  // Use our custom analytics hook
  const {
    performanceData,
    leads,
    abTests,
    dateRange,
    setDateRange,
    isLoading,
    isExporting,
    isSendingEmail,
    error,
    refreshData,
    exportData,
    sendEmailReport,
    savePreferences,
    preferences
  } = useAnalytics({
    listingId: typeof id === 'string' ? id : undefined,
    initialDateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    }
  });
  
  // Email form state
  const [email, setEmail] = useState('');
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRange) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };
  
  // Handle export
  const handleExport = async (type: 'performance' | 'leads' | 'abtests') => {
    await exportData(type);
  };
  
  // Handle email report
  const handleSendEmailReport = async () => {
    if (!email) return;
    
    const success = await sendEmailReport(email);
    if (success) {
      setEmail('');
    }
  };
  
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
      
      <Toaster position="top-right" />
      
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-gray-500">Viewing analytics for listing ID: {id}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  Dashboard
                </button>
                {viewConfig.showPreferences && (
                  <button 
                    onClick={() => setActiveTab('preferences')}
                    className={`px-3 py-1 rounded-md ${activeTab === 'preferences' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Preferences
                  </button>
                )}
                {viewConfig.showExportOptions && (
                  <button 
                    onClick={() => setActiveTab('export')}
                    className={`px-3 py-1 rounded-md ${activeTab === 'export' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Export
                  </button>
                )}
                {viewConfig.showEmailReports && (
                  <button 
                    onClick={() => setActiveTab('email')}
                    className={`px-3 py-1 rounded-md ${activeTab === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Email Report
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('views')}
                  className={`px-3 py-1 rounded-md ${activeTab === 'views' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  Views
                </button>
              </div>
            </div>
            
            {/* View selector tab */}
            {activeTab === 'views' && (
              <ViewSelector 
                viewType={viewType}
                setViewType={setViewType}
                availableViewTypes={availableViewTypes}
              />
            )}
            
            {/* Refresh button and date range selector */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <button 
                    onClick={refreshData}
                    disabled={isLoading}
                    className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    )}
                    Refresh
                  </button>
                  <span className="text-sm text-gray-500">
                    Last updated: {performanceData ? format(new Date(), 'MMM d, yyyy h:mm a') : 'Never'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Date Range:</span>
                  <div className="relative">
                    <button 
                      className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
                      onClick={() => {
                        // This would open a date picker in a real implementation
                        // For now, we'll just use preset ranges
                        setDateRange({
                          from: new Date(new Date().setDate(new Date().getDate() - 30)),
                          to: new Date()
                        });
                      }}
                    >
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
                      ) : (
                        'Select date range'
                      )}
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Dashboard content */}
            {activeTab === 'dashboard' && (
              <>
                {error && <ErrorMessage message={error} onRetry={refreshData} />}
                
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    {performanceData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Views</h3>
                          <p className="text-3xl font-bold">{performanceData.views.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">{performanceData.uniqueVisitors.toLocaleString()} unique visitors</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Leads Generated</h3>
                          <p className="text-3xl font-bold">{leads?.length || 0}</p>
                          <p className="text-xs text-gray-500 mt-1">{performanceData.conversionRate}% conversion rate</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Time on Page</h3>
                          <p className="text-3xl font-bold">{Math.floor(performanceData.averageTimeOnPage / 60)}m {performanceData.averageTimeOnPage % 60}s</p>
                          <p className="text-xs text-gray-500 mt-1">{performanceData.bounceRate}% bounce rate</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Social Engagement</h3>
                          <p className="text-3xl font-bold">164</p>
                          <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
                        </div>
                      </div>
                    )}
                    
                    {viewConfig.showPerformanceMetrics && (
                      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
                        {performanceData ? (
                          <PerformanceMetrics 
                            views={performanceData.views}
                            uniqueVisitors={performanceData.uniqueVisitors}
                            averageTimeOnPage={performanceData.averageTimeOnPage}
                            bounceRate={performanceData.bounceRate}
                            conversionRate={performanceData.conversionRate}
                            engagementByDay={performanceData.engagementByDay}
                          />
                        ) : (
                          <p className="text-gray-500">No performance data available</p>
                        )}
                      </div>
                    )}
                    
                    {viewConfig.showEngagementChart && (
                      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Engagement Analysis</h2>
                        {performanceData ? (
                          <EngagementChart 
                            engagementData={performanceData.engagementByDay}
                            dateRange={dateRange}
                          />
                        ) : (
                          <p className="text-gray-500">No engagement data available</p>
                        )}
                      </div>
                    )}
                    
                    {viewConfig.showLeadGeneration && (
                      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Lead Management</h2>
                        {leads ? (
                          <LeadGeneration 
                            leads={leads}
                            conversionRate={performanceData?.conversionRate || 0}
                          />
                        ) : (
                          <p className="text-gray-500">No lead data available</p>
                        )}
                      </div>
                    )}
                    
                    {viewConfig.showABTesting && (
                      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">A/B Testing</h2>
                        {abTests ? (
                          <ABTestingPanel 
                            tests={abTests}
                            listingId={id}
                          />
                        ) : (
                          <p className="text-gray-500">No A/B testing data available</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            
            {/* Preferences tab */}
            {activeTab === 'preferences' && viewConfig.showPreferences && (
              <DashboardPreferences 
                preferences={preferences}
                onSave={savePreferences}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            )}
            
            {/* Export tab */}
            {activeTab === 'export' && viewConfig.showExportOptions && (
              <ExportPanel 
                onExport={handleExport}
                isExporting={isExporting}
              />
            )}
            
            {/* Email report tab */}
            {activeTab === 'email' && viewConfig.showEmailReports && (
              <EmailReportForm 
                email={email}
                setEmail={setEmail}
                onSend={handleSendEmailReport}
                isSending={isSendingEmail}
              />
            )}
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ListingAnalyticsPage; 