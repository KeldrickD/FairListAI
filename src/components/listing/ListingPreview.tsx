import * as React from "react"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyData } from './PropertyForm'

interface ListingPreviewProps {
  propertyData: PropertyData
  generatedListing: {
    description: string
    socialMedia: {
      instagram: string
      facebook: string
      tiktok: string
    }
    hashtags: string[]
    seoOptimized?: boolean
    seoTitle?: string
  }
  onEdit: () => void
  onCopy: (text: string) => void
  onDownload: () => void
}

export function ListingPreview({
  propertyData,
  generatedListing,
  onEdit,
  onCopy,
  onDownload,
}: ListingPreviewProps): React.JSX.Element {
  // Generate a default title if no SEO title is provided
  const listingTitle = `${propertyData.bedrooms} Bed, ${propertyData.bathrooms} Bath ${propertyData.propertyType} in ${propertyData.location}`;
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Generated Listing</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button onClick={onDownload}>
            Download
          </Button>
        </div>
      </div>

      {/* Display SEO optimized badge if listing is optimized */}
      {generatedListing.seoOptimized && (
        <div className="mb-4 flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <span className="mr-1">✨</span>
            SEO Optimized
          </span>
        </div>
      )}

      {/* Display title */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Title</h3>
        <p className="text-lg font-medium">
          {generatedListing.seoOptimized && generatedListing.seoTitle ? generatedListing.seoTitle : listingTitle}
        </p>
        {generatedListing.seoOptimized && generatedListing.seoTitle && (
          <Button
            variant="ghost"
            onClick={() => onCopy(generatedListing.seoTitle || '')}
            className="mt-2 h-8 px-2 text-xs"
          >
            Copy Title
          </Button>
        )}
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <div className="prose max-w-none">
            <p>{generatedListing.description}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onCopy(generatedListing.description)}
            className="w-full"
          >
            Copy Description
          </Button>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Instagram</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {generatedListing.socialMedia.instagram}
              </p>
              <Button
                variant="outline"
                onClick={() => onCopy(generatedListing.socialMedia.instagram)}
                className="w-full"
              >
                Copy Instagram Caption
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Facebook</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {generatedListing.socialMedia.facebook}
              </p>
              <Button
                variant="outline"
                onClick={() => onCopy(generatedListing.socialMedia.facebook)}
                className="w-full"
              >
                Copy Facebook Post
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">TikTok</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {generatedListing.socialMedia.tiktok}
              </p>
              <Button
                variant="outline"
                onClick={() => onCopy(generatedListing.socialMedia.tiktok)}
                className="w-full"
              >
                Copy TikTok Caption
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {generatedListing.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="bg-secondary px-2 py-1 rounded-md text-sm"
              >
                {hashtag}
              </span>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => onCopy(generatedListing.hashtags.join(' '))}
            className="w-full"
          >
            Copy All Hashtags
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 