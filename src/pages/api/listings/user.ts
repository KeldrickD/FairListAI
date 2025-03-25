import type { NextApiRequest, NextApiResponse } from 'next';

// Importing from save.ts won't work in a production environment with serverless functions
// In a real app, this would use a database
// For demo purposes, we'll create some fake listings
const demoListings = [
  {
    id: '1',
    title: 'Luxury Condo with City Views',
    location: 'Downtown Seattle, WA',
    price: 899000,
    bedrooms: 2,
    bathrooms: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Stunning luxury condo in the heart of downtown with breathtaking city views...',
    propertyType: 'Condo',
    squareFeet: 1250,
    features: ['Balcony', 'Hardwood Floors', 'Stainless Steel Appliances', 'Gym'],
    socialMedia: {
      instagram: '✨ Urban luxury in the heart of Seattle! 2 bed, 2 bath condo with stunning views and modern finishes. #SeattleRealEstate',
      facebook: 'Luxury living in Downtown Seattle! This stunning 2 bed, 2 bath condo offers breathtaking city views and premium amenities.',
      tiktok: 'City living at its finest! 🌃 #SeattleRealEstate #LuxuryHome #DowntownLiving'
    },
    hashtags: ['#SeattleRealEstate', '#LuxuryCondo', '#DowntownLiving', '#CityViews', '#ModernLiving'],
    userId: 'demo-user-123'
  },
  {
    id: '2',
    title: 'Spacious Family Home in Green Valley',
    location: 'Bellevue, WA',
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Beautiful family home in the desirable Green Valley neighborhood...',
    propertyType: 'Single Family',
    squareFeet: 2800,
    features: ['Large Backyard', 'Updated Kitchen', 'Fireplace', 'Garage', 'Home Office'],
    socialMedia: {
      instagram: '🏡 Perfect family home in Bellevue! 4 beds, 3 baths, and room to grow. #BellevueRealEstate #FamilyHome',
      facebook: 'Looking for your dream family home? This spacious 4 bed, 3 bath house in Green Valley has everything you need!',
      tiktok: 'Room for everyone in this Bellevue beauty! 🏡 #FamilyHome #RealEstateTikTok #BellevueWA'
    },
    hashtags: ['#BellevueRealEstate', '#FamilyHome', '#GreenValley', '#LuxuryLiving', '#DreamHome'],
    userId: 'demo-user-123'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // In a real app, you would verify the user's session here
    // const session = await getSession({ req });
    // if (!session || !session.user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Unauthorized',
    //   });
    // }

    // For demo purposes, use a fake user ID
    const userId = 'demo-user-123';

    // In a real app, you would query your database
    // const userListings = await prisma.listing.findMany({
    //   where: { userId: userId },
    //   orderBy: { createdAt: 'desc' },
    // });

    // Return demo listings for now
    return res.status(200).json({
      success: true,
      data: demoListings,
    });
  } catch (error) {
    console.error('Error retrieving listings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve listings',
    });
  }
} 