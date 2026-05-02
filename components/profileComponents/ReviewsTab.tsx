import React from 'react';
import { Star } from 'lucide-react';
import { Review } from './types';

interface ReviewsTabProps {
    reviews: Review[];
}

export function ReviewsTab({ reviews }: ReviewsTabProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-6">My Reviews</h2>

            {!reviews || reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">You haven&apos;t written any reviews yet.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-sm text-gray-900">{review.productName}</h4>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={14}
                                            className={
                                                star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">&quot;{review.text}&quot;</p>
                            <p className="text-xs text-gray-400 mt-4">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
