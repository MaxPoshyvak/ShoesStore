'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Trending.module.css';
import ProductCard from './ProductCard';
import { ServerStatusPopup } from '@/components/ServerStatusPopup/ServerStatusPopup';

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

    const [goods, setGoods] = useState<Good[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const response = await fetch('https://shoesstore-server.onrender.com/api/goods');
                if (!response.ok) {
                    throw new Error('Помилка мережі');
                }
                const data: Good[] = await response.json();

                // 1. Сортуємо товари: спочатку зі знижкою, потім найдешевші
                const sortedData = data.sort((a, b) => {
                    const aHasDiscount = a.old_price && a.old_price > a.price;
                    const bHasDiscount = b.old_price && b.old_price > b.price;

                    // Якщо товар 'a' має знижку, а 'b' ні — 'a' йде вище
                    if (aHasDiscount && !bHasDiscount) return -1;
                    // Якщо товар 'b' має знижку, а 'a' ні — 'b' йде вище
                    if (!aHasDiscount && bHasDiscount) return 1;

                    // Якщо в обох є знижка, АБО в обох немає — сортуємо від найдешевшого
                    return a.price - b.price;
                });

                // 2. Відрізаємо рівно 9 найкращих кросівок
                const top9Goods = sortedData.slice(0, 9);

                setGoods(top9Goods);
            } catch (error) {
                console.error('Помилка завантаження товарів:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoods();
    }, []);

    const totalPages = Math.ceil(goods.length / 3) || 1;

    const goToPage = (pageIndex: number) => {
        setActiveIndex(pageIndex);
        if (sliderRef.current) {
            const scrollAmount = 840 * pageIndex;
            sliderRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const scrollLeft = () => {
        const newIndex = activeIndex > 0 ? activeIndex - 1 : 0;
        goToPage(newIndex);
    };

    const scrollRight = () => {
        const newIndex = activeIndex < totalPages - 1 ? activeIndex + 1 : totalPages - 1;
        goToPage(newIndex);
    };

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
                                <p style={{ fontFamily: 'Poppins, sans-serif' }}>Завантаження товарів...</p>
                            ) : goods.length > 0 ? (
                                goods.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={String(product.id)}
                                        image={product.main_image_url}
                                        name={product.name}
                                        price={product.price}
                                        oldPrice={product.old_price ? product.old_price : undefined}
                                        stockQuantity={product.stock_quantity}
                                        isNew={product.is_new}
                                        showHeart={true}
                                        sizes={product.sizes}
                                    />
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
