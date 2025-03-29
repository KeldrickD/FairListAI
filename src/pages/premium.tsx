import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, BarChart, MessageSquare } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}

export default function Premium() {
  const pricingTiers: PricingTier[] = [
    {
      name: 'Basic',
      price: '$29',
      description: 'Perfect for independent agents',
      features: [
        '20 listings per month',
        'Fair Housing compliance filter',
        'Basic SEO optimization',
        'Social media captions (Instagram, Facebook)',
        'Headline generator',
        'Email templates',
        'PDF downloads',
      ],
      buttonText: 'Get Started',
      buttonLink: '/checkout?plan=basic',
    },
    {
      name: 'Pro',
      price: '$59',
      description: 'For growing real estate professionals',
      features: [
        '50 listings per month',
        'Fair Housing compliance filter',
        'Advanced SEO optimization',
        'Social media captions for all platforms',
        'Custom headline variations',
        'Email templates and campaigns',
        'Neighborhood highlights',
        'PDF and Word downloads',
        'Priority support',
      ],
      buttonText: 'Subscribe Now',
      buttonLink: '/checkout?plan=pro',
      highlighted: true,
    },
    {
      name: 'Business',
      price: '$99',
      description: 'For teams and high-volume agents',
      features: [
        'Unlimited listings',
        'Fair Housing compliance filter',
        'Premium SEO optimization',
        'Social media content calendar',
        'Custom headline variations',
        'Email templates and campaigns',
        'Neighborhood highlights with walkability scores',
        'All export formats',
        'Priority support',
        'Listing analytics dashboard',
        'Team member accounts (3)',
      ],
      buttonText: 'Go Business',
      buttonLink: '/checkout?plan=business',
    },
  ];

  const addOns = [
    {
      name: 'Market Analysis',
      description: 'Get detailed market insights and pricing suggestions for your listings',
      price: '$19/month',
      features: [
        'Comparative market analysis',
        'Local market trends',
        'Pricing suggestions',
        'Neighborhood statistics',
        'School ratings integration',
      ],
    },
    {
      name: 'AI Copywriting Assistant',
      description: 'Expand your marketing toolkit with additional AI copywriting features',
      price: '$15/month',
      features: [
        'Property story narratives',
        'Buyer persona targeting',
        'First-person property walkthroughs',
        'Seasonal listing updates',
        'Custom tone and voice adjustments',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Premium Plans</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your personal listing assistant. Upload a listing → get automatic property descriptions, social captions, ad copy, email blasts, and neighborhood insights.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {pricingTiers.map((tier) => (
          <div 
            key={tier.name}
            className={`rounded-lg overflow-hidden ${
              tier.highlighted 
                ? 'ring-2 ring-[#2F5DE3] shadow-lg relative' 
                : 'border border-gray-200 shadow-sm'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute top-0 right-0 bg-[#2F5DE3] text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Most Popular
              </div>
            )}
            <div className={`p-6 ${tier.highlighted ? 'bg-[#C7BAF5] bg-opacity-20' : 'bg-white'}`}>
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                <span className="ml-1 text-gray-500">/month</span>
              </p>
              <p className="mt-2 text-gray-600">{tier.description}</p>
            </div>
            <div className="px-6 pt-6 pb-8 bg-white">
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-[#43D8B6] shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={tier.buttonLink}
                  className={`block w-full text-center py-3 px-4 rounded-md font-medium ${
                    tier.highlighted
                      ? 'bg-[#2F5DE3] text-white hover:bg-indigo-700'
                      : 'bg-white text-[#2F5DE3] border border-[#2F5DE3] hover:bg-indigo-50'
                  }`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Power Up Your Listings with Add-Ons</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {addOns.map((addon) => (
            <div key={addon.name} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6 bg-white border-b border-gray-200">
                <div className="flex items-center mb-2">
                  {addon.name === 'Market Analysis' ? (
                    <BarChart className="h-5 w-5 text-[#43D8B6] mr-2" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-[#43D8B6] mr-2" />
                  )}
                  <h3 className="text-xl font-bold">{addon.name}</h3>
                </div>
                <p className="text-gray-600">{addon.description}</p>
                <p className="mt-4 font-bold text-xl">{addon.price}</p>
              </div>
              <div className="px-6 py-4 bg-white">
                <ul className="space-y-3">
                  {addon.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Sparkles className="h-4 w-4 text-[#2F5DE3] shrink-0 mr-2 mt-1" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href={`/checkout?addon=${addon.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block w-full text-center py-2 px-4 rounded-md font-medium bg-white text-[#2F5DE3] border border-[#2F5DE3] hover:bg-indigo-50"
                  >
                    Add to Subscription
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Do you offer a free trial?</h3>
            <p className="text-gray-600">
              Yes! You can generate up to 2 listings for free to test our service. No credit card required to start.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-600">
              Absolutely. You can change your plan at any time, and we'll prorate the cost based on your usage.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Is there a fair housing compliance guarantee?</h3>
            <p className="text-gray-600">
              While our AI is extensively trained to comply with Fair Housing laws, we recommend always reviewing generated content. We provide compliance warnings but ultimate responsibility rests with the agent posting the listing.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Do you offer discounts for annual subscriptions?</h3>
            <p className="text-gray-600">
              Yes! Save 20% when you pay annually for any of our subscription plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 