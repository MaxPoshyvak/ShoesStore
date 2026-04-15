"use client";

import { useState, useId } from "react";
import Image from "next/image";
import { useCart } from "./context/CartContext";
import styles from "./ProductCard.module.css";

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
}

export default function ProductCard({ id, image, name, price, oldPrice, isNew, showHeart, fullWidth, bestSellingStyle, stockQuantity }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart, cartItems } = useCart();

    const uniqueImageId = useId();

    const itemInCart = cartItems.find(item => item.id === id);
    const quntityInCart = itemInCart ? itemInCart.quantity : 0;
    const remainingStock = stockQuantity - quntityInCart;
    const isOutOfStock = remainingStock === 0;

    const toggleFavourite = () => {
        setIsFavorite(!isFavorite);
    }

    // === НОВА ФУНКЦІЯ АНІМАЦІЇ ===
    const flyToCart = () => {
        const cartTarget = document.getElementById("cart-icon-target");
        const productImage = document.getElementById(uniqueImageId);

        if (!cartTarget || !productImage) return;

        // Отримуємо координати елементів на екрані
        const cartRect = cartTarget.getBoundingClientRect();
        const imgRect = productImage.getBoundingClientRect();

        // Створюємо "клона" картинки, який буде летіти
        const flyingImg = document.createElement("img");
        flyingImg.src = image; // Беремо посилання на картинку з пропсів

        // Стилізуємо клона, щоб він став точно на місце оригінальної картинки
        flyingImg.style.position = "fixed";
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;
        flyingImg.style.objectFit = "contain";
        flyingImg.style.zIndex = "9999";
        // Задаємо плавність польоту (0.8 секунди)
        flyingImg.style.transition = "all s cubic-bezier(0.25, 1, 0.5, 1)";

        document.body.appendChild(flyingImg);

        // Запускаємо анімацію через мікросекунду, щоб CSS встиг застосуватись
        requestAnimationFrame(() => {
            flyingImg.style.left = `${cartRect.left + 10}px`; // Летить до кошика
            flyingImg.style.top = `${cartRect.top + 10}px`;
            flyingImg.style.width = "20px"; // Зменшується в польоті
            flyingImg.style.height = "20px";
            flyingImg.style.opacity = "0"; // Розчиняється в кінці
        });

        setTimeout(() => {
            flyingImg.remove();
        }, 800);
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        // 1. Додаємо в кошик
        addToCart({
            id: id,
            name: name,
            price: Number(price),
            image: image,
            quantity: 1,
            stock_quantity: stockQuantity
        });

        // 2. Запускаємо анімацію польоту!
        flyToCart();
    };

    return (
        <div className={`${styles.card} ${fullWidth ? styles.cardFullWidth : ""} ${bestSellingStyle ? styles.bestSellingCard : ""} ${isOutOfStock ? styles.outOfStockCard : ""}`}>
            <div className={styles.card__imageBox}>
                {isNew && <div className={styles.badgeNew}>New</div>}

                {showHeart && (
                    <button className={styles.heartBtn} onClick={toggleFavourite}>
                        <Image src={isFavorite ? "/heart-filled.svg" : "/heart-outline.svg"} alt="Favourite" width={24} height={24} />
                    </button>
                )}

                {/* ВАЖЛИВО: Додали id до картинки, щоб функція могла її знайти */}
                <Image
                    id={uniqueImageId}
                    src={image}
                    alt={name}
                    width={250}
                    height={250}
                    className={styles.shoeImage}
                    style={{ objectFit: 'contain' }}
                />
            </div>

            <div className={styles.card__info}>
                <h4 className={styles.card__name}>{name}</h4>

                <div className={styles.stockContainer}>
                    {remainingStock > 0 && remainingStock < 10 && (
                        <span className={styles.lowStock}>in stock: {remainingStock}</span>
                    )}
                </div>

                <div className={styles.card__bottom}>
                    <div className={styles.priceContainer}>
                        <p className={styles.card__price}>₹ {Number(price).toFixed(2)}</p>
                        {oldPrice && <p className={styles.card__oldPrice}>₹ {Number(oldPrice).toFixed(2)}</p>}
                    </div>

                    {isOutOfStock ? (
                        <button className={styles.notifyBtn}>Notify</button>
                    ) : (
                        <button className={styles.card__btn} onClick={handleAddToCart}>
                            <Image src="/btn.png" alt="Add to Cart" width={30} height={30} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}