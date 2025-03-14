import { useState } from 'react'
import { PropertyForm, PropertyData } from '@/components/listing/PropertyForm'
import { ListingPreview } from '@/components/listing/ListingPreview'
import { ComplianceChecker } from '@/components/listing/ComplianceChecker'
import { SeoOptimizer } from '@/components/listing/SeoOptimizer'
import { useToast } from '@/components/ui/use-toast'
import { apiRequest } from '@/lib/api'

export default function NewListing() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [generatedListing, setGeneratedListing] = useState<{
    description: string
    socialMedia: {
      instagram: string
      facebook: string
      tiktok: string
    }
    hashtags: string[]
  } | null>(null)
  const [complianceIssues, setComplianceIssues] = useState<Array<{
    type: 'warning' | 'error'
    message: string
    suggestion: string
  }>>([])
  const [seoMetrics, setSeoMetrics] = useState<Array<{
    name: string
    score: number
    maxScore: number
    suggestions: string[]
  }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: PropertyData) => {
    setIsLoading(true)
    setPropertyData(data)

    try {
      // Generate listing
      const listingResponse = await apiRequest('/api/listings/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!listingResponse.success) {
        throw new Error(listingResponse.message || 'Failed to generate listing')
      }

      setGeneratedListing(listingResponse.data)

      // Check compliance
      const complianceResponse = await apiRequest('/api/compliance/check', {
        method: 'POST',
        body: JSON.stringify({ text: listingResponse.data.description }),
      })

      if (complianceResponse.success) {
        setComplianceIssues(complianceResponse.data.issues)
      }

      // Get SEO metrics
      const seoResponse = await apiRequest('/api/seo/analyze', {
        method: 'POST',
        body: JSON.stringify({
          title: `${data.bedrooms} Bed, ${data.bathrooms} Bath ${data.propertyType} in ${data.location}`,
          description: listingResponse.data.description,
        }),
      })

      if (seoResponse.success) {
        setSeoMetrics(seoResponse.data.metrics)
      }

      toast({
        title: 'Success!',
        description: 'Your listing has been generated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate listing',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied!',
        description: 'Text has been copied to clipboard.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy text to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = async () => {
    if (!generatedListing || !propertyData) return

    try {
      const response = await apiRequest('/api/listings/download', {
        method: 'POST',
        body: JSON.stringify({
          propertyData,
          generatedListing,
        }),
      })

      if (response.success) {
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `listing-${propertyData.location.toLowerCase().replace(/\s+/g, '-')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: 'Success!',
          description: 'Listing has been downloaded successfully.',
        })
      } else {
        throw new Error(response.message || 'Failed to download listing')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to download listing',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Create New Listing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="space-y-6">
          {generatedListing && propertyData && (
            <>
              <ListingPreview
                propertyData={propertyData}
                generatedListing={generatedListing}
                onEdit={() => setGeneratedListing(null)}
                onCopy={handleCopy}
                onDownload={handleDownload}
              />

              <ComplianceChecker
                text={generatedListing.description}
                issues={complianceIssues}
              />

              <SeoOptimizer
                metrics={seoMetrics}
                keywords={[
                  `${propertyData.bedrooms} bed`,
                  `${propertyData.bathrooms} bath`,
                  propertyData.propertyType,
                  propertyData.location,
                ]}
                title={`${propertyData.bedrooms} Bed, ${propertyData.bathrooms} Bath ${propertyData.propertyType} in ${propertyData.location}`}
                description={generatedListing.description}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
} 