import React from 'react';
import { Star } from 'lucide-react';
import { Review } from './types';
import Link from 'next/link';

interface ReviewsTabProps {
    reviews: Review[];
}

export function ReviewsTab({ reviews }: ReviewsTabProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">My Reviews</h2>

            {!reviews || reviews.length === 0 ? (
                <div className="text-center py-10 sm:py-16 text-gray-400">
                    <p className="text-base sm:text-lg">You have not written any reviews yet.</p>
                    <p className="text-sm mt-2 text-gray-300">Review products you have purchased to help others.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                                <Link
                                    href={`/product/${review.goodId}`}
                                    className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                                    {review.productName}
                                </Link>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={12}
                                            className={
                                                star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                &ldquo;{review.text}&rdquo;
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4">
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
