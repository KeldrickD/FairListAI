import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const BANNED_PHRASES = [
  "perfect for",
  "ideal for",
  "suited for",
  "walking distance to church",
  "exclusive",
  "private",
  "integrated",
  "traditional",
  "family-friendly",
];

export interface ComplianceCheck {
  isCompliant: boolean;
  violations: string[];
  suggestions: string[];
}

export async function generateListing(listing: {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  features: string;
}): Promise<{
  listing: string;
  seoScore: number;
  compliance: ComplianceCheck;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a real estate listing expert that generates Fair Housing Act compliant listings. 
          Focus on property features and avoid any language that could discriminate. 
          Use SEO-friendly terms and natural descriptions. Return results in JSON format with listing text, SEO score (0-100), and compliance details.`
        },
        {
          role: "user",
          content: `Generate a listing for:
          Type: ${listing.propertyType}
          Bedrooms: ${listing.bedrooms}
          Bathrooms: ${listing.bathrooms}
          Square Feet: ${listing.squareFeet}
          Features: ${listing.features}`
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in response");
    }

    const result = JSON.parse(response.choices[0].message.content);
    return {
      listing: result.listing,
      seoScore: result.seoScore,
      compliance: {
        isCompliant: result.compliance.isCompliant,
        violations: result.compliance.violations || [],
        suggestions: result.compliance.suggestions || []
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate listing: ${errorMessage}`);
  }
}