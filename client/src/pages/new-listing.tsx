import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Copy, Download, Loader2, Sparkles, AlertCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Property types for dropdown
const propertyTypes = [
  "Single Family Home",
  "Condo",
  "Townhouse",
  "Apartment",
  "Duplex",
  "Multi-Family",
  "Land",
  "Other"
];

// Tone options for dropdown
const toneOptions = [
  "Professional",
  "Conversational",
  "Luxury",
  "Modern",
  "Traditional"
];

export default function NewListingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [isCheckingSEO, setIsCheckingSEO] = useState(false);
  const [generatedListing, setGeneratedListing] = useState("");
  const [socialMediaContent, setSocialMediaContent] = useState("");
  const [complianceResult, setComplianceResult] = useState<{ score: number; issues: string[] } | null>(null);
  const [seoResult, setSeoResult] = useState<{ score: number; suggestions: string[] } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    price: "",
    location: "",
    features: "",
    tone: "Professional",
    includeSEO: user?.seoEnabled || false,
    includeSocialMedia: user?.socialMediaEnabled || false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData({
      ...formData,
      [feature]: checked,
    });
  };

  const isFormValid = () => {
    return (
      formData.propertyType &&
      formData.bedrooms &&
      formData.bathrooms &&
      formData.squareFeet &&
      formData.price &&
      formData.location &&
      formData.features
    );
  };

  const handleGenerateListing = async () => {
    if (!isFormValid()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setActiveTab("generated");

    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Generate mock listing based on form data
        const listing = `
# ${formData.bedrooms} Bed, ${formData.bathrooms} Bath ${formData.propertyType} in ${formData.location}

**Price: $${parseInt(formData.price).toLocaleString()}**
**Size: ${parseInt(formData.squareFeet).toLocaleString()} sq. ft.**

Welcome to this stunning ${formData.bedrooms} bedroom, ${formData.bathrooms} bathroom ${formData.propertyType.toLowerCase()} located in the heart of ${formData.location}. This property offers the perfect blend of comfort, style, and convenience.

## Property Highlights

This well-maintained home features ${formData.squareFeet} square feet of thoughtfully designed living space. The open floor plan creates a seamless flow between the living areas, making it ideal for both everyday living and entertaining.

${formData.features}

## Location Benefits

Situated in a desirable location with convenient access to shopping, dining, and transportation. The property offers a perfect balance of residential tranquility and urban convenience.

## Investment Opportunity

Priced at $${parseInt(formData.price).toLocaleString()}, this property represents an exceptional value in today's market. Whether you're looking for your dream home or a sound investment, this ${formData.propertyType.toLowerCase()} checks all the boxes.

Contact us today to schedule a viewing of this outstanding property!
`;

        // Generate social media content if selected
        let socialContent = "";
        if (formData.includeSocialMedia) {
          socialContent = `
## Instagram Caption
🏠 NEW LISTING ALERT! ${formData.bedrooms}BR/${formData.bathrooms}BA ${formData.propertyType} in ${formData.location} for $${parseInt(formData.price).toLocaleString()}! This stunning property features ${formData.features.split(',')[0].trim().toLowerCase()} and more! DM for details or click the link in bio to schedule a viewing! #realestate #dreamhome #${formData.location.replace(/,.*$/g, '').replace(/\s+/g, '')} #newlisting

## Facebook Post
JUST LISTED! Beautiful ${formData.bedrooms} bedroom, ${formData.bathrooms} bathroom ${formData.propertyType.toLowerCase()} in ${formData.location}! Offering ${parseInt(formData.squareFeet).toLocaleString()} sq. ft. of modern living space with amazing features including ${formData.features.split(',').slice(0, 3).join(', ').toLowerCase()}. 

Priced at $${parseInt(formData.price).toLocaleString()} - this won't last long! Contact us today for a private showing.

## Twitter/X Post
NEW LISTING: Stunning ${formData.bedrooms}BR/${formData.bathrooms}BA ${formData.propertyType} in ${formData.location} for $${parseInt(formData.price).toLocaleString()}! Features include ${formData.features.split(',')[0].trim().toLowerCase()}. Contact us to schedule a showing!
`;
        }

        setGeneratedListing(listing);
        setSocialMediaContent(socialContent);
        setIsGenerating(false);
        
        // Auto check for compliance
        handleCheckCompliance();
        
        // Check SEO if enabled
        if (formData.includeSEO) {
          handleCheckSEO();
        }
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckCompliance = async () => {
    setIsCheckingCompliance(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock compliance check results
        const mockScore = Math.floor(Math.random() * 11) + 90; // 90-100
        const mockIssues = [];
        
        // Add some random issues based on the form data
        if (formData.features.toLowerCase().includes("perfect for families")) {
          mockIssues.push("Consider avoiding 'perfect for families' as it may suggest familial status preference");
        }
        
        if (formData.features.toLowerCase().includes("exclusive")) {
          mockIssues.push("Avoid using 'exclusive' as it may imply discrimination");
        }
        
        if (formData.features.toLowerCase().includes("within walking distance")) {
          mockIssues.push("Consider replacing 'walking distance' with 'close to' to avoid disability discrimination");
        }
        
        setComplianceResult({
          score: mockScore,
          issues: mockIssues
        });
        
        setIsCheckingCompliance(false);
      }, 2000);
    } catch (error) {
      setIsCheckingCompliance(false);
      toast({
        title: "Error",
        description: "Failed to check compliance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckSEO = async () => {
    setIsCheckingSEO(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock SEO analysis results
        const mockScore = Math.floor(Math.random() * 31) + 70; // 70-100
        const mockSuggestions = [
          "Consider adding more specific location keywords throughout the listing",
          "Increase keyword density for property features",
          "Add a neighborhood section to improve local SEO"
        ];
        
        setSeoResult({
          score: mockScore,
          suggestions: mockSuggestions
        });
        
        setIsCheckingSEO(false);
      }, 2000);
    } catch (error) {
      setIsCheckingSEO(false);
      toast({
        title: "Error",
        description: "Failed to analyze SEO. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    toast({
      title: "Listing saved",
      description: "Your listing has been saved successfully."
    });
    
    // In a real app, this would redirect to the listings page
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Listing</h1>
          <p className="text-muted-foreground">
            Generate a Fair Housing compliant property listing
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="details">Property Details</TabsTrigger>
            <TabsTrigger value="generated" disabled={!generatedListing}>Generated Listing</TabsTrigger>
            <TabsTrigger value="social" disabled={!socialMediaContent}>Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>
                  Enter details about the property to generate a listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleSelectChange("propertyType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. Portland, OR"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      placeholder="3"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="2"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Square Feet</Label>
                    <Input
                      id="squareFeet"
                      name="squareFeet"
                      type="number"
                      min="1"
                      placeholder="1500"
                      value={formData.squareFeet}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      placeholder="450000"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features">Property Features</Label>
                  <Textarea
                    id="features"
                    name="features"
                    placeholder="List key features, amenities, and selling points (e.g. Hardwood floors, granite countertops, renovated bathroom, etc.)"
                    rows={4}
                    value={formData.features}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tone">Listing Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => handleSelectChange("tone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="font-medium">Additional Options</h3>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col">
                      <Label htmlFor="includeSEO" className="flex-1">Include SEO Optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize listing for search engines
                      </p>
                    </div>
                    <Switch
                      id="includeSEO"
                      checked={formData.includeSEO}
                      onCheckedChange={(checked) => handleFeatureToggle("includeSEO", checked)}
                      disabled={!user?.seoEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col">
                      <Label htmlFor="includeSocialMedia" className="flex-1">Include Social Media Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Generate content for social platforms
                      </p>
                    </div>
                    <Switch
                      id="includeSocialMedia"
                      checked={formData.includeSocialMedia}
                      onCheckedChange={(checked) => handleFeatureToggle("includeSocialMedia", checked)}
                      disabled={!user?.socialMediaEnabled}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setFormData({
                  title: "",
                  propertyType: "",
                  bedrooms: "",
                  bathrooms: "",
                  squareFeet: "",
                  price: "",
                  location: "",
                  features: "",
                  tone: "Professional",
                  includeSEO: user?.seoEnabled || false,
                  includeSocialMedia: user?.socialMediaEnabled || false,
                })}>
                  Clear
                </Button>
                <Button onClick={handleGenerateListing} disabled={isGenerating || !isFormValid()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Listing
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="generated" className="pt-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Generating your listing...</h3>
                <p className="text-muted-foreground">
                  Creating a compelling and compliant property description
                </p>
              </div>
            ) : generatedListing ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Generated Listing</CardTitle>
                      <CardDescription>
                        Fair Housing compliant property description
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(generatedListing)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line prose max-w-none">
                      {generatedListing}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {/* Compliance score */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Check</CardTitle>
                      <CardDescription>
                        Fair Housing compliance analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isCheckingCompliance ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : complianceResult ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Compliance Score</h3>
                            <span className={`text-2xl font-bold ${getScoreColor(complianceResult.score)}`}>
                              {complianceResult.score}%
                            </span>
                          </div>
                          
                          {complianceResult.issues.length > 0 ? (
                            <div className="space-y-2">
                              <h4 className="font-medium">Issues to Address</h4>
                              <ul className="space-y-2">
                                {complianceResult.issues.map((issue, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-md">
                              <CheckCircle className="h-5 w-5" />
                              <p className="text-sm">No compliance issues detected</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                  
                  {/* SEO score if enabled */}
                  {formData.includeSEO && (
                    <Card>
                      <CardHeader>
                        <CardTitle>SEO Analysis</CardTitle>
                        <CardDescription>
                          Search engine optimization score
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isCheckingSEO ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : seoResult ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">SEO Score</h3>
                              <span className={`text-2xl font-bold ${getScoreColor(seoResult.score)}`}>
                                {seoResult.score}%
                              </span>
                            </div>
                            
                            {seoResult.suggestions.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Optimization Suggestions</h4>
                                <ul className="space-y-2">
                                  {seoResult.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <Card>
                  <CardFooter className="flex justify-between py-6">
                    <Button variant="outline" onClick={() => setActiveTab("details")}>
                      Edit Details
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button onClick={handleSave}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Listing
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ) : null}
          </TabsContent>
          
          <TabsContent value="social" className="pt-6">
            {socialMediaContent ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Social Media Content</CardTitle>
                    <CardDescription>
                      Platform-specific captions for your listing
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(socialMediaContent)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="whitespace-pre-line prose max-w-none">
                    {socialMediaContent}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" onClick={() => setActiveTab("generated")}>
                    Back to Listing
                  </Button>
                </CardFooter>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}