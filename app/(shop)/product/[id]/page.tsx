'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { unauthorized, useParams, useSearchParams } from 'next/navigation';
import { ChevronLeft, Heart, Minus, Plus } from 'lucide-react';
import ReviewModal from '@/components/ReviewModal';
import { useCart } from '@/components/context/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { addToFavorites, removeFromFavorites } from '@/utils/backendData/backendFavorites';
import router from 'next/router';

type Good = {
    id: number;
    name: string;
    price: number;
    old_price?: number | null;
    description?: string | null;
    main_image_url: string;
    stock_quantity: number;
    sizes?: (string | number)[];
    is_new?: boolean;
    category?: string;
};

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const { addToCart, cartItems } = useCart();
    const imageId = useId();
    const router = useRouter();

    const [product, setProduct] = useState<Good | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showSizeError, setShowSizeError] = useState(false);
    const { isLoading: authLoading, user } = useAuth();
    const searchParams = useSearchParams();

    const handleOpenReview = () => {
        if (authLoading) return;

        setShowReviewModal(true);
    };

    const toggleFavourite = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsFavorite(!isFavorite);
        try {
            if (!isFavorite) {
                await addToFavorites(product?.id ?? 0);
            } else {
                await removeFromFavorites(product?.id ?? 0);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setIsFavorite(isFavorite);
        }
    };

    useEffect(() => {
        try {
            const open = searchParams?.get('openReview');
            if (open === '1') {
                setShowReviewModal(true);
            }
        } catch (e) {
            console.error(e);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                // 1. Створюємо запит на конкретний товар
                const productPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods/${params.id}`).then(
                    (res) => {
                        if (!res.ok) throw new Error('Failed to load product');
                        return res.json();
                    },
                );

                // 2. Створюємо запит на улюблені (тільки якщо є токен)
                const token = localStorage.getItem('token');
                let favoritesPromise = Promise.resolve({ favorites: [] }); // Заглушка

                if (token) {
                    favoritesPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites/get`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.json());
                }

                // 3. 🔥 ЧЕКАЄМО ОБИДВА ЗАПИТИ ОДНОЧАСНО
                const [productData, favoritesData] = await Promise.all([productPromise, favoritesPromise]);

                // 4. Записуємо товар у стейт (як ти і робив: data.good)
                setProduct(productData.good);

                // 5. Перевіряємо, чи є ЦЕЙ товар в улюблених, і одразу ставимо лайк
                if (favoritesData && Array.isArray(favoritesData.favorites)) {
                    const isLiked = favoritesData.favorites.some(
                        (fav: { goodId: number }) => fav.goodId === Number(params.id),
                    );
                    setIsFavorite(isLiked);
                } else {
                    setIsFavorite(false);
                }
            } catch (error) {
                console.error('Failed to load product and favorites:', error);
                setProduct(null);
            } finally {
                setIsLoading(false); // Вимикаємо скелетони тільки після всього!
            }
        };

        loadData();
    }, [params.id, user]); // 🔥 Додай `user` в масив залежностей (щоб лайк підтягнувся, якщо юзер залогіниться прямо на сторінці)

    const sizes = useMemo(() => product?.sizes?.map((s) => String(s)) || [], [product]);

    const cartQuantityForProduct = useMemo(() => {
        if (!product) return 0;
        return cartItems.filter((item) => String(item.id) === String(product.id)).reduce((t, i) => t + i.quantity, 0);
    }, [cartItems, product]);

    const remainingStock = product ? Math.max(product.stock_quantity - cartQuantityForProduct, 0) : 0;
    const isOutOfStock = remainingStock <= 0;
    const displayPrice = product ? Number(product.price) : 0;
    const displayOldPrice = product?.old_price == null ? null : Number(product.old_price);

    const flyToCart = () => {
        const cartTarget = document.getElementById('cart-icon-target');
        const productImage = document.getElementById(imageId);
        if (!cartTarget || !productImage) return;

        const cartRect = cartTarget.getBoundingClientRect();
        const imgRect = productImage.getBoundingClientRect();

        const flyingImg = document.createElement('img');
        flyingImg.src = product!.main_image_url;
        flyingImg.style.position = 'fixed';
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;
        flyingImg.style.objectFit = 'contain';
        flyingImg.style.zIndex = '2147483647';
        flyingImg.style.borderRadius = '12px'; // Трохи менше заокруглення для анімації
        flyingImg.style.pointerEvents = 'none';
        flyingImg.style.transition = 'none';

        document.body.appendChild(flyingImg);

        setTimeout(() => {
            flyingImg.style.transition = 'all 1.1s cubic-bezier(0.4, 0, 0.2, 1)';
            flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
            flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
            flyingImg.style.width = '20px';
            flyingImg.style.height = '20px';
            flyingImg.style.opacity = '0.2';
        }, 10);

        setTimeout(() => {
            if (document.body.contains(flyingImg)) flyingImg.remove();
        }, 1200);
    };

    const handleAddToCart = () => {
        if (!product || isOutOfStock) return;

        if (!selectedSize && sizes.length > 0) {
            setShowSizeError(true);
            return;
        }

        setShowSizeError(false);
        addToCart({
            id: String(product.id),
            name: product.name,
            price: product.price,
            image: product.main_image_url,
            quantity,
            stock_quantity: product.stock_quantity,
            size: selectedSize,
            sizes: product.sizes || [],
        });

        setIsAdded(true);
        flyToCart();
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        setShowSizeError(false);
    };

    const handleIncreaseQuantity = () => setQuantity((p) => Math.min(remainingStock, p + 1));
    const handleDecreaseQuantity = () => setQuantity((p) => Math.max(1, p - 1));

    useEffect(() => setQuantity((p) => Math.min(p, Math.max(remainingStock, 1))), [remainingStock]);

    if (isLoading)
        return (
            <main className="min-h-screen bg-white px-4 pt-24 lg:pt-32 pb-16 font-sans">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="h-4 w-32 rounded bg-gray-200 mb-6 lg:mb-8" />
                    <div className="grid gap-8 md:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                        <div className="aspect-square w-full rounded-xl bg-gray-100" />
                        <div className="space-y-6 pt-2 lg:pt-4">
                            <div className="h-6 w-1/4 rounded bg-gray-200" />
                            <div className="h-10 w-3/4 rounded bg-gray-200" />
                            <div className="h-8 w-1/3 rounded bg-gray-200" />
                            <div className="h-32 rounded-xl bg-gray-100 mt-8" />
                        </div>
                    </div>
                </div>
            </main>
        );

    if (!product)
        return (
            <main className="min-h-screen bg-white px-4 flex flex-col items-center justify-center font-sans">
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-400">404 Error</p>
                    <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-black">Shoe Not Found</h1>
                    <p className="mt-4 text-gray-500 text-sm md:text-base">
                        The item you are looking for does not exist or has been removed.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-6 md:px-8 py-3 md:py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-gray-800">
                        <ChevronLeft className="h-4 w-4" /> Back to Shop
                    </Link>
                </div>
            </main>
        );

    return (
        <main className="min-h-screen bg-white px-4 pt-24 lg:pt-32 pb-16 lg:pb-24 font-sans">
            <div className="mx-auto max-w-7xl">
                {/* Breadcrumbs */}
                <div
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black mb-6 lg:mb-8">
                    <ChevronLeft className="h-4 w-4" /> Back
                </div>

                {/* 
                    Адаптивна сітка: 
                    - 1 колонка на мобільних (grid-cols-1)
                    - 2 колонки на великих (lg:grid-cols-[0.9fr_1.1fr]) -> Фотографія займає трохи менше місця, ніж текст
                */}
                <div className="grid gap-8 md:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    {/* Left: Product Image (Адаптивне фото із меншим заокругленням) */}
                    <section className="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden self-start">
                        {product.is_new && (
                            <div className="absolute left-4 top-4 lg:left-6 lg:top-6 z-10 rounded-full bg-black px-3 py-1.5 lg:px-4 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                                New
                            </div>
                        )}
                        <Image
                            id={imageId}
                            src={product.main_image_url}
                            alt={product.name}
                            fill
                            className={`object-cover transition duration-500 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            priority
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
                                <span className="rounded-xl bg-white px-5 py-2.5 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold uppercase tracking-widest text-black shadow-lg">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </section>

                    {/* Right: Product Details */}
                    <section className="flex flex-col pt-2 lg:pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-gray-400">
                                {product.category || 'Sneakers'}
                            </span>
                            <span
                                className={`text-xs lg:text-sm font-semibold ${remainingStock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                                {remainingStock > 0 ? `${remainingStock} left in stock` : 'Unavailable'}
                            </span>
                        </div>

                        {/* Адаптивний заголовок */}
                        <h1 className="mt-3 lg:mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-black leading-tight">
                            {product.name}
                        </h1>

                        <div className="mt-4 lg:mt-6 flex items-end gap-3 lg:gap-4">
                            <p className="text-2xl lg:text-3xl font-extrabold text-black">
                                ₴ {displayPrice.toFixed(2)}
                            </p>
                            {displayOldPrice !== null && displayOldPrice > displayPrice && (
                                <p className="mb-0.5 lg:mb-1 text-base lg:text-lg font-semibold text-gray-400 line-through">
                                    ₴ {displayOldPrice.toFixed(2)}
                                </p>
                            )}
                        </div>

                        <p className="mt-5 lg:mt-6 text-sm lg:text-base leading-relaxed text-gray-600 max-w-lg">
                            {product.description ||
                                'Elevate your daily style with these premium sneakers. Designed for ultimate comfort and durability, whether you are hitting the gym or the city streets.'}
                        </p>

                        {/* Size Selection */}
                        <div className="mt-8 lg:mt-10">
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                                <h2 className="text-xs lg:text-sm font-bold uppercase tracking-wider text-black">
                                    Select Size
                                </h2>
                            </div>

                            {/* Адаптивна сітка розмірів */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2.5 lg:gap-3">
                                {sizes.length > 0 ? (
                                    sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeSelect(size)}
                                            className={`flex h-10 lg:h-12 items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 bg-white text-black hover:border-gray-400'
                                            }`}>
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full rounded-xl border border-dashed border-gray-300 px-4 py-4 text-sm font-medium text-center text-gray-500">
                                        One Size
                                    </div>
                                )}
                            </div>
                            {showSizeError && (
                                <p className="mt-3 text-xs lg:text-sm font-semibold text-red-500">
                                    Please select a size to continue.
                                </p>
                            )}
                        </div>

                        {/* Actions: QTY, Cart, Favorite */}
                        <div className="mt-8 lg:mt-10 flex flex-wrap sm:flex-nowrap items-center gap-3 lg:gap-4">
                            {/* Quantity */}
                            <div className="flex h-12 lg:h-14 w-28 lg:w-32 items-center justify-between rounded-xl border border-gray-200 bg-white px-1 lg:px-2 shrink-0">
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:text-black transition"
                                    onClick={handleDecreaseQuantity}
                                    disabled={isOutOfStock}>
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm lg:text-base font-bold text-black">{quantity}</span>
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:text-black transition"
                                    onClick={handleIncreaseQuantity}
                                    disabled={isOutOfStock || quantity >= remainingStock}>
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-1 flex h-12 lg:h-14 items-center justify-center gap-2 lg:gap-3 rounded-xl bg-black px-4 lg:px-8 text-sm lg:text-base font-bold uppercase tracking-wider text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500">
                                {isOutOfStock ? 'Notify Me' : isAdded ? 'Added ✓' : 'Add to Cart'}
                            </button>

                            {/* Favorite */}
                            <button
                                type="button"
                                onClick={toggleFavourite}
                                className={`flex h-12 w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-xl border transition ${isFavorite ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-gray-800 hover:text-black'}`}
                                aria-label="Add to favorites">
                                <Heart className={`h-4 w-4 lg:h-5 lg:w-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Secondary Links (Reviews) */}
                        <div className="mt-8 lg:mt-10 flex items-center gap-4 lg:gap-6 border-t border-gray-100 pt-6 lg:pt-8">
                            <button
                                onClick={handleOpenReview}
                                className="text-xs lg:text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition">
                                Write a Review
                            </button>
                            <div className="h-3 lg:h-4 w-px bg-gray-300"></div>
                            <Link
                                href={`/product/${product.id}/reviews`}
                                className="text-xs lg:text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition">
                                See All Reviews
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            {showReviewModal && (
                <ReviewModal
                    productId={String(product.id)}
                    productName={product.name}
                    productImage={product.main_image_url}
                    onClose={() => setShowReviewModal(false)}
                    onSubmitted={() => {
                        /* optionally refresh reviews */
                    }}
                />
            )}
        </main>
    );
}
