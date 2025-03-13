import React, { useState } from 'react';

type SubscriptionTier = "FREE" | "BASIC" | "PAY_PER_USE" | "PRO" | "ENTERPRISE";
type PricingTier = "basic" | "pro" | "enterprise" | "pay_per_use";
type PayPerUseService = keyof typeof PAY_PER_USE_PRICES;

const PRICES = {
  basic: 2900,
  pro: 9900,
  enterprise: 49900,
  pay_per_use: 0
} as const;

const PAY_PER_USE_PRICES = {
  SEO_OPTIMIZATION: 1000,
  SOCIAL_MEDIA: 1500,
  VIDEO_SCRIPT: 2500,
  SINGLE_LISTING: 500,
  BULK_LISTING_20: 5000
} as const;

const TIER_LIMITS = {
  free: { listings: 3 },
  basic: { listings: 10 },
  pro: { listings: 50 },
  enterprise: { listings: Number.POSITIVE_INFINITY },
  pay_per_use: { listings: 0 }
} as const;

export default function Premium() {
  const [selectedTier, setSelectedTier] = useState<PricingTier>("basic");
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("FREE");
  const [selectedService, setSelectedService] = useState<PayPerUseService | null>(null);

  const convertToSubscriptionTier = (tier: PricingTier): SubscriptionTier => {
    const tierMap: Record<PricingTier, SubscriptionTier> = {
      basic: "BASIC",
      pro: "PRO",
      enterprise: "ENTERPRISE",
      pay_per_use: "PAY_PER_USE"
    };
    return tierMap[tier];
  };

  const handleTierChange = (newTier: PricingTier) => {
    setSelectedTier(newTier);
    setCurrentTier(convertToSubscriptionTier(newTier));
  };

  const handleServiceSelect = (service: PayPerUseService) => {
    setSelectedService(service);
  };

  const price = PRICES[selectedTier];
  const payPerUsePrice = selectedService ? PAY_PER_USE_PRICES[selectedService] : 0;
  const tierLimits = TIER_LIMITS[selectedTier];

  return (
    <div>
      {/* Your existing JSX */}
    </div>
  );
} 