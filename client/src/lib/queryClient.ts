import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// API request helper
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestOptions {
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

// Define the API base URL based on the environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create a new QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Check if we're running in a static deployment (no backend available)
const isStaticDeployment = window.location.hostname.includes('vercel.app');

/**
 * Generic API request function
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any
) {
  // If this is a static deployment with no backend, provide mock data
  if (isStaticDeployment) {
    console.log(`[Static Deployment] ${method} ${endpoint}`, data);
    return handleStaticDeployment(method, endpoint, data);
  }

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
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // If the response is ok, return the json data
    return response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

/**
 * Function to handle static deployments without a backend
 * Returns mock data based on the endpoint and method
 */
function handleStaticDeployment(
  method: string,
  endpoint: string,
  data?: any
) {
  // Mock authentication
  if (endpoint.startsWith('/auth')) {
    return mockAuthResponse(method, endpoint, data);
  }
  
  // Mock listings data
  if (endpoint.startsWith('/listings')) {
    return mockListingsResponse(method, endpoint, data);
  }

  // Default fallback
  return {
    message: 'This is a static demo deployment. Backend functionality is limited.'
  };
}

/**
 * Mock authentication responses
 */
function mockAuthResponse(method: string, endpoint: string, data?: any) {
  // Mock login
  if (endpoint === '/auth/login' && method === 'POST') {
    return {
      user: {
        id: 1,
        username: data?.username || 'demo_user',
        name: 'Demo User',
        role: 'user',
        isPremium: true,
        subscriptionTier: 'pro',
        listingsThisMonth: 3,
        listingCredits: 50,
        seoEnabled: true,
        socialMediaEnabled: true,
        videoScriptsEnabled: true
      }
    };
  }
  
  // Mock register
  if (endpoint === '/auth/register' && method === 'POST') {
    return {
      user: {
        id: 1,
        username: data?.username || 'new_user',
        name: 'New User',
        role: 'user',
        isPremium: false,
        subscriptionTier: 'free',
        listingsThisMonth: 0,
        listingCredits: 5
      }
    };
  }
  
  return { message: 'Auth endpoint not implemented in static demo' };
}

/**
 * Mock listings responses
 */
function mockListingsResponse(method: string, endpoint: string, data?: any) {
  // Mock get all listings
  if (endpoint === '/listings' && method === 'GET') {
    return {
      listings: [
        {
          id: 101,
          userId: 1,
          title: "Modern 3 Bedroom House in Portland",
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 2100,
          features: "Open floor plan, hardwood floors, stainless steel appliances, large backyard",
          tone: "modern",
          generatedListing: "This stunning modern home offers 3 spacious bedrooms and 2 contemporary bathrooms spread across 2,100 square feet of thoughtfully designed living space. The open floor plan creates a seamless flow between living areas, while beautiful hardwood floors add warmth and elegance throughout. The kitchen boasts premium stainless steel appliances that will delight any home chef. Step outside to discover a large, private backyard perfect for entertaining and outdoor activities. Located in a desirable Portland neighborhood with easy access to shopping, dining, and recreation.",
          generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          seoOptimized: "MODERN PORTLAND HOUSE | 3 BED 2 BATH | OPEN CONCEPT LIVING\n\nDiscover this contemporary 3-bedroom, 2-bathroom home spanning 2,100 square feet of beautifully designed living space in Portland. The property features an inviting open floor plan enhanced by elegant hardwood floors throughout. Home chefs will appreciate the modern kitchen with premium stainless steel appliances. The spacious backyard provides the perfect setting for outdoor entertaining and family activities. Ideally located with convenient access to Portland's finest shopping, dining, and recreational amenities.",
          socialMediaContent: "Just listed in Portland! 🏡✨ This modern 3-bed, 2-bath home has it all—open concept living, hardwood floors, stainless appliances, and a huge backyard! 2,100 sf of stylish space in a prime location. Message for details! #PortlandRealEstate #DreamHome #ModernLiving #JustListed",
          videoScript: null,
        },
        {
          id: 102,
          userId: 1,
          title: "Downtown Luxury Condo with City Views",
          propertyType: "condo",
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1500,
          features: "Floor-to-ceiling windows, quartz countertops, spa-inspired bathrooms, 24-hour concierge",
          tone: "luxury",
          generatedListing: "Indulge in the epitome of downtown luxury living in this exquisite 2-bedroom, 2-bathroom condominium offering 1,500 square feet of sophisticated space. Floor-to-ceiling windows showcase breathtaking city views while bathing the interior in natural light. The gourmet kitchen features sleek quartz countertops and premium appliances. Retreat to spa-inspired bathrooms designed with relaxation in mind. This prestigious building offers 24-hour concierge service for your convenience and security. Experience refined urban living at its finest.",
          generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          seoOptimized: "LUXURY DOWNTOWN CONDO | PANORAMIC CITY VIEWS | 2 BED 2 BATH\n\nExperience elevated living in this premium 2-bedroom, 2-bathroom condominium in the heart of downtown. Spanning 1,500 square feet, this sophisticated residence features dramatic floor-to-ceiling windows that frame stunning city vistas. The designer kitchen showcases elegant quartz countertops and high-end appliances. Indulge in spa-quality bathrooms designed for ultimate relaxation. Building amenities include attentive 24-hour concierge service for a seamless luxury lifestyle. Perfect for discerning urban professionals seeking refined city living.",
          socialMediaContent: "Luxury Downtown Living! 🌇 Breathtaking city views from floor-to-ceiling windows in this upscale 2-bed, 2-bath condo. Featuring quartz countertops, spa-like bathrooms, and 24/7 concierge service. Urban sophistication at its finest! #LuxuryLiving #CityViews #UrbanOasis #DreamCondo",
          videoScript: "OPENING SHOT: Drone shot slowly approaching the luxury condominium building with the city skyline in background\n\nVOICEOVER: \"Welcome to the pinnacle of downtown luxury living.\"\n\nSHOT: Slow pan through the main living area, showcasing the floor-to-ceiling windows and city views\n\nVOICEOVER: \"This exceptional 2-bedroom, 2-bathroom residence spans 1,500 square feet of meticulously designed space, where sophistication meets comfort.\"\n\nSHOT: Close-up of kitchen features, focusing on quartz countertops and appliances\n\nVOICEOVER: \"The gourmet kitchen features premium quartz countertops and state-of-the-art appliances for the discerning chef.\"\n\nSHOT: Pan through master bathroom showing spa features\n\nVOICEOVER: \"Retreat to spa-inspired bathrooms designed with luxury and relaxation in mind.\"\n\nSHOT: Footage of concierge greeting a resident\n\nVOICEOVER: \"Building amenities include attentive 24-hour concierge service for a seamless lifestyle experience.\"\n\nCLOSING SHOT: Sunset view from the condo balcony overlooking city lights\n\nVOICEOVER: \"This is more than a home. It's an elevated living experience in the heart of the city.\"",
        },
        {
          id: 103,
          userId: 1,
          title: "Charming Cottage with Garden",
          propertyType: "house",
          bedrooms: 2,
          bathrooms: 1,
          squareFeet: 950,
          features: "Brick fireplace, garden with mature trees, built-in bookshelves, updated kitchen",
          tone: "cozy",
          generatedListing: "Welcome to this delightful 2-bedroom, 1-bathroom cottage that embodies charm and comfort throughout its 950 square feet of living space. The heart of this inviting home is the brick fireplace that creates a warm ambiance perfect for relaxing evenings. Book lovers will appreciate the beautiful built-in bookshelves that add character and practical storage. The thoughtfully updated kitchen balances modern functionality with cottage appeal. Step outside to discover a magical garden adorned with mature trees, offering a peaceful retreat for outdoor enjoyment and gardening enthusiasm.",
          generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
          seoOptimized: null,
          socialMediaContent: null,
          videoScript: null,
        }
      ]
    };
  }
  
  // Mock generate new listing
  if (endpoint === '/listings/generate' && method === 'POST') {
    return {
      listing: {
        id: 104,
        userId: 1,
        title: data?.title || "New Property Listing",
        propertyType: data?.propertyType || "house",
        bedrooms: data?.bedrooms || 3,
        bathrooms: data?.bathrooms || 2,
        squareFeet: data?.squareFeet || 1800,
        features: data?.features || "Open floor plan, updated kitchen, hardwood floors",
        tone: data?.tone || "modern",
        generatedListing: "This exceptional home offers modern living at its finest with 3 spacious bedrooms and 2 contemporary bathrooms in 1,800 square feet of thoughtfully designed space. The open floor plan creates a seamless flow between living areas, perfect for both entertaining and everyday living. The updated kitchen features stylish fixtures and ample counter space, ideal for culinary creativity. Beautiful hardwood floors add warmth and elegance throughout the home. Located in a desirable neighborhood with easy access to amenities, this property represents the perfect balance of comfort, style, and convenience.",
        generatedAt: new Date(),
        seoOptimized: data?.seo ? "MODERN 3 BED, 2 BATH HOME | OPEN FLOOR PLAN | UPDATED KITCHEN\n\nDiscover this contemporary 3-bedroom, 2-bathroom residence offering 1,800 square feet of beautifully designed living space. The property features an inviting open concept layout that seamlessly connects living areas, creating an ideal environment for both entertaining and daily living. The modernized kitchen showcases stylish fixtures and generous counter space for culinary enthusiasts. Elegant hardwood flooring extends throughout, adding warmth and sophistication to the home. Situated in a sought-after location with convenient access to local amenities, this exceptional property represents the perfect blend of modern comfort and practical living." : null,
        socialMediaContent: data?.social ? "Just listed! 🏡✨ This gorgeous 3-bed, 2-bath modern home has everything you're looking for—open floor plan, updated kitchen, and beautiful hardwood floors! 1,800 sf of stylish living space in a prime location. Message for viewing details! #JustListed #DreamHome #ModernLiving #RealEstateFinds" : null,
        videoScript: data?.video ? "OPENING SHOT: Wide angle view of the home exterior\n\nVOICEOVER: \"Welcome to this exceptional modern home where style meets functionality.\"\n\nSHOT: Panning through the open floor plan from living room to dining area\n\nVOICEOVER: \"The thoughtfully designed open floor plan creates a seamless flow between living spaces, perfect for both entertaining and everyday living.\"\n\nSHOT: Close-up of kitchen features\n\nVOICEOVER: \"The updated kitchen offers stylish fixtures and generous counter space, inspiring culinary creativity.\"\n\nSHOT: Tracking shot showcasing the hardwood floors through hallway\n\nVOICEOVER: \"Beautiful hardwood floors add warmth and sophistication throughout the home.\"\n\nSHOT: Master bedroom overview\n\nVOICEOVER: \"The spacious master bedroom provides a tranquil retreat at the end of the day.\"\n\nSHOT: Bathroom features\n\nVOICEOVER: \"Contemporary bathrooms combine style with functionality.\"\n\nCLOSING SHOT: Exterior view of the neighborhood\n\nVOICEOVER: \"Located in a desirable area with easy access to amenities, this property represents the perfect balance of comfort, style, and convenience.\"" : null
      },
      generated: {
        listing: "This exceptional home offers modern living at its finest with 3 spacious bedrooms and 2 contemporary bathrooms in 1,800 square feet of thoughtfully designed space. The open floor plan creates a seamless flow between living areas, perfect for both entertaining and everyday living. The updated kitchen features stylish fixtures and ample counter space, ideal for culinary creativity. Beautiful hardwood floors add warmth and elegance throughout the home. Located in a desirable neighborhood with easy access to amenities, this property represents the perfect balance of comfort, style, and convenience.",
        seoScore: 92,
        compliance: {
          isCompliant: true,
          violations: [],
          suggestions: []
        },
        seoOptimized: data?.seo ? "MODERN 3 BED, 2 BATH HOME | OPEN FLOOR PLAN | UPDATED KITCHEN\n\nDiscover this contemporary 3-bedroom, 2-bathroom residence offering 1,800 square feet of beautifully designed living space. The property features an inviting open concept layout that seamlessly connects living areas, creating an ideal environment for both entertaining and daily living. The modernized kitchen showcases stylish fixtures and generous counter space for culinary enthusiasts. Elegant hardwood flooring extends throughout, adding warmth and sophistication to the home. Situated in a sought-after location with convenient access to local amenities, this exceptional property represents the perfect blend of modern comfort and practical living." : null,
        socialMediaContent: data?.social ? "Just listed! 🏡✨ This gorgeous 3-bed, 2-bath modern home has everything you're looking for—open floor plan, updated kitchen, and beautiful hardwood floors! 1,800 sf of stylish living space in a prime location. Message for viewing details! #JustListed #DreamHome #ModernLiving #RealEstateFinds" : null,
        videoScript: data?.video ? "OPENING SHOT: Wide angle view of the home exterior\n\nVOICEOVER: \"Welcome to this exceptional modern home where style meets functionality.\"\n\nSHOT: Panning through the open floor plan from living room to dining area\n\nVOICEOVER: \"The thoughtfully designed open floor plan creates a seamless flow between living spaces, perfect for both entertaining and everyday living.\"\n\nSHOT: Close-up of kitchen features\n\nVOICEOVER: \"The updated kitchen offers stylish fixtures and generous counter space, inspiring culinary creativity.\"\n\nSHOT: Tracking shot showcasing the hardwood floors through hallway\n\nVOICEOVER: \"Beautiful hardwood floors add warmth and sophistication throughout the home.\"\n\nSHOT: Master bedroom overview\n\nVOICEOVER: \"The spacious master bedroom provides a tranquil retreat at the end of the day.\"\n\nSHOT: Bathroom features\n\nVOICEOVER: \"Contemporary bathrooms combine style with functionality.\"\n\nCLOSING SHOT: Exterior view of the neighborhood\n\nVOICEOVER: \"Located in a desirable area with easy access to amenities, this property represents the perfect balance of comfort, style, and convenience.\"" : null
      }
    };
  }
  
  return { message: 'Listings endpoint not implemented in static demo' };
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }: { queryKey: unknown[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
