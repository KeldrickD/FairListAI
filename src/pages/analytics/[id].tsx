import React from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
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
            <p className="text-muted-foreground mb-6">
              The listing ID is missing or invalid. Please select a valid listing.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
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
          <AnalyticsDashboard listingId={id} />
        </div>
      </MainLayout>
    </>
  )
}

export default ListingAnalyticsPage 