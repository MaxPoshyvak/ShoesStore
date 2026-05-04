'use client';

import { useState, useId, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './BestSellingCard.module.css';
import { addToFavorites, removeFromFavorites } from '@/utils/backendData/backendFavorites';

interface ProductCardProps {
    id: number;
    image: string;
    name: string;
    price: string | number;
    oldPrice?: string | number;
    isNew?: boolean;
    showHeart?: boolean;
    stockQuantity: number;
    sizes?: (number | string)[];
    initialIsFavorite?: boolean;
}

export default function BestSellingCard({
    id,
    image,
    name,
    price,
    oldPrice,
    isNew,
    showHeart,
    stockQuantity,
    sizes,
    initialIsFavorite,
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false);
    const [isNotifying, setIsNotifying] = useState(false);

    const { cartItems } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const uniqueImageId = useId();

    const itemInCart = cartItems.find((item) => String(item.id) === String(id));
    const cartQuantity = Number(itemInCart?.quantity ?? 0);
    const stock = Number(stockQuantity ?? 0);
    const remainingStock = Math.max(0, stock - cartQuantity);
    const isOutOfStock = remainingStock <= 0;

    const toggleFavourite = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsFavorite(!isFavorite);
        try {
            if (!isFavorite) {
                await addToFavorites(id);
            } else {
                await removeFromFavorites(id);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setIsFavorite(isFavorite);
        }
    };

    const handleOpenProduct = () => {
        if (isOutOfStock) return;
        router.push(`/product/${id}`);
    };

    const handleNotifyClick = async () => {
        // ... (Твоя логіка handleNotifyClick залишається БЕЗ ЗМІН)
        if (isNotifying) return;

        if (!user) {
            Swal.fire({
                icon: 'info',
                title: 'Вхід потрібен',
                text: 'Будь ласка, увійдіть в акаунт, щоб отримувати сповіщення.',
                confirmButtonText: 'Перейти до входу',
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
                title: 'Додаємо в список очікування...',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({ good_id: id, email: user.email }),
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            Swal.fire({
                icon: 'success',
                title: 'Готово!',
                text: `Ми додали "${name}" до вашого списку очікування.`,
                confirmButtonText: 'Закрити',
                confirmButtonColor: '#000',
            });
        } catch (error) {
            console.error('Notify error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Помилка',
                text: 'Не вдалося додати до списку очікування. Спробуйте ще раз.',
                confirmButtonColor: '#000',
            });
        } finally {
            setIsNotifying(false);
        }
    };

    useEffect(() => {}, []);

    return (
        <div className={`${styles.card} ${isOutOfStock ? styles.outOfStockCard : ''}`}>
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
                <h4 className={styles.card__name} title={name}>
                    {name}
                </h4>

                <div className={styles.stockContainer}>
                    {remainingStock > 0 ? (
                        <span className={styles.lowStock}>In stock: {remainingStock}</span>
                    ) : (
                        <span className={styles.lowStock} style={{ color: '#d9534f' }}>
                            Out of stock
                        </span>
                    )}

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
