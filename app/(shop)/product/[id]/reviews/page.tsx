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

    return (
        <main className="min-h-screen px-4 pt-28 pb-16 bg-white">
            <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
                <aside className="col-span-1 rounded-xl border p-6">
                    {product && (
                        <div>
                            <div className="w-full h-48 relative mb-4">
                                <Image src={product.main_image_url} alt={product.name} fill className="object-contain" />
                            </div>
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <p className="mt-2 text-2xl font-black">₴ {Number(product.price).toFixed(2)}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="text-lg font-semibold">{avg.toFixed(1)}</div>
                                <div className="flex items-center text-black">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} fill="black" color="black" className="h-4 w-4" />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500">({reviews.length} reviews)</div>
                            </div>
                        </div>
                    )}
                </aside>

                <section className="col-span-2 rounded-xl border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Reviews</h3>
                        <Link href="/shop" className="text-sm text-gray-600">Back to shop</Link>
                    </div>

                    {loading ? <div>Loading reviews...</div> : (
                        <div className="space-y-6">
                            {reviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}
                            {reviews.map((r) => (
                                <article key={r._id || r.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">{r.username || 'Anonymous'}</div>
                                        <div className="text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-black">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} fill="black" color="black" className="h-4 w-4" />
                                        ))}
                                    </div>
                                    <p className="mt-3 text-gray-700">{r.comment}</p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
