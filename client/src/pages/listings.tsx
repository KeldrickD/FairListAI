import { useState, useEffect } from "react";
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
import { apiRequest } from "@/lib/queryClient";
import { useRouter } from "next/router";

// Define listing type
interface Listing {
  id: number;
  title: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  location?: string;
  price?: number;
  status: string;
  complianceScore?: number;
  seoScore?: number;
  generatedAt: Date;
}

// Define filter state
interface ListingFilters {
  search: string;
  propertyType: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function ListingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ListingFilters>({
    search: '',
    propertyType: '',
    status: '',
    sortBy: 'generatedAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());
        
        if (filters.search) {
          queryParams.append('search', filters.search);
        }
        
        if (filters.propertyType) {
          queryParams.append('propertyType', filters.propertyType);
        }
        
        if (filters.status) {
          queryParams.append('status', filters.status);
        }
        
        if (filters.sortBy) {
          queryParams.append('sortBy', filters.sortBy);
          queryParams.append('sortOrder', filters.sortOrder);
        }
        
        // Add user ID if available
        if (user?.id) {
          queryParams.append('userId', user.id.toString());
        }
        
        // Make API request
        const response = await apiRequest('GET', `/api/listings?${queryParams.toString()}`);
        const data = await response.json();
        
        // Format dates
        const formattedListings = data.listings.map((listing: any) => ({
          ...listing,
          generatedAt: new Date(listing.createdAt),
        }));
        
        setListings(formattedListings);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          pages: data.pagination.pages,
        });
      } catch (error) {
        console.error("Error fetching listings:", error);
        
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.warn("Using mock listings data in development mode");
          
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
              status: "published",
              complianceScore: 95,
              seoScore: 88,
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
              price: 650000,
              status: "draft",
              complianceScore: 85,
              seoScore: 92,
              generatedAt: new Date(2023, 8, 10),
            },
            {
              id: 3,
              title: "Charming Studio Apartment",
              propertyType: "apartment",
              bedrooms: 0,
              bathrooms: 1,
              squareFeet: 550,
              location: "San Francisco, CA",
              price: 2200,
              status: "published",
              complianceScore: 90,
              seoScore: 78,
              generatedAt: new Date(2023, 8, 5),
            },
          ];
          
          setListings(mockListings);
          setPagination({
            ...pagination,
            total: mockListings.length,
            pages: 1,
          });
        } else {
          toast({
            variant: "error",
            title: "Error",
            description: "Failed to load listings. Please try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [user, filters, pagination.page, pagination.limit, toast]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination({ ...pagination, page: 1 });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ListingFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
    // Reset to first page when filtering
    setPagination({ ...pagination, page: 1 });
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/listings/${id}`);
      
      // Remove from local state
      setListings(listings.filter(listing => listing.id !== id));
      
      toast({
        title: "Success",
        description: "Listing deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      
      // In development, just remove from local state
      if (process.env.NODE_ENV === 'development') {
        setListings(listings.filter(listing => listing.id !== id));
        
        toast({
          title: "Development Mode",
          description: "Listing removed from local state.",
        });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Failed to delete listing. Please try again.",
        });
      }
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button onClick={() => router.push('/new-listing')}>Create New Listing</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Listings</CardTitle>
            <CardDescription>
              View, edit, and manage all your property listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Search and filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search listings..."
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </form>
                
                <div className="flex gap-2">
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) => handleFilterChange('propertyType', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleFilterChange('sortBy', 'title')}>
                        Sort by Title
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterChange('sortBy', 'price')}>
                        Sort by Price
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterChange('sortBy', 'generatedAt')}>
                        Sort by Date
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        {filters.sortOrder === 'asc' ? 'Descending Order' : 'Ascending Order'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Listings table */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No listings found. Create your first listing!</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push('/new-listing')}
                  >
                    Create New Listing
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Scores</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell className="font-medium">{listing.title}</TableCell>
                            <TableCell>
                              {listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1)}
                            </TableCell>
                            <TableCell>
                              {listing.price ? `$${listing.price.toLocaleString()}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={listing.status === 'published' ? 'default' : 'secondary'}>
                                {listing.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
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
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(listing.generatedAt, { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/listings/${listing.id}`)}
                                >
                                  <Home className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/listings/${listing.id}/edit`)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(listing.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} listings
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={page === pagination.page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 