"use client";

import Image from "next/image";
import styles from "./PromoBanner.module.css";
import { useState } from "react";

const slidesData = [
    {
        id: 0,
        bgColor: "#FD8B92",
        textColor: '#FD8B92',
        legsImg: "/socks.png",
        thumbnails: ["/shoe-black.png", "/shoe-gray.png", "/shoe-multi.png"]
    },
    {
        id: 1,
        bgColor: "#FFE066",
        textColor: '#FFE066',
        legsImg: "/sock_yellow.png",
        // legsImg: "/socks.png",

        thumbnails: ["/shoe-gray.png", "/shoe-multi.png", "/shoe-black.png",],

    }, {
        id: 2,
        bgColor: "#4CAF50",
        textColor: '#4CAF50',
        legsImg: "/sock_green.png",
        // legsImg: "/socks.png",

        thumbnails: ["/shoe-black.png", "/shoe-gray.png", "/shoe-multi.png"]

    }
]
export default function PromoBanner() {

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const totalSlides = slidesData.length;

    const currentSlide = slidesData[currentSlideIndex];

    const nextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }
    const prevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    }
    const goToSlide = (index: number) => {
        setCurrentSlideIndex(index);
    }
    return (
        <section className={styles.promo}>
            <div className={styles.promo__container}
                style={{
                    backgroundColor: currentSlide.bgColor,
                    '--theme-color': currentSlide.textColor,
                } as React.CSSProperties}
            >

                {/* ФІКС 1: Тут має бути promo__background, а не другий promo__container */}
                <div className={styles.promo__background}>
                    <div className={styles.promo__bgText}>Slick</div>
                </div>

                {/* ФІКС 2: Відкриваємо promo__content і НЕ закриваємо його до самого кінця! */}
                <div
                    className={styles.promo__content}>

                    <button className={`${styles.promo__arrow} ${styles.promo__arrowLeft}`} onClick={prevSlide}>
                        <Image src="/arrow-left-white.png" alt="Prev" width={20} height={20} />
                    </button>

                    <div className={styles.promo__left}>
                        <Image
                            src={currentSlide.legsImg}
                            alt="Legs"
                            width={750}
                            height={600}
                            className={styles.promo__legs}
                            priority
                        />
                    </div>

                    {/* Права частина: Текст */}
                    <div className={styles.promo__right}>
                        <h2 className={styles.promo__title}>
                            Are you ready <br /> to lead the way
                        </h2>
                        <p className={styles.promo__desc}>
                            Lorem ipsum dolor sit amet, consectetur<br />
                            adipiscing elit, sed do.
                        </p>

                        {/* Кнопка та мініатюри в один рядок */}
                        <div className={styles.promo__actions}>
                            <button className={`${styles.promo__btn} ${styles.promo__btnTheme}`}>Explore</button>

                            <div className={styles.promo__miniSlider}>
                                <div className={styles.promo__thumbnails}>
                                    {currentSlide.thumbnails.map((imgSrc, index) => (
                                        <div key={index} className={styles.thumbnail}>
                                            <Image
                                                src={imgSrc}
                                                alt="shoe thumbnail"
                                                width={100}
                                                height={100}
                                                className={styles.miniShoe}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Крапочки під мініатюрами */}
                                <div className={styles.promo__pagination}>
                                    {slidesData.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`${styles.dot} ${currentSlideIndex === index ? styles.dotActive : ""}`}
                                            onClick={() => goToSlide(index)}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className={`${styles.promo__arrow} ${styles.promo__arrowRight}`} onClick={nextSlide}>
                        <Image src="/arrow-right-white.png" alt="Next" width={20} height={20} />
                    </button>

                </div>

            </div>
        </section>
    );
}