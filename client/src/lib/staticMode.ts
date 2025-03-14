/**
 * This file contains utilities for handling the static deployment mode
 * where no backend server is available. It provides mock data for API calls.
 */

// Check if we're running in static deployment mode
export const isStaticDeployment = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || localStorage.getItem('FORCE_STATIC_MODE') === 'true');

// Enable static mode for testing
export function enableStaticMode() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('FORCE_STATIC_MODE', 'true');
    window.location.reload();
  }
}

// Disable static mode
export function disableStaticMode() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('FORCE_STATIC_MODE');
    window.location.reload();
  }
}

// Mock user data
export const mockUser = {
  id: 1,
  username: 'demo_user',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  isPremium: true,
  subscriptionTier: 'pro',
  listingsThisMonth: 3,
  listingCredits: 50,
  seoEnabled: true,
  socialMediaEnabled: true,
  videoScriptsEnabled: true
};

// Mock listings data
export const mockListings = [
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
]; 