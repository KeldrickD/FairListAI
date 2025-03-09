import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, AlertCircle, CheckCircle, Plus, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Listing } from "@shared/schema";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface ListingsResponse {
  listings: Listing[];
}

const apiRequest = async (method: string, url: string, data?: any) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || response.statusText;
    throw new Error(errorMessage);
  }
  return await response.json();
};

export default function Dashboard() {
  const { toast } = useToast();
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const queryClient = useQueryClient();

  const listingsQuery = useQuery<ListingsResponse>({
    queryKey: ['/api/listings']
  });

  const updateTitleMutation = useMutation({
    mutationFn: async ({ id, title }: { id: number; title: string }) => {
      await apiRequest("PATCH", `/api/listings/${id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({ description: "Title updated successfully" });
      setEditingTitleId(null);
    },
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

  const { listings } = listingsQuery.data || { listings: [] };
  const listingsThisMonth = listings.length;
  const isFreeTier = true; 
  const remainingListings = isFreeTier ? `${5 - listingsThisMonth} remaining` : "Unlimited";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-semibold text-xl">ListingAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Support</Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 pt-24">
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

            <div className="flex items-center gap-4">
              <Button asChild className="bg-primary/10 text-primary hover:bg-primary/20">
                <Link href="/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Listing
                </Link>
              </Button>

              {isFreeTier && (
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>
                  {isFreeTier ? "Free Plan" : "Premium Plan"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isFreeTier && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monthly Listings</span>
                        <span className="font-medium">{listingsThisMonth}/5</span>
                      </div>
                      <Progress value={listingsThisMonth * 20} />
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
                      AI Generated
                    </dt>
                    <dd className="text-2xl font-bold">
                      {listings.filter((l: Listing) => l.generatedListing).length}
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
                        <div className="flex-1">
                          {editingTitleId === listing.id ? (
                            <div className="flex gap-2 items-center">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="max-w-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateTitleMutation.mutate({
                                    id: listing.id,
                                    title: editTitle,
                                  });
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingTitleId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {listing.title || (listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1))}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setEditingTitleId(listing.id);
                                  setEditTitle(listing.title || "");
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.squareFeet} sq ft
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      {listing.generatedListing && (
                        <p className="mt-2 text-sm">
                          {listing.generatedListing}
                        </p>
                      )}
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}