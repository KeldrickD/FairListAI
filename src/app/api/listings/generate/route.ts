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
    const socialMediaPrompt = `Create three short and engaging social media captions for this property. Each caption must be under 150 characters:

    Property: ${descriptionResponse.choices[0].message.content}
    
    Format your response exactly like this (keep the labels):
    Instagram: [Short caption with emojis - max 150 chars]
    Facebook: [Engaging caption with key features - max 150 chars]
    TikTok: [Trendy caption with hashtags - max 150 chars]`

    const socialMediaResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who creates concise, engaging real estate content. Keep all captions under 150 characters."
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