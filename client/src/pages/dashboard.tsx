import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, AlertCircle, CheckCircle, Plus, Pencil, Download, Search, SortAsc, Filter, Building2, Sparkles, Video, Share2, PieChart, List, ChevronRight, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Listing } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Home, Settings, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

interface ListingsResponse {
  listings: Listing[];
}

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

    // Add add-on content if available
    if (listing.seoOptimized) {
      content += `\nSEO Optimized Content:\n${listing.seoOptimized}\n`;
    }
    if (listing.socialMediaContent) {
      content += `\nSocial Media Content:\n${listing.socialMediaContent}\n`;
    }
    if (listing.videoScript) {
      content += `\nVideo Script:\n${listing.videoScript}\n`;
    }
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

function AddOnsStatus() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Add-ons</CardTitle>
        <CardDescription>
          Your activated premium features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium">SEO Optimization</span>
            </div>
            {user.seoEnabled ? (
              <Badge className="bg-green-500/10 text-green-600">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Social Media Content</span>
            </div>
            {user.socialMediaEnabled ? (
              <Badge className="bg-green-500/10 text-green-600">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="font-medium">Video Scripts</span>
            </div>
            {user.videoScriptsEnabled ? (
              <Badge className="bg-green-500/10 text-green-600">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>

          {(!user.seoEnabled || !user.socialMediaEnabled || !user.videoScriptsEnabled) && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/premium">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Features
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for dashboard
const mockRecentListings = [
  {
    id: 101,
    title: "Modern 3 Bedroom House in Portland",
    date: "2 days ago",
    complianceScore: 95,
  },
  {
    id: 102,
    title: "Downtown Luxury Condo with City Views",
    date: "1 week ago",
    complianceScore: 88,
  },
  {
    id: 103,
    title: "Charming Cottage with Garden",
    date: "2 weeks ago",
    complianceScore: 100,
  },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "type">("date");
  const [filterType, setFilterType] = useState<string>("all");
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

  // Mock stats for dashboard
  const stats = {
    totalListings: 14,
    compliantListings: 12,
    listingCreditsRemaining: user?.isPremium ? "Unlimited" : 5,
    avgComplianceScore: 92,
    seoScore: 86,
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.username || "User"}! Here's what's happening with your listings.
            </p>
          </div>
          <Button asChild>
            <Link href="/new-listing">
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Link>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.compliantListings} compliant with Fair Housing
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Compliance Score
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgComplianceScore}%</div>
              <div className="mt-2">
                <Progress value={stats.avgComplianceScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. SEO Score
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.seoScore}%</div>
              <div className="mt-2">
                <Progress value={stats.seoScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Listing Credits
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.listingCreditsRemaining}</div>
              <p className="text-xs text-muted-foreground">
                {user?.isPremium 
                  ? "Premium subscription" 
                  : "Free tier limit"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main dashboard content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Listings</CardTitle>
              <CardDescription>
                Your recently created property listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex flex-col">
                      <div className="font-medium truncate max-w-[200px] md:max-w-[240px] lg:max-w-xs">
                        {listing.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{listing.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {listing.complianceScore}%
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/listings">
                  <List className="mr-2 h-4 w-4" />
                  View All Listings
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access key features of FairListAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link href="/new-listing" className="block">
                  <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Create New Listing</h3>
                      <p className="text-sm text-muted-foreground">Generate a new property listing</p>
                    </div>
                  </div>
                </Link>

                <Link href="/compliance-checker" className="block">
                  <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Check Compliance</h3>
                      <p className="text-sm text-muted-foreground">Verify Fair Housing compliance</p>
                    </div>
                  </div>
                </Link>

                <Link href="/seo-analyzer" className="block">
                  <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">SEO Analyzer</h3>
                      <p className="text-sm text-muted-foreground">Optimize your listings for search</p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade banner for free users */}
        {!user?.isPremium && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
              <div>
                <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Get unlimited listings, advanced SEO tools, and priority support
                </p>
              </div>
              <Button>Upgrade Now</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}