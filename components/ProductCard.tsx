'use client';

import { useState, useId } from 'react';
import Image from 'next/image';
import { useCart } from './context/CartContext';
import { useAuth } from './AuthContext'; // Підключили AuthContext
import styles from './ProductCard.module.css';
import { useRouter } from 'next/navigation'; // Підключили роутер

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

    const handleNotifyClick = () => {
        if (!user) {
            alert('Please log in to your account to receive notifications.');
            router.push('/login');
            return;
        }

        alert(`Great! We will send an email to ${user.email} when the sneakers "${name}" are back in stock.`);
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
                        <button className={styles.notifyBtn} onClick={handleNotifyClick}>
                            Notify
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
