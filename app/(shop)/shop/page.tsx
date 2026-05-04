'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../../components/BestSelling.module.css';
import BestSellingCard from '../../../components/BestSellingCard/BestSellingCard';
import { BestSellingCardSkeleton } from '@/components/BestSellingCard/BestSellingCardSkeleton';
import { useAuth } from '@/components/AuthContext'; // 🔥 Імпортуємо контекст (перевір шлях, якщо він інший)

const categories = ['Man', 'Woman', 'Boy', 'Child'];

interface Good {
    id: string;
    name: string;
    price: number;
    old_price: number | null;
    category: string;
    is_new: boolean;
    main_image_url: string;
    stock_quantity: number;
    sizes: string[];
}

function ShopContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth(); // 🔥 Дістаємо юзера

    const activeCategory = searchParams.get('category') || 'Man';
    const sizeFilter = searchParams.get('size');
    const sortFilter = searchParams.get('sort');
    const instockFilter = searchParams.get('instock') === 'true';

    const [goods, setGoods] = useState<Good[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]); // 🔥 Стейт для лайків
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                // 1. Запит на всі товари
                const goodsPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`).then((res) => {
                    if (!res.ok) throw new Error('Помилка завантаження товарів');
                    return res.json();
                });

                // 2. Запит на улюблені товари (якщо юзер авторизований)
                const token = localStorage.getItem('token');
                let favoritesPromise = Promise.resolve({ favorites: [] });

                if (token) {
                    favoritesPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites/get`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.json());
                }

                // 3. 🔥 Чекаємо обидва запити
                const [goodsData, favoritesData] = await Promise.all([goodsPromise, favoritesPromise]);

                // 4. Оновлюємо стейти
                setGoods(goodsData);

                if (favoritesData && Array.isArray(favoritesData.favorites)) {
                    setFavoriteIds(favoritesData.favorites.map((fav: { goodId: number }) => fav.goodId));
                } else {
                    setFavoriteIds([]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false); // Вимикаємо скелетони тільки після того, як усе готово
            }
        };

        loadData();
    }, [user]); // 🔥 Запускаємо повторно, якщо юзер змінився

    let filteredGoods = goods.filter((good) => good.category === activeCategory);

    if (sizeFilter) {
        filteredGoods = filteredGoods.filter((good) => good.sizes && good.sizes.map(String).includes(sizeFilter));
    }

    if (instockFilter) {
        filteredGoods = filteredGoods.filter((good) => good.stock_quantity > 0);
    }

    if (sortFilter === 'price_asc') {
        filteredGoods.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'price_desc') {
        filteredGoods.sort((a, b) => b.price - a.price);
    }

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', cat);
        window.history.pushState(null, '', `?${params.toString()}`);
    };

    return (
        <main style={{ paddingTop: '120px', paddingBottom: '40px', minHeight: '80vh' }}>
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Shop Now</h2>
                <span className={styles.line}></span>
            </div>

            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ''}`}
                        onClick={() => handleCategoryChange(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <BestSellingCardSkeleton key={i} />
                        ))}
                    </>
                ) : filteredGoods.length > 0 ? (
                    filteredGoods.map((product) => (
                        <BestSellingCard
                            key={product.id}
                            id={Number(product.id)}
                            image={product.main_image_url}
                            name={product.name}
                            price={product.price}
                            oldPrice={product.old_price ? product.old_price : undefined}
                            stockQuantity={product.stock_quantity}
                            showHeart={true}
                            isNew={product.is_new}
                            sizes={product.sizes}
                            initialIsFavorite={favoriteIds.includes(Number(product.id))} // 🔥 Передаємо статус лайка
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: 'span 3', fontFamily: 'Poppins' }}>
                        За вашими фільтрами нічого не знайдено.
                    </p>
                )}
            </div>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense
            fallback={
                <div style={{ paddingTop: '120px', textAlign: 'center', fontFamily: 'Poppins' }}>Loading shop...</div>
            }>
            <ShopContent />
        </Suspense>
    );
}
