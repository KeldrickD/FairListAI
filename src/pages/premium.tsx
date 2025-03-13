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
      'Basic listing features',
      'Email support',
    ],
  },
  {
    name: 'BASIC',
    price: 29,
    features: [
      '10 listings per month',
      'Advanced listing features',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  {
    name: 'PRO',
    price: 99,
    features: [
      '50 listings per month',
      'All basic features',
      'API access',
      'Custom branding',
      'Dedicated support',
    ],
  },
  {
    name: 'ENTERPRISE',
    price: 499,
    features: [
      'Unlimited listings',
      'All pro features',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
    ],
  },
  {
    name: 'PAY_PER_USE',
    price: 0,
    features: [
      'Pay only for what you use',
      'Flexible pricing',
      'No monthly commitment',
    ],
    payPerUse: {
      price: 5,
      unit: 'listing',
    },
  },
]

const payPerUseServices = {
  SEO_OPTIMIZATION: 1000,
  SOCIAL_MEDIA: 1500,
  VIDEO_SCRIPT: 2500,
  SINGLE_LISTING: 500,
  BULK_LISTING_20: 5000,
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