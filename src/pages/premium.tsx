import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { apiRequest } from '@/lib/api'

type SubscriptionTierName = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'PAY_PER_USE'

interface SubscriptionTier {
  name: SubscriptionTierName
  price: number
  features: string[]
  payPerUse?: {
    price: number
    unit: string
  }
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'FREE',
    price: 0,
    features: [
      '3 listings per month',
      'Basic AI listing generation',
      'Fair Housing compliance check',
      'Email support',
    ],
  },
  {
    name: 'BASIC',
    price: 29,
    features: [
      '10 listings per month',
      'Advanced AI listing generation',
      'Fair Housing compliance filter',
      'SEO optimization',
      'Priority support',
      'Basic analytics',
    ],
  },
  {
    name: 'PRO',
    price: 99,
    features: [
      '50 listings per month',
      'All basic features',
      'Social media caption generator',
      'Hashtag recommendations',
      'API access',
      'Custom branding',
      'Advanced analytics',
      'Dedicated support',
    ],
  },
  {
    name: 'ENTERPRISE',
    price: 499,
    features: [
      'Unlimited listings',
      'All pro features',
      'Bulk listing generation',
      'MLS API integration',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
      'White-label options',
    ],
  },
  {
    name: 'PAY_PER_USE',
    price: 0,
    features: [
      'Pay only for what you use',
      'All basic features',
      'No monthly commitment',
      'Flexible pricing',
    ],
    payPerUse: {
      price: 5,
      unit: 'listing',
    },
  },
]

const payPerUseServices = {
  SINGLE_LISTING: 5,
  BULK_LISTING_20: 90,
  API_CALL: 0.10,
  SOCIAL_MEDIA_CAPTION: 2,
  SEO_OPTIMIZATION: 10,
} as const

export default function Premium() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierName>('FREE')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (tier: SubscriptionTierName) => {
    setIsLoading(true)
    try {
      const response = await apiRequest('/api/subscriptions/create', {
        method: 'POST',
        body: JSON.stringify({ tier }),
      })

      if (response.success) {
        toast({
          title: 'Success!',
          description: `You have successfully subscribed to the ${tier} tier.`,
        })
      } else {
        throw new Error(response.message || 'Failed to subscribe')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to subscribe',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTierPrice = (tier: SubscriptionTierName): number => {
    const subscription = subscriptionTiers.find((t) => t.name === tier)
    return subscription?.price || 0
  }

  const getPayPerUsePrice = (service: keyof typeof payPerUseServices): number => {
    return payPerUseServices[service]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <Card key={tier.name} className="p-6">
            <h2 className="text-2xl font-bold mb-4">{tier.name}</h2>
            <div className="text-3xl font-bold mb-4">
              ${tier.price}
              {tier.payPerUse && <span className="text-sm">/{tier.payPerUse.unit}</span>}
            </div>
            <ul className="space-y-2 mb-6">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe(tier.name)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Subscribe'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
} 