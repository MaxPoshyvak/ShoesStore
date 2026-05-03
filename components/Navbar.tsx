'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useCart } from './context/CartContext';
import { useAuth } from './AuthContext';

import { Alata } from 'next/font/google';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const alata = Alata({
    weight: '400',
    subsets: ['latin'],
});

const availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

// Helper function to generate avatar gradient
const generateAvatarGradient = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const baseHue = Math.abs(hash) % 360;
    const color1 = `hsl(${baseHue}, 90%, 65%)`;
    const color2 = `hsl(${(baseHue + 40) % 360}, 90%, 75%)`;

    return `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;
};

export default function Navbar() {
    const { totalItems, setIsCartOpen } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 🔥 НОВИЙ СТАН ДЛЯ БУРГЕР-МЕНЮ
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Закриваємо мобільне меню при зміні маршруту
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Hide Navbar on auth/verification pages
    if (pathname === '/login' || pathname === '/register' || pathname === '/verify') {
        return null;
    }

    const resolvedUser = isMounted ? user : null;
    const initial = resolvedUser?.username ? resolvedUser.username.charAt(0).toUpperCase() : '?';

    const currentSize = searchParams.get('size');
    const currentSort = searchParams.get('sort') || 'default';
    const inStock = searchParams.get('instock') === 'true';

    const avatarBackground = resolvedUser?.username
        ? generateAvatarGradient(resolvedUser.username)
        : 'linear-gradient(180deg, #EAEAEA 0%, #D4D4D4 100%)';

    const navbarThemeClass = isScrolled ? styles.navbarScrolled : styles.navbarTransparent;

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <header className={`${styles.navbar} ${navbarThemeClass}`}>
            {/* 🔥 КНОПКА БУРГЕРА */}
            <button
                className={`${styles.burgerBtn} ${isMobileMenuOpen ? styles.burgerBtnOpen : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <Link href="/" className={styles.navbar__logo}>
                Slick
            </Link>

            {/* 🔥 НАВІГАЦІЯ З МОБІЛЬНИМ КЛАСОМ */}
            <nav className={`${styles.navbar__nav} ${isMobileMenuOpen ? styles.navbar__navOpen : ''}`}>
                <Link href="/" className={styles.navbar__link} onClick={() => setIsMobileMenuOpen(false)}>
                    Home
                </Link>
                <Link href="/#trending" className={styles.navbar__link} onClick={() => setIsMobileMenuOpen(false)}>
                    Popular
                </Link>
                <Link href="/#best-selling" className={styles.navbar__link} onClick={() => setIsMobileMenuOpen(false)}>
                    Best Selling
                </Link>
                <Link href="/#reviews" className={styles.navbar__link} onClick={() => setIsMobileMenuOpen(false)}>
                    Review
                </Link>
            </nav>

            <div className={styles.navbar__actions}>
                {/* ... (Фільтри залишаються без змін) ... */}
                {pathname === '/shop' && (
                    <div style={{ position: 'relative' }}>
                        <button className={styles['navbar__btn-search']} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <Image src="/filter.svg" alt="Filter" width={24} height={24} />
                        </button>

                        {isFilterOpen && (
                            <div className={styles.filterWrapper}>
                                <div className={styles.filterArrow}></div>

                                <div className={styles.filterSection}>
                                    <h4 className={styles.filterTitle}>Size</h4>
                                    <div className={styles.sizeGrid}>
                                        <button
                                            onClick={() => updateFilter('size', null)}
                                            className={`${styles.sizeBtn} ${!currentSize ? styles.sizeBtnActive : ''}`}>
                                            All
                                        </button>
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updateFilter('size', size)}
                                                className={`${styles.sizeBtn} ${currentSize === size ? styles.sizeBtnActive : ''}`}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.filterBottomRow}>
                                    <div className={styles.sortWrapper}>
                                        <h4 className={styles.filterTitle}>Sort by</h4>
                                        <div onClick={() => setIsSortOpen(!isSortOpen)} className={styles.sortTrigger}>
                                            {currentSort === 'price_asc'
                                                ? 'Price: Low to High'
                                                : currentSort === 'price_desc'
                                                  ? 'Price: High to Low'
                                                  : 'Default'}
                                            <span
                                                className={styles.sortIcon}
                                                style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                                                ▼
                                            </span>
                                        </div>

                                        {isSortOpen && (
                                            <ul className={styles.sortList}>
                                                <li
                                                    onClick={() => {
                                                        updateFilter('sort', 'default');
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`${styles.sortItem} ${currentSort === 'default' ? styles.sortItemActive : ''}`}>
                                                    Default
                                                </li>
                                                <li
                                                    onClick={() => {
                                                        updateFilter('sort', 'price_asc');
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`${styles.sortItem} ${currentSort === 'price_asc' ? styles.sortItemActive : ''}`}>
                                                    Price: Low to High
                                                </li>
                                                <li
                                                    onClick={() => {
                                                        updateFilter('sort', 'price_desc');
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`${styles.sortItem} ${currentSort === 'price_desc' ? styles.sortItemActive : ''}`}>
                                                    Price: High to Low
                                                </li>
                                            </ul>
                                        )}
                                    </div>

                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={inStock}
                                            onChange={(e) => updateFilter('instock', e.target.checked ? 'true' : null)}
                                            className={styles.checkboxInput}
                                        />
                                        <span className={styles.customCheckbox}></span>
                                        In stock only
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <button className={styles['navbar__btn-search']}>
                    <Image src="/search.png" alt="Search" width={21} height={21} />
                </button>

                <button className={styles['navbar__btn-cart']} onClick={() => setIsCartOpen(true)}>
                    <div id="cart-icon-target" className={styles.cartWrapper}>
                        <Image src="/trolley.png" alt="Cart" width={30} height={30} />
                        <span suppressHydrationWarning className={`${alata.className} ${styles.cartBadge}`}>
                            {totalItems > 0 ? totalItems : ''}
                        </span>
                    </div>
                </button>

                <Link
                    href={resolvedUser ? '/profile' : '/login'}
                    className={styles.userAvatar}
                    style={{ background: avatarBackground }}
                    title={resolvedUser?.username || 'Login'}>
                    {initial}
                </Link>
            </div>
        </header>
    );
}
