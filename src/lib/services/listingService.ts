import { apiRequest } from '@/lib/api';

export interface ListingItem {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
  description: string;
  propertyType: string;
  squareFeet: number;
  features: string[];
  socialMedia?: {
    instagram: string;
    facebook: string;
    tiktok: string;
    linkedin?: string;
    twitter?: string;
  };
  hashtags?: string[];
  userId: string;
}

// Helper to get listings from localStorage
const getStoredListings = (): ListingItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedListings = localStorage.getItem('userListings');
    return storedListings ? JSON.parse(storedListings) : [];
  } catch (error) {
    console.error('Error retrieving listings from localStorage:', error);
    return [];
  }
};

// Helper to save listings to localStorage
const storeListings = (listings: ListingItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('userListings', JSON.stringify(listings));
  } catch (error) {
    console.error('Error storing listings in localStorage:', error);
  }
};

/**
 * Saves a listing to the user's account
 */
export async function saveListing(listing: Omit<ListingItem, 'id' | 'createdAt'>): Promise<ListingItem> {
  try {
    // Create a new listing with an ID and createdAt timestamp
    const newListing: ListingItem = {
      ...listing,
      id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    // Get existing listings
    const existingListings = getStoredListings();
    
    // Add the new listing
    const updatedListings = [newListing, ...existingListings];
    
    // Store the updated listings
    storeListings(updatedListings);
    
    // For demo purposes, also try to call the API (will fallback to localStorage if it fails)
    try {
      await apiRequest('/api/listings/save', {
        method: 'POST',
        body: JSON.stringify(newListing),
      });
    } catch (error) {
      console.warn('API call failed, but listing was saved to localStorage', error);
    }

    return newListing;
  } catch (error) {
    console.error('Error saving listing:', error);
    throw error;
  }
}

/**
 * Retrieves all listings for the current user
 */
export async function getUserListings(): Promise<ListingItem[]> {
  try {
    // Try to get listings from API first
    try {
      const response = await apiRequest('/api/listings/user', {
        method: 'GET',
      });

      if (response.success) {
        // If API call is successful, update localStorage with the response data
        storeListings(response.data);
        return response.data;
      }
    } catch (error) {
      console.warn('API call failed, retrieving listings from localStorage', error);
    }
    
    // Fallback to localStorage if API call fails
    return getStoredListings();
  } catch (error) {
    console.error('Error retrieving listings:', error);
    throw error;
  }
}

/**
 * Deletes a listing by ID
 */
export async function deleteListing(id: string): Promise<void> {
  try {
    // Get existing listings
    const existingListings = getStoredListings();
    
    // Filter out the listing to delete
    const updatedListings = existingListings.filter(listing => listing.id !== id);
    
    // Store the updated listings
    storeListings(updatedListings);
    
    // Try to delete from API as well
    try {
      await apiRequest(`/api/listings/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('API call failed, but listing was deleted from localStorage', error);
    }
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
}

/**
 * Updates an existing listing
 */
export async function updateListing(id: string, listing: Partial<ListingItem>): Promise<ListingItem> {
  try {
    // Get existing listings
    const existingListings = getStoredListings();
    
    // Find the listing to update
    const listingIndex = existingListings.findIndex(item => item.id === id);
    if (listingIndex === -1) {
      throw new Error(`Listing with ID ${id} not found`);
    }
    
    // Update the listing
    const updatedListing = {
      ...existingListings[listingIndex],
      ...listing,
    };
    
    // Replace the old listing with the updated one
    existingListings[listingIndex] = updatedListing;
    
    // Store the updated listings
    storeListings(existingListings);
    
    // Try to update in API as well
    try {
      await apiRequest(`/api/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(listing),
      });
    } catch (error) {
      console.warn('API call failed, but listing was updated in localStorage', error);
    }
    
    return updatedListing;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
} 