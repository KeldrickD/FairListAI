import { db } from '../index';
import { seoAnalyses } from './schema';
import { eq } from 'drizzle-orm';

interface SeoSuggestion {
  category: string;
  issue: string;
  suggestion: string;
}

interface SeoResult {
  score: number;
  keywords: string[];
  suggestions: SeoSuggestion[];
  improvedText?: string;
}

// Property-related keywords to look for
const PROPERTY_KEYWORDS = [
  'property', 'home', 'house', 'real estate', 'apartment', 'condo', 'townhouse',
  'bedroom', 'bathroom', 'kitchen', 'living room', 'garage', 'backyard', 'patio',
  'hardwood floors', 'stainless steel', 'granite countertops', 'updated', 'renovated',
  'spacious', 'cozy', 'modern', 'open concept', 'view', 'walkable', 'commute',
];

// Location-related keywords to look for
const LOCATION_KEYWORDS = [
  'neighborhood', 'community', 'school district', 'shopping', 'restaurant',
  'park', 'transit', 'highway', 'downtown', 'suburb', 'urban', 'rural',
];

// Common words to exclude from keyword analysis
const STOP_WORDS = [
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'like', 'through',
  'over', 'before', 'after', 'between', 'under', 'above', 'these', 'those', 'this',
  'that', 'of', 'from', 'as', 'into', 'during', 'including', 'until', 'against',
  'among', 'throughout', 'despite', 'towards', 'upon', 'concerning',
];

/**
 * Analyze listing text for SEO
 */
export const analyzeSeo = async (
  listingId: number,
  text: string,
  title: string,
  location: string
): Promise<SeoResult> => {
  const suggestions: SeoSuggestion[] = [];
  let score = 100;
  
  // Combine text content for analysis
  const fullContent = `${title} ${text}`.toLowerCase();
  
  // Extract potential keywords (words that appear multiple times)
  const words = fullContent
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
    .split(/\s+/) // Split on whitespace
    .filter(word => !STOP_WORDS.includes(word.toLowerCase()) && word.length > 3); // Filter out stop words and short words
  
  // Count word frequencies
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Extract top keywords (based on frequency)
  const keywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  
  // Check title length (between 50-60 characters is optimal)
  if (title.length < 30) {
    suggestions.push({
      category: 'title',
      issue: 'Title is too short',
      suggestion: 'Increase title length to 50-60 characters with descriptive keywords about the property'
    });
    score -= 10;
  } else if (title.length > 70) {
    suggestions.push({
      category: 'title',
      issue: 'Title is too long',
      suggestion: 'Reduce title length to 50-60 characters while keeping key property information'
    });
    score -= 5;
  }
  
  // Check description length (at least 250 characters for good SEO)
  if (text.length < 250) {
    suggestions.push({
      category: 'description',
      issue: 'Description is too short',
      suggestion: 'Expand your description to at least 250 characters with detailed property information'
    });
    score -= 15;
  }
  
  // Check for property-related keywords
  const propertyKeywordsFound = PROPERTY_KEYWORDS.filter(keyword => 
    fullContent.includes(keyword.toLowerCase())
  );
  
  if (propertyKeywordsFound.length < 5) {
    suggestions.push({
      category: 'keywords',
      issue: 'Not enough property-specific keywords',
      suggestion: `Include more property-specific keywords such as: ${PROPERTY_KEYWORDS.slice(0, 8).join(', ')}`
    });
    score -= 10;
  }
  
  // Check for location keywords
  const locationKeywordsFound = LOCATION_KEYWORDS.filter(keyword => 
    fullContent.includes(keyword.toLowerCase())
  );
  
  if (locationKeywordsFound.length < 3) {
    suggestions.push({
      category: 'location',
      issue: 'Not enough location-specific information',
      suggestion: `Include more location details such as: ${LOCATION_KEYWORDS.slice(0, 5).join(', ')}`
    });
    score -= 10;
  }
  
  // Check if the location is mentioned specifically
  if (!fullContent.includes(location.toLowerCase())) {
    suggestions.push({
      category: 'location',
      issue: 'Specific location not mentioned',
      suggestion: `Include the specific location "${location}" in your description`
    });
    score -= 15;
  }
  
  // Check for image descriptions (we'll assume no image descriptions for this example)
  suggestions.push({
    category: 'images',
    issue: 'Missing image descriptions',
    suggestion: 'Add descriptive alt text to all property images to improve SEO'
  });
  score -= 10;
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score);
  
  // Simple improved text generation (just a placeholder for this example)
  let improvedText = text;
  
  // If the description is too short, append some general property info
  if (text.length < 250) {
    improvedText += ` This ${propertyKeywordsFound[0] || 'property'} is located in ${location} and offers convenient access to local amenities.`;
  }
  
  // If location is not mentioned, add it
  if (!fullContent.includes(location.toLowerCase())) {
    improvedText = `Located in ${location}, this property features ${improvedText}`;
  }
  
  // Store the SEO analysis in the database
  const [savedAnalysis] = await db.insert(seoAnalyses).values({
    listingId,
    score,
    keywords: JSON.stringify(keywords),
    suggestions: JSON.stringify(suggestions),
    improvedText: suggestions.length > 0 ? improvedText : null,
  }).returning();
  
  return {
    score,
    keywords,
    suggestions,
    improvedText: suggestions.length > 0 ? improvedText : undefined
  };
};

/**
 * Get SEO analysis by ID
 */
export const getSeoAnalysis = async (id: number) => {
  const analysis = await db.query.seoAnalyses.findFirst({
    where: eq(seoAnalyses.id, id),
  });
  
  if (analysis) {
    if (typeof analysis.keywords === 'string') {
      analysis.keywords = JSON.parse(analysis.keywords);
    }
    if (typeof analysis.suggestions === 'string') {
      analysis.suggestions = JSON.parse(analysis.suggestions);
    }
  }
  
  return analysis;
};

/**
 * Get SEO analysis by listing ID
 */
export const getSeoAnalysisByListingId = async (listingId: number) => {
  const analysis = await db.query.seoAnalyses.findFirst({
    where: eq(seoAnalyses.listingId, listingId),
    orderBy: (seoAnalyses, { desc }) => [desc(seoAnalyses.createdAt)],
  });
  
  if (analysis) {
    if (typeof analysis.keywords === 'string') {
      analysis.keywords = JSON.parse(analysis.keywords);
    }
    if (typeof analysis.suggestions === 'string') {
      analysis.suggestions = JSON.parse(analysis.suggestions);
    }
  }
  
  return analysis;
}; 