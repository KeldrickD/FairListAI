import React, { useState } from 'react';

type SubscriptionTier = "FREE" | "BASIC" | "PAY_PER_USE" | "PRO" | "ENTERPRISE";
type PricingTier = "BASIC" | "PRO" | "ENTERPRISE" | "PAY_PER_USE";
type LowercasePricingTier = Lowercase<PricingTier>;

const PRICES: Record<LowercasePricingTier, number> = {
  basic: 2900,
  pro: 9900,
  enterprise: 49900,
  pay_per_use: 0
} as const;

type PayPerUseService = keyof typeof PAY_PER_USE_PRICES;

const PAY_PER_USE_PRICES = {
  SEO_OPTIMIZATION: 1000,
  SOCIAL_MEDIA: 1500,
  VIDEO_SCRIPT: 2500,
  SINGLE_LISTING: 500,
  BULK_LISTING_20: 5000
} as const;

const TIER_LIMITS: Record<LowercasePricingTier | 'free', { listings: number }> = {
  free: { listings: 3 },
  basic: { listings: 10 },
  pro: { listings: 50 },
  enterprise: { listings: Number.POSITIVE_INFINITY },
  pay_per_use: { listings: 0 }
} as const;

export default function Premium() {
  const [selectedTier, setSelectedTier] = useState<LowercasePricingTier>("basic");
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("FREE");
  const [selectedService, setSelectedService] = useState<PayPerUseService | null>(null);

  const convertToSubscriptionTier = (tier: LowercasePricingTier): SubscriptionTier => {
    return tier.toUpperCase() as SubscriptionTier;
  };

  const handleTierChange = (newTier: LowercasePricingTier) => {
    setSelectedTier(newTier);
    setCurrentTier(convertToSubscriptionTier(newTier));
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