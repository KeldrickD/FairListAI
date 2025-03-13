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

  const isPayPerUse = currentTier === "PAY_PER_USE";
  const price = isPayPerUse ? 0 : PRICES[selectedTier];
  const payPerUsePrice = selectedService ? PAY_PER_USE_PRICES[selectedService] : 0;
  const tierLimits = TIER_LIMITS[selectedTier];

  const renderPricing = () => {
    if (isPayPerUse && selectedService) {
      return (
        <div>
          <h2>Pay Per Use Pricing</h2>
          <p>Price: ${payPerUsePrice / 100}</p>
        </div>
      );
    }

    return (
      <div>
        <h2>Subscription Pricing</h2>
        <p>Price: ${price / 100}/month</p>
        <p>Listings included: {tierLimits.listings}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Premium Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(PRICES).map(([tier, price]) => (
          <button
            key={tier}
            onClick={() => handleTierChange(tier as PricingTier)}
            className={`p-4 border rounded ${selectedTier === tier ? 'border-blue-500' : 'border-gray-200'}`}
          >
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
            {tier !== 'pay_per_use' && <span> - ${price / 100}/month</span>}
          </button>
        ))}
      </div>

      {isPayPerUse && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Select Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(PAY_PER_USE_PRICES).map(([service, price]) => (
              <button
                key={service}
                onClick={() => handleServiceSelect(service as PayPerUseService)}
                className={`p-4 border rounded ${selectedService === service ? 'border-blue-500' : 'border-gray-200'}`}
              >
                {service.replace(/_/g, ' ')} - ${price / 100}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {renderPricing()}
      </div>
    </div>
  );
} 