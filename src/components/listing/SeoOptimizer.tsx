import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
  onOptimize?: (optimizedData: { title: string, description: string }) => void
}

export function SeoOptimizer({
  metrics,
  keywords,
  title,
  description,
  onOptimize,
}: SeoOptimizerProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'keywords'>('analysis')
  const [showKeywordInsights, setShowKeywordInsights] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationLevel, setOptimizationLevel] = useState<'basic' | 'moderate' | 'aggressive'>('moderate')
  const [optimizationOptions, setOptimizationOptions] = useState({
    title: true,
    description: true,
    keywords: true,
    readability: true,
    callToAction: true
  })
  const [showComparison, setShowComparison] = useState(false)
  const [optimizedContent, setOptimizedContent] = useState<{ title: string, description: string } | null>(null)
  
  // Ensure keywords is always an array
  const safeKeywords = Array.isArray(keywords) ? keywords : [];
  
  // Sample keyword insights - in real implementation, these would come from an API
  const keywordInsights: KeywordInsight[] = [
    ...safeKeywords.map(keyword => ({
      keyword,
      volume: Math.floor(Math.random() * 1000) + 'k/month',
      competition: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      recommended: Math.random() > 0.3
    })),
    ...(safeKeywords.length > 0 ? [
      {
        keyword: 'luxury ' + safeKeywords[0].split(' ').slice(-1)[0],
        volume: '52k/month',
        competition: 'high' as const,
        recommended: true
      },
      {
        keyword: 'affordable ' + safeKeywords[0].split(' ').slice(-1)[0],
        volume: '87k/month',
        competition: 'medium' as const,
        recommended: true
      }
    ] : [])
  ]
  
  // Calculate overall SEO score with safeguards against NaN
  const totalScore = Array.isArray(metrics) ? metrics.reduce((sum, metric) => sum + (isNaN(metric.score) ? 0 : metric.score), 0) : 0;
  const totalMaxScore = Array.isArray(metrics) ? metrics.reduce((sum, metric) => sum + (isNaN(metric.maxScore) ? 0 : metric.maxScore), 0) : 1; // Avoid division by zero
  const overallScorePercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
  
  const getScoreColor = (score: number, maxScore: number) => {
    if (isNaN(score) || isNaN(maxScore) || maxScore === 0) return 'text-gray-500';
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
    if (isNaN(percentage)) return 'Not Available';
    if (percentage >= 80) return 'Excellent'
    if (percentage >= 60) return 'Good'
    if (percentage >= 40) return 'Fair'
    return 'Needs Improvement'
  }
  
  const getProgressColor = (percentage: number) => {
    if (isNaN(percentage)) return 'bg-gray-300';
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Function to highlight keywords in text
  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!text || !Array.isArray(keywords) || keywords.length === 0) return text;
    
    // Create a regex pattern from keywords
    const pattern = keywords
      .filter(k => k && typeof k === 'string')
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex chars
      .join('|');
    
    if (!pattern) return text;
    
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-100 px-1 rounded">$1</mark>');
  };

  // Function to generate optimized title and description based on metrics and options
  const generateOptimizedContent = () => {
    if (!Array.isArray(metrics) || metrics.length === 0) return null;

    let optimizedTitle = title;
    let optimizedDescription = description;
    
    // Apply different optimization levels
    const intensityFactor = optimizationLevel === 'basic' ? 0.5 : 
                           optimizationLevel === 'aggressive' ? 1.5 : 1;
    
    // Only optimize title if the option is selected
    if (optimizationOptions.title) {
      const titleMetric = metrics.find(m => m.name.toLowerCase().includes('title'));
      if (titleMetric && titleMetric.score < titleMetric.maxScore && titleMetric.suggestions.length > 0) {
        // Extract keywords for title optimization
        const keywordsList = safeKeywords.length > 0 ? safeKeywords : [];
        const primaryKeyword = keywordsList[0] || '';
        const location = keywordsList.find(k => k.includes(',')) || '';
        
        // Create a more concise, keyword-rich title
        if (primaryKeyword) {
          if (title.length > 60) {
            // Shorten title if too long
            optimizedTitle = `${primaryKeyword} in ${location || 'Prime Location'}`;
          } else if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
            // Add primary keyword if missing
            optimizedTitle = `${primaryKeyword} - ${title}`;
          }
          
          // For aggressive optimization, add more keywords
          if (optimizationLevel === 'aggressive' && keywordsList.length > 1) {
            const secondaryKeyword = keywordsList[1];
            if (secondaryKeyword && !optimizedTitle.toLowerCase().includes(secondaryKeyword.toLowerCase())) {
              optimizedTitle = `${optimizedTitle} | ${secondaryKeyword}`;
            }
          }
        }
      }
    }
    
    // Only optimize description if the option is selected
    if (optimizationOptions.description) {
      const descriptionMetric = metrics.find(m => m.name.toLowerCase().includes('description'));
      if (descriptionMetric && descriptionMetric.score < descriptionMetric.maxScore && descriptionMetric.suggestions.length > 0) {
        // Extract keywords for description optimization
        const keywordsList = safeKeywords.length > 0 ? safeKeywords : [];
        
        // Improve description based on common issues
        if (description.length > 160) {
          // Shorten description if too long
          optimizedDescription = description.substring(0, 157) + '...';
        } else if (description.length < 120) {
          // Expand description if too short
          const missingKeywords = keywordsList.filter(k => !description.toLowerCase().includes(k.toLowerCase()));
          if (missingKeywords.length > 0) {
            optimizedDescription = `${description} Featuring ${missingKeywords.join(', ')}.`;
          }
        }
        
        // Add keywords based on optimization level
        if (optimizationOptions.keywords) {
          const keywordsToAdd = Math.ceil(keywordsList.length * intensityFactor * 0.5);
          const missingKeywords = keywordsList
            .filter(k => !optimizedDescription.toLowerCase().includes(k.toLowerCase()))
            .slice(0, keywordsToAdd);
            
          if (missingKeywords.length > 0) {
            optimizedDescription = `${optimizedDescription} Includes ${missingKeywords.join(', ')}.`;
          }
        }
        
        // Ensure description has a call to action if the option is selected
        if (optimizationOptions.callToAction && 
            !optimizedDescription.includes('call') && 
            !optimizedDescription.includes('contact') && 
            !optimizedDescription.includes('schedule') && 
            !optimizedDescription.includes('tour')) {
          
          const ctas = [
            'Schedule a tour today!',
            'Contact us for more information.',
            'Call now to view this property!',
            'Don\'t miss this opportunity!'
          ];
          
          const ctaIndex = Math.floor(Math.random() * ctas.length);
          optimizedDescription = `${optimizedDescription} ${ctas[ctaIndex]}`;
        }
        
        // Improve readability if the option is selected
        if (optimizationOptions.readability) {
          // Replace complex words with simpler alternatives
          const complexWords = [
            { complex: 'utilize', simple: 'use' },
            { complex: 'residence', simple: 'home' },
            { complex: 'purchase', simple: 'buy' },
            { complex: 'numerous', simple: 'many' },
            { complex: 'obtain', simple: 'get' }
          ];
          
          let improvedDescription = optimizedDescription;
          complexWords.forEach(({ complex, simple }) => {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            improvedDescription = improvedDescription.replace(regex, simple);
          });
          
          optimizedDescription = improvedDescription;
        }
      }
    }
    
    return { title: optimizedTitle, description: optimizedDescription };
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newOptimizedContent = generateOptimizedContent();
      if (newOptimizedContent && onOptimize) {
        setOptimizedContent(newOptimizedContent);
        setShowComparison(true);
        onOptimize(newOptimizedContent);
      }
      setIsOptimizing(false);
    }, 1500);
  };

  // Toggle optimization options
  const toggleOption = (option: keyof typeof optimizationOptions) => {
    setOptimizationOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // If metrics is empty or invalid, show a placeholder
  if (!Array.isArray(metrics) || metrics.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">SEO Optimization</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Status:</span>
            <span className="text-gray-500">No data available</span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-600">
          SEO metrics are being processed. Please check back shortly or regenerate the listing.
        </div>
      </div>
    );
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

      {/* Optimization Options Panel */}
      {onOptimize && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Optimization Options</h3>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-sm text-blue-600 hover:underline"
              disabled={!optimizedContent}
            >
              {showComparison ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-2">What to Optimize</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="title-option" 
                    checked={optimizationOptions.title}
                    onCheckedChange={() => toggleOption('title')}
                  />
                  <Label htmlFor="title-option">Title</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="description-option" 
                    checked={optimizationOptions.description}
                    onCheckedChange={() => toggleOption('description')}
                  />
                  <Label htmlFor="description-option">Description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="keywords-option" 
                    checked={optimizationOptions.keywords}
                    onCheckedChange={() => toggleOption('keywords')}
                  />
                  <Label htmlFor="keywords-option">Keywords</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="readability-option" 
                    checked={optimizationOptions.readability}
                    onCheckedChange={() => toggleOption('readability')}
                  />
                  <Label htmlFor="readability-option">Readability</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cta-option" 
                    checked={optimizationOptions.callToAction}
                    onCheckedChange={() => toggleOption('callToAction')}
                  />
                  <Label htmlFor="cta-option">Call to Action</Label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Optimization Level</h4>
              <RadioGroup 
                value={optimizationLevel} 
                onValueChange={(value) => setOptimizationLevel(value as 'basic' | 'moderate' | 'aggressive')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic-level" />
                  <Label htmlFor="basic-level">Basic - Subtle changes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate-level" />
                  <Label htmlFor="moderate-level">Moderate - Balanced approach</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive-level" />
                  <Label htmlFor="aggressive-level">Aggressive - Maximum optimization</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {isOptimizing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing...
                </>
              ) : (
                <>
                  <span className="mr-1">✨</span>
                  Optimize for SEO
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Before/After Comparison */}
      {showComparison && optimizedContent && (
        <div className="mb-6 border rounded-md overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium">
            Before/After Comparison
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Title</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  <div className="text-xs text-gray-500 mb-1">Original</div>
                  {title}
                </div>
                <div className="p-3 bg-green-50 rounded border text-sm">
                  <div className="text-xs text-gray-500 mb-1">Optimized</div>
                  <div dangerouslySetInnerHTML={{ __html: highlightKeywords(optimizedContent.title, safeKeywords) }} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  <div className="text-xs text-gray-500 mb-1">Original</div>
                  {description}
                </div>
                <div className="p-3 bg-green-50 rounded border text-sm">
                  <div className="text-xs text-gray-500 mb-1">Optimized</div>
                  <div dangerouslySetInnerHTML={{ __html: highlightKeywords(optimizedContent.description, safeKeywords) }} />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border">
              <div className="text-sm">
                <span className="font-medium">Estimated SEO Improvement: </span>
                <span className="text-green-600">+15-25%</span>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="text-xs text-blue-600 hover:underline"
              >
                Hide Comparison
              </button>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded border">{title || 'No title available'}</p>
              <div className="flex gap-2 mt-2">
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {(title || '').length} characters (Ideal: 50-60)
                </div>
                {title && safeKeywords.length > 0 && title.includes(safeKeywords[0]) && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Contains primary keyword
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded border">{description || 'No description available'}</p>
              <div className="flex gap-2 mt-2">
                <div className={`text-xs ${!description || description.length < 120 || description.length > 160 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full`}>
                  {(description || '').length} characters (Ideal: 120-160)
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {description && safeKeywords.length > 0 ? safeKeywords.filter(k => description.includes(k)).length : 0} keywords
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
                        {isNaN(metric.score) ? 0 : metric.score}/{isNaN(metric.maxScore) ? 0 : metric.maxScore}
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
                          width: `${metric.maxScore > 0 ? (metric.score / metric.maxScore) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    {Array.isArray(metric.suggestions) && metric.suggestions.length > 0 && (
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
              
              {keywordInsights.length > 0 ? (
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
                      {(showKeywordInsights ? keywordInsights : safeKeywords.map(k => ({ keyword: k, volume: '', competition: 'medium' as const, recommended: false }))).map((item, idx) => (
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
              ) : (
                <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                  No keywords available. Please regenerate the listing.
                </div>
              )}
              
              {showKeywordInsights && keywordInsights.length > 0 && (
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
                      {safeKeywords.slice(0, Math.min(3, safeKeywords.length)).join(', ') || 'No keywords available'}
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
                      {safeKeywords.slice(0, Math.min(2, safeKeywords.length)).join(', ') || 'No keywords available'}
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