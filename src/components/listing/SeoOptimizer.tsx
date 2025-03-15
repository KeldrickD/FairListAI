import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

interface SeoMetric {
  name: string
  score: number
  maxScore: number
  suggestions: string[]
}

interface KeywordInsight {
  keyword: string
  volume: string
  competition: 'high' | 'medium' | 'low'
  recommended: boolean
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
  const [activeTab, setActiveTab] = useState<'analysis' | 'keywords'>('analysis')
  const [showKeywordInsights, setShowKeywordInsights] = useState(false)
  
  // Sample keyword insights - in real implementation, these would come from an API
  const keywordInsights: KeywordInsight[] = [
    ...keywords.map(keyword => ({
      keyword,
      volume: Math.floor(Math.random() * 1000) + 'k/month',
      competition: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      recommended: Math.random() > 0.3
    })),
    {
      keyword: 'luxury ' + keywords[0].split(' ').slice(-1)[0],
      volume: '52k/month',
      competition: 'high',
      recommended: true
    },
    {
      keyword: 'affordable ' + keywords[0].split(' ').slice(-1)[0],
      volume: '87k/month',
      competition: 'medium',
      recommended: true
    }
  ]
  
  // Calculate overall SEO score
  const totalScore = metrics.reduce((sum, metric) => sum + metric.score, 0)
  const totalMaxScore = metrics.reduce((sum, metric) => sum + metric.maxScore, 0)
  const overallScorePercentage = Math.round((totalScore / totalMaxScore) * 100)
  
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  const getCompetitionColor = (competition: 'high' | 'medium' | 'low') => {
    if (competition === 'low') return 'text-green-500'
    if (competition === 'medium') return 'text-yellow-500'
    return 'text-red-500'
  }
  
  const getScoreLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent'
    if (percentage >= 60) return 'Good'
    if (percentage >= 40) return 'Fair'
    return 'Needs Improvement'
  }
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">SEO Optimization</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Overall Score:</span>
          <span className={getScoreColor(totalScore, totalMaxScore)}>
            {overallScorePercentage}% • {getScoreLabel(overallScorePercentage)}
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <Progress 
          value={overallScorePercentage} 
          className="h-2" 
        />
      </div>

      <div className="flex flex-col">
        <div className="flex space-x-2 mb-4 border-b">
          <button 
            className={`px-3 py-2 flex items-center gap-1 ${activeTab === 'analysis' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('analysis')}
          >
            <span className="w-4 h-4 mr-1">📊</span>
            <span>Analysis</span>
          </button>
          <button 
            className={`px-3 py-2 flex items-center gap-1 ${activeTab === 'keywords' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('keywords')}
          >
            <span className="w-4 h-4 mr-1">🔍</span>
            <span>Keywords</span>
          </button>
        </div>
        
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Title</h3>
              <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded border">{title}</p>
              <div className="flex gap-2 mt-2">
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {title.length} characters (Ideal: 50-60)
                </div>
                {title.includes(keywords[0]) && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Contains primary keyword
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded border">{description}</p>
              <div className="flex gap-2 mt-2">
                <div className={`text-xs ${description.length < 120 || description.length > 160 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full`}>
                  {description.length} characters (Ideal: 120-160)
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {keywords.filter(k => description.includes(k)).length} keywords
                </div>
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
                            <span className="text-red-500">❌</span>
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
        )}
        
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Target Keywords</h3>
                <button 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  onClick={() => setShowKeywordInsights(!showKeywordInsights)}
                >
                  <span className="mr-1">💡</span>
                  {showKeywordInsights ? 'Hide Insights' : 'Show Insights'}
                </button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Keyword</th>
                      {showKeywordInsights && (
                        <>
                          <th className="px-4 py-2 text-left font-medium">Search Volume</th>
                          <th className="px-4 py-2 text-left font-medium">Competition</th>
                          <th className="px-4 py-2 text-left font-medium">Recommended</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(showKeywordInsights ? keywordInsights : keywords.map(k => ({ keyword: k, volume: '', competition: 'medium' as const, recommended: false }))).map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2">{item.keyword}</td>
                        {showKeywordInsights && (
                          <>
                            <td className="px-4 py-2">{item.volume}</td>
                            <td className="px-4 py-2">
                              <span className={getCompetitionColor(item.competition)}>
                                {item.competition.charAt(0).toUpperCase() + item.competition.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {item.recommended ? (
                                <span className="text-green-500">✓</span>
                              ) : (
                                <span className="text-red-500">✗</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {showKeywordInsights && (
                <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <div className="flex gap-2">
                    <span>ℹ️</span>
                    <p>
                      Keywords with higher search volume but lower competition generally offer the best opportunities for ranking. 
                      Consider incorporating these recommended keywords into your listing for improved visibility.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Platform-Specific Optimization</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Zillow</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Optimized
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      This listing is optimized for Zillow's search algorithm with property specifics highlighted.
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Best keywords: </span>
                      {keywords.slice(0, 3).join(', ')}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Realtor.com</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Optimized
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Description formatted for Realtor.com with neighborhood and property highlights.
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Best keywords: </span>
                      {keywords.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 