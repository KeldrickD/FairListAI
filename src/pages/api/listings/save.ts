import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// In a real application, this would use a database
// For now, we'll use an in-memory store that persists for the session
let listings: any[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

    const listingData = req.body;
    // Create a new listing with an ID and createdAt timestamp
    const newListing = {
      ...listingData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      userId,
    };

    // In a real app, you would save to a database
    listings.push(newListing);

    // Return the created listing
    return res.status(201).json({
      success: true,
      data: newListing,
    });
  } catch (error) {
    console.error('Error saving listing:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save listing',
    });
  }
} 