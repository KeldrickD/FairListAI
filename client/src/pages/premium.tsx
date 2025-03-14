import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Star, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_PRICES, SUBSCRIPTION_LIMITS, ADD_ON_PRICES } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Check that the Stripe key is available
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required environment variable: VITE_STRIPE_PUBLIC_KEY");
}

// Initialize Stripe with the test public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PricingTier = ({
  name,
  price,
  features,
  isPopular,
  onSelect,
  isSelected,
  selectedTier,
}: {
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
  isSelected: boolean;
  selectedTier: keyof typeof SUBSCRIPTION_TIERS;
}) => {
  const showPrimaryStyle = isSelected || (isPopular && selectedTier === SUBSCRIPTION_TIERS.PRO);
  const isPricePerListing = name === "Pay-Per-Use";

  return (
    <Card className={cn("relative", {
      "border-primary": showPrimaryStyle,
      "border-muted": !showPrimaryStyle
    })}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${(price / 100).toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">
            {isPricePerListing ? "/listing" : "/mo"}
          </span>
        </CardTitle>
        <CardDescription className="font-semibold text-lg">{name}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className={cn("h-5 w-5 flex-shrink-0 mt-0.5", {
                "text-primary": showPrimaryStyle,
                "text-muted-foreground": !showPrimaryStyle
              })} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={showPrimaryStyle ? "default" : "outline"}
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Select Plan"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Update the CheckoutForm to include better error handling
function CheckoutForm({ selectedTier, selectedAddOns, total }: {
  selectedTier: keyof typeof SUBSCRIPTION_TIERS;
  selectedAddOns: string[];
  total: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Stripe has not been properly initialized.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the base URL for the application
      const baseUrl = window.location.origin;
      const returnUrl = new URL('/dashboard', baseUrl).toString();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              address: {
                country: 'US', // Default to US for test mode
              }
            }
          }
        },
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: error.message || "An unexpected error occurred during payment.",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during payment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-muted/30 p-4 mb-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE ? "Pay-Per-Use Plan" : `${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Plan`}</span>
            <span>${(selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE ? 5 : total / 100).toFixed(2)}{selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE ? "/listing" : "/month"}</span>
          </div>
          {selectedAddOns.map((addon) => (
            <div key={addon} className="flex justify-between text-sm">
              <span>{addon.split('_').join(' ').toLowerCase()}</span>
              <span>${(ADD_ON_PRICES[addon] / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE ? "5.00/listing" : `${(total / 100).toFixed(2)}/month`}</span>
            </div>
          </div>
        </div>
      </div>

      <PaymentElement />
      <Button
        type="submit"
        className="w-full h-12"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE ? "$5.00/listing" : `$${(total / 100).toFixed(2)}/month`}`
        )}
      </Button>
    </form>
  );
}

export default function PremiumPage() {
  // Get the plan from URL parameters
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const planFromUrl = params.get('plan');

  // Update the initial tier selection logic
  const getInitialTier = () => {
    switch (planFromUrl) {
      case 'pay_per_use':
        return SUBSCRIPTION_TIERS.PAY_PER_USE;
      case 'basic':
        return SUBSCRIPTION_TIERS.BASIC;
      case 'pro':
        return SUBSCRIPTION_TIERS.PRO;
      case 'enterprise':
        return SUBSCRIPTION_TIERS.ENTERPRISE;
      default:
        return SUBSCRIPTION_TIERS.PRO; // Default to PRO if no valid plan specified
    }
  };

  const [selectedTier, setSelectedTier] = useState<keyof typeof SUBSCRIPTION_PRICES>(getInitialTier());
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Update the total calculation
  const total = selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE
    ? 500 // Fixed amount for pay-per-use
    : (SUBSCRIPTION_PRICES[selectedTier.toLowerCase()] || 0) +
      selectedAddOns.reduce((sum, addon) =>
        sum + (ADD_ON_PRICES[addon] || 0), 0);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          tier: selectedTier,
          addOns: selectedAddOns
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "Failed to initialize payment");
          return;
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setError(null);
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        setError("Failed to initialize payment. Please try again.");
      }
    };

    if (!user?.isPremium && selectedTier) {
      initializePayment();
    }
  }, [user, selectedTier, selectedAddOns]);

  if (user?.isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Premium Member
            </CardTitle>
            <CardDescription>
              You're already enjoying all the benefits of our premium features!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Your Current Benefits:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Up to {SUBSCRIPTION_LIMITS[user.subscriptionTier].listings} AI-generated listings per month</li>
                <li>{user.seoEnabled && "SEO optimization for better visibility"}</li>
                <li>{user.socialMediaEnabled && "Social media content generation"}</li>
                <li>{user.videoScriptsEnabled && "Video script generation"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Unlock the full potential of Listing Genie
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <PricingTier
            name="Pay-Per-Use"
            price={500} // $5.00
            features={[
              "Pay as you go",
              "All standard features",
              "No monthly commitment",
              "Email support"
            ]}
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.PAY_PER_USE)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.PAY_PER_USE}
            selectedTier={selectedTier}
          />
          <PricingTier
            name="Basic"
            price={2900} // $29.00
            features={[
              "10 listings per month",
              "SEO optimization",
              "Fair Housing compliance",
              "Email support"
            ]}
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.BASIC)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.BASIC}
            selectedTier={selectedTier}
          />
          <PricingTier
            name="Pro"
            price={9900} // $99.00
            features={[
              "50 listings per month",
              "SEO optimization",
              "Social media content",
              "Priority support",
              "Custom tone & style"
            ]}
            isPopular
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.PRO)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.PRO}
            selectedTier={selectedTier}
          />
          <PricingTier
            name="Enterprise"
            price={49900} // $499.00
            features={[
              "Unlimited listings",
              "API access",
              "Team accounts",
              "Custom integrations",
              "Dedicated support"
            ]}
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.ENTERPRISE)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.ENTERPRISE}
            selectedTier={selectedTier}
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add-ons Available with Any Plan</CardTitle>
            <CardDescription>
              Enhance your listings with these powerful features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">SEO Optimization</CardTitle>
                      <CardDescription>${(ADD_ON_PRICES.SEO_OPTIMIZATION / 100).toFixed(2)} per listing</CardDescription>
                    </div>
                    <Checkbox
                      checked={selectedAddOns.includes('SEO_OPTIMIZATION')}
                      onCheckedChange={(checked) => {
                        setSelectedAddOns(prev =>
                          checked
                            ? [...prev, 'SEO_OPTIMIZATION']
                            : prev.filter(a => a !== 'SEO_OPTIMIZATION')
                        );
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Optimize your listings for search engines and MLS platforms</p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Social Media Package</CardTitle>
                      <CardDescription>${(ADD_ON_PRICES.SOCIAL_MEDIA / 100).toFixed(2)} per listing</CardDescription>
                    </div>
                    <Checkbox
                      checked={selectedAddOns.includes('SOCIAL_MEDIA')}
                      onCheckedChange={(checked) => {
                        setSelectedAddOns(prev =>
                          checked
                            ? [...prev, 'SOCIAL_MEDIA']
                            : prev.filter(a => a !== 'SOCIAL_MEDIA')
                        );
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Get engaging captions and hashtags for major platforms</p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Video Scripts</CardTitle>
                      <CardDescription>${(ADD_ON_PRICES.VIDEO_SCRIPT / 100).toFixed(2)} per listing</CardDescription>
                    </div>
                    <Checkbox
                      checked={selectedAddOns.includes('VIDEO_SCRIPT')}
                      onCheckedChange={(checked) => {
                        setSelectedAddOns(prev =>
                          checked
                            ? [...prev, 'VIDEO_SCRIPT']
                            : prev.filter(a => a !== 'VIDEO_SCRIPT')
                        );
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Professional scripts for your property videos</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Subscription</CardTitle>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0099FF',
                      colorBackground: '#ffffff',
                      colorText: '#30313d',
                    },
                  },
                  mode: 'payment',
                  currency: 'usd',
                  paymentMethodCreation: 'manual'
                }}
              >
                <CheckoutForm
                  selectedTier={selectedTier}
                  selectedAddOns={selectedAddOns}
                  total={total}
                />
              </Elements>
            ) : error ? null : (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}