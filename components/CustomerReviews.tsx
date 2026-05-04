'use client';

import { useEffect, useState } from 'react';
import styles from './CustomerReviews.module.css';

type Feedback = {
    _id: string;
    comment: string;
    rating: number;
    goodId: string;
    goodName: string;
    username: string;
    createdAt?: string;
};

const generateAvatarGradient = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const baseHue = Math.abs(hash) % 360;
    const color1 = `hsl(${baseHue}, 90%, 65%)`;
    const color2 = `hsl(${(baseHue + 40) % 360}, 90%, 75%)`;

    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

export default function CustomerReviews() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reviews, setReviews] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth <= 1024 ? 1 : 2);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbacks/get`);
                if (!response.ok) {
                    throw new Error('Failed to load reviews');
                }

                const data = await response.json();
                setReviews(Array.isArray(data?.feedbacks) ? data.feedbacks : []);
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const totalSlides = Math.ceil(reviews.length / itemsPerPage);
    const gap = itemsPerPage === 2 ? 30 : 15;

    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(totalSlides - 1);
        }
    }, [totalSlides, currentSlide]);

    return (
        <section className={styles.reviewsSection} id="reviews">
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Customer Reviews</h2>
                <span className={styles.line}></span>
            </div>

            {isLoading ? (
                <p style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>Loading reviews...</p>
            ) : reviews.length > 0 ? (
                <>
                    <div className={styles.sliderWindow}>
                        <div
                            className={styles.sliderTrack}
                            style={{
                                transform: `translateX(calc(-${currentSlide * (100 / itemsPerPage)}% - ${currentSlide * gap}px))`,
                            }}>
                            {reviews.map((review) => {
                                const initial = review.username ? review.username.charAt(0).toUpperCase() : '?';
                                const avatarBg = review.username ? generateAvatarGradient(review.username) : '#ccc';

                                return (
                                    <div key={review._id} className={styles.card}>
                                        <div className={styles.avatarWrapper} style={{ background: avatarBg }}>
                                            <span className={styles.avatarLetter}>{initial}</span>
                                        </div>

                                        <div className={styles.content}>
                                            <h4 className={styles.name}>{review.username || 'Anonymous'}</h4>
                                            <p className={styles.goodName}>{review.goodName || 'Unknown product'}</p>

                                            <div className={styles.stars}>
                                                {[...Array(review.rating || 0)].map((_, i) => (
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
                                onClick={() => setCurrentSlide(index)}></span>
                        ))}
                    </div>
                </>
            ) : (
                <p style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>No reviews yet.</p>
            )}
        </section>
    );
}
