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

/**
 * Saves a listing to the user's account
 */
export async function saveListing(listing: Omit<ListingItem, 'id' | 'createdAt'>): Promise<ListingItem> {
  try {
    const response = await apiRequest('/api/listings/save', {
      method: 'POST',
      body: JSON.stringify(listing),
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to save listing');
    }

    return response.data;
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
    const response = await apiRequest('/api/listings/user', {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to retrieve listings');
    }

    return response.data;
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
    const response = await apiRequest(`/api/listings/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete listing');
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
    const response = await apiRequest(`/api/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(listing),
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to update listing');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
} 