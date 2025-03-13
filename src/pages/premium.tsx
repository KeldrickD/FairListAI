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
      name: 'Free',
      price: '$0',
      description: 'Basic features for individual agents',
      features: [
        '5 listings per month',
        'Basic compliance checking',
        'Standard SEO optimization',
        'Social media captions',
        'PDF downloads',
      ],
      buttonText: 'Get Started',
      buttonLink: '/register',
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'Advanced features for serious agents',
      features: [
        'Unlimited listings',
        'Advanced compliance checking',
        'Enhanced SEO optimization',
        'Social media captions with analytics',
        'PDF and Word downloads',
        'Email marketing templates',
        'Priority support',
      ],
      buttonText: 'Upgrade to Pro',
      buttonLink: '/checkout?plan=pro',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$99',
      description: 'For real estate teams and brokerages',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Team dashboard',
        'Listing approval workflow',
        'Brand voice customization',
        'White-label PDFs',
        'API access',
        'Dedicated account manager',
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Premium Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upgrade your account to access advanced features and create even better property listings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                {tier.name !== 'Free' && <span className="ml-1 text-gray-500">/month</span>}
              </p>
              <p className="mt-2 text-gray-600">{tier.description}</p>
            </div>
            <div className="px-6 pt-6 pb-8 bg-white">
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
            <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade at any time?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes to your subscription will take effect at the start of your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">How does the team plan work?</h3>
            <p className="text-gray-600">
              The team plan allows up to 10 team members to access the platform under a single account. The team admin can manage permissions, view all listings, and track team performance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Do you offer a free trial of premium features?</h3>
            <p className="text-gray-600">
              Yes, we offer a 14-day free trial of our Pro plan. No credit card required. You can try all the premium features and decide if it's right for you.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 