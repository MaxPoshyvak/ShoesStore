"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import Swal from 'sweetalert2';
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/product/')) {
        return null;
    }
    
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        await Swal.fire({
            icon: 'success',
            title: 'Thanks for subscribing!',
            showConfirmButton: true,
            confirmButtonColor: '#000'
        });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* ЛІВА КОЛОНКА: Логотип, текст, соцмережі */}
                <div className={styles.colLeft}>
                    <h2 className={styles.logo}>Slick</h2>
                    <p className={styles.desc}>
                        Fresh sneaker drops, trusted fit guides<br />
                        and honest reviews from real runners<br />
                        and streetwear fans.
                    </p>
                    <div className={styles.socials}>
                        <Link href="#" className={styles.socialIcon}>
                            <Image src="/facebook.png" alt="Facebook" width={44} height={44} />
                        </Link>
                        <Link href="#" className={styles.socialIcon}>
                            <Image src="/instagram.png" alt="Instagram" width={44} height={44} />
                        </Link>
                    </div>
                </div>

                <div className={styles.colCenter}>
                    <h3 className={styles.title}>Subscribe for news latter</h3>
                    {/* Форма підписки */}
                    <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter Email..."
                            className={styles.input}
                            required
                        />
                        <span className={styles.divider}>|</span>
                        <button type="submit" className={styles.submitBtn}>
                            SUBSCRIBE
                        </button>
                    </form>
                </div>

                <div className={styles.colRight}>
                    <h3 className={styles.title}>Quick Links</h3>
                    <ul className={styles.linksList}>
                        <li><Link href="#">Home</Link></li>
                        <li><Link href="#">Shop</Link></li>
                        <li><Link href="#">Category</Link></li>
                        <li><Link href="#">Contact</Link></li>
                        <li><Link href="#">Privacy</Link></li>
                    </ul>
                </div>

            </div>

            <div className={styles.bottomBar}>
                <span className={styles.bottomLine}></span>
                <p className={styles.copyright}>www.slick.com©all right reserve</p>
            </div>
        </footer>
    );
}