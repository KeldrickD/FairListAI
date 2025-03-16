import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ABTest, ABVariant } from './AnalyticsDashboard'

interface ABTestingProps {
  tests: ABTest[]
}

export function ABTesting({ tests }: ABTestingProps) {
  const [activeTest, setActiveTest] = useState<string>(tests.length > 0 ? tests[0].id : '')
  
  // Get the currently selected test
  const currentTest = tests.find(test => test.id === activeTest) || tests[0]
  
  // Calculate total views and conversions for the test
  const getTotalViews = (test: ABTest) => {
    return test.variants.reduce((sum, variant) => sum + variant.views, 0)
  }
  
  const getTotalConversions = (test: ABTest) => {
    return test.variants.reduce((sum, variant) => sum + variant.conversions, 0)
  }
  
  // Calculate confidence level based on statistical significance
  const getConfidenceLevel = (test: ABTest) => {
    // This is a simplified calculation - in a real app, you'd use a proper statistical test
    const totalViews = getTotalViews(test)
    const totalConversions = getTotalConversions(test)
    
    if (totalViews < 100) return 'Low'
    if (totalViews < 500) return 'Medium'
    return 'High'
  }
  
  // Find the winning variant
  const getWinningVariant = (test: ABTest) => {
    if (!test || test.variants.length === 0) return null
    
    return test.variants.reduce((winner, current) => {
      const winnerRate = winner.conversions / winner.views || 0
      const currentRate = current.conversions / current.views || 0
      
      return currentRate > winnerRate ? current : winner
    }, test.variants[0])
  }
  
  // Calculate improvement percentage
  const getImprovementPercentage = (test: ABTest) => {
    if (!test || test.variants.length < 2) return 0
    
    const winner = getWinningVariant(test)
    if (!winner) return 0
    
    const control = test.variants.find(v => v.isControl)
    if (!control) return 0
    
    const winnerRate = winner.conversions / winner.views || 0
    const controlRate = control.conversions / control.views || 0
    
    if (controlRate === 0) return 0
    return ((winnerRate - controlRate) / controlRate) * 100
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    })
  }
  
  // Prepare chart data
  const getChartData = (test: ABTest) => {
    if (!test) return []
    
    return test.variants.map(variant => ({
      name: variant.name,
      'Conversion Rate': parseFloat(((variant.conversions / variant.views) * 100 || 0).toFixed(2)),
      Views: variant.views,
      Conversions: variant.conversions,
      isControl: variant.isControl
    }))
  }
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get variant performance color
  const getVariantPerformanceColor = (variant: ABVariant, test: ABTest) => {
    if (!test) return 'text-gray-500'
    
    const winner = getWinningVariant(test)
    if (!winner) return 'text-gray-500'
    
    if (variant.id === winner.id) return 'text-green-600'
    
    const winnerRate = winner.conversions / winner.views || 0
    const variantRate = variant.conversions / variant.views || 0
    
    // Within 10% of winner
    if (variantRate >= winnerRate * 0.9) return 'text-yellow-600'
    
    return 'text-red-600'
  }
  
  if (tests.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No A/B Tests Available</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any A/B tests yet. Create a test to compare different versions of your listings.
          </p>
          <Button>Create A/B Test</Button>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">A/B Testing</h2>
        <Button>Create New Test</Button>
      </div>
      
      <Tabs value={activeTest} onValueChange={setActiveTest} className="w-full">
        <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap">
          {tests.map(test => (
            <TabsTrigger key={test.id} value={test.id} className="whitespace-nowrap">
              {test.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tests.map(test => (
          <TabsContent key={test.id} value={test.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Test Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                  <p className="text-lg font-bold">
                    {test.status === 'running' ? 'In Progress' : test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {test.status === 'running' ? 'Started' : 'Ended'} on {formatDate(test.startDate)}
                  {test.endDate && ` - ${formatDate(test.endDate)}`}
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Confidence Level</h3>
                <p className="text-lg font-bold">{getConfidenceLevel(test)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on {getTotalViews(test)} total views
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Improvement</h3>
                <p className="text-lg font-bold">
                  {getImprovementPercentage(test).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Over control variant
                </p>
              </Card>
            </div>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Conversion Rates</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getChartData(test)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} 
                      domain={[0, 'dataMax + 5']}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                    <Legend />
                    <Bar 
                      dataKey="Conversion Rate" 
                      fill="#8884d8" 
                      name="Conversion Rate (%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Variant Performance</h3>
              <div className="space-y-6">
                {test.variants.map(variant => {
                  const conversionRate = (variant.conversions / variant.views) * 100 || 0
                  return (
                    <div key={variant.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {variant.name}
                          </span>
                          {variant.isControl && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                              Control
                            </span>
                          )}
                          {variant.id === getWinningVariant(test)?.id && (
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                              Winner
                            </span>
                          )}
                        </div>
                        <span className={`font-bold ${getVariantPerformanceColor(variant, test)}`}>
                          {conversionRate.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={conversionRate} className="h-2" />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {variant.conversions} / {variant.views}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Test Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-muted-foreground">{test.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Hypothesis</h4>
                  <p className="text-muted-foreground">{test.hypothesis}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Target Audience</h4>
                  <p className="text-muted-foreground">{test.targetAudience || 'All visitors'}</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  {test.status === 'running' && (
                    <Button variant="outline">Pause Test</Button>
                  )}
                  {test.status === 'paused' && (
                    <Button variant="outline">Resume Test</Button>
                  )}
                  {test.status !== 'completed' && (
                    <Button>End Test</Button>
                  )}
                  {test.status === 'completed' && getWinningVariant(test) && (
                    <Button>Apply Winner</Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 