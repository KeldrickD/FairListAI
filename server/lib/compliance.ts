import { db } from '../index';
import { complianceChecks } from './schema';
import { eq } from 'drizzle-orm';

interface ComplianceIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  text: string;
  suggestion: string;
}

interface ComplianceResult {
  score: number;
  isCompliant: boolean;
  issues: ComplianceIssue[];
  improvedText?: string;
}

// Map of problematic terms and their categories
const PROHIBITED_TERMS = {
  familyStatus: [
    'bachelor', 'mature couple', 'no children', 'adults only', 'perfect for young professionals',
    'ideal for singles', 'not suitable for children', 'adult living', 'couples only',
    'empty nesters', 'mature person', 'mature individual'
  ],
  race: [
    'white neighborhood', 'asian', 'black', 'hispanic', 'integrated', 'traditional neighborhood',
    'ethnic', 'exclusive neighborhood', 'private community', 'culturally homogeneous'
  ],
  religion: [
    'christian', 'jewish', 'catholic', 'muslim', 'close to church', 'near synagogue', 'temple',
    'preferred religion', 'religious community', 'god-fearing'
  ],
  gender: [
    'male only', 'female preferred', 'gentlemen', 'bachelor', 'bachelorette',
    'male roommate wanted', 'female tenant', 'perfect for businessmen'
  ],
  disability: [
    'no wheelchairs', 'able-bodied', 'walking distance', 'not for handicapped', 'not ADA accessible',
    'must be able to climb stairs', 'no mental illness', 'no service animals'
  ],
  nationality: [
    'american only', 'foreigners', 'immigrants', 'english speaking only', 'native',
    'no foreigners', 'citizens only', 'green card', 'non-citizens'
  ]
};

// Replacement suggestions for prohibited terms
const TERM_REPLACEMENTS = {
  'bachelor': 'studio apartment',
  'mature couple': 'residents',
  'no children': 'property amenities include...',
  'adults only': 'property features include...',
  'white neighborhood': 'neighborhood',
  'integrated': 'diverse area',
  'christian community': 'community',
  'near church': 'near places of worship',
  'walking distance': 'short distance',
  'no wheelchairs': 'property features include...',
  'male only': 'roommate',
};

/**
 * Check listing text for Fair Housing compliance
 */
export const checkCompliance = async (
  listingId: number,
  text: string
): Promise<ComplianceResult> => {
  const issues: ComplianceIssue[] = [];
  let score = 100;
  
  // Analyze text for each category of prohibited terms
  Object.entries(PROHIBITED_TERMS).forEach(([category, terms]) => {
    terms.forEach(term => {
      // Check for the term (case insensitive)
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(text)) {
        const severity = category === 'familyStatus' || category === 'race' ? 'high' : 'medium';
        
        // Reduce score based on severity
        if (severity === 'high') {
          score -= 20;
        } else if (severity === 'medium') {
          score -= 10;
        } else {
          score -= 5;
        }
        
        // Add the issue
        issues.push({
          type: category,
          severity,
          text: term,
          suggestion: TERM_REPLACEMENTS[term] || `Remove or replace terms related to ${category}`
        });
      }
    });
  });
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score);
  
  // Determine if the listing is compliant (above 70%)
  const isCompliant = score >= 70;
  
  // Generate improved text by replacing problematic terms
  let improvedText = text;
  issues.forEach(issue => {
    const regex = new RegExp(`\\b${issue.text}\\b`, 'i');
    if (TERM_REPLACEMENTS[issue.text]) {
      improvedText = improvedText.replace(regex, TERM_REPLACEMENTS[issue.text]);
    } else {
      // If no specific replacement, just remove the term
      improvedText = improvedText.replace(regex, '');
    }
  });
  
  // Store the compliance check result in the database
  const [savedCheck] = await db.insert(complianceChecks).values({
    listingId,
    score,
    isCompliant,
    issues: JSON.stringify(issues),
    improvedText: issues.length > 0 ? improvedText : null,
  }).returning();
  
  return {
    score,
    isCompliant,
    issues,
    improvedText: issues.length > 0 ? improvedText : undefined
  };
};

/**
 * Get compliance check by ID
 */
export const getComplianceCheck = async (id: number) => {
  const check = await db.query.complianceChecks.findFirst({
    where: eq(complianceChecks.id, id),
  });
  
  if (check && typeof check.issues === 'string') {
    check.issues = JSON.parse(check.issues);
  }
  
  return check;
};

/**
 * Get compliance check by listing ID
 */
export const getComplianceCheckByListingId = async (listingId: number) => {
  const check = await db.query.complianceChecks.findFirst({
    where: eq(complianceChecks.listingId, listingId),
    orderBy: (complianceChecks, { desc }) => [desc(complianceChecks.createdAt)],
  });
  
  if (check && typeof check.issues === 'string') {
    check.issues = JSON.parse(check.issues);
  }
  
  return check;
}; 