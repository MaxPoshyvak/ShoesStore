"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductCard.module.css";


interface ProductCardProps {
    image: string;
    name: string;
    price: string | number;

    oldPrice?: string | number;
    isNew?: boolean;
    showHeart?: boolean;
    fullWidth?: boolean;
    bestSellingStyle?: boolean;
}

export default function ProductCard({ image, name, price, oldPrice, isNew, showHeart, fullWidth, bestSellingStyle }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false); 

        const toggleFavourite = () =>{
            setIsFavorite(!isFavorite);

        }

    return (
        <div className={`${styles.card} ${fullWidth ? styles.cardFullWidth : ""} ${bestSellingStyle ? styles.bestSellingCard : ""}`}>
            <div className={styles.card__imageBox}>
                {isNew && <div className={styles.badgeNew}>New</div>}

                {showHeart && (
                    <button className={styles.heartBtn}  onClick={toggleFavourite}>
                        <Image
                        src={isFavorite ? "/heart-filled.svg" : "/heart-outline.svg"} alt="Favourite" width={24} height={24} />
                    </button>
                )}

                <Image src={image} alt={name} width={250} height={250} className={styles.shoeImage} style={{ objectFit: 'contain' }} />
            </div>
            <div className={styles.card__info}>

                <h4 className={styles.card__name}>
                    {name}
                </h4>
                <div className={styles.card__bottom}>

                    <div className={styles.priceContainer}>
                        <p className={styles.card__price}>{price}</p>

                        {oldPrice && <p className={styles.card__oldPrice}>{oldPrice}</p>}

                    </div>

                    <button className={styles.card__btn}>
                        <Image src="/btn.png" alt="Add to Cart" width={30} height={30} />
                    </button>
                </div>

            </div>
        </div>
    )
}