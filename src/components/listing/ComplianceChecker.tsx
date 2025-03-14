import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ComplianceIssue {
  type: 'warning' | 'error'
  message: string
  suggestion: string
}

interface ComplianceCheckerProps {
  text: string
  issues: ComplianceIssue[]
}

export function ComplianceChecker({ text, issues }: ComplianceCheckerProps) {
  if (issues.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Fair Housing Compliant</AlertTitle>
        <AlertDescription className="text-green-700">
          This listing appears to be compliant with Fair Housing laws.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fair Housing Compliance Issues Found</AlertTitle>
        <AlertDescription>
          Please review and address the following issues to ensure compliance.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {issues.map((issue, index) => (
          <Alert
            key={index}
            variant={issue.type === 'error' ? 'destructive' : 'default'}
            className="bg-yellow-50 border-yellow-200"
          >
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              {issue.type === 'error' ? 'Compliance Error' : 'Potential Issue'}
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              <p className="mb-2">{issue.message}</p>
              <p className="text-sm">
                <span className="font-semibold">Suggestion:</span> {issue.suggestion}
              </p>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  )
} 