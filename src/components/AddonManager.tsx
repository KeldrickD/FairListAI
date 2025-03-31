import React, { useState, useEffect } from 'react';
import { Subscription } from '@/lib/utils';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  compatiblePlans: string[];
}

interface AddonManagerProps {
  onAddonPurchased?: (addonId: string) => void;
}

const AddonManager: React.FC<AddonManagerProps> = ({ onAddonPurchased }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Available addons in the system
  const availableAddons: Addon[] = [
    {
      id: 'virtual-staging',
      name: 'Virtual Staging',
      description: 'Transform empty rooms into beautifully staged spaces with AI-powered virtual staging.',
      price: 15,
      compatiblePlans: ['Basic', 'Pro', 'Business']
    },
    {
      id: 'premium-seo',
      name: 'Premium SEO Optimization',
      description: 'Boost your listings visibility with advanced SEO tools and keyword optimization.',
      price: 25,
      compatiblePlans: ['Basic', 'Pro']
    },
    {
      id: 'social-content',
      name: 'Social Media Content Calendar',
      description: 'Schedule and manage posts for your listings across multiple social platforms.',
      price: 20,
      compatiblePlans: ['Basic', 'Pro']
    },
    {
      id: 'analytics-boost',
      name: 'Advanced Analytics',
      description: 'Gain deeper insights with detailed performance metrics and demographic data.',
      price: 30,
      compatiblePlans: ['Basic', 'Pro']
    },
    {
      id: 'extra-team-member',
      name: 'Additional Team Member',
      description: 'Add one more team member account to your subscription.',
      price: 10,
      compatiblePlans: ['Business']
    }
  ];

  useEffect(() => {
    // Load user's subscription from localStorage
    if (typeof window !== 'undefined') {
      const savedSubscription = localStorage.getItem('userSubscription');
      if (savedSubscription) {
        const parsedSubscription = JSON.parse(savedSubscription);
        setSubscription(parsedSubscription);

        // Filter addons that are compatible with the user's plan
        // and not already purchased
        const currentAddons = parsedSubscription.addons || [];
        
        const filteredAddons = availableAddons.filter(addon => {
          return addon.compatiblePlans.includes(parsedSubscription.plan) && 
                 !currentAddons.includes(addon.id);
        });
        
        setAddons(filteredAddons);
      }
    }
  }, []);

  // Function to purchase an addon
  const purchaseAddon = () => {
    if (!selectedAddon || !subscription) return;
    
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Add the addon to the user's subscription
      const updatedAddons = [...(subscription.addons || []), selectedAddon.id];
      
      const updatedSubscription = {
        ...subscription,
        addons: updatedAddons
      };
      
      // Update localStorage
      localStorage.setItem('userSubscription', JSON.stringify(updatedSubscription));
      
      // Update state
      setSubscription(updatedSubscription);
      
      // Remove the purchased addon from available addons
      setAddons(addons.filter(addon => addon.id !== selectedAddon.id));
      
      // Reset selection and show success message
      setSelectedAddon(null);
      setIsProcessing(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      // Call the callback if provided
      if (onAddonPurchased) {
        onAddonPurchased(selectedAddon.id);
      }
    }, 1500);
  };

  if (!subscription) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-3">Addon Manager</h3>
        <p className="text-gray-600">
          You need an active subscription to purchase addons.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Enhance Your Subscription</h3>
      
      {/* Current Subscription */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-blue-800 font-medium">{subscription.plan} Plan</span>
            <span className="ml-2 text-sm text-blue-600">({subscription.billingCycle})</span>
          </div>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {subscription.status}
          </span>
        </div>
        
        {/* Current Addons */}
        {subscription.addons && subscription.addons.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Your Addons</h4>
            <div className="flex flex-wrap gap-2">
              {subscription.addons.map(addonId => {
                const addonInfo = availableAddons.find(a => a.id === addonId);
                return (
                  <span key={addonId} className="inline-block bg-white px-3 py-1 rounded-full text-sm text-blue-800 border border-blue-200">
                    {addonInfo ? addonInfo.name : addonId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100 text-green-800">
          <p className="font-medium">Addon successfully added to your subscription!</p>
          <p className="text-sm mt-1">Your account has been updated with the new features.</p>
        </div>
      )}
      
      {/* Available Addons */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Available Addons</h4>
        
        {addons.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {subscription.addons && subscription.addons.length > 0 
                ? "You've purchased all available addons for your plan!" 
                : "No addons available for your current plan."}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Consider upgrading your plan for more features.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addons.map(addon => (
              <div 
                key={addon.id}
                onClick={() => setSelectedAddon(selectedAddon?.id === addon.id ? null : addon)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAddon?.id === addon.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-800">{addon.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                  </div>
                  <div className="text-blue-600 font-medium">
                    ${addon.price}/mo
                  </div>
                </div>
                
                {selectedAddon?.id === addon.id && (
                  <div className="mt-4 pt-4 border-t border-blue-200 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        purchaseAddon();
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                      {isProcessing ? 'Processing...' : 'Add to Subscription'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Upgrade Note */}
      <div className="text-center py-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-3">Need more advanced features?</p>
        <a 
          href="/premium" 
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors inline-block"
        >
          Upgrade Your Plan
        </a>
      </div>
    </div>
  );
};

export default AddonManager; 