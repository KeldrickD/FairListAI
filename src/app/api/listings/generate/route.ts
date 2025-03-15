import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PropertyData } from '@/components/listing/PropertyForm'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const data: PropertyData = await request.json()

    // Generate the main listing description
    const descriptionPrompt = `Create a detailed and engaging property listing for a ${data.bedrooms} bed, ${data.bathrooms} bath ${data.propertyType} in ${data.location}. 
    Key features: ${data.features.join(', ')}. 
    Square footage: ${data.squareFeet}. 
    Price: $${data.price.toLocaleString()}. 
    Additional notes: ${data.additionalNotes}.
    
    The listing should be professional, highlight the property's best features, and be optimized for real estate websites.`

    const descriptionResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate copywriter who creates engaging property listings."
        },
        {
          role: "user",
          content: descriptionPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    // Generate social media captions
    const socialMediaPrompt = `Create engaging social media captions for the following property:
    ${descriptionResponse.choices[0].message.content}
    
    Create three different captions:
    1. Instagram: Short, engaging caption with emojis
    2. Facebook: More detailed caption with key features
    3. TikTok: Trendy, attention-grabbing caption with hashtags`

    const socialMediaResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who creates engaging real estate content."
        },
        {
          role: "user",
          content: socialMediaPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    // Parse social media response
    const socialMediaText = socialMediaResponse.choices[0]?.message?.content || ''
    let instagram = '', facebook = '', tiktok = ''
    
    // More robust parsing of social media captions
    const lines = socialMediaText.split('\n').map(line => line.trim()).filter(Boolean)
    for (const line of lines) {
      if (line.toLowerCase().includes('instagram:')) {
        instagram = line.substring(line.indexOf(':') + 1).trim()
      } else if (line.toLowerCase().includes('facebook:')) {
        facebook = line.substring(line.indexOf(':') + 1).trim()
      } else if (line.toLowerCase().includes('tiktok:')) {
        tiktok = line.substring(line.indexOf(':') + 1).trim()
      }
    }

    // If any caption is missing, use the first available caption
    const defaultCaption = instagram || facebook || tiktok || 'Check out this amazing property! ✨'
    instagram = instagram || defaultCaption
    facebook = facebook || defaultCaption
    tiktok = tiktok || defaultCaption

    // Generate relevant hashtags
    const hashtagPrompt = `Generate 10 relevant real estate hashtags for a ${data.propertyType} in ${data.location}. 
    Include a mix of property-specific, location-specific, and general real estate hashtags.`

    const hashtagResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who creates relevant hashtags for real estate content."
        },
        {
          role: "user",
          content: hashtagPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    })

    const hashtags = hashtagResponse.choices[0]?.message?.content
      ?.split('\n')
      .filter(line => line.trim())
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`) || []

    return NextResponse.json({
      success: true,
      data: {
        description: descriptionResponse.choices[0].message.content,
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