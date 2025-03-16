import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, DownloadIcon, ShareIcon } from '@heroicons/react/24/outline';

const AnalyticsPage: NextPage = () => {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Analytics Dashboard | FairListAI</title>
        <meta name="description" content="Track and analyze your listing performance with advanced analytics" />
      </Head>
      
      <MainLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Track performance and optimize your listings
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <TabsContent value="dashboard">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Comprehensive monthly report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A detailed analysis of your listing performance over the past month, including views, leads, and conversion metrics.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Comparison</CardTitle>
                    <CardDescription>Compare multiple listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compare performance metrics across multiple listings to identify top performers and optimization opportunities.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>Analyze your conversion path</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track how visitors move through your listing pages and identify where potential leads drop off.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Performance</CardTitle>
                    <CardDescription>Search engine visibility report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyze how your listings are performing in search engines and identify optimization opportunities.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Impact</CardTitle>
                    <CardDescription>Social engagement analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Measure the impact of social media sharing on your listing performance and engagement.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Report</CardTitle>
                    <CardDescription>Build your own report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a custom report with the specific metrics and timeframes that matter most to you.
                    </p>
                    <Button className="w-full">Create Custom Report</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Settings</CardTitle>
                  <CardDescription>Configure your analytics preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Collection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          id="track-visitors" 
                          className="mt-1" 
                          defaultChecked 
                        />
                        <div>
                          <label htmlFor="track-visitors" className="text-sm font-medium">
                            Track Unique Visitors
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Collect data about unique visitors to your listings
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          id="track-engagement" 
                          className="mt-1" 
                          defaultChecked 
                        />
                        <div>
                          <label htmlFor="track-engagement" className="text-sm font-medium">
                            Track Engagement Metrics
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Collect data about how users interact with your listings
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          id="track-social" 
                          className="mt-1" 
                          defaultChecked 
                        />
                        <div>
                          <label htmlFor="track-social" className="text-sm font-medium">
                            Track Social Sharing
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Collect data about social media sharing of your listings
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          id="track-location" 
                          className="mt-1" 
                          defaultChecked 
                        />
                        <div>
                          <label htmlFor="track-location" className="text-sm font-medium">
                            Track Geographic Data
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Collect data about where your visitors are located
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Reporting Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="default-timeframe" className="text-sm font-medium block mb-2">
                          Default Timeframe
                        </label>
                        <select 
                          id="default-timeframe" 
                          className="w-full p-2 border rounded-md"
                          defaultValue="30"
                        >
                          <option value="7">Last 7 days</option>
                          <option value="14">Last 14 days</option>
                          <option value="30">Last 30 days</option>
                          <option value="90">Last 90 days</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="email-frequency" className="text-sm font-medium block mb-2">
                          Email Report Frequency
                        </label>
                        <select 
                          id="email-frequency" 
                          className="w-full p-2 border rounded-md"
                          defaultValue="weekly"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </>
  );
};

export default AnalyticsPage; 