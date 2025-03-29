import * as React from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Clipboard, Download, Check, Edit, Mail, MapPin } from 'lucide-react'
import { useState } from 'react'

interface ListingPreviewProps {
  description: string
  socialMedia?: {
    instagram: string
    facebook: string
    linkedin?: string
    twitter?: string
  }
  headlines?: string[]
  email?: string
  neighborhood?: string
  hashtags?: string[]
  onCopy: (text: string) => void
  onDownload: () => void
  isLoading?: boolean
}

export function ListingPreview({
  description,
  socialMedia,
  headlines,
  email,
  neighborhood,
  hashtags = [],
  onCopy,
  onDownload,
  isLoading = false,
}: ListingPreviewProps) {
  const [activeTab, setActiveTab] = useState('description')
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, section: string) => {
    onCopy(text)
    setCopied(section)
    setTimeout(() => setCopied(null), 2000)
  }
  
  const formatDescription = (text: string) => {
    // Add paragraph breaks to make the description more readable
    return text.replace(/\n/g, '<br />').replace(/\.\s+/g, '.<br /><br />').trim()
  }

  const getNextHeadline = () => {
    if (!headlines || headlines.length === 0) return;
    setHeadlineIndex((headlineIndex + 1) % headlines.length);
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generating your listing...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-gray-100 flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <CardTitle>
            {headlines && headlines.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span>{headlines[headlineIndex]}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={getNextHeadline}
                    className="h-6 w-6"
                    title="Try another headline"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {headlineIndex + 1} of {headlines.length} headlines
                </div>
              </>
            ) : (
              'Your Listing Preview'
            )}
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDownload} title="Download listing">
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b rounded-none px-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
        </TabsList>
        <CardContent className="p-6">
          <TabsContent value="description" className="mt-0">
            <div className="space-y-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
              />
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {hashtags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                  {hashtags.length > 5 && <Badge variant="outline">+{hashtags.length - 5} more</Badge>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(description, 'description')}
                  disabled={copied === 'description'}
                >
                  {copied === 'description' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4 mr-1" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <div className="space-y-6">
              {socialMedia?.instagram && (
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Instagram</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(socialMedia.instagram, 'instagram')}
                      disabled={copied === 'instagram'}
                    >
                      {copied === 'instagram' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm">{socialMedia.instagram}</p>
                </div>
              )}
              
              {socialMedia?.facebook && (
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Facebook</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(socialMedia.facebook, 'facebook')}
                      disabled={copied === 'facebook'}
                    >
                      {copied === 'facebook' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm">{socialMedia.facebook}</p>
                </div>
              )}
              
              {socialMedia?.linkedin && (
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">LinkedIn</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(socialMedia.linkedin, 'linkedin')}
                      disabled={copied === 'linkedin'}
                    >
                      {copied === 'linkedin' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm">{socialMedia.linkedin}</p>
                </div>
              )}
              
              {socialMedia?.twitter && (
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Twitter/X</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(socialMedia.twitter, 'twitter')}
                      disabled={copied === 'twitter'}
                    >
                      {copied === 'twitter' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm">{socialMedia.twitter}</p>
                </div>
              )}
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Hashtags</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(hashtags.join(' '), 'hashtags')}
                    disabled={copied === 'hashtags'}
                  >
                    {copied === 'hashtags' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="mt-0">
            <div className="space-y-4">
              {email ? (
                <>
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-[#2F5DE3]" />
                        <h3 className="font-medium">Email Announcement</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(email, 'email')}
                        disabled={copied === 'email'}
                      >
                        {copied === 'email' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatDescription(email) }}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    <p>Pro tip: Customize this email with your contact information and a call-to-action before sending.</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Email template will appear here when generated.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="neighborhood" className="mt-0">
            <div className="space-y-4">
              {neighborhood ? (
                <>
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-[#2F5DE3]" />
                        <h3 className="font-medium">Neighborhood Highlights</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(neighborhood, 'neighborhood')}
                        disabled={copied === 'neighborhood'}
                      >
                        {copied === 'neighborhood' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatDescription(neighborhood) }}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    <p>Pro Subscribers: Upgrade to get walkability scores and school ratings integration.</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Neighborhood insights will appear here when generated.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
} 