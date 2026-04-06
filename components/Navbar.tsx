

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
        <Link href="/shop" className={styles.navbar__link}>Shop</Link>
        <Link href="/collection" className={styles.navbar__link}>Collection</Link>
        <Link href="/customize" className={styles.navbar__link}>Customize</Link>
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

