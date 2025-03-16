import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ABTestResult } from '@/lib/types/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface ABTestingAnalysisProps {
  testResults: ABTestResult[];
}

export const ABTestingAnalysis: React.FC<ABTestingAnalysisProps> = ({ testResults }) => {
  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!testResults.length) return null;
    
    const totalTests = testResults.length;
    const activeTests = testResults.filter(test => test.status === 'active').length;
    const completedTests = testResults.filter(test => test.status === 'completed').length;
    
    const significantResults = testResults.filter(test => {
      // Consider a test significant if the conversion difference is > 10%
      if (!test.variantA.views || !test.variantB.views) return false;
      
      const conversionA = test.variantA.conversions / test.variantA.views;
      const conversionB = test.variantB.conversions / test.variantB.views;
      
      return Math.abs(conversionA - conversionB) / Math.min(conversionA, conversionB) > 0.1;
    }).length;
    
    return {
      totalTests,
      activeTests,
      completedTests,
      significantResults,
    };
  }, [testResults]);
  
  // Prepare data for charts
  const chartData = useMemo(() => {
    return testResults.map(test => {
      const conversionA = test.variantA.views ? (test.variantA.conversions / test.variantA.views) * 100 : 0;
      const conversionB = test.variantB.views ? (test.variantB.conversions / test.variantB.views) * 100 : 0;
      
      const winner = conversionA > conversionB ? 'A' : conversionB > conversionA ? 'B' : 'Tie';
      const improvement = Math.abs(conversionA - conversionB);
      
      return {
        name: test.testName,
        conversionA: parseFloat(conversionA.toFixed(2)),
        conversionB: parseFloat(conversionB.toFixed(2)),
        viewsA: test.variantA.views,
        viewsB: test.variantB.views,
        winner,
        improvement: parseFloat(improvement.toFixed(2)),
        status: test.status,
      };
    });
  }, [testResults]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Prepare data for the winners pie chart
  const winnerData = useMemo(() => {
    const completed = testResults.filter(test => test.status === 'completed');
    
    const aWins = completed.filter(test => {
      const conversionA = test.variantA.views ? test.variantA.conversions / test.variantA.views : 0;
      const conversionB = test.variantB.views ? test.variantB.conversions / test.variantB.views : 0;
      return conversionA > conversionB;
    }).length;
    
    const bWins = completed.filter(test => {
      const conversionA = test.variantA.views ? test.variantA.conversions / test.variantA.views : 0;
      const conversionB = test.variantB.views ? test.variantB.conversions / test.variantB.views : 0;
      return conversionB > conversionA;
    }).length;
    
    const ties = completed.filter(test => {
      const conversionA = test.variantA.views ? test.variantA.conversions / test.variantA.views : 0;
      const conversionB = test.variantB.views ? test.variantB.conversions / test.variantB.views : 0;
      return conversionA === conversionB;
    }).length;
    
    return [
      { name: 'Variant A Wins', value: aWins },
      { name: 'Variant B Wins', value: bWins },
      { name: 'Ties', value: ties },
    ].filter(item => item.value > 0);
  }, [testResults]);
  
  // Calculate average improvement
  const averageImprovement = useMemo(() => {
    const improvements = chartData
      .filter(item => item.status === 'completed' && item.winner !== 'Tie')
      .map(item => item.improvement);
    
    if (!improvements.length) return 0;
    
    return improvements.reduce((sum, val) => sum + val, 0) / improvements.length;
  }, [chartData]);
  
  if (!testResults.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>A/B Testing Analysis</CardTitle>
          <CardDescription>No test results available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Start creating A/B tests to compare different versions of your listings and see which performs better.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>A/B Testing Analysis</CardTitle>
        <CardDescription>Compare performance between different listing variations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{summary?.totalTests || 0}</div>
                  <p className="text-xs text-gray-500">Total Tests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{summary?.activeTests || 0}</div>
                  <p className="text-xs text-gray-500">Active Tests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{summary?.completedTests || 0}</div>
                  <p className="text-xs text-gray-500">Completed Tests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{summary?.significantResults || 0}</div>
                  <p className="text-xs text-gray-500">Significant Results</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Conversion Rate Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData.slice(0, 5)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                      <Legend />
                      <Bar dataKey="conversionA" name="Variant A" fill="#0088FE" />
                      <Bar dataKey="conversionB" name="Variant B" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Test Winners</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={winnerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {winnerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Tests']} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 text-center">
                    <div className="text-sm font-medium">Average Improvement</div>
                    <div className="text-2xl font-bold flex items-center justify-center">
                      {averageImprovement.toFixed(2)}%
                      <ArrowUpIcon className="h-5 w-5 text-green-500 ml-1" />
                    </div>
                    <div className="text-xs text-gray-500">in conversion rate for winning variants</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tests">
            <div className="space-y-4">
              {chartData.map((test, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{test.name}</CardTitle>
                      <Badge variant={test.status === 'active' ? 'default' : 'outline'}>
                        {test.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Variant A</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500">Views</div>
                            <div className="font-medium">{test.viewsA.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Conversion</div>
                            <div className="font-medium">{test.conversionA}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Variant B</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500">Views</div>
                            <div className="font-medium">{test.viewsB.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Conversion</div>
                            <div className="font-medium">{test.conversionB}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {test.status === 'completed' && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            Winner: <span className="font-medium">Variant {test.winner}</span>
                          </div>
                          <div className="text-sm flex items-center">
                            Improvement: 
                            <span className="font-medium ml-1">{test.improvement}%</span>
                            {test.improvement > 0 && <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Performance Summary</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {winnerData.find(d => d.name === 'Variant A Wins')?.value > 
                     winnerData.find(d => d.name === 'Variant B Wins')?.value
                      ? "Variant A tends to perform better across your tests. Consider applying these optimizations to more listings."
                      : "Variant B tends to perform better across your tests. Consider what makes these variations more effective."}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Recommendations</h4>
                  <ul className="text-sm text-gray-500 mt-1 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {averageImprovement > 5 
                        ? "Your A/B tests are showing significant improvements. Continue testing new variations."
                        : "Your tests show modest improvements. Consider more substantial changes to test."}
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {summary?.activeTests === 0
                        ? "You have no active tests. Consider starting new tests to continue optimizing."
                        : `You have ${summary?.activeTests} active tests. Monitor these closely and end tests once you have statistical significance.`}
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Focus on testing one element at a time (title, description, images) to clearly identify what drives improvements.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Next Steps</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on your results, we recommend testing {chartData.length < 3 ? "more variations" : "different aspects"} of your listings, 
                    such as {chartData.length < 3 ? "different headlines and descriptions" : "pricing strategies and featured amenities"}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 