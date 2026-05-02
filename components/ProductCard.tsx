'use client';

import { useState, useId } from 'react';
import Image from 'next/image';
import { useCart } from './context/CartContext';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    id: string;
    image: string;
    name: string;
    price: string | number;
    oldPrice?: string | number;
    isNew?: boolean;
    showHeart?: boolean;
    fullWidth?: boolean;
    bestSellingStyle?: boolean;
    stockQuantity: number;
    sizes?: (number | string)[];
}

export default function ProductCard({
    id,
    image,
    name,
    price,
    oldPrice,
    isNew,
    showHeart,
    fullWidth,
    bestSellingStyle,
    stockQuantity,
    sizes,
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isNotifying, setIsNotifying] = useState(false);

    const { cartItems } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const uniqueImageId = useId();

    const itemInCart = cartItems.find((item) => String(item.id) === String(id));
    const quntityInCart = itemInCart ? Number(itemInCart.quantity) : 0;
    const stock = Number(stockQuantity ?? 0);
    const remainingStock = Math.max(0, stock - quntityInCart);
    const isOutOfStock = remainingStock <= 0;

    const toggleFavourite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleOpenProduct = () => {
        if (isOutOfStock) return;
        router.push(`/product/${id}`);
    };

    const handleNotifyClick = async () => {
        if (isNotifying) return;

        if (!user) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please log in to your account to receive notifications.',
                confirmButtonText: 'Go to Login',
                confirmButtonColor: '#000',
                background: '#fff',
                color: '#000',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
            return;
        }

        setIsNotifying(true);

        try {
            Swal.fire({
                title: 'Adding to waitlist...',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({
                    good_id: id,
                    email: user.email,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            Swal.fire({
                icon: 'success',
                title: 'Done!',
                text: `We added "${name}" to your waitlist. You'll receive an email notification at ${user.email} when the sneakers are back in stock.`,
                confirmButtonText: 'Close',
                confirmButtonColor: '#000',
                background: '#fff',
                color: '#000',
            });
        } catch (error) {
            console.error('Notify error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add to waitlist. Please try again.',
                confirmButtonText: 'Close',
                confirmButtonColor: '#000',
                background: '#fff',
                color: '#000',
            });
        } finally {
            setIsNotifying(false);
        }
    };

    return (
        <div
            className={`${styles.card} ${fullWidth ? styles.cardFullWidth : ''} ${bestSellingStyle ? styles.bestSellingCard : ''} ${isOutOfStock ? styles.outOfStockCard : ''}`}>
            {/* Додано клік по картинці для переходу на сторінку товару */}
            <div
                className={styles.card__imageBox}
                onClick={handleOpenProduct}
                style={{ cursor: isOutOfStock ? 'default' : 'pointer' }}>
                {isNew && <div className={styles.badgeNew}>New</div>}

                {showHeart && (
                    <button
                        className={styles.heartBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavourite();
                        }}>
                        <Image
                            src={isFavorite ? '/heart-filled.svg' : '/heart-outline.svg'}
                            alt="Favourite"
                            width={24}
                            height={24}
                            style={{ objectFit: 'contain' }}
                        />
                    </button>
                )}

                <Image
                    id={uniqueImageId}
                    src={image}
                    alt={name}
                    fill={true}
                    className={styles.shoeImage}
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
                    style={{ objectFit: 'contain', padding: '20px' }}
                />
            </div>

            <div className={styles.card__info}>
                {/* Додано title для повної назви при наведенні */}
                <h4 className={styles.card__name} title={name}>
                    {name}
                </h4>

                {/* Прибрано інлайн-стилі, які ламали верстку! */}
                <div className={styles.stockContainer}>
                    {remainingStock > 0 ? (
                        <span className={styles.lowStock}>In stock: {remainingStock}</span>
                    ) : (
                        <span className={styles.lowStock} style={{ color: '#d9534f' }}>
                            Out of stock
                        </span>
                    )}

                    {/* Додано title для перегляду всіх розмірів */}
                    {sizes && sizes.length > 0 && (
                        <span className={styles.sizesList} title={sizes.join(', ')}>
                            Sizes: {sizes.join(', ')}
                        </span>
                    )}
                </div>

                <div className={styles.card__bottom}>
                    <div className={styles.priceContainer}>
                        {(() => {
                            const displayPrice = Number(price ?? 0);
                            const displayOld = oldPrice != null ? Number(oldPrice) : null;
                            return (
                                <>
                                    <p className={styles.card__price}>₴ {displayPrice.toFixed(2)}</p>
                                    {displayOld !== null && !Number.isNaN(displayOld) && (
                                        <p className={styles.card__oldPrice}>₴ {displayOld.toFixed(2)}</p>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    {isOutOfStock ? (
                        <button
                            className={styles.notifyBtn}
                            onClick={handleNotifyClick}
                            disabled={isNotifying}
                            style={{ opacity: isNotifying ? 0.6 : 1 }}>
                            {isNotifying ? 'Wait...' : 'Notify'}
                        </button>
                    ) : (
                        <button className={styles.card__btn} onClick={handleOpenProduct}>
                            <Image
                                src="/btn.png"
                                alt="Add to Cart"
                                width={30}
                                height={30}
                                style={{ objectFit: 'contain' }}
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
