import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface ListingItem {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
}

export default function Dashboard() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an API
    setIsLoading(true);
    setTimeout(() => {
      // Mock data for demonstration
      const mockListings: ListingItem[] = [
        {
          id: '1',
          title: 'Modern Apartment',
          location: 'San Francisco, CA',
          price: 850000,
          bedrooms: 2,
          bathrooms: 2,
          createdAt: '2023-03-10T12:00:00Z',
        },
        {
          id: '2',
          title: 'Urban Loft',
          location: 'New York, NY',
          price: 1250000,
          bedrooms: 3,
          bathrooms: 2,
          createdAt: '2023-03-05T10:30:00Z',
        },
        {
          id: '3',
          title: 'Suburban Home',
          location: 'Austin, TX',
          price: 675000,
          bedrooms: 4,
          bathrooms: 3,
          createdAt: '2023-02-28T15:45:00Z',
        },
      ];
      
      setListings(mockListings);
      setIsLoading(false);
    }, 1000);
  }, []);

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
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Created {new Date(listing.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button className="btn btn-secondary text-sm">Edit</button>
                  <button className="btn btn-secondary text-sm">Delete</button>
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
    </div>
  );
} 