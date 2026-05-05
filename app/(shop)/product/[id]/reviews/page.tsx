'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Star, ChevronLeft, MessageSquareOff } from 'lucide-react';
import { Good } from '@/types/backendTypes';

type Review = {
    _id?: string;
    id?: string;
    goodId: string;
    rating: number;
    comment: string;
    username?: string;
    createdAt?: string;
};

export default function ReviewsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [product, setProduct] = useState<Good | null>(null);
    const [loading, setLoading] = useState(true);

    const backToProduct = () => {
        router.back();
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [rRes, pRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbacks/get`),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods/${id}`),
                ]);

                const rData = await rRes.json().catch(() => []);
                const data = await pRes.json().catch(() => []);

                const allReviews = Array.isArray(rData?.feedbacks)
                    ? rData.feedbacks
                    : Array.isArray(rData)
                      ? rData
                      : [];
                setReviews(allReviews.filter((review: Review) => String(review.goodId) === id));
                setProduct(data.good || null);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const avg = reviews.length ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length : 0;
    const roundedAvg = Math.round(avg);

    return (
        <main className="min-h-screen bg-white px-4 pt-24 lg:pt-32 pb-16 lg:pb-24 font-sans text-black">
            <div className="mx-auto max-w-7xl">
                {/* Кнопка "Назад" */}
                <button
                    onClick={backToProduct}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black mb-8 lg:mb-12">
                    <ChevronLeft className="h-4 w-4" /> Back to product
                </button>

                <div className="grid gap-12 md:gap-16 lg:grid-cols-[0.8fr_1.2fr] items-start">
                    {/* Ліва колонка - Інформація про товар (Sticky) */}
                    <aside className="lg:sticky lg:top-32">
                        {product ? (
                            <div className="flex flex-col">
                                {/* Фото товару як на головній (Без відступів, object-cover) */}
                                <div className="relative mb-6 lg:mb-8 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                                    <Image
                                        src={product.main_image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 40vw"
                                        priority
                                    />
                                </div>

                                <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
                                    {product.category || 'Woman'}
                                </span>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-black">
                                    {product.name}
                                </h2>
                                <p className="mt-3 text-2xl lg:text-3xl font-extrabold text-black">
                                    ₴ {Number(product.price).toFixed(2)}
                                </p>

                                {/* Блок із зірками */}
                                <div className="mt-8 lg:mt-10 flex items-center gap-5 border-t border-gray-100 pt-8">
                                    <div className="text-5xl font-black tracking-tighter">{avg.toFixed(1)}</div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < roundedAvg ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            Based on {reviews.length} reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse flex flex-col">
                                <div className="aspect-square w-full bg-gray-100 rounded-xl mb-6"></div>
                                <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
                            </div>
                        )}
                    </aside>

                    {/* Права колонка - Список відгуків */}
                    <section>
                        <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-6">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Customer Reviews</h1>
                        </div>

                        {loading ? (
                            <div className="flex flex-col">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="py-8 border-b border-gray-100 w-full animate-pulse flex gap-6">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0"></div>
                                        <div className="w-full space-y-3 pt-2">
                                            <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-1/6 bg-gray-100 rounded"></div>
                                            <div className="h-16 w-full bg-gray-100 rounded mt-4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {reviews.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 lg:py-32 text-center">
                                        <MessageSquareOff className="mb-4 h-12 w-12 text-gray-300 stroke-[1.5]" />
                                        <h3 className="text-xl font-bold text-black mb-2">No reviews yet</h3>
                                        <p className="text-base text-gray-500">
                                            Be the first to share your thoughts on this product!
                                        </p>
                                    </div>
                                )}

                                {reviews.map((r) => (
                                    <article
                                        key={r._id || r.id}
                                        className="flex flex-col sm:flex-row gap-5 sm:gap-6 py-8 border-b border-gray-100 last:border-0">
                                        {/* Аватарка */}
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                                            {r.username ? r.username.charAt(0).toUpperCase() : 'A'}
                                        </div>

                                        {/* Контент відгуку */}
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                                                <h4 className="font-bold text-lg text-black">
                                                    {r.username || 'Anonymous'}
                                                </h4>
                                                <span className="text-sm font-semibold text-gray-400">
                                                    {r.createdAt
                                                        ? new Date(r.createdAt).toLocaleDateString('en-US', {
                                                              year: 'numeric',
                                                              month: 'long',
                                                              day: 'numeric',
                                                          })
                                                        : ''}
                                                </span>
                                            </div>

                                            <div className="mb-4 flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < r.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>

                                            <p className="text-base leading-relaxed text-gray-600">{r.comment}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
