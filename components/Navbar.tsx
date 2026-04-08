

import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css"

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      
      <Link href="/" className={styles.navbar__logo}>
        Slick
      </Link>

      <nav className={styles.navbar__nav}>
        <Link href="/" className={styles.navbar__link}>Home</Link>
        <Link href="/#trending" className={styles.navbar__link}>Popular</Link>
        <Link href="/#best-selling" className={styles.navbar__link}>Best Selling</Link>
        <Link href="/#reviews" className={styles.navbar__link}>Review</Link>
      </nav>

      <div className={styles.navbar__actions}>
        <button className={styles["navbar__btn-search"]}>
          <Image src="/search.png" alt="Search" width={21} height={21} />
        </button>
        <button className={styles["navbar__btn-cart"]}>
          <Image src="/trolley.png" alt="Cart" width={21} height={21} />
        </button>
        
        <button className={styles["navbar__btn-menu"]}>
          <Image src="/menu.png" alt="Menu" width={22} height={11} />
        </button>
      </div>

    </header>
  );
}

