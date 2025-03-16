import React from 'react'
import { Card } from '@/components/ui/card'
import { SocialShares } from './AnalyticsDashboard'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface PlatformBreakdownProps {
  socialShares: SocialShares
}

export function PlatformBreakdown({ socialShares }: PlatformBreakdownProps) {
  // Prepare chart data
  const platformData = Object.entries(socialShares).map(([platform, count], index) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count,
    color: ['#1877F2', '#1DA1F2', '#0A66C2', '#E4405F', '#E60023', '#6E5494'][index % 6]
  }))
  
  // Calculate total shares
  const totalShares = Object.values(socialShares).reduce((sum, count) => sum + count, 0)
  
  // Calculate platform percentages
  const platformPercentages = Object.entries(socialShares).reduce((acc, [platform, count]) => {
    acc[platform] = totalShares > 0 ? (count / totalShares) * 100 : 0
    return acc
  }, {} as Record<string, number>)
  
  // Get platform color
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      linkedin: '#0A66C2',
      instagram: '#E4405F',
      pinterest: '#E60023',
      email: '#6E5494'
    }
    
    return colors[platform] || '#888888'
  }
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '📘'
      case 'twitter':
        return '🐦'
      case 'linkedin':
        return '💼'
      case 'instagram':
        return '📷'
      case 'pinterest':
        return '📌'
      case 'email':
        return '📧'
      default:
        return '🔗'
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Social Shares Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Platform Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Shares" radius={[0, 4, 4, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Platform Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(socialShares).map(([platform, count]) => (
            <div key={platform} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getPlatformIcon(platform)}</span>
                <h4 className="text-sm font-medium capitalize">{platform}</h4>
              </div>
              <p className="text-3xl font-bold">{count}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  {platformPercentages[platform].toFixed(1)}% of total
                </p>
                <div 
                  className="h-2 w-16 rounded-full" 
                  style={{ 
                    background: `linear-gradient(90deg, ${getPlatformColor(platform)} ${platformPercentages[platform]}%, transparent ${platformPercentages[platform]}%)` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Social Media Insights</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Top Performing Platform</h4>
            {totalShares > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">
                  {getPlatformIcon(Object.entries(socialShares).sort((a, b) => b[1] - a[1])[0][0])}
                </span>
                <div>
                  <p className="font-medium capitalize">
                    {Object.entries(socialShares).sort((a, b) => b[1] - a[1])[0][0]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Object.entries(socialShares).sort((a, b) => b[1] - a[1])[0][1]} shares
                    ({(Object.entries(socialShares).sort((a, b) => b[1] - a[1])[0][1] / totalShares * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No social shares yet</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Recommendations</h4>
            <ul className="mt-1 space-y-2 text-sm text-muted-foreground">
              {totalShares === 0 ? (
                <li>Start promoting your listing on social media to increase visibility</li>
              ) : (
                <>
                  <li>
                    Focus more on {Object.entries(socialShares).sort((a, b) => b[1] - a[1])[0][0]} 
                    where your listing is performing best
                  </li>
                  {Object.entries(socialShares).sort((a, b) => a[1] - b[1])[0][1] === 0 ? (
                    <li>
                      Consider promoting on {Object.entries(socialShares).sort((a, b) => a[1] - b[1])[0][0]} 
                      to reach a different audience
                    </li>
                  ) : (
                    <li>
                      Improve your content for {Object.entries(socialShares).sort((a, b) => a[1] - b[1])[0][0]} 
                      to increase shares
                    </li>
                  )}
                  <li>
                    Create platform-specific content to maximize engagement across all channels
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
} 