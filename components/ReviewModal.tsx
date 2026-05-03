 'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
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
    const { user, token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userRecord = user as unknown as Record<string, unknown> | null;
    const isVerified = Boolean(
        userRecord && (userRecord['verified'] === true || userRecord['isVerified'] === true || userRecord['emailVerified'] === true)
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

        if (!isVerified) {
            // redirect to verify page
            router.push('/verify');
            return;
        }

        if (rating <= 0 || content.trim().length < 5) {
            alert('Please provide a rating and a short review.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ productId, rating, content }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Failed to submit review');
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
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className={`p-1 ${rating >= s ? 'text-yellow-500' : 'text-gray-400'}`}>
                                <Star />
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
        </div>
    );
}
