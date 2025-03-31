import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export interface Subscription {
  plan: string;
  billingCycle: string;
  addons: string[];
  startDate: string;
  status: string;
}

export interface Feature {
  name: string;
  included: boolean;
}

export function getPlanFeatures(planName: string): Record<string, Feature> {
  const basicFeatures = {
    "AI Property Descriptions": { name: "AI Property Descriptions", included: true },
    "Fair Housing Compliance Check": { name: "Fair Housing Compliance Check", included: true },
    "10 Listings per Month": { name: "10 Listings per Month", included: true },
    "Basic Analytics": { name: "Basic Analytics", included: true },
    "Email Support": { name: "Email Support", included: true },
    "Advanced SEO Optimization": { name: "Advanced SEO Optimization", included: false },
    "Property Highlight Suggestions": { name: "Property Highlight Suggestions", included: false },
    "50 Listings per Month": { name: "50 Listings per Month", included: false },
    "Priority Support": { name: "Priority Support", included: false },
    "Unlimited Listings": { name: "Unlimited Listings", included: false },
    "White-label Exports": { name: "White-label Exports", included: false },
    "Dedicated Account Manager": { name: "Dedicated Account Manager", included: false },
    "Market Analysis": { name: "Market Analysis", included: false },
    "AI Copywriting Assistant": { name: "AI Copywriting Assistant", included: false }
  };

  const proFeatures = {
    ...basicFeatures,
    "Advanced SEO Optimization": { name: "Advanced SEO Optimization", included: true },
    "Property Highlight Suggestions": { name: "Property Highlight Suggestions", included: true },
    "50 Listings per Month": { name: "50 Listings per Month", included: true },
    "Priority Support": { name: "Priority Support", included: true }
  };

  const businessFeatures = {
    ...proFeatures,
    "Unlimited Listings": { name: "Unlimited Listings", included: true },
    "White-label Exports": { name: "White-label Exports", included: true },
    "Dedicated Account Manager": { name: "Dedicated Account Manager", included: true }
  };

  switch (planName) {
    case "Basic":
      return basicFeatures;
    case "Pro":
      return proFeatures;
    case "Business":
      return businessFeatures;
    default:
      return basicFeatures;
  }
}

export function getAddonFeatures(addons: string[]): Record<string, Feature> {
  const addonFeatures: Record<string, Feature> = {};
  
  if (addons.includes("Market Analysis Add-on")) {
    addonFeatures["Market Analysis"] = { name: "Market Analysis", included: true };
  }
  
  if (addons.includes("AI Copywriting Assistant Add-on")) {
    addonFeatures["AI Copywriting Assistant"] = { name: "AI Copywriting Assistant", included: true };
  }
  
  return addonFeatures;
}

export function getUserFeatures(subscription: Subscription | null): Record<string, Feature> {
  if (!subscription) {
    return {
      "AI Property Descriptions": { name: "AI Property Descriptions", included: true },
      "Fair Housing Compliance Check": { name: "Fair Housing Compliance Check", included: true },
      "3 Listings (Trial)": { name: "3 Listings (Trial)", included: true }
    };
  }
  
  const planFeatures = getPlanFeatures(subscription.plan);
  
  const addonFeatures = getAddonFeatures(subscription.addons || []);
  
  return {
    ...planFeatures,
    ...addonFeatures
  };
}

export function hasFeature(subscription: Subscription | null, featureName: string): boolean {
  const features = getUserFeatures(subscription);
  return features[featureName]?.included || false;
} 