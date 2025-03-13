import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, AlertCircle, InfoIcon, Lightbulb, Edit, Shield, AlertTriangle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ComplianceIssue {
  type: string;
  severity: "high" | "medium" | "low";
  text: string;
  suggestion: string;
}

interface ComplianceResult {
  score: number;
  compliant: boolean;
  issues: ComplianceIssue[];
  improvedText?: string;
}

export default function ComplianceCheckerPage() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [activeTab, setActiveTab] = useState("check");
  const [listingText, setListingText] = useState("");
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [showImproved, setShowImproved] = useState(false);

  const handleCheckCompliance = async () => {
    if (!listingText) {
      toast({
        title: "Missing content",
        description: "Please enter your listing content to check for compliance.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      // Simulate an API call with setTimeout
      setTimeout(() => {
        // Sample response with mock data
        const mockResult: ComplianceResult = {
          score: 85,
          compliant: true,
          issues: [
            {
              type: "Discriminatory language",
              severity: "medium",
              text: "perfect for families",
              suggestion: "Consider using 'spacious layout' instead of 'perfect for families' to avoid familial status discrimination.",
            },
            {
              type: "Religious reference",
              severity: "low",
              text: "close to churches",
              suggestion: "Consider mentioning 'close to places of worship' or 'close to community centers' instead.",
            },
            {
              type: "Potentially exclusive language",
              severity: "low",
              text: "exclusive neighborhood",
              suggestion: "Consider using 'desirable location' instead of 'exclusive neighborhood' to avoid implications of exclusivity.",
            },
          ],
          improvedText: listingText
            .replace("perfect for families", "with a spacious layout")
            .replace("close to churches", "close to places of worship")
            .replace("exclusive neighborhood", "desirable location"),
        };

        setResult(mockResult);
        setIsChecking(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check compliance. Please try again.",
        variant: "destructive",
      });
      setIsChecking(false);
    }
  };

  const handleAutoCorrect = () => {
    if (!result || !result.improvedText) return;
    
    setListingText(result.improvedText);
    setShowImproved(false);
    
    // Perform a new check with the improved text
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      const newResult: ComplianceResult = {
        score: 100,
        compliant: true,
        issues: [],
      };
      
      setResult(newResult);
      setIsChecking(false);
      
      toast({
        title: "Auto-correction applied",
        description: "Your listing has been updated with compliant language.",
      });
    }, 1500);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-yellow-500";
      default:
        return "text-slate-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fair Housing Compliance Checker</h1>
            <p className="text-muted-foreground">
              Ensure your property listings comply with Fair Housing regulations
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="check">Check Compliance</TabsTrigger>
            <TabsTrigger value="fixed">Fixed Content</TabsTrigger>
          </TabsList>

          <TabsContent value="check" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Check Your Listing</CardTitle>
                    <CardDescription>
                      Paste your listing content below to check for Fair Housing compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter your listing text here..."
                      className="min-h-[200px]"
                      value={listingText}
                      onChange={(e) => setListingText(e.target.value)}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setListingText("")}>
                      Clear
                    </Button>
                    <Button onClick={handleCheckCompliance} disabled={isChecking}>
                      {isChecking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Check Compliance
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Fair Housing Tips</CardTitle>
                    <CardDescription>
                      Key guidelines to ensure compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Avoid references to:</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Race or ethnicity</li>
                        <li>Religion</li>
                        <li>Gender or sex</li>
                        <li>Familial status</li>
                        <li>Disability</li>
                        <li>National origin</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Focus on:</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Property features</li>
                        <li>Location attributes</li>
                        <li>Amenities and upgrades</li>
                        <li>Factual information</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {result && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Compliance Results</CardTitle>
                        <CardDescription>
                          Analysis of your listing content
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                        <Shield className={`h-5 w-5 ${result.compliant ? "text-green-500" : "text-red-500"}`} />
                        <div>
                          <p className="text-sm font-medium">Compliance Score</p>
                          <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                            {result.score}/100
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Overall Compliance</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.compliant ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {result.compliant ? "Compliant" : "Non-Compliant"}
                        </span>
                      </div>
                      <Progress
                        value={result.score}
                        className="h-2"
                        indicatorClassName={getProgressColor(result.score)}
                      />
                    </div>

                    {result.issues.length > 0 ? (
                      <div>
                        <h3 className="font-medium mb-3">Potential Issues ({result.issues.length})</h3>
                        <div className="space-y-4">
                          {result.issues.map((issue, index) => (
                            <div key={index} className="border rounded-md p-4">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${getSeverityColor(issue.severity)}`}>
                                  <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{issue.type}</p>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(issue.severity)} bg-opacity-10`}>
                                      {issue.severity.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">Found:</span> "{issue.text}"
                                  </p>
                                  <p className="text-sm mt-2 text-muted-foreground">
                                    <span className="font-medium text-foreground">Suggestion:</span> {issue.suggestion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {result.improvedText && (
                          <div className="mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setShowImproved(!showImproved)}
                              className="mb-4"
                            >
                              {showImproved ? "Hide" : "Show"} Suggested Improvements
                            </Button>

                            {showImproved && (
                              <div className="border rounded-md p-4 bg-muted/50">
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-medium">Improved Listing</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyText(result.improvedText || "")}
                                  >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                  </Button>
                                </div>
                                <p className="text-sm whitespace-pre-line">{result.improvedText}</p>
                                
                                <Button
                                  className="mt-4"
                                  onClick={handleAutoCorrect}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Apply Suggested Changes
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-green-50 text-green-800 p-4 rounded-md">
                        <CheckCircle className="h-5 w-5" />
                        <p>No compliance issues found. Your listing appears to be Fair Housing compliant.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fixed" className="pt-4">
            {isCorrecting ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Fixing compliance issues...</h3>
                <p className="text-muted-foreground">
                  Our AI is updating your content to comply with Fair Housing regulations
                </p>
              </div>
            ) : result?.improvedText ? (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Fixed Listing Content</CardTitle>
                      <CardDescription>
                        Your listing has been corrected to comply with Fair Housing regulations
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      100% Compliant
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/30">
                    <p className="whitespace-pre-line">{result.improvedText}</p>
                  </div>

                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Fair Housing Compliant</AlertTitle>
                    <AlertDescription>
                      This revised text has been updated to comply with Fair Housing regulations.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                    <h3 className="font-medium text-blue-700 flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5" />
                      Changes Made
                    </h3>
                    <p className="text-sm text-blue-700 mb-2">
                      We've updated your listing by:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                      <li>Removing language that could be interpreted as exclusionary</li>
                      <li>Replacing potentially biased terms with neutral alternatives</li>
                      <li>Focusing on property features rather than potential occupants</li>
                      <li>Using inclusive language throughout the listing</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleCopyText(result.improvedText || "")}>
                    Copy Fixed Listing
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No fixed content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Check your listing for compliance issues first, then use the auto-fix feature
                </p>
                <Button onClick={() => setActiveTab("check")}>
                  Go to Compliance Check
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 