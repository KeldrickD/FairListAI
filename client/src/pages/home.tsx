import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema, type InsertListing } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, AlertCircle, CheckCircle, Home as HomeIcon, Bath, Bed, Maximize2, Building2, Shield, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const { toast } = useToast();
  const [generatedListing, setGeneratedListing] = useState<string | null>(null);
  const [compliance, setCompliance] = useState<{
    isCompliant: boolean;
    violations: string[];
    suggestions: string[];
  } | null>(null);

  const form = useForm<InsertListing>({
    resolver: zodResolver(insertListingSchema),
    defaultValues: {
      propertyType: "house",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      features: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: InsertListing) => {
      const res = await apiRequest("POST", "/api/listings/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedListing(data.generated.listing);
      setCompliance(data.generated.compliance);
      toast({
        title: "Success!",
        description: "Your listing has been generated and checked for compliance.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">ListingAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Support</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
                AI-Powered Real Estate Listings
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Create professional, compliant property listings in seconds with our advanced AI technology.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-white shadow-md border"
              >
                <Sparkles className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Professional listings crafted by advanced AI in seconds
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-white shadow-md border"
              >
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Fair Housing Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic compliance checking with HUD guidelines
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-xl bg-white shadow-md border"
              >
                <HomeIcon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">SEO Optimized</h3>
                <p className="text-sm text-muted-foreground">
                  Listings optimized for maximum visibility
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="shadow-lg border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-2xl">Property Details</CardTitle>
                    <CardDescription>
                      Enter your property information below to generate a professional listing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12">
                                    <HomeIcon className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Select property type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="house">House</SelectItem>
                                  <SelectItem value="condo">Condo</SelectItem>
                                  <SelectItem value="apartment">Apartment</SelectItem>
                                  <SelectItem value="townhouse">Townhouse</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4" />
                                    Bedrooms
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-2">
                                    <Bath className="w-4 h-4" />
                                    Bathrooms
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="squareFeet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4" />
                                    Square Feet
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="features"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Key Features</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe notable features (e.g., modern kitchen, hardwood floors, updated appliances)"
                                  className="h-32 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full h-12 text-base"
                          disabled={generateMutation.isPending}
                        >
                          {generateMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Generating Listing...
                            </>
                          ) : (
                            "Generate Professional Listing"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Output Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                {generatedListing && (
                  <Card className="shadow-lg border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-2xl">Generated Listing</CardTitle>
                        <CardDescription>AI-powered and optimized for engagement</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedListing);
                          toast({ description: "Listing copied to clipboard!" });
                        }}
                      >
                        Copy Listing
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg bg-muted/30 p-6 border">
                        <p className="whitespace-pre-wrap text-base leading-relaxed">
                          {generatedListing}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {compliance && (
                  <Card className="shadow-lg border-primary/10">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-2xl">Fair Housing Compliance</CardTitle>
                        <Badge 
                          variant={compliance.isCompliant ? "default" : "destructive"}
                          className={cn(
                            "text-sm py-1",
                            compliance.isCompliant ? "bg-green-500/10 text-green-600" : ""
                          )}
                        >
                          {compliance.isCompliant ? "Compliant" : "Needs Review"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!compliance.isCompliant && compliance.violations.length > 0 && (
                        <Alert variant="destructive" className="border-destructive/30">
                          <AlertCircle className="h-5 w-5" />
                          <AlertTitle className="text-lg font-semibold">Compliance Issues Found</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-4 mt-2 space-y-2">
                              {compliance.violations.map((violation, i) => (
                                <li key={i} className="text-sm">{violation}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}

                      {compliance.suggestions.length > 0 && (
                        <Alert className="border-primary/30 bg-primary/5">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <AlertTitle className="text-lg font-semibold">Suggestions for Improvement</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-4 mt-2 space-y-2">
                              {compliance.suggestions.map((suggestion, i) => (
                                <li key={i} className="text-sm">{suggestion}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-semibold text-xl">ListingAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional real estate listings powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Premium</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Fair Housing Guide</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Contact</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}