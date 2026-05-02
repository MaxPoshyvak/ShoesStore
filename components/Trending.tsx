'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Trending.module.css';
import { ServerStatusPopup } from '@/components/ServerStatusPopup/ServerStatusPopup';
import BestSellingCard from '@/components/BestSellingCard';

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
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setItemsPerPage(1);
            } else if (window.innerWidth <= 1500) {
                // Змінили 1024 на 1500
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
        const fetchGoods = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`);
                if (!response.ok) {
                    throw new Error('Помилка мережі');
                }
                const data: Good[] = await response.json();

                const sortedData = data.sort((a, b) => {
                    const aHasDiscount = a.old_price && a.old_price > a.price;
                    const bHasDiscount = b.old_price && b.old_price > b.price;

                    if (aHasDiscount && !bHasDiscount) return -1;
                    if (!aHasDiscount && bHasDiscount) return 1;

                    return a.price - b.price;
                });

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

            let gap = 30; // Для екранів > 1500px
            if (window.innerWidth <= 600) {
                gap = 15; // Для телефону
            } else if (window.innerWidth <= 1500) {
                // Змінили 1024 на 1500
                gap = 20; // Для планшета та екранів до 1500px
            }

            const scrollAmount = (containerWidth + gap) * pageIndex;

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
                                    <div key={product.id} className={styles.cardWrapper}>
                                        <BestSellingCard
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
