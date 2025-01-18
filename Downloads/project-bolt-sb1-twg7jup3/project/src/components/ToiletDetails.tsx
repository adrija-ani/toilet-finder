import React from 'react';
import { Star, ArmchairIcon as WheelchairIcon, Users, ShowerHead as Shower } from 'lucide-react';
import type { ToiletLocation, Review } from '../types';

interface ToiletDetailsProps {
  toilet: ToiletLocation;
  onClose: () => void;
}

export default function ToiletDetails({ toilet, onClose }: ToiletDetailsProps) {
  const handleNavigate = () => {
    if (toilet.position) {
      // Open in OpenStreetMap
      window.open(
        `https://www.openstreetmap.org/directions?from=&to=${toilet.position.lat},${toilet.position.lng}`,
        '_blank'
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{toilet.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-500" size={20} />
          <span>{toilet.hygieneRating}/5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{toilet.paid ? 'Paid' : 'Free'}</span>
        </div>
        {toilet.wheelchairAccessible && (
          <div className="flex items-center gap-2">
            <WheelchairIcon size={20} />
            <span>Accessible</span>
          </div>
        )}
        {toilet.familyFriendly && (
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>Family Friendly</span>
          </div>
        )}
        {toilet.showers && (
          <div className="flex items-center gap-2">
            <Shower size={20} />
            <span>Showers Available</span>
          </div>
        )}
      </div>

      <button
        onClick={handleNavigate}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-6"
      >
        Get Directions
      </button>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>
        {toilet.reviews.length > 0 ? (
          <div className="space-y-4">
            {toilet.reviews.map((review: Review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-1">- {review.userName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Nearby Bus Stops</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium">Central Bus Stop</h4>
            <p className="text-sm text-gray-500">200m away</p>
            <div className="mt-2">
              <p className="text-sm font-medium">Next buses:</p>
              <div className="flex gap-2 mt-1">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Route 101 - 5 min
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Route 202 - 12 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}