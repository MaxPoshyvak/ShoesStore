'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, CheckCircle2, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';

type Good = {
    id: string | number;
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

    const [product, setProduct] = useState<Good | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`);
                if (!response.ok) throw new Error('Failed to load product');
                const goods: Good[] = await response.json();
                const found = goods.find((item) => String(item.id) === params.id);
                setProduct(found || null);
            } catch (error) {
                console.error('Failed to load product', error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [params.id]);

    const sizes = useMemo(() => {
        return product?.sizes?.map((size) => String(size)) || [];
    }, [product]);

    const cartQuantityForProduct = useMemo(() => {
        if (!product) return 0;

        return cartItems
            .filter((item) => String(item.id) === String(product.id))
            .reduce((total, item) => total + item.quantity, 0);
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
        flyingImg.style.borderRadius = '20px';
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
            if (document.body.contains(flyingImg)) {
                flyingImg.remove();
            }
        }, 1200);
    };

    const handleAddToCart = () => {
        if (!product || isOutOfStock || !selectedSize) return;

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
    };

    const handleIncreaseQuantity = () => {
        setQuantity((prev) => Math.min(remainingStock, prev + 1));
    };

    const handleDecreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    useEffect(() => {
        setQuantity((prev) => Math.min(prev, Math.max(remainingStock, 1)));
    }, [remainingStock]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white px-4 pt-28 pb-16">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="h-6 w-32 rounded bg-gray-200" />
                    <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="h-135 rounded-3xl bg-gray-100" />
                        <div className="space-y-4 rounded-3xl bg-gray-100 p-8">
                            <div className="h-8 w-3/4 rounded bg-gray-200" />
                            <div className="h-5 w-1/2 rounded bg-gray-200" />
                            <div className="h-32 rounded bg-gray-200" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-white px-4 pt-28 pb-16">
                <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">Product not found</p>
                    <h1 className="mt-4 text-3xl font-black text-gray-900">We could not find this shoe</h1>
                    <p className="mt-3 text-gray-500">The item may have been removed or the link is invalid.</p>
                    <Link
                        href="/shop"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                        <ChevronLeft className="h-4 w-4" /> Back to shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f8f6] px-4 pt-28 pb-16">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-black">
                    <ChevronLeft className="h-4 w-4" /> Back to shop
                </Link>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="relative overflow-hidden rounded-4xl bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
                        {product.is_new && (
                            <div className="absolute left-6 top-6 z-10 rounded-full bg-black px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                                New
                            </div>
                        )}
                        <div className="relative aspect-[1.1/1] w-full">
                            <Image
                                id={imageId}
                                src={product.main_image_url}
                                alt={product.name}
                                fill
                                className={`object-contain p-8 transition duration-300 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                                    <span className="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white shadow-lg">
                                        Notice
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                                {product.category || 'Sneakers'}
                            </span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                                {remainingStock > 0 ? `${remainingStock} left` : 'Out of stock'}
                            </span>
                        </div>

                        <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950">{product.name}</h1>

                        <div className="mt-4 flex items-end gap-4">
                            <p className="text-3xl font-black text-black">₴ {displayPrice.toFixed(2)}</p>
                            {displayOldPrice !== null && displayOldPrice > displayPrice && (
                                <p className="pb-1 text-lg font-semibold text-gray-400 line-through">
                                    ₴ {displayOldPrice.toFixed(2)}
                                </p>
                            )}
                        </div>

                        <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
                            {product.description || 'No description provided for this product yet.'}
                        </p>

                        <div className="mt-8">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                                    Choose size
                                </h2>
                                <span className="text-sm text-gray-500">Required</span>
                            </div>

                            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                                {sizes.length > 0 ? (
                                    sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                                            }`}>
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                                        Sizes are not available for this product.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Quantity</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white transition hover:border-black"
                                        onClick={handleDecreaseQuantity}>
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-base font-bold">{quantity}</span>
                                    <button
                                        type="button"
                                        className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white transition hover:border-black"
                                        onClick={handleIncreaseQuantity}
                                        disabled={isOutOfStock || quantity >= remainingStock}>
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Favourite</p>
                                <button
                                    type="button"
                                    onClick={() => setIsFavorite((prev) => !prev)}
                                    className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                        isFavorite
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-black'
                                    }`}>
                                    <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                                    {isFavorite ? 'Added to favourite' : 'Add to favourite'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || !selectedSize}
                            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300">
                            <ShoppingCart className="h-5 w-5" />
                            {isOutOfStock ? 'Notify' : isAdded ? 'Added to cart' : 'Add to cart'}
                        </button>

                        {!selectedSize && sizes.length > 0 && (
                            <p className="mt-3 text-sm text-amber-600">
                                Please choose a size before adding the product.
                            </p>
                        )}

                        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                Selected size: {selectedSize || 'none'}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
