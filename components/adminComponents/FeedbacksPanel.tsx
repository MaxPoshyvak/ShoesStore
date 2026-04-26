import React, { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { fetchFeedbacks, FeedbackType } from '@/utils/backendData/backendFeedbacks';

export const FeedbacksPanel = () => {
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks()
            .then((data) => {
                // Сортуємо так, щоб нові відгуки були зверху (якщо бекенд цього не робить)
                const sortedData = data.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                setFeedbacks(sortedData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error loading feedbacks:', error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={24} className="text-gray-400" />
                    Customer feedback
                </h2>
                <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-bold">
                        Total: {feedbacks.length}
                    </span>
                </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {isLoading ? (
                    <p className="text-center text-gray-500 text-sm py-8">Loading feedbacks...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-8">No feedback yet</p>
                ) : (
                    feedbacks.map((feedback) => (
                        <div
                            key={feedback._id}
                            className="p-5 border border-gray-100 rounded-xl hover:border-black transition-colors bg-white group cursor-default">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-gray-900">{feedback.username}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Product:{' '}
                                        <span className="font-medium text-black group-hover:underline cursor-pointer">
                                            {feedback.goodName || 'Unknown product'}
                                        </span>
                                    </p>
                                </div>
                                {/* Зірочки рейтингу */}
                                <div className="flex text-black">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < feedback.rating ? '#FFD700' : 'none'}
                                            color={i < feedback.rating ? '#FFD703' : '#E5E7EB'}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{feedback.comment}</p>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="text-xs font-medium text-gray-400">
                                    {feedback.createdAt
                                        ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : 'Unknown date'}
                                </span>
                                {/* Оскільки модерації немає, просто показуємо пошту або залишаємо пустим */}
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                    {feedback.userEmail}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
