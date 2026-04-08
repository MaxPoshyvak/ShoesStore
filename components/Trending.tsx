"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./Trending.module.css";
import ProductCard from "./ProductCard";

// Тимчасовий масив товарів (скоро ми замінимо його на дані з API)
const mockProducts = [
    { id: 1, image: "/shoe-black.png", name: "Black sport shoe", price: "₹ 3999.00" },
    { id: 2, image: "/shoe-gray.png", name: "Gray sport shoe", price: "₹ 3999.00" },
    { id: 3, image: "/shoe-multi.png", name: "Multi sport shoe", price: "₹ 3999.00" },
    { id: 4, image: "/shoe-black.png", name: "Black sport shoe 2", price: "₹ 3999.00" },
    { id: 5, image: "/shoe-gray.png", name: "Gray sport shoe 2", price: "₹ 3999.00" },
    { id: 6, image: "/shoe-multi.png", name: "Multi sport shoe 2", price: "₹ 3999.00" },
    // { id: 7, image: "/shoe-black.png", name: "Black sport shoe 3", price: "₹ 3999.00" },
    // { id: 8, image: "/shoe-gray.png", name: "Gray sport shoe 3", price: "₹ 3999.00" },
    // { id: 9, image: "/shoe-multi.png", name: "Multi sport shoe 3", price: "₹ 3999.00" },
 
];

export default function Trending() {
    const sliderRef = useRef<HTMLDivElement>(null);

    // СТАН: зберігаємо поточну "сторінку" (від 0 до 2)
    const [activeIndex, setActiveIndex] = useState(0);
    const totalPages = 3; // Оскільки в нас 9 карток, по 3 на сторінку

    const goToPage = (pageIndex: number) => {
        setActiveIndex(pageIndex);
        if (sliderRef.current) {
            const scrollAmount = 990 * pageIndex;
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
            {/* Ліва частина з текстом */}
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

            {/* Права частина зі слайдером */}
            <div className={styles.trending__right}>
                <div className={styles.trending__sliderWrapper}>
                    <button className={styles.slider__btn} onClick={scrollLeft}>
                        <Image src="/left.png" alt="Left" width={40} height={40} />
                    </button>

                    <div className={styles.trending__cards} ref={sliderRef}>
                        {/* МАГІЯ REACT: Виводимо масив карток через .map() */}
                        {mockProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                            />
                        ))}
                    </div>

                    <button className={styles.slider__btn} onClick={scrollRight}>
                        <Image src="/right.png" alt="Right" width={40} height={40} />
                    </button>
                </div>

                <div className={styles.trending__pagination}>


                    {[0, 1, 2].map((index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
                            onClick={() => goToPage(index)} // Крапочки тепер клікабельні!
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
}