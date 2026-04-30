'use client';

import { useState, useId } from 'react';
import Image from 'next/image';
import { useCart } from './context/CartContext';
import { useAuth } from './AuthContext'; // Підключили AuthContext
import { useRouter } from 'next/navigation'; // Підключили роутер
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
    const { user } = useAuth(); // Дістаємо юзера
    const router = useRouter(); // Ініціалізуємо роутер

    const uniqueImageId = useId();

    const itemInCart = cartItems.find((item) => item.id === id);
    const quntityInCart = itemInCart ? itemInCart.quantity : 0;
    const remainingStock = stockQuantity - quntityInCart;
    const isOutOfStock = remainingStock === 0;

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
            // Показуємо loading
            Swal.fire({
                title: 'Adding to waitlist...',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Робимо запит до API
            const response = await fetch('https://shoesstore-server.onrender.com/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({
                    good_id: id,
                    email: user.email,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // Success
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

            // Помилка
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
            <div className={styles.card__imageBox}>
                {isNew && <div className={styles.badgeNew}>New</div>}

                {showHeart && (
                    <button className={styles.heartBtn} onClick={toggleFavourite}>
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
                <h4 className={styles.card__name}>{name}</h4>

                <div
                    className={styles.stockContainer}
                    style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '13px', color: '#888' }}>
                    {remainingStock > 0 ? (
                        <span className={styles.lowStock}>In stock: {remainingStock}</span>
                    ) : (
                        <span className={styles.lowStock} style={{ color: '#d9534f' }}>
                            Out of stock
                        </span>
                    )}

                    {sizes && sizes.length > 0 && <span className={styles.sizesList}>size: {sizes.join(', ')}</span>}
                </div>

                <div className={styles.card__bottom}>
                    <div className={styles.priceContainer}>
                        <p className={styles.card__price}>₴ {Number(price).toFixed(2)}</p>
                        {oldPrice && <p className={styles.card__oldPrice}>₴ {Number(oldPrice).toFixed(2)}</p>}
                    </div>

                    {isOutOfStock ? (
                        <button 
                            className={styles.notifyBtn} 
                            onClick={handleNotifyClick}
                            disabled={isNotifying}
                            style={{ opacity: isNotifying ? 0.6 : 1 }}
                        >
                            {isNotifying ? 'Adding...' : 'Notify'}
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
