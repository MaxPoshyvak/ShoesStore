"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css"
import { useCart } from "./context/CartContext";
import { Alata } from "next/font/google";
import { usePathname } from "next/navigation";

const alata = Alata({
  weight: '400',
  subsets: ["latin"]
});
export default function Navbar() {

  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }
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

        <button
          className={styles["navbar__btn-cart"]}
          onClick={() => setIsCartOpen(true)}
        >
          <div id="cart-icon-target" className={styles.cartWrapper}>
            <Image src="/trolley.png" alt="Cart" width={30} height={30} />
            {totalItems > 0 && (
              <span className={`${alata.className} ${styles.cartBadge}`}>
                {totalItems}
              </span>
            )}
          </div>
        </button>

        <button className={styles["navbar__btn-menu"]}>

          <Image src="/menu.png" alt="Menu" width={22} height={11} />

        </button>
      </div>

    </header>
  );
}

