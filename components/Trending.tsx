"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Trending.module.css";
import ProductCard from "./ProductCard";

// Описуємо інтерфейс товару, який приходить від API
interface Good {
    id: string;
    name: string;
    price: number;
    old_price?: number | null;
    main_image_url: string;
    stock_quantity: number;
}

export default function Trending() {
    const sliderRef = useRef<HTMLDivElement>(null);

    // СТАНИ ДЛЯ API ТА СЛАЙДЕРА
    const [goods, setGoods] = useState<Good[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    // Підтягуємо дані з сервера при завантаженні компонента
    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const response = await fetch('https://shoesstore-server.onrender.com/api/goods');
                if (!response.ok) {
                    throw new Error('Помилка мережі');
                }
                const data = await response.json();
                setGoods(data);
            } catch (error) {
                console.error('Помилка завантаження товарів:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchGoods();
    }, []);

    // Динамічно рахуємо кількість сторінок (по 3 картки на сторінку)
    const totalPages = Math.ceil(goods.length / 3) || 1;

    const goToPage = (pageIndex: number) => {
        setActiveIndex(pageIndex);
        if (sliderRef.current) {
            // Ширина картки (250px) + відступ (30px) = 280px. 
            // Три картки: 280 * 3 = 840px.
            const scrollAmount = 840 * pageIndex;

            sliderRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth"
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
        <section id="trending" className={styles.trending}>
            <div className={styles.trending__left}>
                <div className={styles.trending__subtitle}>
                    <span className={styles.trending__line}></span>
                    Our Trending Shoe
                </div>
                <h2 className={styles.trending__title}>Most Popular Products</h2>
                <p className={styles.trending__desc}>
                    Lorem Ipsum Dolor Sit Amet,
                    <br />Consectetur Adipiscing Elit,
                </p>
                <button className={styles.trending__explore}>Explore</button>
            </div>

            <div className={styles.trending__right}>
                <div className={styles.trending__sliderWrapper}>
                    <button className={styles.slider__btn} onClick={scrollLeft}>
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
                                    showHeart={true}
                                // bestSellingStyle={true}
                                />
                            ))
                        ) : (
                            <p style={{ fontFamily: 'Poppins, sans-serif' }}>Товарів поки немає</p>
                        )}
                    </div>

                    <button className={styles.slider__btn} onClick={scrollRight}>
                        <Image src="/right.png" alt="Right" width={40} height={40} />
                    </button>
                </div>

                <div className={styles.trending__pagination}>
                    {/* Рендеримо крапочки на основі реальної кількості товарів */}
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
                            onClick={() => goToPage(index)}
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
}