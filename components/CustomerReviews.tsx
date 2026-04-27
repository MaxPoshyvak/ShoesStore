"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CustomerReviews.module.css";



export default function CustomerReviews() {
    interface Feedback {
        id?: string;
        comment: string;
        rating: number;
        goodId: string;
    }

    const [currentSlide, setCurrentSlide] = useState(0);

    const [reviews, setReviews] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('https://shoesstore-server.onrender.com/api/feedbacks/get');
                if (!response.ok) throw new Error('Помилка мережі');

                const data = await response.json();
                // Зверни увагу: беремо data.feedbacks згідно з документацією API
                setReviews(data.feedbacks || []);
            } catch (error) {
                console.error("Не вдалося завантажити відгуки:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);
    const totalSlides = Math.ceil(reviews.length / 2);
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className={styles.reviewsSection}>
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Customer Review</h2>
                <span className={styles.line}></span>
            </div>

            {isLoading ? (
                <p style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>Завантаження відгуків...</p>
            ) : reviews.length > 0 ? (
                <>
                    <div className={styles.sliderWindow}>
                        <div
                            className={styles.sliderTrack}
                            style={{ transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 30}px))` }}
                        >
                            {reviews.map((review, index) => (
                                <div key={review.id || index} className={styles.card}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={"/ava-cropped.jpg"}
                                            alt="User"
                                            width={120}
                                            height={150}
                                            className={styles.avatar}
                                            style={{ objectFit: 'cover', width: 'auto', height: 'auto' }}
                                        />
                                    </div>

                                    <div className={styles.content}>
                                        {/* Уявимо, що в базі є ім'я юзера. Якщо ні - заглушка */}
                                        <h4 className={styles.name}>Customer User</h4>
                                        <div className={styles.stars}>
                                            {/* Малюємо зірочки на основі рейтингу Максима */}
                                            {[...Array(review.rating || 5)].map((_, i) => (
                                                <span key={i}>★</span>
                                            ))}
                                        </div>
                                        <p className={styles.text}>{review.comment}</p>
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
                </>
            ) : (
                <p style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>Поки немає відгуків.</p>
            )}
        </section>
    );
}