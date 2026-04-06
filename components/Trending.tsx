import Image from "next/image";
import styles from "./Trending.module.css";
import ProductCard from "./ProductCard"; // Імпортуємо нашу картку

export default function Trending() {
    return (
        <section className={styles.trending}>

            {/* Ліва частина з текстом */}
            <div className={styles.trending__left}>
                <div className={styles.trending__subtitle}>
                    <span className={styles.trending__line}></span>
                    Our Trending Shoe
                </div>
                <h2 className={styles.trending__title}>Most Popular Products</h2>
                <p className={styles.trending__desc}>
                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit,
                </p>
                <button className={styles.trending__explore}>Explore</button>
            </div>

            {/* Права частина зі слайдером (поки що просто сітка) */}
            <div className={styles.trending__right}>
                <button className={styles.slider__btn}><Image src="/left.png" alt="Left" width={20} height={20} /></button>

                <div className={styles.trending__cards}>
                    <ProductCard image="/shoe-black.png" name="Running sport shoe" price="₹ 3999.00" />
                    <ProductCard image="/shoe-gray.png" name="Running sport shoe" price="₹ 3999.00" />
                    <ProductCard image="/shoe-multi.png" name="Running sport shoe" price="₹ 3999.00" />
                </div>

                <button className={styles.slider__btn}><Image src="/right.png" alt="Right" width={20} height={20} /></button>
            </div>

        </section>
    );
}