import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_PRICES, SUBSCRIPTION_LIMITS, ADD_ON_PRICES } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required environment variable: VITE_STRIPE_PUBLIC_KEY");
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PricingTier = ({
  name,
  price,
  features,
  isPopular,
  onSelect,
  isSelected,
}: {
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
  isSelected: boolean;
}) => (
  <Card className={`relative ${isPopular ? 'border-primary' : ''}`}>
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
        <span className="text-sm text-muted-foreground">/month</span>
      </CardTitle>
      <CardDescription className="font-semibold text-lg">{name}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className="w-full"
        variant={isSelected ? "secondary" : (isPopular ? "default" : "outline")}
        onClick={onSelect}
      >
        {isSelected ? "Selected" : "Select Plan"}
      </Button>
    </CardContent>
  </Card>
);

function CheckoutForm({ selectedTier, selectedAddOns, total }: {
  selectedTier: keyof typeof SUBSCRIPTION_PRICES;
  selectedAddOns: string[];
  total: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "An unexpected error occurred.",
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
            <span>{selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Plan</span>
            <span>${(SUBSCRIPTION_PRICES[selectedTier] / 100).toFixed(2)}</span>
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
              <span>${(total / 100).toFixed(2)}/month</span>
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
          `Pay $${(total / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
}

export default function PremiumPage() {
  const [selectedTier, setSelectedTier] = useState<keyof typeof SUBSCRIPTION_PRICES>(SUBSCRIPTION_TIERS.BASIC);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const total = SUBSCRIPTION_PRICES[selectedTier] +
    selectedAddOns.reduce((sum, addon) => sum + (ADD_ON_PRICES[addon] || 0), 0);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          tier: selectedTier,
          addOns: selectedAddOns
        });
        const data = await response.json();
        if (response.ok) {
          setClientSecret(data.clientSecret);
          setError(null);
        } else {
          setError(data.message || "Failed to initialize payment");
        }
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        setError("Failed to initialize payment. Please try again.");
      }
    };

    if (!user?.isPremium) {
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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <PricingTier
            name="Basic"
            price={SUBSCRIPTION_PRICES.basic}
            features={[
              "10 AI-generated listings per month",
              "Fair Housing compliant content",
              "Basic property descriptions",
              "Email support"
            ]}
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.BASIC)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.BASIC}
          />
          <PricingTier
            name="Pro"
            price={SUBSCRIPTION_PRICES.pro}
            features={[
              "50 AI-generated listings per month",
              "SEO optimization included",
              "Social media content generation",
              "Priority support",
              "MLS integration"
            ]}
            isPopular
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.PRO)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.PRO}
          />
          <PricingTier
            name="Enterprise"
            price={SUBSCRIPTION_PRICES.enterprise}
            features={[
              "Unlimited AI-generated listings",
              "API access for automation",
              "Custom integrations",
              "Dedicated account manager",
              "White-label options"
            ]}
            onSelect={() => setSelectedTier(SUBSCRIPTION_TIERS.ENTERPRISE)}
            isSelected={selectedTier === SUBSCRIPTION_TIERS.ENTERPRISE}
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