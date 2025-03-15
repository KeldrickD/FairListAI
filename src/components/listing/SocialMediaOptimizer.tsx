import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { PropertyData } from './PropertyForm'
import { useToast } from '@/components/ui/use-toast'

// Platform-specific character limits
const PLATFORM_LIMITS = {
  instagram: 2200,
  facebook: 63206,
  tiktok: 2200,
  linkedin: 3000,
  twitter: 280
}

// Platform-specific hashtag recommendations
const PLATFORM_HASHTAG_COUNTS = {
  instagram: { min: 5, max: 30, optimal: 11 },
  facebook: { min: 0, max: 5, optimal: 2 },
  tiktok: { min: 3, max: 10, optimal: 5 },
  linkedin: { min: 0, max: 3, optimal: 2 },
  twitter: { min: 1, max: 3, optimal: 2 }
}

interface SocialMediaOptimizerProps {
  propertyData: PropertyData
  generatedListing: {
    description: string
    socialMedia: {
      instagram: string
      facebook: string
      tiktok: string
      linkedin?: string
      twitter?: string
    }
    hashtags: string[]
  }
  onOptimize: (optimizedSocialMedia: {
    instagram: string
    facebook: string
    tiktok: string
    linkedin: string
    twitter: string
    hashtags: string[]
  }) => void
  onPost?: (platform: string, content: string) => Promise<boolean>
}

export function SocialMediaOptimizer({
  propertyData,
  generatedListing,
  onOptimize,
  onPost
}: SocialMediaOptimizerProps) {
  const { toast } = useToast()
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'twitter'>('instagram')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isPosting, setIsPosting] = useState<string | null>(null)
  const [optimizationOptions, setOptimizationOptions] = useState({
    emoji: true,
    hashtags: true,
    callToAction: true,
    locationTags: true,
    mentionBrokerage: false
  })
  const [hashtagCount, setHashtagCount] = useState<number>(
    PLATFORM_HASHTAG_COUNTS[activePlatform].optimal
  )
  const [customHashtags, setCustomHashtags] = useState<string[]>([])
  const [optimizedContent, setOptimizedContent] = useState<{
    instagram: string
    facebook: string
    tiktok: string
    linkedin: string
    twitter: string
    hashtags: string[]
  }>({
    instagram: generatedListing.socialMedia.instagram || '',
    facebook: generatedListing.socialMedia.facebook || '',
    tiktok: generatedListing.socialMedia.tiktok || '',
    linkedin: generatedListing.socialMedia.linkedin || generateLinkedInPost(propertyData, generatedListing.description),
    twitter: generatedListing.socialMedia.twitter || generateTwitterPost(propertyData),
    hashtags: generatedListing.hashtags || []
  })

  // Generate a LinkedIn post if not available
  function generateLinkedInPost(propertyData: PropertyData, description: string): string {
    const shortDesc = description.length > 200 
      ? description.substring(0, 197) + '...' 
      : description;
    
    return `🏡 New Listing Alert! 🏡\n\n${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath ${propertyData.propertyType} in ${propertyData.location}.\n\n${shortDesc}\n\nContact me for more details or to schedule a viewing!`;
  }

  // Generate a Twitter post if not available
  function generateTwitterPost(propertyData: PropertyData): string {
    return `Just listed: ${propertyData.bedrooms}bd/${propertyData.bathrooms}ba ${propertyData.propertyType} in ${propertyData.location}. Contact for details! #RealEstate #JustListed`;
  }

  // Get character count for the current platform
  const getCharacterCount = (platform: string) => {
    const content = optimizedContent[platform as keyof typeof optimizedContent] as string;
    return content ? content.length : 0;
  }

  // Check if character count exceeds platform limit
  const isOverLimit = (platform: string) => {
    const count = getCharacterCount(platform);
    const limit = PLATFORM_LIMITS[platform as keyof typeof PLATFORM_LIMITS];
    return count > limit;
  }

  // Get character limit display text
  const getCharacterLimitText = (platform: string) => {
    const count = getCharacterCount(platform);
    const limit = PLATFORM_LIMITS[platform as keyof typeof PLATFORM_LIMITS];
    return `${count}/${limit} characters`;
  }

  // Get color class based on character count
  const getCharacterCountColor = (platform: string) => {
    const count = getCharacterCount(platform);
    const limit = PLATFORM_LIMITS[platform as keyof typeof PLATFORM_LIMITS];
    
    if (count > limit) return 'text-red-500';
    if (count > limit * 0.9) return 'text-yellow-500';
    return 'text-green-500';
  }

  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    setActivePlatform(platform as any);
    setHashtagCount(PLATFORM_HASHTAG_COUNTS[platform as keyof typeof PLATFORM_HASHTAG_COUNTS].optimal);
  }

  // Toggle optimization options
  const toggleOption = (option: keyof typeof optimizationOptions) => {
    setOptimizationOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  }

  // Generate optimized social media content
  const generateOptimizedContent = () => {
    setIsOptimizing(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newOptimizedContent = {
        ...optimizedContent
      };
      
      // Generate optimized content for each platform
      Object.keys(PLATFORM_LIMITS).forEach(platform => {
        let content = '';
        const platformKey = platform as keyof typeof optimizedContent;
        
        // Base content structure
        switch (platform) {
          case 'instagram':
            content = generateInstagramCaption();
            break;
          case 'facebook':
            content = generateFacebookPost();
            break;
          case 'tiktok':
            content = generateTikTokCaption();
            break;
          case 'linkedin':
            content = generateLinkedInPost(propertyData, generatedListing.description);
            break;
          case 'twitter':
            content = generateTwitterPost(propertyData);
            break;
        }
        
        newOptimizedContent[platformKey] = content;
      });
      
      // Generate optimized hashtags
      const newHashtags = generateOptimizedHashtags();
      newOptimizedContent.hashtags = newHashtags;
      
      setOptimizedContent(newOptimizedContent);
      onOptimize(newOptimizedContent);
      
      toast({
        title: 'Social Media Content Optimized!',
        description: 'Your social media captions have been optimized for each platform.',
      });
      
      setIsOptimizing(false);
    }, 1500);
  }

  // Generate Instagram caption
  const generateInstagramCaption = () => {
    let caption = `✨ NEW LISTING ✨\n\n`;
    
    // Add property details
    caption += `${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath ${propertyData.propertyType} in ${propertyData.location}\n\n`;
    
    // Add description (shortened)
    const shortDesc = generatedListing.description.length > 300 
      ? generatedListing.description.substring(0, 297) + '...' 
      : generatedListing.description;
    
    caption += `${shortDesc}\n\n`;
    
    // Add emojis if option is selected
    if (optimizationOptions.emoji) {
      caption = addEmojisToCaption(caption, 'instagram');
    }
    
    // Add call to action if option is selected
    if (optimizationOptions.callToAction) {
      caption += `👉 DM for more info or to schedule a viewing!\n\n`;
    }
    
    // Add location tags if option is selected
    if (optimizationOptions.locationTags) {
      caption += `📍 ${propertyData.location}\n\n`;
    }
    
    // Add mention if option is selected
    if (optimizationOptions.mentionBrokerage) {
      caption += `Listed by @yourbrokerage\n\n`;
    }
    
    // Add hashtags if option is selected
    if (optimizationOptions.hashtags) {
      const hashtagsToUse = generatedListing.hashtags.slice(0, hashtagCount);
      caption += `.\n.\n.\n${hashtagsToUse.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}`;
    }
    
    return caption;
  }

  // Generate Facebook post
  const generateFacebookPost = () => {
    let post = `🏡 JUST LISTED 🏡\n\n`;
    
    // Add property details
    post += `${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath ${propertyData.propertyType} in ${propertyData.location}\n\n`;
    
    // Add full description
    post += `${generatedListing.description}\n\n`;
    
    // Add emojis if option is selected
    if (optimizationOptions.emoji) {
      post = addEmojisToCaption(post, 'facebook');
    }
    
    // Add call to action if option is selected
    if (optimizationOptions.callToAction) {
      post += `Contact me for more information or to schedule a viewing!\n\n`;
    }
    
    // Add mention if option is selected
    if (optimizationOptions.mentionBrokerage) {
      post += `Listed by Your Brokerage\n\n`;
    }
    
    // Add hashtags if option is selected (Facebook uses fewer hashtags)
    if (optimizationOptions.hashtags) {
      const hashtagsToUse = generatedListing.hashtags.slice(0, Math.min(3, hashtagCount));
      post += `${hashtagsToUse.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}`;
    }
    
    return post;
  }

  // Generate TikTok caption
  const generateTikTokCaption = () => {
    let caption = `Check out this ${propertyData.propertyType} in ${propertyData.location}! ✨\n\n`;
    
    // Add brief property details
    caption += `${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath\n`;
    
    // Add emojis if option is selected
    if (optimizationOptions.emoji) {
      caption = addEmojisToCaption(caption, 'tiktok');
    }
    
    // Add call to action if option is selected
    if (optimizationOptions.callToAction) {
      caption += `\nDM for details! 📲\n`;
    }
    
    // Add hashtags if option is selected (TikTok uses moderate hashtags)
    if (optimizationOptions.hashtags) {
      const hashtagsToUse = generatedListing.hashtags.slice(0, hashtagCount);
      caption += `\n${hashtagsToUse.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}`;
    }
    
    return caption;
  }

  // Add emojis to caption based on platform
  const addEmojisToCaption = (caption: string, platform: string) => {
    const propertyTypeEmojis: Record<string, string> = {
      'house': '🏠',
      'apartment': '🏢',
      'condo': '🏙️',
      'townhouse': '🏘️',
      'villa': '🏛️',
      'cottage': '🏡',
      'mansion': '🏰',
      'studio': '🏠',
      'duplex': '🏠',
      'penthouse': '🏙️'
    };
    
    const featureEmojis = ['✨', '🔑', '🏠', '🏡', '🌟', '💎', '🌈', '🌞', '🌊', '🌲', '🏞️', '🏔️'];
    
    // Add property type emoji
    const propertyType = propertyData.propertyType.toLowerCase();
    const propertyEmoji = propertyTypeEmojis[propertyType] || '🏠';
    
    // Replace property type with emoji + property type
    caption = caption.replace(
      new RegExp(`\\b${propertyData.propertyType}\\b`, 'i'),
      `${propertyEmoji} ${propertyData.propertyType}`
    );
    
    // Add random feature emojis based on platform
    if (platform === 'instagram' || platform === 'tiktok') {
      // More emojis for Instagram and TikTok
      const emojiCount = 3;
      const selectedEmojis = [];
      
      for (let i = 0; i < emojiCount; i++) {
        const randomIndex = Math.floor(Math.random() * featureEmojis.length);
        selectedEmojis.push(featureEmojis[randomIndex]);
      }
      
      caption = caption.replace('NEW LISTING', `NEW LISTING ${selectedEmojis.join(' ')}`);
    } else if (platform === 'facebook' || platform === 'linkedin') {
      // Fewer emojis for Facebook and LinkedIn
      const randomIndex = Math.floor(Math.random() * featureEmojis.length);
      caption = caption.replace('JUST LISTED', `JUST LISTED ${featureEmojis[randomIndex]}`);
    }
    
    return caption;
  }

  // Generate optimized hashtags
  const generateOptimizedHashtags = () => {
    const baseHashtags = generatedListing.hashtags || [];
    const propertyTypeTag = propertyData.propertyType.toLowerCase().replace(/\s+/g, '');
    const locationTag = propertyData.location.toLowerCase().replace(/\s+/g, '').replace(',', '');
    
    const commonHashtags = [
      'realestate',
      'realtor',
      'home',
      'property',
      'forsale',
      'investment',
      'newhome',
      'dreamhome',
      'househunting',
      'homesweethome',
      'luxuryrealestate',
      'realestateagent',
      'realestateinvestor',
      'homesforsale',
      'realestatephotography',
      'architecture',
      'interiordesign',
      'mortgage',
      'homeinspection',
      'justlisted'
    ];
    
    // Add property-specific hashtags
    const specificHashtags = [
      propertyTypeTag,
      locationTag,
      `${propertyData.bedrooms}bedroom`,
      `${propertyData.bathrooms}bathroom`,
      `${locationTag}realestate`,
      'newlisting',
      'openhouse',
      'homeforsale'
    ];
    
    // Combine all hashtags and remove duplicates
    const allHashtags = [...baseHashtags, ...specificHashtags];
    const uniqueHashtags = [...new Set(allHashtags)];
    
    // Add common hashtags if we need more
    if (uniqueHashtags.length < 30) {
      const neededCount = 30 - uniqueHashtags.length;
      const shuffledCommon = [...commonHashtags].sort(() => 0.5 - Math.random());
      const additionalHashtags = shuffledCommon.slice(0, neededCount);
      uniqueHashtags.push(...additionalHashtags);
    }
    
    // Add custom hashtags if any
    if (customHashtags.length > 0) {
      uniqueHashtags.push(...customHashtags);
    }
    
    // Remove duplicates again and return
    return [...new Set(uniqueHashtags)];
  }

  // Handle post to social media
  const handlePost = async (platform: string) => {
    if (!onPost) return;
    
    setIsPosting(platform);
    
    try {
      const content = optimizedContent[platform as keyof typeof optimizedContent] as string;
      const success = await onPost(platform, content);
      
      if (success) {
        toast({
          title: 'Posted Successfully!',
          description: `Your content has been posted to ${platform.charAt(0).toUpperCase() + platform.slice(1)}.`,
        });
      } else {
        toast({
          title: 'Post Failed',
          description: `There was an error posting to ${platform}.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Post Failed',
        description: `There was an error posting to ${platform}.`,
        variant: 'destructive',
      });
    } finally {
      setIsPosting(null);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Social Media Optimizer</h2>
      </div>
      
      <Tabs defaultValue="instagram" onValueChange={handlePlatformChange}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold">
                {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} Caption
              </h3>
              <span className={`text-xs font-medium ${getCharacterCountColor(activePlatform)}`}>
                {getCharacterLimitText(activePlatform)}
              </span>
            </div>
            
            <div className="relative">
              <div className="p-4 bg-gray-50 rounded-md border min-h-[200px] whitespace-pre-wrap">
                {optimizedContent[activePlatform]}
              </div>
              
              {isOverLimit(activePlatform) && (
                <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Over character limit!
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(optimizedContent[activePlatform]);
                  toast({
                    title: 'Copied!',
                    description: `${activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} caption copied to clipboard.`,
                  });
                }}
                className="flex-1"
              >
                Copy
              </Button>
              
              {onPost && (
                <Button
                  onClick={() => handlePost(activePlatform)}
                  disabled={isPosting !== null || isOverLimit(activePlatform)}
                  className="flex-1"
                >
                  {isPosting === activePlatform ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>Post to {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)}</>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-4">Optimization Options</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hashtag-count">Hashtag Count ({hashtagCount})</Label>
                    <span className="text-xs text-gray-500">
                      Recommended: {PLATFORM_HASHTAG_COUNTS[activePlatform].optimal}
                    </span>
                  </div>
                  <Slider
                    id="hashtag-count"
                    min={PLATFORM_HASHTAG_COUNTS[activePlatform].min}
                    max={PLATFORM_HASHTAG_COUNTS[activePlatform].max}
                    step={1}
                    value={[hashtagCount]}
                    onValueChange={(value) => setHashtagCount(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emoji-option" 
                      checked={optimizationOptions.emoji}
                      onCheckedChange={() => toggleOption('emoji')}
                    />
                    <Label htmlFor="emoji-option">Include Emojis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hashtags-option" 
                      checked={optimizationOptions.hashtags}
                      onCheckedChange={() => toggleOption('hashtags')}
                    />
                    <Label htmlFor="hashtags-option">Include Hashtags</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cta-option" 
                      checked={optimizationOptions.callToAction}
                      onCheckedChange={() => toggleOption('callToAction')}
                    />
                    <Label htmlFor="cta-option">Add Call to Action</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="location-option" 
                      checked={optimizationOptions.locationTags}
                      onCheckedChange={() => toggleOption('locationTags')}
                    />
                    <Label htmlFor="location-option">Add Location Tags</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mention-option" 
                      checked={optimizationOptions.mentionBrokerage}
                      onCheckedChange={() => toggleOption('mentionBrokerage')}
                    />
                    <Label htmlFor="mention-option">Mention Brokerage</Label>
                  </div>
                </div>
                
                <Button
                  onClick={generateOptimizedContent}
                  disabled={isOptimizing}
                  className="w-full"
                >
                  {isOptimizing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Optimizing...
                    </>
                  ) : (
                    <>Optimize All Platforms</>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-4 border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Platform Best Practices</h3>
              </div>
              
              <div className="text-xs text-gray-600 space-y-2">
                {activePlatform === 'instagram' && (
                  <>
                    <p>• Use 5-30 hashtags (11 is optimal)</p>
                    <p>• Keep captions engaging but concise</p>
                    <p>• Use line breaks for readability</p>
                    <p>• Include a call-to-action</p>
                    <p>• Use relevant emojis to increase engagement</p>
                  </>
                )}
                
                {activePlatform === 'facebook' && (
                  <>
                    <p>• Keep posts under 80 words for best engagement</p>
                    <p>• Use 0-2 hashtags (too many reduce reach)</p>
                    <p>• Ask questions to encourage comments</p>
                    <p>• Include high-quality images</p>
                    <p>• Best times to post: Wed-Thu 10am-3pm</p>
                  </>
                )}
                
                {activePlatform === 'tiktok' && (
                  <>
                    <p>• Keep captions short and engaging</p>
                    <p>• Use 3-5 relevant hashtags</p>
                    <p>• Include trending hashtags when possible</p>
                    <p>• Add a clear call-to-action</p>
                    <p>• Use emojis to increase engagement</p>
                  </>
                )}
                
                {activePlatform === 'linkedin' && (
                  <>
                    <p>• Keep posts professional but conversational</p>
                    <p>• Use 0-3 hashtags maximum</p>
                    <p>• Include industry insights when possible</p>
                    <p>• Best times to post: Tue-Thu 9am-12pm</p>
                    <p>• Avoid excessive emojis</p>
                  </>
                )}
                
                {activePlatform === 'twitter' && (
                  <>
                    <p>• Keep tweets under 280 characters</p>
                    <p>• Use 1-2 relevant hashtags</p>
                    <p>• Include a link when possible</p>
                    <p>• Best times to post: Mon-Fri 8am-4pm</p>
                    <p>• Use concise, direct language</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Tabs>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-4">Hashtag Library</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {optimizedContent.hashtags.slice(0, 20).map((hashtag, index) => (
            <div key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
              #{hashtag.replace(/\s+/g, '')}
            </div>
          ))}
          {optimizedContent.hashtags.length > 20 && (
            <div className="bg-gray-100 px-2 py-1 rounded text-sm">
              +{optimizedContent.hashtags.length - 20} more
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => {
            const hashtagText = optimizedContent.hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
            navigator.clipboard.writeText(hashtagText);
            toast({
              title: 'Copied!',
              description: 'Hashtags copied to clipboard.',
            });
          }}
          className="w-full"
        >
          Copy All Hashtags
        </Button>
      </div>
    </Card>
  )
} 