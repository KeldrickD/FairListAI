import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

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

const TONE_DESCRIPTIONS = {
  luxury: "elegant, sophisticated, and premium, emphasizing high-end features and finishes",
  cozy: "warm, inviting, and comfortable, highlighting intimate spaces and homey features",
  modern: "sleek, contemporary, and cutting-edge, focusing on innovative features and clean design",
  professional: "balanced, factual, and straightforward, emphasizing practical features",
  "family-friendly": "welcoming, spacious, and practical, highlighting versatile living spaces",
};

export async function generateListing(listing: {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  features: string;
  tone: keyof typeof TONE_DESCRIPTIONS;
}): Promise<{
  listing: string;
  seoScore: number;
  compliance: ComplianceCheck;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a real estate listing expert that generates Fair Housing Act compliant listings. 
          Create a listing with a ${listing.tone} tone (${TONE_DESCRIPTIONS[listing.tone]}).
          Focus on property features and avoid any language that could discriminate. 
          Use SEO-friendly terms and natural descriptions.

          Respond with a JSON string in this exact format:
          {
            "listing": "<the generated listing text>",
            "seoScore": <number between 0-100>,
            "compliance": {
              "isCompliant": <boolean>,
              "violations": [<array of violation strings>],
              "suggestions": [<array of suggestion strings>]
            }
          }`
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
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in response");
    }

    const result = JSON.parse(response.choices[0].message.content);

    if (!result.listing || typeof result.seoScore !== 'number' || !result.compliance) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      listing: result.listing,
      seoScore: result.seoScore,
      compliance: {
        isCompliant: result.compliance.isCompliant ?? false,
        violations: result.compliance.violations || [],
        suggestions: result.compliance.suggestions || []
      }
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate listing: ${errorMessage}`);
  }
}