import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

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
      name: 'Pay-Per-Use',
      price: '$5',
      description: 'Perfect for occasional users',
      features: [
        'Single listing generation',
        'Fair Housing compliance filter',
        'Basic SEO optimization',
        'Social media caption for one platform',
        'Valid for 30 days',
        'PDF download',
      ],
      buttonText: 'Buy One Listing',
      buttonLink: '/checkout?plan=single',
    },
    {
      name: 'Basic Plan',
      price: '$29',
      description: 'Best value for individual agents',
      features: [
        '10 listings per month',
        'Fair Housing compliance filter',
        'Advanced SEO optimization',
        'Social media captions',
        'Hashtag suggestions',
        'PDF and Word downloads',
        'Email support',
      ],
      buttonText: 'Subscribe Now',
      buttonLink: '/checkout?plan=basic',
      highlighted: true,
    },
    {
      name: 'Pro Plan',
      price: '$99',
      description: 'For serious real estate professionals',
      features: [
        '50 listings per month',
        'Fair Housing compliance filter',
        'Advanced SEO optimization',
        'Social media captions for all platforms',
        'Custom hashtag recommendations',
        'All export formats',
        'Priority support',
        'Listing analytics',
      ],
      buttonText: 'Go Pro',
      buttonLink: '/checkout?plan=pro',
    },
    {
      name: 'Enterprise Plan',
      price: '$499',
      description: 'For brokerages and real estate teams',
      features: [
        'Unlimited listings',
        'Fair Housing compliance filter',
        'Advanced SEO optimization',
        'Social media captions for all platforms',
        'Custom hashtag recommendations',
        'All export formats',
        'API integration for MLS platforms',
        'Bulk listing generation',
        'Dedicated account manager',
        'Custom branding options',
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact?plan=enterprise',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Premium Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Power up your real estate listings with AI-generated, Fair Housing compliant, and SEO-optimized descriptions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier) => (
          <div 
            key={tier.name}
            className={`rounded-lg overflow-hidden ${
              tier.highlighted 
                ? 'ring-2 ring-indigo-600 shadow-lg' 
                : 'border border-gray-200 shadow-sm'
            }`}
          >
            <div className={`p-6 ${tier.highlighted ? 'bg-indigo-50' : 'bg-white'}`}>
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                {tier.name === 'Pay-Per-Use' ? (
                  <span className="ml-1 text-gray-500">/listing</span>
                ) : (
                  <span className="ml-1 text-gray-500">/month</span>
                )}
              </p>
              <p className="mt-2 text-gray-600">{tier.description}</p>
            </div>
            <div className="px-6 pt-6 pb-8 bg-white h-full">
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={tier.buttonLink}
                  className={`block w-full text-center py-3 px-4 rounded-md font-medium ${
                    tier.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">What happens when I reach my monthly listing limit?</h3>
            <p className="text-gray-600">
              You can upgrade your plan at any time or purchase additional listings at $5 each. Your existing listings will remain accessible even if you reach your limit.
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
              Yes! Save 20% when you pay annually for any of our subscription plans. Contact our sales team for custom enterprise pricing.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">How does the API integration work?</h3>
            <p className="text-gray-600">
              Enterprise subscribers receive API access to integrate with MLS platforms, CRMs, and other real estate software. Our documentation provides implementation guides and our team offers integration support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 