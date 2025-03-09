import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, AlertCircle, CheckCircle, Plus, Pencil, Download, Search, SortAsc, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Listing } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const exportListing = (listing: Listing, format: 'text' | 'csv') => {
  let content = '';
  const filename = `listing-${listing.id}-${format === 'csv' ? 'data' : 'description'}.${format}`;

  if (format === 'csv') {
    content = `Title,Property Type,Bedrooms,Bathrooms,Square Feet,Features,Generated At\n`;
    content += `"${listing.title}","${listing.propertyType}",${listing.bedrooms},${listing.bathrooms},${listing.squareFeet},"${listing.features}","${listing.generatedAt}"\n`;
  } else {
    content = `${listing.title}\n\n`;
    content += `Property Details:\n`;
    content += `Type: ${listing.propertyType}\n`;
    content += `Bedrooms: ${listing.bedrooms}\n`;
    content += `Bathrooms: ${listing.bathrooms}\n`;
    content += `Square Feet: ${listing.squareFeet}\n\n`;
    content += `Features:\n${listing.features}\n\n`;
    content += `Generated Listing:\n${listing.generatedListing}\n`;
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function Dashboard() {
  const { toast } = useToast();
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "type">("date");
  const [filterType, setFilterType] = useState<string>("all");
  const queryClient = useQueryClient();

  const listingsQuery = useQuery<ListingsResponse>({
    queryKey: ['/api/listings'],
    select: (data) => ({
      listings: data.listings.map(listing => ({
        ...listing,
        generatedAt: listing.generatedAt ? new Date(listing.generatedAt) : null
      }))
    })
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

  const { listings: rawListings } = listingsQuery.data || { listings: [] };

  // Filter listings
  let listings = rawListings;
  if (searchQuery) {
    listings = listings.filter(listing =>
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.features.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.generatedListing?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterType !== "all") {
    listings = listings.filter(listing => listing.propertyType === filterType);
  }

  // Sort listings
  listings = [...listings].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return ((b.generatedAt instanceof Date ? b.generatedAt : new Date(0)).getTime()) - 
               ((a.generatedAt instanceof Date ? a.generatedAt : new Date(0)).getTime());
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "type":
        return a.propertyType.localeCompare(b.propertyType);
      default:
        return 0;
    }
  });

  const listingsThisMonth = rawListings.length;
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

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-[160px] h-12">
                  <SortAsc className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="type">Property Type</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px] h-12">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">Houses</SelectItem>
                  <SelectItem value="condo">Condos</SelectItem>
                  <SelectItem value="apartment">Apartments</SelectItem>
                  <SelectItem value="townhouse">Townhouses</SelectItem>
                </SelectContent>
              </Select>
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
              <CardDescription>
                {listings.length} listing{listings.length !== 1 ? 's' : ''} found
              </CardDescription>
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
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportListing(listing, 'text')}
                            title="Export as Text"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Text
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportListing(listing, 'csv')}
                            title="Export as CSV"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
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