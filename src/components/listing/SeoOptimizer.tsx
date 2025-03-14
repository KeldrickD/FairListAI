import { BarChart3, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface SeoMetric {
  name: string
  score: number
  maxScore: number
  suggestions: string[]
}

interface SeoOptimizerProps {
  metrics: SeoMetric[]
  keywords: string[]
  title: string
  description: string
}

export function SeoOptimizer({
  metrics,
  keywords,
  title,
  description,
}: SeoOptimizerProps) {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">SEO Optimization</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Title</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Target Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-secondary px-2 py-1 rounded-md text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Optimization Metrics</h3>
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.name}</span>
                  <span className={getScoreColor(metric.score, metric.maxScore)}>
                    {metric.score}/{metric.maxScore}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      getScoreColor(metric.score, metric.maxScore).replace(
                        'text-',
                        'bg-'
                      )
                    }`}
                    style={{
                      width: `${(metric.score / metric.maxScore) * 100}%`,
                    }}
                  />
                </div>
                {metric.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {metric.suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <XCircle className="h-4 w-4 mt-0.5" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 