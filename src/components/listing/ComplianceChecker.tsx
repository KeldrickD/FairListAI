import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ComplianceIssue {
  type: 'warning' | 'error'
  message: string
  suggestion: string
  flaggedText?: string
}

interface ComplianceCheckerProps {
  text: string
  issues: ComplianceIssue[]
}

export function ComplianceChecker({ text, issues }: ComplianceCheckerProps) {
  const [showFairHousingInfo, setShowFairHousingInfo] = useState(false)

  const fairHousingCategories = [
    { name: 'Race', examples: ['exclusive neighborhoods', 'ethnic references', 'culturally specific'] },
    { name: 'Color', examples: ['references to skin tone', 'visual descriptions of people'] },
    { name: 'Religion', examples: ['close to churches/temples', 'religious community', 'religious schools'] },
    { name: 'Sex', examples: ['perfect for bachelors', 'man cave', 'mother-in-law suite'] },
    { name: 'Disability', examples: ['walk-up', 'walking distance', 'able-bodied', 'handicapped'] },
    { name: 'Family Status', examples: ['adults only', 'no children', 'perfect for families'] },
    { name: 'National Origin', examples: ['ethnic neighborhoods', 'nationality references'] },
  ]

  if (issues.length === 0) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Fair Housing Compliant</AlertTitle>
          <AlertDescription className="text-green-700">
            This listing appears to be compliant with Fair Housing laws.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFairHousingInfo(!showFairHousingInfo)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Info className="h-4 w-4 mr-1" />
            {showFairHousingInfo ? 'Hide Fair Housing Info' : 'Show Fair Housing Info'}
          </Button>
        </div>
        
        {showFairHousingInfo && (
          <FairHousingInformation categories={fairHousingCategories} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fair Housing Compliance Issues Found</AlertTitle>
        <AlertDescription>
          Please review and address the following issues to ensure compliance with Fair Housing laws.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {issues.map((issue, index) => (
          <Alert
            key={index}
            variant={issue.type === 'error' ? 'destructive' : 'default'}
            className={issue.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}
          >
            <AlertCircle className={`h-4 w-4 ${issue.type === 'error' ? 'text-red-600' : 'text-yellow-600'}`} />
            <AlertTitle className={issue.type === 'error' ? 'text-red-800' : 'text-yellow-800'}>
              {issue.type === 'error' ? 'Compliance Violation' : 'Potential Issue'}
            </AlertTitle>
            <AlertDescription className={issue.type === 'error' ? 'text-red-700' : 'text-yellow-700'}>
              <p className="mb-2">{issue.message}</p>
              {issue.flaggedText && (
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Flagged text:</span>{' '}
                  <span className={`${issue.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'} px-1 rounded`}>
                    "{issue.flaggedText}"
                  </span>
                </p>
              )}
              <p className="text-sm">
                <span className="font-semibold">Suggestion:</span> {issue.suggestion}
              </p>
            </AlertDescription>
          </Alert>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowFairHousingInfo(!showFairHousingInfo)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Info className="h-4 w-4 mr-1" />
          {showFairHousingInfo ? 'Hide Fair Housing Info' : 'Show Fair Housing Info'}
        </Button>
      </div>
      
      {showFairHousingInfo && (
        <FairHousingInformation categories={fairHousingCategories} />
      )}
    </div>
  )
}

interface FairHousingInformationProps {
  categories: {
    name: string;
    examples: string[];
  }[];
}

function FairHousingInformation({ categories }: FairHousingInformationProps) {
  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <h3 className="text-lg font-medium text-blue-800 mb-2">Fair Housing Act Information</h3>
      <p className="text-sm text-blue-700 mb-4">
        The Fair Housing Act prohibits discrimination in housing based on protected characteristics. 
        When writing listings, avoid language that could be seen as expressing preference or discrimination.
      </p>
      
      <h4 className="text-md font-medium text-blue-800 mb-2">Protected Categories</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => (
          <div key={category.name} className="bg-white rounded p-2 border border-blue-100">
            <h5 className="font-medium text-blue-900">{category.name}</h5>
            <p className="text-xs text-blue-700 mt-1">
              Avoid terms like: {category.examples.join(', ')}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-blue-700">
        <p className="font-medium">Best Practices:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Focus on property features, not who should live there</li>
          <li>Describe the property, not the ideal resident</li>
          <li>Use inclusive language that welcomes all potential buyers</li>
          <li>Highlight accessibility features without assumptions</li>
          <li>When in doubt, focus on facts rather than subjective descriptions</li>
        </ul>
      </div>
    </Card>
  )
} 