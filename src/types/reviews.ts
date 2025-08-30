export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

export interface NormalizedReview {
  id: number;
  source: 'hostaway' | 'google';
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number | null;
  overallRating?: number;
  reviewText: string;
  categories: ReviewCategory[];
  submittedAt: Date | string; // Can be Date object or ISO string
  channel: string;
  type: string;
  status: 'published' | 'pending' | 'hidden';
  isApprovedForPublic: boolean;
}

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PropertySummary {
  propertyId: string;
  propertyName: string;
  totalReviews: number;
  averageRating: number;
  approvedReviews: number;
  pendingReviews: number;
  recentReviews: NormalizedReview[];
}
