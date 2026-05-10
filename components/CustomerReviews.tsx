'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './CustomerReviews.module.css';
import { useRouter } from 'next/navigation';
import { Reveal } from '@/components/ScrollAnimated/Reveal';

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

const AUTOPLAY_INTERVAL = 5000;
const GAP_PERCENT = 2; // gap as % of slider window width

export default function CustomerReviews() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reviews, setReviews] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    const trackRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const router = useRouter();

    // Responsive items per page
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w <= 768) {
                setItemsPerPage(1);
            } else if (w <= 1200) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbacks/get`);
                if (!response.ok) {
                    throw new Error('Failed to load reviews');
                }

                const data = await response.json();
                setReviews(
                    Array.isArray(data?.feedbacks)
                        ? data.feedbacks.sort((a: Feedback, b: Feedback) => b.rating - a.rating).slice(0, 9)
                        : [],
                );
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const totalSlides = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

    // Clamp currentSlide when totalSlides changes
    useEffect(() => {
        if (currentSlide >= totalSlides) {
            setCurrentSlide(Math.max(0, totalSlides - 1));
        }
    }, [totalSlides, currentSlide]);

    // Auto-play
    const resetAutoPlay = useCallback(() => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        if (!isHovered && reviews.length > itemsPerPage) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }, AUTOPLAY_INTERVAL);
        }
    }, [isHovered, reviews.length, itemsPerPage, totalSlides]);

    useEffect(() => {
        resetAutoPlay();
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [resetAutoPlay]);

    const goTo = useCallback(
        (index: number) => {
            setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
            resetAutoPlay();
        },
        [totalSlides, resetAutoPlay],
    );

    const goNext = useCallback(() => {
        goTo((currentSlide + 1) % totalSlides);
    }, [currentSlide, totalSlides, goTo]);

    const goPrev = useCallback(() => {
        goTo((currentSlide - 1 + totalSlides) % totalSlides);
    }, [currentSlide, totalSlides, goTo]);

    // Touch / drag handlers
    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setDragStart(clientX);
        setDragOffset(0);
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;
        setDragOffset(clientX - dragStart);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 50;
        if (dragOffset < -threshold) {
            goNext();
        } else if (dragOffset > threshold) {
            goPrev();
        }
        setDragOffset(0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleDragMove(e.touches[0].clientX);
    };

    // --- Pure percentage-based transform ---
    // Each card width = (100 - (itemsPerPage - 1) * GAP) / itemsPerPage  [% of window]
    // Step per slide = cardWidth + GAP
    // Total track width = reviews.length * cardWidth + (reviews.length - 1) * GAP
    //                   = reviews.length * step - GAP
    //
    // Translate = -currentSlide * step  [%]
    //
    // For drag: convert pixel offset to % of window width
    const cardWidthPct = (100 - (itemsPerPage - 1) * GAP_PERCENT) / itemsPerPage;
    const stepPct = cardWidthPct + GAP_PERCENT;
    const baseTranslatePct = -(currentSlide * stepPct);

    // Convert drag pixels to percentage
    const winWidth = windowRef.current?.offsetWidth || 1;
    const dragPct = isDragging ? (dragOffset / winWidth) * 100 : 0;

    const showArrows = reviews.length > itemsPerPage;

    // Card inline style
    const cardStyle: React.CSSProperties = {
        flex: `0 0 ${cardWidthPct}%`,
        minWidth: 0,
        marginRight: `${GAP_PERCENT}%`,
    };

    return (
        <section className={styles.reviewsSection} id="reviews">
            <Reveal effect="blur">
                <div className={styles.header}>
                    <span className={styles.line}></span>
                    <h2 className={styles.title}>Customer Reviews</h2>
                    <span className={styles.line}></span>
                </div>
            </Reveal>

            {isLoading ? (
                <div className={styles.skeletonWrapper}>
                    {itemsPerPage > 1 ? (
                        <>
                            <div className={styles.skeletonCard}>
                                <div className={styles.skeletonAvatar} />
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonLine} style={{ width: '60%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '80%' }} />
                                </div>
                            </div>
                            <div className={styles.skeletonCard}>
                                <div className={styles.skeletonAvatar} />
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonLine} style={{ width: '60%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '80%' }} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.skeletonCard}>
                            <div className={styles.skeletonAvatar} />
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonLine} style={{ width: '60%' }} />
                                <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                <div className={styles.skeletonLine} style={{ width: '80%' }} />
                            </div>
                        </div>
                    )}
                </div>
            ) : reviews.length > 0 ? (
                <div
                    className={styles.sliderWrapper}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        handleDragEnd();
                    }}>
                    {showArrows && (
                        <button
                            className={`${styles.arrow} ${styles.arrowPrev}`}
                            onClick={goPrev}
                            aria-label="Previous reviews"
                            type="button">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    )}

                    <div className={styles.sliderWindow} ref={windowRef}>
                        <div
                            ref={trackRef}
                            className={styles.sliderTrack}
                            style={{
                                transform: `translateX(calc(${baseTranslatePct}% + ${dragPct}%))`,
                                transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                cursor: isDragging ? 'grabbing' : 'grab',
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleDragEnd}>
                            {reviews.map((review) => {
                                const initial = review.username ? review.username.charAt(0).toUpperCase() : '?';
                                const avatarBg = review.username ? generateAvatarGradient(review.username) : '#ccc';

                                return (
                                    <div key={review._id} className={styles.card} style={cardStyle}>
                                        <Reveal effect="fade-up">
                                            <div className={styles.cardInner}>
                                                <div className={styles.avatarWrapper} style={{ background: avatarBg }}>
                                                    <span className={styles.avatarLetter}>{initial}</span>
                                                </div>

                                                <div className={styles.content}>
                                                    <h4 className={styles.name}>{review.username || 'Anonymous'}</h4>
                                                    <p
                                                        className={styles.goodName}
                                                        onClick={() => router.push(`/product/${review.goodId}`)}>
                                                        {review.goodName || 'Unknown product'}
                                                    </p>

                                                    <div className={styles.stars}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                className={
                                                                    star <= (review.rating || 0)
                                                                        ? styles.starFilled
                                                                        : styles.starEmpty
                                                                }>
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className={styles.text}>{review.comment}</p>
                                                </div>
                                            </div>
                                        </Reveal>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {showArrows && (
                        <button
                            className={`${styles.arrow} ${styles.arrowNext}`}
                            onClick={goNext}
                            aria-label="Next reviews"
                            type="button">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    )}
                </div>
            ) : (
                <p className={styles.emptyText}>No reviews yet.</p>
            )}

            {!isLoading && reviews.length > itemsPerPage && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${currentSlide === index ? styles.dotActive : ''}`}
                            onClick={() => goTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            type="button"
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
