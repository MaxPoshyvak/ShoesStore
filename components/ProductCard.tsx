import Image from "next/image";
import styles from "./ProductCard.module.css";


interface ProductCardProps {
    image: string;
    name: string;
    price: string;
}

export default function ProductCard({ image, name, price }: ProductCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.card__imageBox}>
                <Image src={image} alt={name} width={350} height={350} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.card__info}>

                <h4 className={styles.card__name}>
                    {name}
                </h4>
                <div className={styles.card__bottom}>

                    <p className={styles.card__price}>
                        {price}
                    </p>
                    <button className={styles.card__btn}>
                        <Image src="/btn.png" alt="Add to Cart" width={30} height={30} />
                    </button>
                </div>

            </div>
        </div>
    )
}