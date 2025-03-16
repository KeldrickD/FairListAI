import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PropertyData } from '@/components/listing/PropertyForm'

// Configure OpenAI with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout for API requests
  maxRetries: 2, // Retry failed requests twice
})

// Set a longer timeout for the API route
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Use a specific region for better performance
}

export async function POST(request: Request) {
  try {
    const data: PropertyData = await request.json()

    // Generate the main listing description
    const descriptionPrompt = `Create a detailed and engaging property listing for a ${data.bedrooms} bed, ${data.bathrooms} bath ${data.propertyType} in ${data.location}. 
    Key features: ${data.features.join(', ')}. 
    Square footage: ${data.squareFeet}. 
    Price: $${data.price.toLocaleString()}. 
    Additional notes: ${data.additionalNotes}.
    
    Template: ${data.template || 'standard'}
    Writing Style: ${data.style || 'professional'}
    
    TEMPLATE GUIDELINES:
    - Standard Listing (200-300 words): Perfect for Zillow, Realtor.com, and Redfin-style descriptions.
    - Short Listing (100-150 words): Ideal for social media captions, MLS listings, and quick property overviews.
    - Luxury Home (300-350 words): For high-end properties with premium features and amenities.
    - Investment Property: Focuses on ROI, rental income, and investment potential.
    - New Construction: Highlights builder features, warranties, and modern amenities.
    - 55+ Community: Emphasizes lifestyle, amenities, and low-maintenance living.
    - Vacation Rental: Perfect for short-term rentals, highlighting getaway features.
    - Fixer-Upper/Foreclosure: Focuses on potential, investment opportunity, and value.
    
    WRITING STYLE GUIDELINES:
    - Standard Professional: Clear, concise, informative, and engaging.
    - Luxury & High-End: Elegant, sophisticated, upscale language.
    - Investor-Friendly: Direct, ROI-focused, clear financial value.
    - Casual & Friendly: Conversational, engaging, warm tone.
    - SEO-Optimized: Keyword-rich, designed for ranking in searches.
    - Storytelling / Lifestyle: Emotional, immersive, paints a picture.
    - Social Media Style: Short, punchy, high-energy, with emojis.
    
    The listing should be professional, highlight the property's best features, and be optimized for real estate websites.`

    // Process all OpenAI requests in parallel for better performance
    const [descriptionResponse, hashtagResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional real estate copywriter who creates engaging property listings. You adapt your writing style and format based on the specified template and style guidelines."
          },
          {
            role: "user",
            content: descriptionPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      
      // Generate relevant hashtags in parallel
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a social media expert who creates relevant hashtags for real estate content."
          },
          {
            role: "user",
            content: `Generate 10 relevant real estate hashtags for a ${data.propertyType} in ${data.location}.
            Include a mix of property-specific, location-specific, and general real estate hashtags.`
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      })
    ]);

    // Extract the description
    const description = descriptionResponse.choices[0].message.content;
    
    // Now generate social media captions with the description
    const socialMediaPrompt = `Create three short and engaging social media captions for this property. Each caption should be under 150 characters.
    Property: ${description}

    Writing Style: ${data.style || 'professional'}

    WRITING STYLE GUIDELINES:
    - Standard Professional: Clear, concise, informative, and engaging.
    - Luxury & High-End: Elegant, sophisticated, upscale language.
    - Investor-Friendly: Direct, ROI-focused, clear financial value.
    - Casual & Friendly: Conversational, engaging, warm tone.
    - SEO-Optimized: Keyword-rich, designed for ranking in searches.
    - Storytelling / Lifestyle: Emotional, immersive, paints a picture.
    - Social Media Style: Short, punchy, high-energy, with emojis.

    Format your response exactly like this (keep the labels):
    Instagram: [Short caption with emojis - max 150 chars]
    Facebook: [Engaging caption with key features - max 150 chars]
    TikTok: [Trendy caption with hashtags - max 150 chars]`

    const socialMediaResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who creates concise, engaging real estate content. Keep all captions under 150 characters and adapt your tone to match the specified writing style."
        },
        {
          role: "user",
          content: socialMediaPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "text" }
    })

    // Parse social media response
    const socialMediaText = socialMediaResponse.choices[0]?.message?.content || ''
    let instagram = '', facebook = '', tiktok = ''
    
    // More robust parsing of social media captions
    const lines = socialMediaText.split('\n').map(line => line.trim()).filter(Boolean)
    for (const line of lines) {
      const lowercaseLine = line.toLowerCase()
      if (lowercaseLine.startsWith('instagram:')) {
        instagram = line.substring('instagram:'.length).trim()
      } else if (lowercaseLine.startsWith('facebook:')) {
        facebook = line.substring('facebook:'.length).trim()
      } else if (lowercaseLine.startsWith('tiktok:')) {
        tiktok = line.substring('tiktok:'.length).trim()
      }
    }

    // Ensure captions don't exceed 150 characters
    const truncateCaption = (caption: string) => {
      return caption.length > 150 ? caption.substring(0, 147) + '...' : caption
    }

    instagram = truncateCaption(instagram || 'Check out this amazing property! ✨')
    facebook = truncateCaption(facebook || instagram)
    tiktok = truncateCaption(tiktok || instagram)

    // Parse hashtags
    const hashtags = hashtagResponse.choices[0]?.message?.content
      ?.split('\n')
      .filter(line => line.trim())
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`) || []

    return NextResponse.json({
      success: true,
      data: {
        description,
        socialMedia: {
          instagram: instagram.replace('Instagram:', '').trim(),
          facebook: facebook.replace('Facebook:', '').trim(),
          tiktok: tiktok.replace('TikTok:', '').trim(),
        },
        hashtags,
      },
    })
  } catch (error) {
    console.error('Error generating listing:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate listing',
      },
      { status: 500 }
    )
  }
} 