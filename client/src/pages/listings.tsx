import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter, Download, Copy, Pencil, Trash2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// Mock listing data for development
const mockListings = [
  {
    id: 1,
    title: "3 Bed, 2 Bath House in Portland",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    location: "Portland, OR",
    price: 450000,
    generatedAt: new Date(2023, 8, 12),
  },
  {
    id: 2,
    title: "Luxury 2 Bed Condo in Downtown",
    propertyType: "condo",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    location: "Seattle, WA",
    price: 550000,
    generatedAt: new Date(2023, 8, 14),
  },
  {
    id: 3,
    title: "Spacious 4 Bed Family Home",
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2400,
    location: "Austin, TX",
    price: 650000,
    generatedAt: new Date(2023, 8, 15),
  },
  {
    id: 4,
    title: "Cozy 1 Bed Apartment in the City",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    location: "New York, NY",
    price: 320000,
    generatedAt: new Date(2023, 8, 18),
  },
  {
    id: 5,
    title: "Modern 3 Bed Townhouse",
    propertyType: "townhouse",
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1650,
    location: "Denver, CO",
    price: 520000,
    generatedAt: new Date(2023, 8, 20),
  },
];

export default function ListingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort listings
  const filteredListings = mockListings
    .filter(listing => {
      // Search query filter
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Property type filter
      if (propertyTypeFilter !== "all" && listing.propertyType !== propertyTypeFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortBy) {
        case "date":
          return b.generatedAt.getTime() - a.generatedAt.getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "bedrooms":
          return b.bedrooms - a.bedrooms;
        case "sqft":
          return b.squareFeet - a.squareFeet;
        default:
          return 0;
      }
    });

  const handleCopyListing = (listingId: number) => {
    // In a real app, this would fetch the full listing text
    toast({
      title: "Listing copied",
      description: "Listing details copied to clipboard",
    });
  };

  const handleDeleteListing = (listingId: number) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Listing deleted",
        description: "The listing has been deleted successfully",
      });
    }, 1000);
  };

  const handleDownloadListing = (listingId: number) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Downloading listing",
      description: "Your listing PDF is being generated",
    });
  };

  const getPropertyTypeBadge = (type: string) => {
    switch (type) {
      case "house":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">House</Badge>;
      case "condo":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Condo</Badge>;
      case "apartment":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Apartment</Badge>;
      case "townhouse":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Townhouse</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground">
              Manage and organize your property listings
            </p>
          </div>
          <Button className="shrink-0" asChild>
            <a href="/new-listing">Create New Listing</a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Listings</CardTitle>
            <CardDescription>
              {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, location..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="house">Houses</SelectItem>
                    <SelectItem value="condo">Condos</SelectItem>
                    <SelectItem value="apartment">Apartments</SelectItem>
                    <SelectItem value="townhouse">Townhouses</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Newest First</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                    <SelectItem value="sqft">Largest Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Listings table */}
            {filteredListings.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden md:table-cell">Details</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-start gap-3">
                            <div className="rounded-md bg-muted p-2 hidden sm:block">
                              <Home className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{listing.title}</div>
                              <div className="text-sm text-muted-foreground md:hidden">
                                {listing.location}
                              </div>
                              <div className="mt-1">
                                {getPropertyTypeBadge(listing.propertyType)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {listing.location}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.squareFeet} sqft
                          </div>
                          <div className="text-sm font-medium">
                            ${listing.price.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {formatDistanceToNow(listing.generatedAt, { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleCopyListing(listing.id)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>Copy</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadListing(listing.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={`/edit-listing/${listing.id}`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteListing(listing.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Home className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No listings found</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  {searchQuery || propertyTypeFilter !== "all" 
                    ? "Try changing your search or filter criteria" 
                    : "Create your first property listing to get started"}
                </p>
                {!searchQuery && propertyTypeFilter === "all" && (
                  <Button asChild>
                    <a href="/new-listing">Create Listing</a>
                  </Button>
                )}
              </div>
            )}

            {isLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-background p-4 rounded-lg shadow-lg flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Processing...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 