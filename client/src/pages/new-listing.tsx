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
import { Loader2, Home as HomeIcon, Bath, Bed, Maximize2, Building2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { AlertCircle, CheckCircle } from "lucide-react";


export default function NewListing() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [generatedListing, setGeneratedListing] = useState<string | null>(null);
  const [compliance, setCompliance] = useState<{
    isCompliant: boolean;
    violations: string[];
    suggestions: string[];
  } | null>(null);

  const form = useForm<InsertListing>({
    resolver: zodResolver(insertListingSchema),
    defaultValues: {
      title: "",
      propertyType: "house",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      features: "",
      tone: "professional", // Added tone default value
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
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: "Success!",
        description: "Your listing has been generated and saved.",
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
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">ListingAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost">Support</Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Listing</CardTitle>
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Modern Downtown Condo or Family Home in Suburbia"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Tone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select tone style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="luxury">Luxury</SelectItem>
                            <SelectItem value="cozy">Cozy</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="family-friendly">Family-Friendly</SelectItem>
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
                            placeholder="Describe notable features or paste an existing listing to improve (e.g., modern kitchen, hardwood floors, updated appliances)"
                            className="h-48 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => setLocation("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={generateMutation.isPending}
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Listing"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              {generatedListing && (
                <div className="mt-8">
                  <Card className="shadow-lg border-primary/10">
                    <CardHeader>
                      <CardTitle>Generated Listing</CardTitle>
                      <CardDescription>Review your generated listing below</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg bg-muted/30 p-6 border">
                        <p className="whitespace-pre-wrap text-base leading-relaxed">
                          {generatedListing}
                        </p>
                      </div>
                      <div className="flex justify-end mt-4 space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedListing);
                            toast({ description: "Listing copied to clipboard!" });
                          }}
                        >
                          Copy Listing
                        </Button>
                        <Button onClick={() => setLocation("/dashboard")}>
                          Go to Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Add after the generated listing card */}
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}