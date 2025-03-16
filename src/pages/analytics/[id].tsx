import React from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '@/components/layout/MainLayout'

const ListingAnalyticsPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
            <p className="mb-4">Viewing analytics for listing ID: {id}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Views</h3>
                <p className="text-3xl font-bold">1,245</p>
                <p className="text-xs text-gray-500 mt-1">876 unique visitors</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Leads Generated</h3>
                <p className="text-3xl font-bold">24</p>
                <p className="text-xs text-gray-500 mt-1">4.8% conversion rate</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Time on Page</h3>
                <p className="text-3xl font-bold">2m 7s</p>
                <p className="text-xs text-gray-500 mt-1">32.5% bounce rate</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Social Engagement</h3>
                <p className="text-3xl font-bold">164</p>
                <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">Analytics Dashboard</h2>
              <p className="text-gray-500 mb-4">
                The full analytics dashboard is coming soon. Check back later for detailed metrics, 
                engagement charts, lead tracking, and A/B testing results.
              </p>
              <button 
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ListingAnalyticsPage 