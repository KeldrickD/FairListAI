import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ComplianceCheckRequest {
  text: string
}

export async function POST(request: Request) {
  try {
    const { text }: ComplianceCheckRequest = await request.json()

    const compliancePrompt = `Analyze the following property listing for Fair Housing compliance issues. 
    Check for any discriminatory language or content that violates Fair Housing laws.
    Focus on protected classes: race, color, religion, sex, disability, familial status, and national origin.
    
    Listing text:
    ${text}
    
    For each issue found, provide:
    1. The type of issue (warning or error)
    2. A clear message explaining the problem
    3. A specific suggestion for how to fix it
    
    Format the response as a JSON array of objects with these properties:
    {
      "type": "warning" | "error",
      "message": "string",
      "suggestion": "string"
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a Fair Housing compliance expert who analyzes property listings for potential violations."
        },
        {
          role: "user",
          content: compliancePrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const issues = JSON.parse(response.choices[0].message.content || '[]')

    return NextResponse.json({
      success: true,
      data: {
        issues,
      },
    })
  } catch (error) {
    console.error('Error checking compliance:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to check compliance',
      },
      { status: 500 }
    )
  }
} 