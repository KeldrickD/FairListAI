import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, Sparkles, BarChart, MessageSquare, Star, ChevronRight, CreditCard, Calendar, Lock, XCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { requireAuth, getUserFromRequest } from '@/lib/auth';
import { useNotification } from '@/contexts/NotificationContext';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
  annualPrice?: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

interface CheckoutFormData {
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  couponCode: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function Premium({ user }) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutFormData>({
    name: user?.name || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    couponCode: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const { showNotification } = useNotification();
  
  const handleCheckoutOpen = (plan: string) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
    
    // Scroll to checkout form
    setTimeout(() => {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      // Format as xxxx xxxx xxxx xxxx
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expiryDate') {
      // Format as MM/YY
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    } else if (name === 'cvv') {
      // Only allow up to 4 digits
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCheckoutData({
      ...checkoutData,
      [name]: formattedValue,
    });
  };
  
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would integrate with a payment processor
    // For now, we'll simulate a successful purchase

    // Show loading state
    showNotification({
      type: 'info',
      title: 'Processing Payment',
      message: 'Please wait while we process your payment...',
      duration: 3000
    });

    // Simulate API call with timeout
    setTimeout(() => {
      // Close checkout form
      setIsCheckoutOpen(false);
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'Subscription Activated!',
        message: `Your ${selectedPlan} plan has been successfully activated.`,
        duration: 5000
      });

      // Reset form
      setCheckoutData({
        name: user?.name || '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        couponCode: '',
        billingAddress: '',
        city: '',
        state: '',
        zipCode: '',
      });

      // Redirect to dashboard after successful purchase
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }, 3000);
  };
  
  const pricingTiers: PricingTier[] = [
    {
      name: 'Basic',
      price: '$29',
      annualPrice: '$278',
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
      annualPrice: '$566',
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
      annualPrice: '$950',
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

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Real Estate Agent",
      company: "Realty One Group",
      content: "Listing Genie has transformed how I create property descriptions. I've saved hours on each listing, and my clients love the professional results. The Fair Housing compliance feature gives me peace of mind.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Broker",
      company: "Rodriguez Realty",
      content: "As a broker managing a team of agents, the Business plan has been invaluable. The analytics dashboard helps us track performance, and the unlimited listings give us the flexibility we need.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Jennifer Williams",
      role: "Marketing Director",
      company: "Premium Properties",
      content: "The social media content calendar and email templates have streamlined our marketing efforts. Our engagement metrics have doubled since using Listing Genie.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Premium Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal listing assistant. Upload a listing → get automatic property descriptions, social captions, ad copy, email blasts, and neighborhood insights.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-[#2F5DE3]' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button 
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annually' : 'monthly')}
            className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200 px-0.5 transition-colors"
          >
            <span 
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                billingCycle === 'annually' ? 'translate-x-6' : 'translate-x-0'
              }`} 
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'annually' ? 'text-[#2F5DE3]' : 'text-gray-500'}`}>
            Annually <span className="text-[#43D8B6] ml-1">Save 20%</span>
          </span>
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
                  <span className="text-4xl font-extrabold">
                    {billingCycle === 'monthly' ? tier.price : tier.annualPrice}
                  </span>
                  <span className="ml-1 text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
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
                  <button
                    onClick={() => handleCheckoutOpen(tier.name)}
                    className={`block w-full text-center py-3 px-4 rounded-md font-medium ${
                      tier.highlighted
                        ? 'bg-[#2F5DE3] text-white hover:bg-opacity-90'
                        : 'bg-white text-[#2F5DE3] border border-[#2F5DE3] hover:bg-indigo-50'
                    }`}
                  >
                    {tier.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    <button
                      onClick={() => handleCheckoutOpen(`${addon.name} Add-on`)}
                      className="block w-full text-center py-2 px-4 rounded-md font-medium bg-white text-[#2F5DE3] border border-[#2F5DE3] hover:bg-indigo-50"
                    >
                      Add to Subscription
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isCheckoutOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Complete Your Purchase</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="font-medium">Selected Plan: <span className="text-blue-600">{selectedPlan}</span></p>
              <p className="text-gray-600">
                {billingCycle === 'annual' ? 'Annual billing' : 'Monthly billing'}
              </p>
            </div>
            
            <form onSubmit={handleCheckoutSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={checkoutData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2F5DE3] focus:border-[#2F5DE3]"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={checkoutData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2F5DE3] focus:border-[#2F5DE3]"
                    required
                  />
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={checkoutData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2F5DE3] focus:border-[#2F5DE3]"
                      required
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={checkoutData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2F5DE3] focus:border-[#2F5DE3]"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code (optional)
                </label>
                <input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  value={checkoutData.couponCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2F5DE3] focus:border-[#2F5DE3]"
                />
              </div>
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  className="h-4 w-4 text-[#2F5DE3] focus:ring-[#2F5DE3] border-gray-300 rounded"
                  required
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <Link href="/terms" className="text-[#2F5DE3]">Terms and Conditions</Link> and <Link href="/privacy" className="text-[#2F5DE3]">Privacy Policy</Link>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-6"
              >
                Complete Purchase
              </button>
            </form>
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
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check if user is authenticated
  const authResult = requireAuth(context);
  
  // If authentication check results in a redirect, return it
  if ('redirect' in authResult) {
    return authResult;
  }
  
  // Get user info from the session
  const user = getUserFromRequest(context.req);
  
  return {
    props: {
      user: user || null,
    }
  };
} 