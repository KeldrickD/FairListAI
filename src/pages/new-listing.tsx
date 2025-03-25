import { useState } from 'react'
import { PropertyForm, PropertyData } from '@/components/listing/PropertyForm'
import { ListingPreview } from '@/components/listing/ListingPreview'
import { ComplianceChecker } from '@/components/listing/ComplianceChecker'
import { SeoOptimizer } from '@/components/listing/SeoOptimizer'
import { SocialMediaOptimizer } from '@/components/listing/SocialMediaOptimizer'
import { useToast } from '@/components/ui/use-toast'
import { apiRequest } from '@/lib/api'
import { saveListing } from '@/lib/services/listingService'
import { useRouter } from 'next/router'
import { sendListingCreatedEmail } from '@/lib/services/emailService'
import { Tutorial } from '@/components/ui/Tutorial'

export default function NewListing() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [generatedListing, setGeneratedListing] = useState<{
    description: string
    socialMedia: {
      instagram: string
      facebook: string
      tiktok: string
      linkedin?: string
      twitter?: string
    }
    hashtags: string[]
    seoOptimized?: boolean
    seoTitle?: string
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
  const [isPosting, setIsPosting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

  // Handle social media optimization
  const handleSocialMediaOptimize = (optimizedSocialMedia: {
    instagram: string
    facebook: string
    tiktok: string
    linkedin: string
    twitter: string
    hashtags: string[]
  }) => {
    if (!generatedListing) return;
    
    setGeneratedListing({
      ...generatedListing,
      socialMedia: {
        instagram: optimizedSocialMedia.instagram,
        facebook: optimizedSocialMedia.facebook,
        tiktok: optimizedSocialMedia.tiktok,
        linkedin: optimizedSocialMedia.linkedin,
        twitter: optimizedSocialMedia.twitter
      },
      hashtags: optimizedSocialMedia.hashtags
    });
  }

  // Handle social media posting
  const handleSocialMediaPost = async (platform: string, content: string): Promise<boolean> => {
    setIsPosting(true);
    
    try {
      // Simulate API call to post to social media
      // In a real implementation, this would call a social media API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Posted Successfully!',
        description: `Your content has been posted to ${platform}.`,
      });
      
      setIsPosting(false);
      return true;
    } catch (error) {
      toast({
        title: 'Post Failed',
        description: `There was an error posting to ${platform}.`,
        variant: 'destructive',
      });
      
      setIsPosting(false);
      return false;
    }
  }

  // Add a new function to save the listing
  const handleSaveListing = async () => {
    if (!propertyData || !generatedListing) return;
    
    setIsSaving(true);
    try {
      // Create a title from the property details
      const title = `${propertyData.bedrooms} Bed, ${propertyData.bathrooms} Bath ${propertyData.propertyType} in ${propertyData.location}`;
      
      // Prepare the listing data
      const listingData = {
        title,
        location: propertyData.location,
        price: propertyData.price,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        description: generatedListing.description,
        propertyType: propertyData.propertyType,
        squareFeet: propertyData.squareFeet,
        features: propertyData.features,
        socialMedia: generatedListing.socialMedia,
        hashtags: generatedListing.hashtags,
        userId: 'demo-user-123', // In a real app, this would come from the authenticated user
      };
      
      // Save the listing
      const savedListing = await saveListing(listingData);
      
      // Send email notification
      // In a real app, you would get the user's email from the session
      await sendListingCreatedEmail('user@example.com', title);
      
      toast({
        title: 'Success!',
        description: 'Your listing has been saved to your dashboard.',
      });
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save listing',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Create New Listing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          <div className="relative">
            <Tutorial
              id="property-form-intro"
              title="Fill in Property Details"
              content="Enter information about the property to generate an AI-powered listing description."
              position="right"
              delay={1500}
            />
          </div>
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
              
              <div className="relative">
                <Tutorial
                  id="listing-preview-intro"
                  title="Review Your Listing"
                  content="Here's your AI-generated listing. You can edit, copy, or download it as needed."
                  position="left"
                  delay={3000}
                />
              </div>

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
                onOptimize={(optimizedData) => {
                  // Create a new listing with optimized SEO content
                  setGeneratedListing({
                    ...generatedListing,
                    description: optimizedData.description,
                    seoOptimized: true,
                    seoTitle: optimizedData.title
                  });
                  
                  toast({
                    title: 'SEO Optimized!',
                    description: 'Your listing has been optimized for better search engine visibility.',
                  });
                }}
              />
              
              <SocialMediaOptimizer
                propertyData={propertyData}
                generatedListing={generatedListing}
                onOptimize={handleSocialMediaOptimize}
                onPost={handleSocialMediaPost}
              />

              <button
                onClick={handleSaveListing}
                disabled={isSaving || !generatedListing}
                className="btn btn-primary flex items-center"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span> Saving...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span> Save to Dashboard
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 