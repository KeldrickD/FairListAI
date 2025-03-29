import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PropertyData } from '@/components/listing/PropertyForm'

// Configure OpenAI with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout for API requests
  maxRetries: 3, // Retry failed requests up to 3 times
})

// Updated config format for Next.js App Router
export const runtime = "edge";
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: Request) {
  try {
    const data: PropertyData = await request.json()

    // Create a more detailed prompt to generate better quality content
    const descriptionPrompt = `Generate engaging real estate content for a ${data.bedrooms} bed, ${data.bathrooms} bath ${data.propertyType} in ${data.location}. 
    Price: $${data.price.toLocaleString()}
    Size: ${data.squareFeet} sq ft
    Key Features: ${data.features.join(', ')}
    Additional Notes: ${data.additionalNotes || 'None'}
    Template: ${data.template || 'standard'}
    Writing Style: ${data.style || 'professional'}`

    // Use a single API call to generate all content at once with improved instructions
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for higher quality outputs
      messages: [
        {
          role: "system",
          content: `You are Listing Genie, a premium AI assistant for real estate agents that creates compelling, fair housing compliant content. 
          
          Create the following for this property:
          
          1. THREE HEADLINE OPTIONS (5-10 words each): Catchy, attention-grabbing headlines for the listing that highlight its best features
          
          2. PROPERTY DESCRIPTION (250-300 words): A professionally written, Fair Housing compliant property description that avoids clichés like "must-see" and "cozy"
          
          3. SOCIAL MEDIA CONTENT:
             - Instagram caption (with emojis, under 150 chars)
             - Facebook post (with key features, under 150 chars)
             - LinkedIn post (professional tone, under 200 chars)
             - Twitter/X post (concise with hashtags, under 280 chars)
          
          4. EMAIL BLAST (150-200 words): Email announcement template for the property
          
          5. NEIGHBORHOOD HIGHLIGHTS (100 words): Brief overview of the neighborhood perks, avoiding demographic assumptions
          
          6. RELEVANT HASHTAGS: 8-10 hashtags for social media
          
          Format your response exactly as follows:
          
          HEADLINES:
          1. [First headline]
          2. [Second headline]
          3. [Third headline]
          
          DESCRIPTION:
          [Property description]
          
          INSTAGRAM:
          [Instagram caption]
          
          FACEBOOK:
          [Facebook post]
          
          LINKEDIN:
          [LinkedIn post]
          
          TWITTER:
          [Twitter/X post]
          
          EMAIL:
          [Email blast template]
          
          NEIGHBORHOOD:
          [Neighborhood highlights]
          
          HASHTAGS:
          [Hashtags separated by spaces]`
        },
        {
          role: "user",
          content: descriptionPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    // Parse the response
    const content = response.choices[0].message.content || '';
    
    // Extract sections using regex
    const headlinesMatch = content.match(/HEADLINES:([\s\S]*?)(?=DESCRIPTION:|$)/i);
    const descriptionMatch = content.match(/DESCRIPTION:([\s\S]*?)(?=INSTAGRAM:|$)/i);
    const instagramMatch = content.match(/INSTAGRAM:([\s\S]*?)(?=FACEBOOK:|$)/i);
    const facebookMatch = content.match(/FACEBOOK:([\s\S]*?)(?=LINKEDIN:|$)/i);
    const linkedinMatch = content.match(/LINKEDIN:([\s\S]*?)(?=TWITTER:|$)/i);
    const twitterMatch = content.match(/TWITTER:([\s\S]*?)(?=EMAIL:|$)/i);
    const emailMatch = content.match(/EMAIL:([\s\S]*?)(?=NEIGHBORHOOD:|$)/i);
    const neighborhoodMatch = content.match(/NEIGHBORHOOD:([\s\S]*?)(?=HASHTAGS:|$)/i);
    const hashtagsMatch = content.match(/HASHTAGS:([\s\S]*?)$/i);
    
    // Extract and clean the content
    const headlines = headlinesMatch 
      ? headlinesMatch[1].trim().split(/\d+\.\s+/).filter(Boolean) 
      : [];
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    const instagram = instagramMatch ? instagramMatch[1].trim() : '';
    const facebook = facebookMatch ? facebookMatch[1].trim() : '';
    const linkedin = linkedinMatch ? linkedinMatch[1].trim() : '';
    const twitter = twitterMatch ? twitterMatch[1].trim() : '';
    const email = emailMatch ? emailMatch[1].trim() : '';
    const neighborhood = neighborhoodMatch ? neighborhoodMatch[1].trim() : '';
    
    // Parse hashtags
    const hashtags = hashtagsMatch 
      ? hashtagsMatch[1].trim().split(/\s+/).filter(tag => tag.startsWith('#'))
      : [];

    // Ensure captions don't exceed character limits
    const truncateCaption = (caption: string, limit: number) => {
      return caption.length > limit ? caption.substring(0, limit - 3) + '...' : caption;
    };

    return NextResponse.json({
      success: true,
      data: {
        headlines,
        description,
        socialMedia: {
          instagram: truncateCaption(instagram, 150),
          facebook: truncateCaption(facebook, 150),
          linkedin: truncateCaption(linkedin, 200),
          twitter: truncateCaption(twitter, 280),
        },
        email,
        neighborhood,
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