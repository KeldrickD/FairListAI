import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ComplianceCheckRequest {
  text: string
}

interface ComplianceIssue {
  type: string;
  message: string;
  suggestion: string;
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
    
    Return ONLY a valid JSON object with this exact format:
    {
      "issues": [
        {
          "type": "warning",
          "message": "Description of the issue",
          "suggestion": "How to fix it"
        }
      ]
    }
    
    If no issues are found, return an empty array: {"issues": []}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a Fair Housing compliance expert. Return ONLY valid JSON with an 'issues' array containing compliance problems."
        },
        {
          role: "user",
          content: compliancePrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    let issues: ComplianceIssue[] = []
    try {
      const content = response.choices[0]?.message?.content || '{"issues": []}'
      const parsed = JSON.parse(content)
      
      if (Array.isArray(parsed.issues)) {
        issues = parsed.issues.map((issue: any) => ({
          type: issue.type === 'error' ? 'error' : 'warning',
          message: String(issue.message || ''),
          suggestion: String(issue.suggestion || '')
        }))
      }
    } catch (error) {
      console.error('Error parsing compliance issues:', error)
      issues = []
    }

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