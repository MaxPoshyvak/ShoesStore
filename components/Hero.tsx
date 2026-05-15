import Image from 'next/image';
import styles from './Hero.module.css';
import Link from 'next/link';
import { Reveal } from '@/components/ScrollAnimated/Reveal';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.hero__left}>
                <Reveal effect="fade-up" delay={0}>
                    <h1 className={styles.hero__title}>
                        Find Your <br />
                        Sole Mate <br />
                        With Us
                    </h1>
                </Reveal>

                <Reveal effect="fade-up" delay={0.1}>
                    <p className={styles.hero__description}>
                        Premium sneaker drops, built for speed
                        <br />
                        and everyday comfort.
                    </p>
                </Reveal>

                <Reveal effect="fade-up" delay={0.2}>
                    <Link href="/shop" className={styles.hero__btn}>
                        Shop Now
                    </Link>
                </Reveal>
            </div>

            <div className={styles.hero__right}>
                <div className={`${styles.hero__graphic} ${styles['hero__graphic--circles']}`}>
                    <Image
                        src="/Group 3(circle).png"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 80vw, 45vw"
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className={`${styles.hero__graphic} ${styles['hero__graphic--lines']}`}>
                    <Image
                        src="/Group 1(line).png"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 80vw, 45vw"
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className={`${styles.hero__graphic} ${styles['hero__graphic--shadows']}`}>
                    <Image
                        src="/Group 2(shadow).png"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 80vw, 45vw"
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className={styles.hero__ultimate}>ULTIMATE</div>

                {/* Кросівок */}
                <div className={styles.hero__imageContainer}>
                    <Reveal effect="scale">
                        <Image
                            src="/hero-shoe.png"
                            alt="Trendy Slick Pro shoe"
                            width={650}
                            height={550}
                            className={styles.hero__shoe}
                            priority
                        />
                    </Reveal>
                </div>

                <div className={styles.hero__priceTag}>
                    <h3 className={styles.hero__shoeName}>Trendy Slick Pro</h3>
                    <p className={styles.hero__shoePrice}>₴ 3999.00</p>
                </div>
            </div>
        </section>
    );
}
