'use client';

import { useState, useEffect } from 'react';
import { NormalizedReview } from '@/types/reviews';
import Link from 'next/link';

export default function PropertiesPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/hostaway?mock=true');
      const data = await response.json();
      
      if (data.success) {
        // Convert date strings back to Date objects and filter approved reviews
        const reviewsWithDates = data.data
          .map((review: any) => ({
            ...review,
            submittedAt: new Date(review.submittedAt)
          }))
          .filter((review: NormalizedReview) => review.isApprovedForPublic);
        setReviews(reviewsWithDates);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const getUniqueProperties = () => {
    const propertyMap = new Map();
    
    reviews.forEach(review => {
      if (!propertyMap.has(review.propertyName)) {
        propertyMap.set(review.propertyName, {
          name: review.propertyName,
          id: review.propertyId,
          reviews: []
        });
      }
      propertyMap.get(review.propertyName).reviews.push(review);
    });
    
    return Array.from(propertyMap.values());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const properties = getUniqueProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Flex Living Properties</h1>
              <p className="text-gray-600">Discover our premium accommodations</p>
            </div>
            <Link 
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Manager Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {properties.map(property => (
            <div key={property.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Property Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h2 className="text-xl font-bold mb-2">{property.name}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-yellow-300 text-lg">★</span>
                    <span className="ml-1">
                      {(property.reviews.reduce((sum: number, r: NormalizedReview) => 
                        sum + (r.overallRating || 0), 0) / property.reviews.length / 2).toFixed(1)}/5
                    </span>
                  </div>
                  <span className="text-blue-100">({property.reviews.length} reviews)</span>
                </div>
              </div>
              
              {/* Property Image Placeholder */}
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Property Image Placeholder</span>
              </div>
              
              {/* Property Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About this property</h3>
                  <p className="text-gray-600">
                    Modern, fully-furnished accommodation in a prime location. 
                    Perfect for business travelers and extended stays.
                  </p>
                </div>
                
                {/* Reviews Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Reviews</h3>
                  <div className="space-y-4">
                    {property.reviews.slice(0, 3).map((review: NormalizedReview) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{review.guestName}</p>
                            <p className="text-sm text-gray-500">
                              {review.submittedAt instanceof Date 
                                ? review.submittedAt.toLocaleDateString() 
                                : new Date(review.submittedAt).toLocaleDateString()
                              }
                            </p>
                          </div>
                          <div className="flex items-center">
                            {review.overallRating && (
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">
                                  {'★'.repeat(Math.round(review.overallRating / 2))}
                                  {'☆'.repeat(5 - Math.round(review.overallRating / 2))}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {Math.round(review.overallRating / 2)}/5
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.reviewText}
                        </p>
                        
                        {/* Category highlights */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {review.categories.slice(0, 3).map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              {category.category.replace('_', ' ')}: {category.rating}/10
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {property.reviews.length > 3 && (
                      <div className="text-center pt-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Show {property.reviews.length - 3} more reviews
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium">
                    Book This Property
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No approved reviews to display yet.</p>
            <Link 
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to dashboard to approve reviews
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
