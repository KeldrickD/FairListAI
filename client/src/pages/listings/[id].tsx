import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Home, Edit, Trash2, ArrowLeft, Share2, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Define listing type
interface Listing {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  location?: string;
  price?: number;
  status: string;
  complianceScore?: number;
  seoScore?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ListingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Make API request
        const response = await apiRequest('GET', `/api/listings/${id}`);
        const data = await response.json();
        
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.warn("Using mock listing data in development mode");
          
          // Mock listing data for development
          const mockListing = {
            id: Number(id),
            title: "Beautiful 3 Bedroom House in Portland",
            description: "This stunning property features an open floor plan, hardwood floors, and a newly renovated kitchen. The spacious backyard is perfect for entertaining, and the location provides easy access to schools, parks, and shopping centers.",
            propertyType: "house",
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 1800,
            location: "Portland, OR",
            price: 450000,
            status: "published",
            complianceScore: 95,
            seoScore: 88,
            createdAt: "2023-09-12T14:30:00Z",
            updatedAt: "2023-09-12T14:30:00Z",
          };
          
          setListing(mockListing);
        } else {
          toast({
            variant: "error",
            title: "Error",
            description: "Failed to load listing details. Please try again.",
          });
          
          // Navigate back to listings page
          router.push('/listings');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [id, router, toast]);
  
  // Handle delete
  const handleDelete = async () => {
    if (!listing) return;
    
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await apiRequest('DELETE', `/api/listings/${listing.id}`);
      
      toast({
        title: "Success",
        description: "Listing deleted successfully.",
      });
      
      // Redirect to listings page
      router.push('/listings');
    } catch (error) {
      console.error("Error deleting listing:", error);
      
      // In development, just redirect
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Development Mode",
          description: "Listing deleted (simulated).",
        });
        
        // Redirect to listings page
        router.push('/listings');
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Failed to delete listing. Please try again.",
        });
        
        setIsDeleting(false);
      }
    }
  };
  
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "Price not specified";
    return `$${price.toLocaleString()}`;
  };
  
  // Get property type label
  const getPropertyTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!listing) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h2 className="text-2xl font-bold">Listing Not Found</h2>
          <p className="text-muted-foreground">The listing you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/listings')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2" 
              onClick={() => router.push('/listings')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Button>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{getPropertyTypeLabel(listing.propertyType)}</Badge>
              <Badge variant={listing.status === 'published' ? 'default' : 'secondary'}>
                {listing.status}
              </Badge>
              {listing.complianceScore && (
                <Badge variant="outline" className="bg-green-50">
                  FH: {listing.complianceScore}
                </Badge>
              )}
              {listing.seoScore && (
                <Badge variant="outline" className="bg-blue-50">
                  SEO: {listing.seoScore}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/listings/${listing.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Main listing details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg">{listing.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listing.bedrooms !== undefined && (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{listing.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                    </div>
                  )}
                  
                  {listing.bathrooms !== undefined && (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{listing.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                    </div>
                  )}
                  
                  {listing.squareFeet !== undefined && (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{listing.squareFeet.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                    </div>
                  )}
                  
                  {listing.price !== undefined && (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">${listing.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Price</p>
                    </div>
                  )}
                </div>
                
                {listing.location && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Location</h3>
                    <p>{listing.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Compliance and SEO scores */}
            {(listing.complianceScore || listing.seoScore) && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Scores</CardTitle>
                  <CardDescription>
                    Fair Housing compliance and SEO optimization scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listing.complianceScore && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Fair Housing Compliance</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-4">
                            <div 
                              className="bg-green-500 h-4 rounded-full" 
                              style={{ width: `${listing.complianceScore}%` }}
                            />
                          </div>
                          <span className="font-bold">{listing.complianceScore}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {listing.complianceScore >= 90 
                            ? "Excellent compliance with Fair Housing guidelines." 
                            : listing.complianceScore >= 70 
                            ? "Good compliance, with minor suggestions for improvement." 
                            : "Needs improvement to meet Fair Housing guidelines."}
                        </p>
                      </div>
                    )}
                    
                    {listing.seoScore && (
                      <div className="space-y-2">
                        <h3 className="font-medium">SEO Optimization</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-4">
                            <div 
                              className={`h-4 rounded-full ${
                                listing.seoScore >= 90 
                                  ? "bg-green-500" 
                                  : listing.seoScore >= 70 
                                  ? "bg-amber-500" 
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${listing.seoScore}%` }}
                            />
                          </div>
                          <span className="font-bold">{listing.seoScore}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {listing.seoScore >= 90 
                            ? "Excellent SEO optimization for maximum visibility." 
                            : listing.seoScore >= 70 
                            ? "Good optimization with room for improvement." 
                            : "Needs significant SEO improvements for better visibility."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p>{formatDistanceToNow(new Date(listing.updatedAt), { addSuffix: true })}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={listing.status === 'published' ? 'default' : 'secondary'} className="mt-1">
                    {listing.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <p>{getPropertyTypeLabel(listing.propertyType)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-mono text-xs">{listing.id}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Listing
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 