'use client';

import { useState, useEffect } from 'react';
import { NormalizedReview, PropertySummary } from '@/types/reviews';
import { ReviewCard } from '@/components/ReviewCard';

export default function Dashboard() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'property'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  
  const properties = Array.from(new Set(reviews.map(r => r.propertyName)));
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews/hostaway?mock=true');
      const data = await response.json();
      
      if (data.success) {
        // Convert date strings back to Date objects
        const reviewsWithDates = data.data.map((review: any) => ({
          ...review,
          submittedAt: new Date(review.submittedAt)
        }));
        setReviews(reviewsWithDates);
      } else {
        setError(data.error || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError('Network error while fetching reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleApproval = (reviewId: number, isApproved: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isApprovedForPublic: isApproved }
        : review
    ));
  };
  
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (selectedProperty !== 'all' && review.propertyName !== selectedProperty) return false;
      if (filterStatus === 'approved' && !review.isApprovedForPublic) return false;
      if (filterStatus === 'pending' && review.isApprovedForPublic) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'rating':
          return (b.overallRating || 0) - (a.overallRating || 0);
        case 'property':
          return a.propertyName.localeCompare(b.propertyName);
        default:
          return 0;
      }
    });
  
  const getPropertySummary = (): PropertySummary[] => {
    const summaryMap = new Map<string, PropertySummary>();
    
    reviews.forEach(review => {
      if (!summaryMap.has(review.propertyName)) {
        summaryMap.set(review.propertyName, {
          propertyId: review.propertyId,
          propertyName: review.propertyName,
          totalReviews: 0,
          averageRating: 0,
          approvedReviews: 0,
          pendingReviews: 0,
          recentReviews: []
        });
      }
      
      const summary = summaryMap.get(review.propertyName)!;
      summary.totalReviews++;
      
      if (review.isApprovedForPublic) {
        summary.approvedReviews++;
      } else {
        summary.pendingReviews++;
      }
      
      summary.recentReviews.push(review);
    });
    
    // Calculate averages and sort recent reviews
    summaryMap.forEach(summary => {
      const ratings = summary.recentReviews
        .map(r => r.overallRating)
        .filter(r => r !== null && r !== undefined) as number[];
      
      summary.averageRating = ratings.length > 0 
        ? Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length * 10) / 10
        : 0;
      
      summary.recentReviews = summary.recentReviews
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 3);
    });
    
    return Array.from(summaryMap.values()).sort((a, b) => b.totalReviews - a.totalReviews);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={fetchReviews}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reviews Dashboard</h1>
              <p className="text-gray-600">Manage and review guest feedback</p>
            </div>
            <div className="text-sm text-gray-500">
              {reviews.length} total reviews • {reviews.filter(r => r.isApprovedForPublic).length} approved
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Property Summary Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPropertySummary().map(property => (
              <div key={property.propertyName} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium text-gray-900 mb-2">{property.propertyName}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{property.totalReviews}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{property.approvedReviews}</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{property.averageRating}/10</div>
                    <div className="text-xs text-gray-500">Avg Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Properties</option>
                {properties.map(property => (
                  <option key={property} value={property}>{property}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Latest First</option>
                <option value="rating">Highest Rating</option>
                <option value="property">Property Name</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reviews</option>
                <option value="approved">Approved Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onToggleApproval={handleToggleApproval}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
