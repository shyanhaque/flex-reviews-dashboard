import { NextRequest, NextResponse } from 'next/server';
import { GoogleReview, NormalizedReview } from '@/types/reviews';

// Mock Google Reviews data for exploration
const mockGoogleReviews: GoogleReview[] = [
  {
    author_name: "John Smith",
    rating: 5,
    text: "Great location and excellent service from Flex Living. The apartment was clean and modern with everything we needed for our stay.",
    relative_time_description: "2 weeks ago",
    time: Date.now() - (14 * 24 * 60 * 60 * 1000), // 2 weeks ago
  },
  {
    author_name: "Maria Garcia",
    rating: 4,
    text: "Very comfortable stay. The property management was responsive and helpful. Only minor issue was noise from the street but overall excellent.",
    relative_time_description: "1 month ago", 
    time: Date.now() - (30 * 24 * 60 * 60 * 1000), // 1 month ago
  },
  {
    author_name: "David Chen",
    rating: 5,
    text: "Outstanding experience with Flex Living. Professional service, beautiful apartment, and great location. Highly recommend!",
    relative_time_description: "3 weeks ago",
    time: Date.now() - (21 * 24 * 60 * 60 * 1000), // 3 weeks ago
  }
];

function normalizeGoogleReviews(googleReviews: GoogleReview[], propertyName: string = "Flex Living Property"): NormalizedReview[] {
  return googleReviews.map((review, index) => ({
    id: 8000 + index, // Use different ID range for Google reviews
    source: 'google' as const,
    propertyId: 'google-property',
    propertyName,
    guestName: review.author_name,
    rating: review.rating,
    overallRating: review.rating * 2, // Convert 5-star to 10-point scale
    reviewText: review.text,
    categories: [
      { category: 'overall', rating: review.rating * 2 }
    ],
    submittedAt: new Date(review.time),
    channel: 'Google Reviews',
    type: 'guest-to-host',
    status: 'published' as const,
    isApprovedForPublic: true, // Google reviews are automatically public
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const useMockData = searchParams.get('mock') === 'true' || process.env.NODE_ENV === 'development';
    
    let googleReviews: GoogleReview[];
    
    if (useMockData || !process.env.GOOGLE_PLACES_API_KEY) {
      // Use mock data for development or if API key is not configured
      googleReviews = mockGoogleReviews;
    } else {
      // Fetch from real Google Places API
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }
      
      googleReviews = data.result.reviews || [];
    }
    
    const normalizedReviews = normalizeGoogleReviews(googleReviews);
    
    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        source: useMockData || !process.env.GOOGLE_PLACES_API_KEY ? 'mock' : 'google-places-api',
        timestamp: new Date().toISOString(),
        notes: !process.env.GOOGLE_PLACES_API_KEY ? 
          'Google Places API key not configured. Using mock data for demonstration.' : 
          'Live Google Places API data'
      }
    });
    
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews from Google Places API',
        message: error instanceof Error ? error.message : 'Unknown error',
        notes: 'Google Reviews integration requires a Google Places API key and proper setup.'
      },
      { status: 500 }
    );
  }
}
