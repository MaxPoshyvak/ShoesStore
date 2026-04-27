'use client';

import { useState, useId } from 'react';
import Image from 'next/image';
import { useCart } from './context/CartContext';
// 1. Імпортуємо контекст авторизації та роутер
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import styles from './BestSellingCard.module.css';

interface ProductCardProps {
    id: string;
    image: string;
    name: string;
    price: string | number;
    oldPrice?: string | number;
    isNew?: boolean;
    showHeart?: boolean;
    stockQuantity: number;
    sizes?: (number | string)[];
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
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const { addToCart, cartItems } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const uniqueImageId = useId();

    const itemInCart = cartItems.find((item) => item.id === id);
    const quntityInCart = itemInCart ? itemInCart.quantity : 0;
    const remainingStock = stockQuantity - quntityInCart;
    const isOutOfStock = remainingStock === 0;

    const toggleFavourite = () => {
        setIsFavorite(!isFavorite);
    };

    const flyToCart = () => {
        const cartTarget = document.getElementById('cart-icon-target');
        const productImage = document.getElementById(uniqueImageId);

        if (!cartTarget || !productImage) {
            console.log('Елементи для анімації не знайдено!');
            return;
        }

        const cartRect = cartTarget.getBoundingClientRect();
        const imgRect = productImage.getBoundingClientRect();

        const flyingImg = document.createElement('img');
        flyingImg.src = image;
        flyingImg.style.position = 'fixed';
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;
        flyingImg.style.objectFit = 'contain';
        flyingImg.style.zIndex = '2147483647';
        flyingImg.style.borderRadius = '50%';
        flyingImg.style.pointerEvents = 'none';

        flyingImg.style.transition = 'none';
        document.body.appendChild(flyingImg);

        setTimeout(() => {
            flyingImg.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

            flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
            flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
            flyingImg.style.width = '20px';
            flyingImg.style.height = '20px';
            flyingImg.style.opacity = '0.2';
        }, 10);

        setTimeout(() => {
            if (document.body.contains(flyingImg)) {
                flyingImg.remove();
            }
        }, 1500);
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        console.log('🛍️ Adding to cart:', { id, name, price, sizes });

        addToCart({
            id: id,
            name: name,
            price: Number(price),
            image: image,
            quantity: 1,
            stock_quantity: stockQuantity,
            sizes: sizes || [],
        });

        flyToCart();
    };

    const handleNotifyClick = () => {
        if (!user) {
            alert('Будь ласка, увійдіть в акаунт, щоб отримувати сповіщення.');
            router.push('/login');
            return;
        }

        alert(`Супер! Ми надішлемо листа на ${user.email}, коли кросівки "${name}" знову з'являться на складі.`);
    };

    return (
        <div className={`${styles.card} ${isOutOfStock ? styles.outOfStockCard : ''}`}>
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
                    {/* ЗАЛИШОК */}
                    {remainingStock > 0 ? (
                        <span className={styles.lowStock}>in stock: {remainingStock}</span>
                    ) : (
                        <span className={styles.lowStock} style={{ color: '#d9534f' }}>
                            Out of stock
                        </span>
                    )}

                    {/* РОЗМІРИ (ЯКЩО ВОНИ Є) */}
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
                        <button className={styles.card__btn} onClick={handleAddToCart}>
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
