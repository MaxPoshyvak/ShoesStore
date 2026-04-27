import Image from "next/image";
import styles from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.hero}>
      
      <div className={styles.hero__left}>
        <h1 className={styles.hero__title}>
          Find Your <br />
          Sole Mate <br />
          With Us
        </h1>
        <p className={styles.hero__description}>
          Premium sneaker drops, built for speed<br />
          and everyday comfort.
        </p>
        <Link href="/shop" className={styles.hero__btn}>
          Shop Now
        </Link>
      </div>

      <div className={styles.hero__right}>
        
        
        <div className={`${styles.hero__graphic} ${styles["hero__graphic--circles"]}`}>
          <Image src="/Group 3(circle).png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.hero__graphic} ${styles["hero__graphic--lines"]}`}>
          <Image src="/Group 1(line).png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.hero__graphic} ${styles["hero__graphic--shadows"]}`}>
          <Image src="/Group 2(shadow).png" alt="" fill style={{ objectFit: "contain" }} />
        </div>


        <div className={styles.hero__ultimate}>
          ULTIMATE
        </div>

        {/* Кросівок */}
        <div className={styles.hero__imageContainer}>
          <Image 
            src="/hero-shoe.png" 
            alt="Trendy Slick Pro shoe" 
            width={650} 
            height={550} 
            className={styles.hero__shoe}
            priority
          />
        </div>
        
        <div className={styles.hero__priceTag}>
          <h3 className={styles.hero__shoeName}>Trendy Slick Pro</h3>
          <p className={styles.hero__shoePrice}>₴ 3999.00</p>
        </div>
      </div>

    </section>
  );
}