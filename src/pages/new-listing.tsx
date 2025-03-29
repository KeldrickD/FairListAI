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
    headlines?: string[]
    description: string
    socialMedia: {
      instagram: string
      facebook: string
      linkedin?: string
      twitter?: string
    }
    email?: string
    neighborhood?: string
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
          title: listingResponse.data.headlines ? listingResponse.data.headlines[0] : `${data.bedrooms} Bed, ${data.bathrooms} Bath ${data.propertyType} in ${data.location}`,
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
      // Create a title from the property details or use the first headline
      const title = generatedListing.headlines && generatedListing.headlines.length > 0 
        ? generatedListing.headlines[0] 
        : `${propertyData.bedrooms} Bed, ${propertyData.bathrooms} Bath ${propertyData.propertyType} in ${propertyData.location}`;
      
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
        email: generatedListing.email,
        neighborhood: generatedListing.neighborhood,
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
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-7">
          {isLoading ? (
            <ListingPreview 
              description=""
              isLoading={true}
              onCopy={handleCopy}
              onDownload={handleDownload}
            />
          ) : generatedListing ? (
            <div className="space-y-6">
              <ListingPreview 
                description={generatedListing.description}
                headlines={generatedListing.headlines}
                socialMedia={generatedListing.socialMedia}
                email={generatedListing.email}
                neighborhood={generatedListing.neighborhood}
                hashtags={generatedListing.hashtags}
                onCopy={handleCopy}
                onDownload={handleDownload}
              />
              
              {complianceIssues.length > 0 && (
                <ComplianceChecker
                  issues={complianceIssues}
                  text={generatedListing.description}
                  onChange={(text) => setGeneratedListing({...generatedListing, description: text })}
                />
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSaveListing}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-[#2F5DE3] text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Listing'}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 border border-[#2F5DE3] text-[#2F5DE3] rounded-md hover:bg-indigo-50 transition-colors"
                >
                  Download PDF
                </button>
              </div>
              
              <SocialMediaOptimizer 
                content={generatedListing.description}
                onOptimize={handleSocialMediaOptimize}
                onPost={handleSocialMediaPost}
                isPosting={isPosting}
              />
              
              <SeoOptimizer 
                title={generatedListing.headlines ? generatedListing.headlines[0] : ''}
                description={generatedListing.description}
                metrics={seoMetrics}
                onOptimize={(optimized) => {
                  setGeneratedListing({
                    ...generatedListing,
                    description: optimized.description,
                    seoOptimized: true,
                    seoTitle: optimized.title
                  })
                }}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">Enter property details</h2>
              <p>Fill out the form on the left to generate your listing.</p>
              <Tutorial
                steps={[
                  {
                    title: 'Enter property details',
                    content: 'Fill in information about your property including features and amenities.'
                  },
                  {
                    title: 'Generate listing',
                    content: 'Click "Generate Listing" to create your AI-powered property description.'
                  },
                  {
                    title: 'Review and edit',
                    content: 'Check the generated content and make any necessary edits.'
                  },
                  {
                    title: 'Download or share',
                    content: 'Save your listing or download it as a PDF for your marketing materials.'
                  }
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 