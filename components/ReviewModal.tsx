 'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

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
    
    // user info available from AuthContext if needed (kept minimal)

    const StarIcon = ({ active }: { active: boolean }) => (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={`transition-all duration-200 ease-out ${active ? 'scale-110 text-black' : 'scale-95 text-gray-300'}`}
        >
            <path
                d="M12 2.5l2.9 6 6.6.6-5 4.3 1.6 6.3L12 17.8 5.9 20.7 7.5 14.4 2.5 10.1l6.6-.6L12 2.5z"
                fill={active ? 'currentColor' : 'none'}
                stroke={active ? 'currentColor' : 'currentColor'}
                strokeWidth="1.2"
            />
        </svg>
    );

    const handleSubmit = async () => {
        if (isLoading) {
            // still loading auth state — avoid redirecting prematurely
            return;
        }

        if (!isAuthenticated) {
            router.push('/register');
            return;
        }

        if (rating <= 0 || content.trim().length < 5) {
            alert('Please provide a rating and a short review.');
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
            console.log('Submitting feedback', url, payload);

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                let errMsg = text || `HTTP ${res.status}`;
                try {
                    const parsed = JSON.parse(text || '{}');
                    errMsg = parsed.message || JSON.stringify(parsed) || errMsg;
                } catch {
                    // ignore parse errors
                }
                console.error('Feedback submission failed', res.status, errMsg);
                throw new Error(errMsg || 'Failed to submit feedback');
            }

            if (onSubmitted) onSubmitted();
            onClose();
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">Write a Review</h3>
                    <button onClick={onClose} aria-label="Close" className="text-gray-500">✕</button>
                </div>

                <div className="mt-4 flex items-center gap-4">
                    {productImage && (
                        <div className="h-16 w-16 relative">
                            <Image src={productImage} alt={`Image of ${productName}`} fill className="object-contain rounded" />
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-semibold">{productName}</div>
                        <div className="text-xs text-gray-500">Share your thoughts with the community.</div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex items-center gap-2 text-black">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                style={rating >= s ? { animation: 'starPop 220ms ease-out' } : undefined}
                                className="rounded-full p-1 transition-transform duration-150 ease-out hover:scale-110 active:scale-95"
                                aria-label={`Set rating to ${s} stars`}
                            >
                                <StarIcon active={rating >= s} />
                            </button>
                        ))}
                        <div className="text-sm text-gray-500">{rating} / 5</div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        placeholder="Write your review"
                        className="mt-4 w-full rounded border p-3 text-sm"
                    />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded bg-gray-100 px-4 py-2">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
            <style jsx global>{`
            @keyframes starPop {
                0% {
                    transform: scale(0.85);
                }
                60% {
                    transform: scale(1.18);
                }
                100% {
                    transform: scale(1);
                }
            }
        `}</style>
        </div>
    );
}
