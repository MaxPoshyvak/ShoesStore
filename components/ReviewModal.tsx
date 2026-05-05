'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { unauthorized } from '@/utils/backendData/401Error';

export default function ReviewModal({
    productId,
    productName,
    productImage,
    onClose,
    onSubmitted,
}: {
    productId: string;
    productName?: string;
    productImage?: string;
    onClose: () => void;
    onSubmitted?: () => void;
}) {
    const { token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Іконка зірки з чорним кольором для активного стану
    const StarIcon = ({ active }: { active: boolean }) => (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={`transition-all duration-200 ease-out ${
                active ? 'scale-110 text-black' : 'scale-95 text-gray-300'
            }`}>
            <path
                d="M12 2.5l2.9 6 6.6.6-5 4.3 1.6 6.3L12 17.8 5.9 20.7 7.5 14.4 2.5 10.1l6.6-.6L12 2.5z"
                fill={active ? 'currentColor' : 'none'}
                stroke={active ? 'currentColor' : 'currentColor'}
                strokeWidth="1.2"
            />
        </svg>
    );

    const handleSubmit = async () => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/register');
            return;
        }

        if (rating <= 0 || content.trim().length < 5) {
            alert('Please provide a rating and a short review (min 5 characters).');
            return;
        }

        setIsSubmitting(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbacks/add`;
            const payload = {
                comment: content.trim(),
                rating,
                goodId: String(productId),
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) unauthorized();

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                let errMsg = text || `HTTP ${res.status}`;
                try {
                    const parsed = JSON.parse(text || '{}');
                    errMsg = parsed.message || JSON.stringify(parsed) || errMsg;
                } catch {
                    // ігноруємо помилки парсингу
                }
                throw new Error(errMsg || 'Failed to submit feedback');
            }

            if (onSubmitted) onSubmitted();
            onClose();
            router.push(`/product/${productId}/reviews`);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Затемнений фон з легким блюром */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Контейнер модального вікна */}
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
                {/* Хедер модалки */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Інформація про товар */}
                <div className="mt-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                    {productImage && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white p-1 shadow-sm">
                            <Image src={productImage} alt={`Image of ${productName}`} fill className="object-contain" />
                        </div>
                    )}
                    <div>
                        <div className="text-base font-bold text-gray-900">{productName}</div>
                        <div className="mt-1 text-sm text-gray-500">Share your thoughts with the community.</div>
                    </div>
                </div>

                {/* Вибір рейтингу та введення відгуку */}
                <div className="mt-8">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    style={
                                        rating >= s
                                            ? { animation: 'starPop 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
                                            : undefined
                                    }
                                    className="rounded-full p-1 transition-transform duration-150 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                    aria-label={`Set rating to ${s} stars`}>
                                    <StarIcon active={rating >= s} />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            {rating > 0 ? `${rating} / 5` : 'Select a rating'}
                        </span>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        placeholder="What did you like or dislike? What should other shoppers know before buying?"
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>

                {/* Кнопки дій */}
                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center justify-center rounded-lg bg-black px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes starPop {
                    0% {
                        transform: scale(0.85);
                    }
                    50% {
                        transform: scale(1.25);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
