import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SeoAnalysisRequest {
  title: string
  description: string
}

export async function POST(request: Request) {
  try {
    const { title, description }: SeoAnalysisRequest = await request.json()

    const seoPrompt = `Analyze the following property listing for SEO optimization:
    
    Title: ${title}
    Description: ${description}
    
    Evaluate the following metrics and provide specific suggestions for improvement:
    1. Title Length (max 60 characters)
    2. Description Length (optimal 150-160 characters)
    3. Keyword Usage (natural integration of key terms)
    4. Readability (clear, engaging language)
    5. Call-to-Action (clear next steps)
    
    Format the response as a JSON array of objects with these properties:
    {
      "name": "string",
      "score": number,
      "maxScore": number,
      "suggestions": string[]
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert who analyzes real estate listings for optimization opportunities."
        },
        {
          role: "user",
          content: seoPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const metrics = JSON.parse(response.choices[0].message.content || '[]')

    return NextResponse.json({
      success: true,
      data: {
        metrics,
      },
    })
  } catch (error) {
    console.error('Error analyzing SEO:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to analyze SEO',
      },
      { status: 500 }
    )
  }
} 