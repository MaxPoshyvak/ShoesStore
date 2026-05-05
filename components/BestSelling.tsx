'use client';

import { useState, useEffect, use } from 'react';
import styles from './BestSelling.module.css';
import BestSellingCard from './BestSellingCard/BestSellingCard';
import Link from 'next/link';
import { BestSellingCardSkeleton } from '@/components/BestSellingCard/BestSellingCardSkeleton';
import { useAuth } from '@/components/AuthContext';

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

export default function BestSelling() {
    const [activeCategory, setActiveCategory] = useState('Man');
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const categories = ['Man', 'Woman', 'Boy', 'Child'];

    //СТАНИ ДЛЯ API

    const [goods, setGoods] = useState<Good[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                const token = localStorage.getItem('token');

                // 1. Створюємо запит на товари
                const goodsPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`, {
                    headers: { Authorization: `Bearer ${token}` },
                    method: 'GET',
                }).then((res) => {
                    if (!res.ok) throw new Error('Помилка мережі товарів');
                    return res.json();
                });

                // 2. Створюємо запит на улюблені (АЛЕ тільки якщо є токен/юзер)
                let favoritesPromise = Promise.resolve({ favorites: [] }); // Заглушка, якщо не авторизований

                if (token) {
                    favoritesPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites/get`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.json());
                }

                // 3. 🔥 ЧЕКАЄМО ОБИДВА ЗАПИТИ ОДНОЧАСНО
                const [goodsData, favoritesData] = await Promise.all([goodsPromise, favoritesPromise]);

                // 4. Записуємо дані в стейт
                setGoods(goodsData);

                if (favoritesData && Array.isArray(favoritesData.favorites)) {
                    setFavoriteIds(favoritesData.favorites.map((fav: { goodId: number }) => fav.goodId));
                } else {
                    setFavoriteIds([]); // Очищаємо, якщо юзер вийшов
                }
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            } finally {
                setIsLoading(false); // Вимикаємо скелетони ТІЛЬКИ коли все готово!
            }
        };

        loadData();
    }, [user]);
    const filteredGoods = goods.filter((good) => good.category === activeCategory).slice(0, 6);

    return (
        <section id="best-selling" className={styles.bestSelling}>
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Best Selling</h2>
                <span className={styles.line}></span>
            </div>

            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ''}`}
                        onClick={() => setActiveCategory(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4, 5, 6].map((_, index) => (
                            <BestSellingCardSkeleton key={index} />
                        ))}
                    </>
                ) : filteredGoods.length > 0 ? (
                    filteredGoods.map((product) => (
                        <BestSellingCard // Використовуємо новий компонент
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
                            initialIsFavorite={favoriteIds.includes(Number(product.id))}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontFamily: 'Poppins, sans-serif' }}>
                        В цій категорії поки немає товарів
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingRight: '10px' }}>
                <Link
                    href={`/shop?category=${activeCategory}`}
                    style={{ fontFamily: 'Poppins', color: '#888888', textDecoration: 'none', fontSize: '16px' }}>
                    All goods...
                </Link>
            </div>
        </section>
    );
}
