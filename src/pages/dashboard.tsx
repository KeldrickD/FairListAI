import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { getUserListings, deleteListing, ListingItem } from '@/lib/services/listingService';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tutorial } from '@/components/ui/Tutorial';
import { requireAuth, getUserFromRequest } from '@/lib/auth';
import { Sparkles, Award, Clock } from 'lucide-react';

// Define a type for subscription
interface Subscription {
  plan: string;
  billingCycle: string;
  startDate: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard({ user }: { user: User | null }) {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  // Fetch listings when the component mounts and whenever the page is focused
  useEffect(() => {
    fetchListings();
    
    // Check for subscription in localStorage
    if (typeof window !== 'undefined') {
      const savedSubscription = localStorage.getItem('userSubscription');
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      }
    }

    // Also refresh listings when the page is focused (e.g., when navigating back)
    const handleFocus = () => {
      fetchListings();
      // Also refresh subscription data
      if (typeof window !== 'undefined') {
        const savedSubscription = localStorage.getItem('userSubscription');
        if (savedSubscription) {
          setSubscription(JSON.parse(savedSubscription));
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const data = await getUserListings();
      setListings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your listings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteListing(id);
      // Update the UI by filtering out the deleted listing
      setListings(listings.filter(listing => listing.id !== id));
      toast({
        title: 'Success',
        description: 'Listing deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete listing. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Listings</h1>
        <Link 
          href="/new-listing" 
          className="btn btn-primary"
        >
          Create New Listing
        </Link>
      </div>
      
      {subscription ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100 flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-4">
            <Award className="text-blue-600 h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800">
              {subscription.plan} Plan Active
            </h3>
            <p className="text-sm text-blue-600">
              Your subscription is active. Enjoy all the premium features!
            </p>
          </div>
          <div className="ml-auto">
            <Link
              href="/account"
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 mb-6 border border-amber-100 flex items-center">
          <div className="bg-amber-100 rounded-full p-2 mr-4">
            <Clock className="text-amber-600 h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800">Free Trial Mode</h3>
            <p className="text-sm text-amber-600">
              You're using the free trial version. Upgrade to unlock all features.
            </p>
          </div>
          <div className="ml-auto">
            <Link
              href="/premium"
              className="text-amber-600 text-sm font-medium hover:text-amber-800"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="card hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-600 mb-4">{listing.location}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{listing.bedrooms} bed • {listing.bathrooms} bath</span>
                <span>{formatPrice(listing.price)}</span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{listing.description}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Created {new Date(listing.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Link href={`/edit-listing/${listing.id}`} className="btn btn-secondary text-sm">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(listing.id)} 
                    className="btn btn-secondary text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-4">No listings found</h3>
          <p className="text-gray-500 mb-6">You haven't created any listings yet.</p>
          <Link 
            href="/new-listing" 
            className="btn btn-primary"
          >
            Create Your First Listing
          </Link>
        </div>
      )}

      {/* Only show the tutorial if there's no subscription */}
      {!subscription && (
        <div className="fixed bottom-6 right-6">
          <Tutorial
            id="dashboard-intro"
            title="Welcome to Your Dashboard!"
            content="Here you'll find all your property listings. Click 'Create New Listing' to generate your first AI-powered property description."
            position="left"
            delay={1000}
          />
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const authResult = requireAuth(context);
  
  // If authentication check results in a redirect, return it
  if ('redirect' in authResult) {
    return authResult;
  }
  
  // Get user info from the session
  const user = getUserFromRequest(context.req);
  
  // Otherwise, return the props
  return {
    props: {
      user: user || null
    }
  };
} 