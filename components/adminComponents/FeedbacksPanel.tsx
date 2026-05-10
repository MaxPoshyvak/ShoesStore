import React, { useEffect, useMemo, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { fetchFeedbacks, FeedbackType } from '@/utils/backendData/backendFeedbacks';

export const FeedbacksPanel = ({ searchInp }: { searchInp: string }) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data = await fetchFeedbacks();
                const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setFeedbacks(sorted);
            } catch (error) {
                console.error('Error loading feedbacks:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const filteredFeedbacks = useMemo(() => {
        if (!searchInp) return feedbacks; // Якщо пошук пустий — повертаємо всіх

        const query = searchInp.toLowerCase();
        return feedbacks.filter(
            (feedbacks) =>
                (feedbacks.username?.toLowerCase() || '').includes(query) ||
                (feedbacks.comment?.toLowerCase() || '').includes(query) ||
                (feedbacks.createdAt?.toLowerCase() || '').includes(query) ||
                (feedbacks.goodName?.toLowerCase() || '').includes(query) ||
                (feedbacks.userEmail?.toLowerCase() || '').includes(query),
        );
    }, [feedbacks, searchInp]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
                            <MessageSquare size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-gray-900">Customer Feedback</h2>
                            <p className="text-[12px] text-gray-400 mt-0.5">
                                {filteredFeedbacks.length} review{filteredFeedbacks.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feedback list */}
                <div className="p-6 space-y-3 max-h-160 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                            <p className="text-sm text-gray-400">Loading feedbacks…</p>
                        </div>
                    ) : filteredFeedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                            <MessageSquare size={32} className="text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">No feedback yet</p>
                        </div>
                    ) : (
                        filteredFeedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                className="p-5 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-150 group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">{feedback.username}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Product:{' '}
                                            <span className="font-medium text-gray-600 group-hover:text-gray-900 transition-colors cursor-pointer">
                                                {feedback.goodName ?? 'Unknown product'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < feedback.rating ? '#F59E0B' : 'none'}
                                                color={i < feedback.rating ? '#F59E0B' : '#E5E7EB'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{feedback.comment}</p>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <span className="text-[11px] font-medium text-gray-400">
                                        {feedback.createdAt
                                            ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : 'Unknown date'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">{feedback.userEmail}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
