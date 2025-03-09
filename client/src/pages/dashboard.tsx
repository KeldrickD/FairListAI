import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, AlertCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Listing } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();

  const listingsQuery = useQuery({
    queryKey: ['/api/listings'],
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  if (listingsQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (listingsQuery.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { listings } = listingsQuery.data;
  const user = listings.length > 0 ? listings[0].user : null;
  const remainingListings = user?.isPremium ? "Unlimited" : `${5 - user?.listingsThisMonth} remaining`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your listings and subscription
            </p>
          </div>
          
          {!user?.isPremium && (
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                {user?.isPremium ? "Premium Plan" : "Free Plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user?.isPremium && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Listings</span>
                      <span className="font-medium">{user?.listingsThisMonth}/5</span>
                    </div>
                    <Progress value={(user?.listingsThisMonth || 0) * 20} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {remainingListings} this month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Total Listings
                  </dt>
                  <dd className="text-2xl font-bold">
                    {listings.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Compliant Listings
                  </dt>
                  <dd className="text-2xl font-bold">
                    {listings.filter((l: Listing) => !l.complianceIssues).length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {listings.map((listing: Listing) => (
                  <div key={listing.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          {listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.squareFeet} sq ft
                        </p>
                      </div>
                      {listing.complianceIssues ? (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="mt-2 text-sm">
                      {listing.generatedListing}
                    </p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
