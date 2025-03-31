import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, Key, CreditCard, Save, Package, CheckCheck, X } from 'lucide-react'
import Layout from '@/components/Layout'
import { GetServerSideProps } from 'next'
import { requireAuth, getUserFromRequest } from '@/lib/auth'
import { Subscription, getUserFeatures, Feature } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: string
  company?: string
  phone?: string
}

interface AccountFormData {
  name: string
  email: string
  company: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Account({ user }: { user: User | null }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [features, setFeatures] = useState<Record<string, Feature>>({})
  const [formData, setFormData] = useState<AccountFormData>({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Load subscription data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSubscription = localStorage.getItem('userSubscription')
      if (savedSubscription) {
        const parsedSubscription = JSON.parse(savedSubscription)
        setSubscription(parsedSubscription)
        
        // Get features based on subscription
        const userFeatures = getUserFeatures(parsedSubscription)
        setFeatures(userFeatures)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would update the user profile via API
      console.log('Saving profile data:', formData)
      setIsSaving(false)
      
      // Show success message
      alert('Profile updated successfully!')
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const cancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing cycle.')) {
      // In a real app, this would make an API call to cancel the subscription
      
      // For the demo, we'll update the status in localStorage
      if (subscription && typeof window !== 'undefined') {
        const updatedSubscription = {
          ...subscription,
          status: 'cancelled'
        }
        localStorage.setItem('userSubscription', JSON.stringify(updatedSubscription))
        setSubscription(updatedSubscription)
      }
      
      alert('Your subscription has been cancelled. It will remain active until the end of the current billing period.')
    }
  }

  return (
    <Layout hideHeader={false}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Subscription</h3>
                {subscription ? (
                  <div>
                    <div className={`rounded-md p-2 mb-2 ${
                      subscription.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <p className="font-medium">{subscription.plan} Plan</p>
                      <p className="text-sm">
                        Status: {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                      </p>
                      <p className="text-sm">
                        Started: {formatDate(subscription.startDate)}
                      </p>
                      <p className="text-sm">
                        Billing: {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
                      </p>
                      
                      {/* Show addons if any */}
                      {subscription.addons && subscription.addons.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Add-ons:</p>
                          <ul className="text-xs">
                            {subscription.addons.map(addon => (
                              <li key={addon} className="mt-1">• {addon}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {subscription.status === 'active' && (
                        <button
                          onClick={cancelSubscription}
                          className="w-full py-2 px-3 border border-red-300 rounded-md text-red-600 text-sm font-medium hover:bg-red-50"
                        >
                          Cancel Subscription
                        </button>
                      )}
                      
                      <a
                        href="/premium"
                        className="block w-full py-2 px-3 text-center bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700"
                      >
                        {subscription.status === 'active' ? 'Change Plan' : 'Reactivate Subscription'}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-3">You are currently on the free trial.</p>
                    <a
                      href="/premium"
                      className="block w-full py-2 px-3 text-center bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700"
                    >
                      Upgrade Now
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Features section */}
            {Object.keys(features).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="font-medium mb-4">Your Features</h3>
                <ul className="space-y-2">
                  {Object.entries(features).map(([key, feature]) => (
                    <li key={key} className="flex items-center text-sm">
                      {feature.included ? (
                        <CheckCheck className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company/Brokerage
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Your company"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
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