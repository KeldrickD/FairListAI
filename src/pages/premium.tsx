import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { apiRequest } from '@/lib/api'

interface SubscriptionTier {
  name: string
  price: number
  features: string[]
  payPerUse?: {
    price: number
    unit: string
  }
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Basic',
    price: 9.99,
    features: [
      '5 listings per month',
      'Basic AI optimization',
      'Email support',
      'Standard templates'
    ]
  },
  {
    name: 'Pro',
    price: 19.99,
    features: [
      'Unlimited listings',
      'Advanced AI optimization',
      'Priority support',
      'Premium templates',
      'Analytics dashboard'
    ]
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: [
      'Everything in Pro',
      'Custom AI training',
      'Dedicated support',
      'API access',
      'Custom integrations'
    ],
    payPerUse: {
      price: 0.05,
      unit: 'listing'
    }
  }
]

export default function Premium() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setIsLoading(true)
    try {
      const response = await apiRequest('/api/subscriptions/create', {
        method: 'POST',
        body: JSON.stringify({
          tier: tier.name,
          price: tier.price,
          payPerUse: tier.payPerUse
        })
      })

      if (response.success) {
        toast({
          title: 'Success!',
          description: `You have successfully subscribed to the ${tier.name} plan.`
        })
      } else {
        throw new Error(response.message || 'Failed to create subscription')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create subscription',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>
                ${tier.price.toFixed(2)}/month
                {tier.payPerUse && (
                  <span className="block text-sm text-muted-foreground">
                    +${tier.payPerUse.price.toFixed(2)} per {tier.payPerUse.unit}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(tier)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 