'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Trending.module.css';
import { ServerStatusPopup } from '@/components/ServerStatusPopup/ServerStatusPopup';
import BestSellingCard from '@/components/BestSellingCard/BestSellingCard';
import { BestSellingCardSkeleton } from '@/components/BestSellingCard/BestSellingCardSkeleton';
import { useAuth } from '@/components/AuthContext'; // 🔥 Імпортуємо контекст для юзера

interface Good {
    id: string;
    name: string;
    price: number;
    old_price?: number | null;
    main_image_url: string;
    stock_quantity: number;
    is_new?: boolean;
    sizes: string[];
}

export default function Trending() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth(); // 🔥 Дістаємо юзера

    const [goods, setGoods] = useState<Good[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]); // 🔥 Стейт для улюблених
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const skeletonArray = [1, 2, 3];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setItemsPerPage(1);
            } else if (window.innerWidth <= 1500) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                // 1. Запит на товари
                const goodsPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`).then((res) => {
                    if (!res.ok) throw new Error('Помилка мережі товарів');
                    return res.json();
                });

                // 2. Запит на лайки (тільки якщо є токен)
                const token = localStorage.getItem('token');
                let favoritesPromise = Promise.resolve({ favorites: [] });

                if (token) {
                    favoritesPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites/get`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.json());
                }

                // 3. Чекаємо обидва запити одночасно
                const [goodsData, favoritesData] = await Promise.all([goodsPromise, favoritesPromise]);

                // 4. Логіка сортування товарів (твоя оригінальна)
                const sortedData = goodsData.sort((a: Good, b: Good) => {
                    const aHasDiscount = a.old_price && a.old_price > a.price;
                    const bHasDiscount = b.old_price && b.old_price > b.price;

                    if (aHasDiscount && !bHasDiscount) return -1;
                    if (!aHasDiscount && bHasDiscount) return 1;

                    return a.price - b.price;
                });

                const top9Goods = sortedData.slice(0, 9);
                setGoods(top9Goods);

                // 5. Записуємо лайки
                if (favoritesData && Array.isArray(favoritesData.favorites)) {
                    setFavoriteIds(favoritesData.favorites.map((fav: { goodId: number }) => fav.goodId));
                } else {
                    setFavoriteIds([]);
                }
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]); // Перезапускаємо, якщо юзер залогінився/розлогінився

    // ... (Логіка пагінації та скролу залишається без змін)
    const totalPages = Math.ceil(goods.length / itemsPerPage) || 1;

    useEffect(() => {
        if (activeIndex >= totalPages && totalPages > 0) {
            setActiveIndex(totalPages - 1);
        }
    }, [totalPages, activeIndex]);

    const goToPage = (pageIndex: number) => {
        setActiveIndex(pageIndex);
        if (sliderRef.current) {
            const containerWidth = sliderRef.current.clientWidth;
            let gap = 30;
            if (window.innerWidth <= 600) gap = 15;
            else if (window.innerWidth <= 1500) gap = 20;

            const scrollAmount = (containerWidth + gap) * pageIndex;
            sliderRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => goToPage(activeIndex > 0 ? activeIndex - 1 : 0);
    const scrollRight = () => goToPage(activeIndex < totalPages - 1 ? activeIndex + 1 : totalPages - 1);

    return (
        <>
            <section id="trending" className={styles.trending}>
                <div className={styles.trending__left}>
                    <div className={styles.trending__subtitle}>
                        <span className={styles.trending__line}></span>
                        Our Trending Shoe
                    </div>
                    <h2 className={styles.trending__title}>Most Popular Products</h2>
                    <p className={styles.trending__desc}>
                        Top-rated sneakers for daily miles,
                        <br />
                        gym sessions, and city walks.
                    </p>
                    <button className={styles.trending__explore}>Explore</button>
                </div>

                <div className={styles.trending__right}>
                    <div className={styles.trending__sliderGrid}>
                        <button className={`${styles.slider__btn} ${styles.btn__left}`} onClick={scrollLeft}>
                            <Image src="/left.png" alt="Left" width={40} height={40} />
                        </button>

                        <div className={styles.trending__cards} ref={sliderRef}>
                            {isLoading ? (
                                <>
                                    {skeletonArray.map((_, index) => (
                                        <div key={index} className={styles.cardWrapper}>
                                            <BestSellingCardSkeleton />
                                        </div>
                                    ))}
                                </>
                            ) : goods.length > 0 ? (
                                goods.map((product) => (
                                    <div key={product.id} className={styles.cardWrapper}>
                                        <BestSellingCard
                                            id={Number(product.id)} /* 🔥 Передаємо як number */
                                            image={product.main_image_url}
                                            name={product.name}
                                            price={product.price}
                                            oldPrice={product.old_price ? product.old_price : undefined}
                                            stockQuantity={product.stock_quantity}
                                            isNew={product.is_new}
                                            showHeart={true}
                                            sizes={product.sizes}
                                            initialIsFavorite={favoriteIds.includes(
                                                Number(product.id),
                                            )} /* 🔥 Передаємо лайк */
                                        />
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontFamily: 'Poppins, sans-serif' }}>Товарів поки немає</p>
                            )}
                        </div>

                        <button className={`${styles.slider__btn} ${styles.btn__right}`} onClick={scrollRight}>
                            <Image src="/right.png" alt="Right" width={40} height={40} />
                        </button>

                        <div className={styles.trending__pagination}>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
                                    onClick={() => goToPage(index)}></span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <ServerStatusPopup isReady={!isLoading} />
        </>
    );
}
