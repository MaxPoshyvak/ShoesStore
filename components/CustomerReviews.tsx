'use client';

import { useState, useEffect } from 'react';
import styles from './CustomerReviews.module.css';

// Генератор красивого градієнта на основі імені юзера
const generateAvatarGradient = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const baseHue = Math.abs(hash) % 360;
    const color1 = `hsl(${baseHue}, 90%, 65%)`;
    const color2 = `hsl(${(baseHue + 40) % 360}, 90%, 75%)`;
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

// Оновлений інтерфейс згідно з твоїм скріншотом бази даних
interface Feedback {
    _id: string;
    comment: string;
    rating: number;
    goodId: string;
    goodName: string;
    username: string;
    createdAt?: string;
}

export default function CustomerReviews() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reviews, setReviews] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(2); // За замовчуванням 2 картки на ПК

    // Відслідковуємо розмір екрана для правильної роботи пагінації слайдера
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setItemsPerPage(1); // 1 картка на телефонах і планшетах
            } else {
                setItemsPerPage(2); // 2 картки на ПК
            }
        };

        handleResize(); // Перевіряємо при завантаженні
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedbacks/get`);
                if (!response.ok) throw new Error('Помилка мережі');

                const data = await response.json();
                setReviews(data.feedbacks || []);
            } catch (error) {
                console.error('Не вдалося завантажити відгуки:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Рахуємо кількість "сторінок" пагінації залежно від ширини екрана
    const totalSlides = Math.ceil(reviews.length / itemsPerPage);

    // Захист від помилок при ресайзі (якщо currentSlide більший за нову кількість сторінок)
    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(totalSlides - 1);
        }
    }, [totalSlides, currentSlide]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Розраховуємо зсув залежно від поточного екрану (відступи збігаються з CSS)
    const gap = itemsPerPage === 2 ? 30 : 15;

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
                        {/* Математика зсуву: (100% / itemsPerPage) * номер слайду */}
                        <div
                            className={styles.sliderTrack}
                            style={{
                                transform: `translateX(calc(-${currentSlide * (100 / itemsPerPage)}% - ${currentSlide * gap}px))`,
                            }}>
                            {reviews.map((review) => {
                                // Беремо першу літеру (або заглушку, якщо імені раптом немає)
                                const initial = review.username ? review.username.charAt(0).toUpperCase() : '?';
                                const avatarBg = review.username ? generateAvatarGradient(review.username) : '#ccc';

                                return (
                                    <div key={review._id} className={styles.card}>
                                        {/* Нова аватарка з літерою */}
                                        <div className={styles.avatarWrapper} style={{ background: avatarBg }}>
                                            <span className={styles.avatarLetter}>{initial}</span>
                                        </div>

                                        <div className={styles.content}>
                                            <h4 className={styles.name}>{review.username}</h4>

                                            {/* Додано назву товару, на який залишено відгук */}
                                            <p className={styles.goodName}>{review.goodName}</p>

                                            <div className={styles.stars}>
                                                {[...Array(review.rating || 5)].map((_, i) => (
                                                    <span key={i}>★</span>
                                                ))}
                                            </div>
                                            <p className={styles.text}>{review.comment}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.pagination}>
                        {[...Array(totalSlides)].map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.dot} ${currentSlide === index ? styles.dotActive : ''}`}
                                onClick={() => goToSlide(index)}></span>
                        ))}
                    </div>
                </>
            ) : (
                <p style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>Поки немає відгуків.</p>
            )}
        </section>
    );
}
