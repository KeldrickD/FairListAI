import { isStaticDeployment, mockUser, mockListings } from './staticMode';

// API base URL
const API_BASE_URL = '/api';

/**
 * Make an API request with appropriate error handling
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any
) {
  // If in static deployment mode, return mock data
  if (isStaticDeployment) {
    console.log(`[Static Mode] ${method} ${endpoint}`, data);
    return handleStaticRequest(method, endpoint, data);
  }

  // Regular API request
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

/**
 * Handle requests in static deployment mode
 */
function handleStaticRequest(method: string, endpoint: string, data?: any) {
  // Auth endpoints
  if (endpoint.startsWith('/auth/')) {
    return handleAuthRequest(method, endpoint, data);
  }
  
  // Listings endpoints
  if (endpoint.startsWith('/listings')) {
    return handleListingsRequest(method, endpoint, data);
  }
  
  // Default response for unhandled endpoints
  return {
    message: 'This is a static demo. The requested endpoint is not available in demo mode.'
  };
}

/**
 * Handle authentication requests in static mode
 */
function handleAuthRequest(method: string, endpoint: string, data?: any) {
  // Login
  if (endpoint === '/auth/login' && method === 'POST') {
    return { user: mockUser };
  }
  
  // Register
  if (endpoint === '/auth/register' && method === 'POST') {
    return {
      user: {
        ...mockUser,
        username: data.username,
        isPremium: false,
        subscriptionTier: 'free',
        listingsThisMonth: 0,
        listingCredits: 5,
        seoEnabled: false,
        socialMediaEnabled: false,
        videoScriptsEnabled: false
      }
    };
  }
  
  // Logout
  if (endpoint === '/auth/logout' && method === 'POST') {
    return { message: 'Logged out successfully' };
  }
  
  return { message: 'Auth endpoint not implemented in demo mode' };
}

/**
 * Handle listings requests in static mode
 */
function handleListingsRequest(method: string, endpoint: string, data?: any) {
  // Get all listings
  if (endpoint === '/listings' && method === 'GET') {
    return { listings: mockListings };
  }
  
  // Generate new listing
  if (endpoint === '/listings/generate' && method === 'POST') {
    const newListing = {
      id: 104,
      userId: mockUser.id,
      title: data.title || 'New Generated Listing',
      propertyType: data.propertyType || 'house',
      bedrooms: data.bedrooms || 3,
      bathrooms: data.bathrooms || 2,
      squareFeet: data.squareFeet || 1800,
      features: data.features || 'Open floor plan, hardwood floors, updated kitchen',
      tone: data.tone || 'modern',
      generatedListing: 'This exceptional home offers the perfect blend of style and functionality with 3 spacious bedrooms and 2 well-appointed bathrooms in 1,800 square feet of thoughtfully designed space. The open floor plan creates a seamless flow for both entertaining and everyday living. Beautiful hardwood floors run throughout, adding warmth and elegance. The updated kitchen features modern fixtures and generous counter space. Located in a desirable neighborhood with easy access to amenities, this property represents the perfect balance of comfort and convenience.',
      generatedAt: new Date(),
      seoOptimized: mockUser.seoEnabled ? 'MODERN HOME | 3 BED 2 BATH | HARDWOOD FLOORS\n\nDiscover this exceptional 3-bedroom, 2-bathroom residence offering 1,800 square feet of beautifully designed living space. The property features an inviting open floor plan perfect for both entertaining and everyday living. Beautiful hardwood floors run throughout, adding warmth and character. The updated kitchen provides modern functionality with stylish fixtures and ample counter space. Situated in a prime location with convenient access to various amenities, this property represents an ideal blend of comfort, style, and convenience.' : null,
      socialMediaContent: mockUser.socialMediaEnabled ? 'Just listed! 🏡✨ This stunning 3-bed, 2-bath home has it all — open floor plan, beautiful hardwood floors, and an updated kitchen! 1,800 sf of thoughtfully designed space in a prime location. Message to schedule a viewing! #JustListed #DreamHome #RealEstateFinder' : null,
      videoScript: mockUser.videoScriptsEnabled ? 'OPENING SHOT: Wide angle view of home exterior\n\nVOICEOVER: "Welcome to this exceptional property where style meets functionality."\n\nSHOT: Pan through the open floor plan\n\nVOICEOVER: "The thoughtfully designed open floor plan creates a seamless flow between living spaces."\n\nSHOT: Close-up of hardwood flooring\n\nVOICEOVER: "Beautiful hardwood floors run throughout, adding warmth and character to the home."\n\nSHOT: Showcase kitchen features\n\nVOICEOVER: "The updated kitchen offers modern fixtures and generous counter space, perfect for culinary creativity."\n\nSHOT: Tour of bedrooms\n\nVOICEOVER: "Three spacious bedrooms provide comfortable retreats for rest and relaxation."\n\nCLOSING SHOT: Exterior view of neighborhood\n\nVOICEOVER: "Located in a desirable area with easy access to amenities, this property represents the perfect balance of comfort, style, and convenience."' : null
    };
    
    return {
      listing: newListing,
      generated: {
        listing: newListing.generatedListing,
        seoScore: 92,
        compliance: {
          isCompliant: true,
          violations: [],
          suggestions: []
        },
        seoOptimized: newListing.seoOptimized,
        socialMediaContent: newListing.socialMediaContent,
        videoScript: newListing.videoScript
      }
    };
  }
  
  // Update listing title
  if (endpoint.match(/\/listings\/\d+/) && method === 'PATCH') {
    const listingId = parseInt(endpoint.split('/').pop() || '0');
    const updatedListing = mockListings.find(listing => listing.id === listingId);
    
    if (!updatedListing) {
      throw new Error('Listing not found');
    }
    
    return {
      listing: {
        ...updatedListing,
        title: data.title
      }
    };
  }
  
  return { message: 'Listings endpoint not implemented in demo mode' };
} 