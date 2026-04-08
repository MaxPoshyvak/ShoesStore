"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./CustomerReviews.module.css";

// Масив з 6 відгуків
const mockReviews = [
    { id: 1, name: "Ava Joshi", image: "/ava-cropped.jpg", text: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua." },
    { id: 2, name: "Otis Bisnoy", image: "/otis.jpg", text: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua." },
    { id: 3, name: "Maria Garcia", image: "/eva.png", text: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua." },
    { id: 4, name: "James Smith", image: "/leonardo-cropped.png", text: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua." },
    { id: 5, name: "Linda Lee", image: "/ava-cropped.jpg", text: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua." },
    { id: 6, name: "Robert Doe", image: "/eva.png", text: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua." },
];

export default function CustomerReviews() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3; 

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section id="reviews" className={styles.reviewsSection}>
            
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Customer Review</h2>
                <span className={styles.line}></span>
            </div>

            <div className={styles.sliderWindow}>
                {/* Стрічка з картками, яка буде рухатись */}
                <div 
                    className={styles.sliderTrack}
                    style={{ transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 30}px))` }}
                >
                    {mockReviews.map((review) => (
                        <div key={review.id} className={styles.card}>
                            {/* Фотографія */}
                            <div className={styles.imageWrapper}>
                                <Image src={review.image} alt={review.name} width={120} height={150} className={styles.avatar} style={{ objectFit: 'cover' }} />
                            </div>
                            
                            {/* Текст відгуку */}
                            <div className={styles.content}>
                                <h4 className={styles.name}>{review.name}</h4>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <p className={styles.text}>{review.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.pagination}>
                {[...Array(totalSlides)].map((_, index) => (
                    <span 
                        key={index}
                        className={`${styles.dot} ${currentSlide === index ? styles.dotActive : ""}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>

        </section>
    );
}