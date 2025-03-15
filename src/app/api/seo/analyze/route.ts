import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SeoAnalysisRequest {
  title: string
  description: string
}

interface SeoMetric {
  name: string
  score: number
  maxScore: number
  suggestions: string[]
}

export async function POST(request: Request) {
  try {
    const { title, description }: SeoAnalysisRequest = await request.json()

    const seoPrompt = `Analyze the following property listing for SEO optimization:
    
    Title: ${title}
    Description: ${description}
    
    Evaluate each metric below and provide a score from 0-10 and specific suggestions for improvement:
    1. Title Length (max 60 characters)
    2. Description Length (optimal 150-160 characters)
    3. Keyword Usage (natural integration of key terms)
    4. Readability (clear, engaging language)
    5. Call-to-Action (clear next steps)
    
    Format your response as a JSON array with exactly these 5 metrics. Example:
    {
      "metrics": [
        {
          "name": "Title Length",
          "score": 8,
          "maxScore": 10,
          "suggestions": ["Your title is good but could be shortened by 5 characters"]
        },
        {
          "name": "Description Length",
          "score": 7,
          "maxScore": 10,
          "suggestions": ["Add 20 more characters to reach optimal length"]
        }
      ]
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Return ONLY a valid JSON object with a 'metrics' array containing exactly 5 metrics. Each metric must have a score between 0-10."
        },
        {
          role: "user",
          content: seoPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    let metrics: SeoMetric[] = []
    try {
      const content = response.choices[0]?.message?.content || '{"metrics": []}'
      const parsed = JSON.parse(content)
      
      if (Array.isArray(parsed.metrics)) {
        metrics = parsed.metrics.map(metric => ({
          name: String(metric.name || ''),
          score: Math.min(Math.max(Number(metric.score) || 0, 0), 10),
          maxScore: 10,
          suggestions: Array.isArray(metric.suggestions) ? metric.suggestions.map(String) : []
        }))
      }

      // Ensure we have all 5 required metrics
      const requiredMetrics = [
        'Title Length',
        'Description Length',
        'Keyword Usage',
        'Readability',
        'Call-to-Action'
      ]

      // Add any missing metrics with default values
      requiredMetrics.forEach(name => {
        if (!metrics.some(m => m.name === name)) {
          metrics.push({
            name,
            score: 0,
            maxScore: 10,
            suggestions: ['Analysis not available. Please try again.']
          })
        }
      })
    } catch (error) {
      console.error('Error parsing SEO metrics:', error)
      metrics = []
    }

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