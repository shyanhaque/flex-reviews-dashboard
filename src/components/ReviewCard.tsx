'use client';

import { NormalizedReview } from '@/types/reviews';
import { useState } from 'react';

interface ReviewCardProps {
  review: NormalizedReview;
  onToggleApproval: (reviewId: number, isApproved: boolean) => void;
}

export function ReviewCard({ review, onToggleApproval }: ReviewCardProps) {
  const [isApproved, setIsApproved] = useState(review.isApprovedForPublic);
  
  const handleToggle = () => {
    const newApprovalStatus = !isApproved;
    setIsApproved(newApprovalStatus);
    onToggleApproval(review.id, newApprovalStatus);
  };
  
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600';
    if (rating >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getStars = (rating: number) => {
    const stars = Math.round(rating / 2); // Convert 10-point to 5-star
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.propertyName}</h3>
          <p className="text-sm text-gray-600">by {review.guestName}</p>
          <p className="text-sm text-gray-500">
            {review.submittedAt instanceof Date 
              ? review.submittedAt.toLocaleDateString() 
              : new Date(review.submittedAt).toLocaleDateString()
            }
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {review.overallRating && (
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${getRatingColor(review.overallRating)}`}>
                {review.overallRating}/10
              </span>
              <span className="text-yellow-400">
                {getStars(review.overallRating)}
              </span>
            </div>
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${
            review.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {review.status}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Category Ratings:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {review.categories.map((category, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600 capitalize">{category.category.replace('_', ' ')}</p>
              <p className={`font-semibold ${getRatingColor(category.rating)}`}>
                {category.rating}/10
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Source:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
            {review.channel}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Show on website:</label>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isApproved ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isApproved ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
