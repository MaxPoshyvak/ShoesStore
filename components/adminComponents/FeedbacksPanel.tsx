import { Star, CheckCircle } from 'lucide-react';

const mockFeedbacks = [
    {
        id: 1,
        user: 'Іван Петров',
        good: 'Slick casual sneaker shoe',
        rating: 5,
        comment: 'Чудові кросівки, дуже зручні та стильні! Рекомендую.',
        date: '16 Квіт 2026',
        status: 'published',
    },
    {
        id: 2,
        user: 'Олена В.',
        good: 'Nike Dunk Low Retro',
        rating: 4,
        comment: 'Трохи замаломірять, але якість супер. Доставка швидка.',
        date: '15 Квіт 2026',
        status: 'pending',
    },
];

export const FeedbacksPanel = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Модерація відгуків</h2>
            <div className="flex gap-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">1 нове</span>
            </div>
        </div>

        <div className="space-y-4">
            {mockFeedbacks.map((feedback) => (
                <div
                    key={feedback.id}
                    className="p-5 border border-gray-100 rounded-xl hover:border-gray-300 transition-all bg-gray-50/30">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="font-bold text-gray-900">{feedback.user}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Товар: <span className="font-medium text-black">{feedback.good}</span>
                            </p>
                        </div>
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < feedback.rating ? 'currentColor' : 'none'}
                                    color={i < feedback.rating ? 'currentColor' : '#d1d5db'}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 italic">&quot;{feedback.comment}&quot;</p>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{feedback.date}</span>
                        <div className="flex gap-2">
                            {feedback.status === 'pending' ? (
                                <>
                                    <button className="text-xs px-3 py-1.5 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                                        Опублікувати
                                    </button>
                                    <button className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                                        Відхилити
                                    </button>
                                </>
                            ) : (
                                <span className="text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded flex items-center gap-1">
                                    <CheckCircle size={14} /> На сайті
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
