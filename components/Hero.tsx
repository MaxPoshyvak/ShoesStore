import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      
      {/* Ліва колонка (ТУТ БЕЗ ЗМІН) */}
      <div className={styles.hero__left}>
        <h1 className={styles.hero__title}>
          Find Your <br />
          Sole Mate <br />
          With Us
        </h1>
        <p className={styles.hero__description}>
          Lorem Ipsum Dolor Sit Amet, Consectetur<br />
          Adipiscing Elit, Sed Do Eiusmod.
        </p>
        <button className={styles.hero__btn}>
          Shop Now
        </button>
      </div>

      {/* Права колонка */}
      <div className={styles.hero__right}>
        
        {/* === ДОДАТКОВІ ФІГУРИ (Нові шари) === */}
        
        {/* 1. Group 3(circle) - Найзадніший план */}
        <div className={`${styles.hero__graphic} ${styles["hero__graphic--circles"]}`}>
          <Image src="/Group 3(circle).png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        {/* 2. Group 1(line) - Лінії, що перетинають текст */}
        <div className={`${styles.hero__graphic} ${styles["hero__graphic--lines"]}`}>
          <Image src="/Group 1(line).png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        {/* 3. Group 2(shadow) - Тіні під кросівками */}
        <div className={`${styles.hero__graphic} ${styles["hero__graphic--shadows"]}`}>
          <Image src="/Group 2(shadow).png" alt="" fill style={{ objectFit: "contain" }} />
        </div>


        {/* Вертикальний текст ULTIMATE (тепер повертаємо rotate) */}
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
          <p className={styles.hero__shoePrice}>₹ 3999.00</p>
        </div>
      </div>

    </section>
  );
}