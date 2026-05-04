'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star } from 'lucide-react';

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
    const [reviews, setReviews] = useState<Review[]>([]);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [rRes, pRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbacks/get`),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`),
                ]);

                const rData = await rRes.json().catch(() => []);
                const goods = await pRes.json().catch(() => []);
                const found = goods.find((g: any) => String(g.id) === id);

                const allReviews = Array.isArray(rData?.feedbacks) ? rData.feedbacks : Array.isArray(rData) ? rData : [];
                setReviews(allReviews.filter((review: Review) => String(review.goodId) === id));
                setProduct(found || null);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : 0;
    const roundedAvg = Math.round(avg);

    return (
        <main className="min-h-screen bg-white px-4 pt-28 pb-16 text-black">
            <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-12">
                
                {/* Ліва колонка - Інформація про товар (Збільшена) */}
                <aside className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-28 rounded-3xl bg-gray-50 p-8">
                        {product ? (
                            <div>
                                <div className="relative mb-8 h-80 w-full overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                                    <Image 
                                        src={product.main_image_url} 
                                        alt={product.name} 
                                        fill 
                                        className="object-contain" 
                                    />
                                </div>
                                <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>
                                <p className="mt-4 text-3xl font-black">₴ {Number(product.price).toFixed(2)}</p>
                                
                                <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-8">
                                    <div className="text-4xl font-bold">{avg.toFixed(1)}</div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`h-5 w-5 ${i < roundedAvg ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} 
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-1.5 text-sm font-medium text-gray-500">{reviews.length} reviews</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse flex flex-col items-center gap-4">
                                <div className="h-80 w-full bg-gray-200 rounded-2xl"></div>
                                <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Права колонка - Список відгуків */}
                <section className="lg:col-span-7 xl:col-span-8">
                    <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-3xl font-bold">
                            Customer Reviews
                        </h3>
                        <Link 
                            href="/shop" 
                            className="rounded-full bg-gray-100 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
                        >
                            Back to shop
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-gray-100"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {reviews.length === 0 && (
                                <div className="flex h-48 flex-col items-center justify-center rounded-2xl bg-gray-50 text-gray-500">
                                    <Star className="mb-3 h-10 w-10 text-gray-300" />
                                    <p className="text-lg">No reviews yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                            
                            {reviews.map((r) => (
                                <article 
                                    key={r._id || r.id} 
                                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl bg-gray-100 p-6 sm:p-8 transition-all hover:bg-gray-50"
                                >
                                    {/* Аватарка */}
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xl font-bold text-white">
                                        {r.username ? r.username.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    
                                    {/* Контент відгуку */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="font-bold text-lg">{r.username || 'Anonymous'}</div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : ''}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2 flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`h-4 w-4 ${i < r.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} 
                                                />
                                            ))}
                                        </div>
                                        
                                        <p className="mt-4 text-base leading-relaxed text-gray-700">
                                            {r.comment}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
                
            </div>
        </main>
    );
}