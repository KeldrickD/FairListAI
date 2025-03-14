import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, ArrowRight, CheckCircle, AlertCircle, PieChart, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SEOMetric {
  name: string;
  score: number;
  maxScore: number;
  suggestions: string[];
}

export default function SEOAnalyzerPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");
  const [listingText, setListingText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [optimizedListing, setOptimizedListing] = useState("");
  const [seoResults, setSeoResults] = useState<{
    overallScore: number;
    metrics: SEOMetric[];
  } | null>(null);

  const handleAnalyzeSEO = async () => {
    if (!listingText) {
      toast({
        title: "Missing content",
        description: "Please enter your listing content to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // Mock SEO analysis results
        const mockMetrics: SEOMetric[] = [
          {
            name: "Keyword Usage",
            score: 8,
            maxScore: 10,
            suggestions: [
              "Consider using your main keywords in the first paragraph",
              "Try to include keywords in headings when natural"
            ]
          },
          {
            name: "Content Length",
            score: 7,
            maxScore: 10,
            suggestions: [
              "Your listing is 320 words. Try to reach at least 400 words for better SEO",
              "Expand on property features and neighborhood information"
            ]
          },
          {
            name: "Readability",
            score: 9,
            maxScore: 10,
            suggestions: [
              "Good readability score! Keep paragraphs short and concise"
            ]
          },
          {
            name: "Descriptive Language",
            score: 7,
            maxScore: 10,
            suggestions: [
              "Add more sensory descriptions (what can buyers see, feel, experience)",
              "Use more specific adjectives instead of generic ones like 'nice' or 'good'"
            ]
          },
          {
            name: "Location References",
            score: 6,
            maxScore: 10,
            suggestions: [
              "Include more specific neighborhood information",
              "Mention nearby landmarks, schools, or amenities"
            ]
          }
        ];

        // Calculate overall score (weighted average)
        const totalScore = mockMetrics.reduce((acc, metric) => acc + metric.score, 0);
        const maxPossibleScore = mockMetrics.reduce((acc, metric) => acc + metric.maxScore, 0);
        const overallScore = Math.round((totalScore / maxPossibleScore) * 100);

        setSeoResults({
          overallScore,
          metrics: mockMetrics
        });

        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze SEO. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeListing = async () => {
    if (!listingText) {
      toast({
        title: "Missing content",
        description: "Please enter your listing content to optimize.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setActiveTab("optimize");

    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // Create enhanced version based on original text
        const keywordsList = keywords.split(',').map(k => k.trim()).filter(k => k);
        
        // Simple optimization simulation - add keywords and enhance text
        let enhancedText = listingText;
        
        // Add location specifics if not already present
        if (!enhancedText.includes("neighborhood")) {
          enhancedText += "\n\nThis property is located in a highly desirable neighborhood with excellent schools nearby and convenient access to shopping and dining options.";
        }
        
        // Add features emphasis if keywords contain related terms
        if (keywordsList.some(k => k.includes("modern") || k.includes("updat"))) {
          enhancedText += "\n\nThe home features modern updates throughout, ensuring comfort and contemporary styling.";
        }
        
        // Add value proposition
        enhancedText += "\n\nThis property represents an excellent investment opportunity in today's market.";

        setOptimizedListing(enhancedText);
        setIsAnalyzing(false);
      }, 2500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize listing. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SEO Analyzer</h1>
            <p className="text-muted-foreground">
              Optimize your property listings for better search engine visibility
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyze Your Listing</CardTitle>
                    <CardDescription>
                      Paste your listing content to receive SEO recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="listing-content">Listing Content</Label>
                      <Textarea
                        id="listing-content"
                        rows={12}
                        placeholder="Paste your property listing text here..."
                        value={listingText}
                        onChange={(e) => setListingText(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target-keywords">Target Keywords (optional)</Label>
                      <Input
                        id="target-keywords"
                        placeholder="e.g., modern home, downtown, renovation, family-friendly"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate keywords with commas
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setListingText("")}>
                      Clear
                    </Button>
                    <Button onClick={handleAnalyzeSEO} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Analyze SEO
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>SEO Tips</CardTitle>
                    <CardDescription>
                      Best practices for property listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Use location-specific keywords like neighborhood names</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Aim for 300-500 words for optimal content length</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Include specific property features and amenities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Mention nearby schools, parks, and shopping areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Use descriptive headings and paragraphs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Include price range and value proposition</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {seoResults && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle>SEO Analysis Results</CardTitle>
                        <CardDescription>
                          Review your listing's SEO performance
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                        <PieChart className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Overall Score</p>
                          <p className={`text-2xl font-bold ${getScoreColor(seoResults.overallScore)}`}>
                            {seoResults.overallScore}/100
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {seoResults.metrics.map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{metric.name}</p>
                            <p className={`font-medium ${getScoreColor(metric.score * 10)}`}>
                              {metric.score}/{metric.maxScore}
                            </p>
                          </div>
                          <Progress 
                            value={(metric.score / metric.maxScore) * 100} 
                            className="h-2"
                            indicatorClassName={getProgressColor(metric.score * 10)}
                          />
                          <ul className="mt-2 space-y-1">
                            {metric.suggestions.map((suggestion, sidx) => (
                              <li key={sidx} className="text-sm flex items-start gap-2">
                                {metric.score < 8 ? (
                                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                )}
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleOptimizeListing} className="ml-auto">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Optimize Listing
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="optimize" className="pt-4">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Optimizing your listing...</h3>
                <p className="text-muted-foreground">
                  Our AI is enhancing your content for better search visibility
                </p>
              </div>
            ) : optimizedListing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Listing</CardTitle>
                  <CardDescription>
                    Your listing has been optimized for better search visibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Enhanced Content</Label>
                    <div className="mt-2 p-4 border rounded-md bg-muted/30">
                      <p className="whitespace-pre-line">{optimizedListing}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                    <h3 className="font-medium text-blue-700 flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5" />
                      Optimization Summary
                    </h3>
                    <p className="text-sm text-blue-700 mb-2">
                      We've enhanced your listing by:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                      <li>Adding more descriptive language</li>
                      <li>Highlighting neighborhood information</li>
                      <li>Improving keyword density and placement</li>
                      <li>Enhancing structure and readability</li>
                      <li>Adding a value proposition</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("analyze")}>
                    Back to Analysis
                  </Button>
                  <Button onClick={() => handleCopy(optimizedListing)}>
                    Copy Optimized Listing
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No optimized content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Analyze your listing first to generate optimization suggestions
                </p>
                <Button onClick={() => setActiveTab("analyze")}>
                  Go to Analysis
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 