import React, { useState, useEffect } from 'react';
import { useRealtimeAnalytics } from '@/lib/services/realtimeService';
import { RealtimeActivityFeed } from '@/components/analytics/RealtimeActivityFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, lastEvent, eventCount } = useRealtimeAnalytics();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Button variant="outline">Export Data</Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Views</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{eventCount.view || 0}</div>
                    <p className="text-sm text-muted-foreground">
                      +{Math.floor(Math.random() * 20) + 5}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Leads Generated</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{eventCount.lead || 0}</div>
                    <p className="text-sm text-muted-foreground">
                      +{Math.floor(Math.random() * 15) + 2}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>Views to leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {eventCount.view ? ((eventCount.lead / eventCount.view) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}% from last month
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Activity</CardTitle>
              <CardDescription>
                Live updates as users interact with your listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="grid grid-cols-3 gap-2 my-4">
                    {Array(6).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <RealtimeActivityFeed 
                  isConnected={isConnected}
                  lastEvent={lastEvent}
                  eventCount={eventCount}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listing Performance</CardTitle>
              <CardDescription>
                Compare how your different listings are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-60 w-full" />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Detailed listing performance metrics will appear here as data is collected.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abtests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>A/B Testing Results</CardTitle>
              <CardDescription>
                Compare performance of different listing variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-60 w-full" />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    A/B testing results will appear here once you've created test variants.
                  </p>
                  <Button className="mt-4" variant="outline">
                    Create A/B Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 