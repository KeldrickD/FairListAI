import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PropertyData } from '@/components/listing/PropertyForm'

// Configure OpenAI with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout for API requests
  maxRetries: 3, // Retry failed requests up to 3 times
})

// Set a longer timeout for the API route
export const config = {
  runtime: 'edge',
  maxDuration: 60, // Set maximum duration to 60 seconds
}

export async function POST(request: Request) {
  try {
    const data: PropertyData = await request.json()

    // Create a more concise prompt to reduce token usage and processing time
    const descriptionPrompt = `Create a property listing for a ${data.bedrooms} bed, ${data.bathrooms} bath ${data.propertyType} in ${data.location}. 
    Features: ${data.features.join(', ')}. 
    Size: ${data.squareFeet} sq ft. Price: $${data.price.toLocaleString()}. 
    Notes: ${data.additionalNotes}.
    Template: ${data.template || 'standard'}
    Style: ${data.style || 'professional'}`

    // Use a single API call to generate all content at once
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a faster model for better performance
      messages: [
        {
          role: "system",
          content: `You are a real estate content generator that creates:
          1. A property description (200-300 words)
          2. Three social media captions (under 150 chars each for Instagram, Facebook, TikTok)
          3. Ten relevant hashtags
          
          Format your response exactly as follows:
          DESCRIPTION:
          [Your property description here]
          
          INSTAGRAM:
          [Instagram caption with emojis]
          
          FACEBOOK:
          [Facebook caption with key features]
          
          TIKTOK:
          [TikTok caption with hashtags]
          
          HASHTAGS:
          #tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10`
        },
        {
          role: "user",
          content: descriptionPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    // Parse the response
    const content = response.choices[0].message.content || '';
    
    // Extract sections using regex
    const descriptionMatch = content.match(/DESCRIPTION:([\s\S]*?)(?=INSTAGRAM:|$)/i);
    const instagramMatch = content.match(/INSTAGRAM:([\s\S]*?)(?=FACEBOOK:|$)/i);
    const facebookMatch = content.match(/FACEBOOK:([\s\S]*?)(?=TIKTOK:|$)/i);
    const tiktokMatch = content.match(/TIKTOK:([\s\S]*?)(?=HASHTAGS:|$)/i);
    const hashtagsMatch = content.match(/HASHTAGS:([\s\S]*?)$/i);
    
    // Extract and clean the content
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    const instagram = instagramMatch ? instagramMatch[1].trim() : '';
    const facebook = facebookMatch ? facebookMatch[1].trim() : '';
    const tiktok = tiktokMatch ? tiktokMatch[1].trim() : '';
    
    // Parse hashtags
    const hashtags = hashtagsMatch 
      ? hashtagsMatch[1].trim().split(/\s+/).filter(tag => tag.startsWith('#'))
      : [];

    // Ensure captions don't exceed 150 characters
    const truncateCaption = (caption: string) => {
      return caption.length > 150 ? caption.substring(0, 147) + '...' : caption;
    };

    return NextResponse.json({
      success: true,
      data: {
        description,
        socialMedia: {
          instagram: truncateCaption(instagram),
          facebook: truncateCaption(facebook),
          tiktok: truncateCaption(tiktok),
        },
        hashtags,
      },
    });
  } catch (error) {
    console.error('Error generating listing:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate listing',
      },
      { status: 500 }
    );
  }
} 