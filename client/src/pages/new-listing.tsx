import { useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Copy, Download, Loader2, Sparkles, AlertCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Define property types
const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

// Define listing status options
const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export default function NewListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    location: "",
    price: "",
    status: "draft",
  });
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert numeric fields
      const numericFields = {
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
        price: formData.price ? parseInt(formData.price) : undefined,
      };
      
      // Prepare data for API
      const listingData = {
        ...formData,
        ...numericFields,
      };
      
      // Make API request
      const response = await apiRequest('POST', '/api/listings', { body: listingData });
      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Listing created successfully!",
      });
      
      // Redirect to listings page or the new listing
      router.push(`/listings/${data.id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      
      // In development, simulate success
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Development Mode",
          description: "Listing created successfully (simulated).",
        });
        
        // Redirect to listings page
        router.push('/listings');
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Failed to create listing. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Listing</h1>
          <Button variant="outline" onClick={() => router.push('/listings')}>
            Cancel
          </Button>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
              <CardDescription>
                Enter the details of your property listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Listing Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Beautiful 3 Bedroom House in Portland"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your property..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleSelectChange("propertyType", value)}
                      required
                    >
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Property Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      placeholder="Number of bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Number of bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="squareFeet">Square Feet</Label>
                    <Input
                      id="squareFeet"
                      name="squareFeet"
                      type="number"
                      min="0"
                      placeholder="Property size in sq ft"
                      value={formData.squareFeet}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="Property price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Address/Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Portland, OR or full address"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Publishing Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Publishing Options</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Draft listings are only visible to you. Published listings are visible to the public.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/listings')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}