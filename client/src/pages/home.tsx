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
import { Loader2, AlertCircle, CheckCircle, Home as HomeIcon, Bath, Bed, Maximize2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
              AI Real Estate Listing Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create professional, compliant property listings in seconds. Just enter the basic details below.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Fill in the basic information about your property
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
                              <SelectTrigger>
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
                              <Input type="number" {...field} />
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
                              <Input type="number" {...field} />
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
                              <Input type="number" {...field} />
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
                              placeholder="Describe notable features (e.g., modern kitchen, hardwood floors, updated appliances, fenced yard)"
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={generateMutation.isPending}
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Listing...
                        </>
                      ) : (
                        "Generate Listing"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Output Section */}
            <div className="space-y-6">
              {generatedListing && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Generated Listing</CardTitle>
                      <CardDescription>AI-powered and optimized for engagement</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedListing);
                        toast({ description: "Listing copied to clipboard!" });
                      }}
                    >
                      Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedListing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {compliance && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <CardTitle>Fair Housing Compliance</CardTitle>
                      <Badge variant={compliance.isCompliant ? "default" : "destructive"}>
                        {compliance.isCompliant ? "Compliant" : "Needs Review"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!compliance.isCompliant && compliance.violations.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Compliance Issues Found</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4 mt-2 space-y-1">
                            {compliance.violations.map((violation, i) => (
                              <li key={i} className="text-sm">{violation}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {compliance.suggestions.length > 0 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Suggestions for Improvement</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4 mt-2 space-y-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}