import { NextRequest, NextResponse } from 'next/server';
import { HostawayApiResponse, NormalizedReview } from '@/types/reviews';

// Mock data for development since sandbox API contains no reviews
const mockHostawayData: HostawayApiResponse = {
  status: "success",
  result: [
    {
      id: 7453,
      type: "guest-to-host",
      status: "published",
      rating: null,
      publicReview: "Amazing stay at Shoreditch Heights! The apartment was modern, clean, and perfectly located. Shane was incredibly responsive and helpful throughout our stay. Would definitely recommend!",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 9 },
        { category: "value", rating: 8 }
      ],
      submittedAt: "2024-08-21 22:45:14",
      guestName: "Sarah Johnson",
      listingName: "2B N1 A - 29 Shoreditch Heights"
    },
    {
      id: 7454,
      type: "guest-to-host",
      status: "published",
      rating: null,
      publicReview: "Great location in the heart of Shoreditch. The flat was exactly as described and very comfortable for our group of 4. Easy check-in process and excellent communication from the host team.",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 10 },
        { category: "value", rating: 9 }
      ],
      submittedAt: "2024-08-15 14:30:22",
      guestName: "Michael Chen",
      listingName: "2B N1 A - 29 Shoreditch Heights"
    },
    {
      id: 7455,
      type: "guest-to-host",
      status: "published",
      rating: null,
      publicReview: "Lovely apartment with all the amenities we needed. The area is vibrant with lots of restaurants and shops nearby. Host was very accommodating with our late check-in request.",
      reviewCategory: [
        { category: "cleanliness", rating: 8 },
        { category: "communication", rating: 9 },
        { category: "location", rating: 10 },
        { category: "amenities", rating: 9 }
      ],
      submittedAt: "2024-08-10 09:15:33",
      guestName: "Emma Williams",
      listingName: "1B E2 B - 15 Canary Wharf Tower"
    },
    {
      id: 7456,
      type: "guest-to-host",
      status: "published",
      rating: null,
      publicReview: "Perfect for a business trip! Close to the office and transport links. The apartment was spotless and had everything needed for a comfortable stay.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 8 },
        { category: "location", rating: 10 },
        { category: "value", rating: 8 }
      ],
      submittedAt: "2024-08-05 16:45:11",
      guestName: "David Thompson",
      listingName: "1B E2 B - 15 Canary Wharf Tower"
    },
    {
      id: 7457,
      type: "guest-to-host",
      status: "published",
      rating: null,
      publicReview: "Incredible views from this apartment! The space was modern and well-equipped. Great communication from the Flex Living team. Only minor issue was noise from construction nearby during the day.",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 8 },
        { category: "amenities", rating: 9 }
      ],
      submittedAt: "2024-07-28 11:20:55",
      guestName: "Jennifer Lopez",
      listingName: "Studio W1 C - 42 Mayfair Gardens"
    }
  ]
};

function normalizeHostawayReviews(hostawayReviews: HostawayApiResponse): NormalizedReview[] {
  return hostawayReviews.result.map(review => {
    // Calculate overall rating from categories
    const totalRating = review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0);
    const overallRating = Math.round(totalRating / review.reviewCategory.length);
    
    // Extract property ID from listing name (simple extraction for demo)
    const propertyId = review.listingName.split(' - ')[0] || 'unknown';
    
    return {
      id: review.id,
      source: 'hostaway' as const,
      propertyId,
      propertyName: review.listingName,
      guestName: review.guestName,
      rating: review.rating,
      overallRating,
      reviewText: review.publicReview,
      categories: review.reviewCategory,
      submittedAt: new Date(review.submittedAt),
      channel: 'Hostaway',
      type: review.type,
      status: review.status as 'published' | 'pending' | 'hidden',
      isApprovedForPublic: review.status === 'published'
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const useMockData = searchParams.get('mock') === 'true' || process.env.NODE_ENV === 'development';
    
    let reviewsData: HostawayApiResponse;
    
    if (useMockData) {
      // Use mock data for development
      reviewsData = mockHostawayData;
    } else {
      // Fetch from real Hostaway API
      const apiKey = process.env.HOSTAWAY_API_KEY || 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';
      const accountId = process.env.HOSTAWAY_ACCOUNT_ID || '61148';
      
      const response = await fetch(`https://api.hostaway.com/v1/reviews?accountId=${accountId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Hostaway API error: ${response.status}`);
      }
      
      reviewsData = await response.json();
    }
    
    let normalizedReviews = normalizeHostawayReviews(reviewsData);
    
    // Filter by property if specified
    if (propertyId) {
      normalizedReviews = normalizedReviews.filter(review => 
        review.propertyId === propertyId || review.propertyName.includes(propertyId)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        source: useMockData ? 'mock' : 'hostaway-api',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews from Hostaway',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
