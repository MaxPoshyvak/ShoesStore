"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useCart } from "./context/CartContext";
import { useAuth } from "./AuthContext";

import { Alata } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const alata = Alata({
    weight: '400',
    subsets: ["latin"]
});

const availableSizes = ["39", "40", "41", "42", "43", "44", "45"];

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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // Hide Navbar on auth pages
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    const resolvedUser = isMounted ? user : null;
    const initial = resolvedUser?.username ? resolvedUser.username.charAt(0).toUpperCase() : "?";
    
    const currentSize = searchParams.get('size');
    const currentSort = searchParams.get('sort') || 'default';
    const inStock = searchParams.get('instock') === 'true';
    
    const avatarBackground = resolvedUser?.username
        ? generateAvatarGradient(resolvedUser.username)
        : "linear-gradient(180deg, #EAEAEA 0%, #D4D4D4 100%)";

    const navbarThemeClass = isScrolled ? styles.navbarScrolled : styles.navbarTransparent;

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <header className={`${styles.navbar} ${navbarThemeClass}`}>

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
                
                {pathname === '/shop' && (
                    <div style={{ position: 'relative' }}>
                        <button
                            className={styles["navbar__btn-search"]}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Image src="/filter.svg" alt="Filter" width={24} height={24} />
                        </button>

                        {isFilterOpen && (
                            <div style={{
                                position: 'absolute', top: '40px', right: '-63px', width: '320px',
                                backgroundColor: '#EBEBEB', padding: '20px', borderRadius: '15px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, fontFamily: 'Poppins'
                            }}>
                                {/* Triangle indicator */}
                                <div style={{ 
                                    position: 'absolute', top: '-10px', right: '65px', 
                                    width: '0', height: '0', 
                                    borderLeft: '10px solid transparent', 
                                    borderRight: '10px solid transparent', 
                                    borderBottom: '10px solid #EBEBEB' 
                                }}></div>

                                <div style={{ marginBottom: '15px' }}>
                                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>Size:</p>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => updateFilter('size', null)}
                                            style={{ 
                                                padding: '5px 12px', borderRadius: '8px', border: '1px solid #ccc', 
                                                background: !currentSize ? '#000' : '#fff', 
                                                color: !currentSize ? '#fff' : '#000', cursor: 'pointer' 
                                            }}
                                        >All</button>
                                        {availableSizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => updateFilter('size', size)}
                                                style={{ 
                                                    padding: '5px 12px', borderRadius: '8px', border: '1px solid #ccc', 
                                                    background: currentSize === size ? '#000' : '#fff', 
                                                    color: currentSize === size ? '#fff' : '#000', cursor: 'pointer' 
                                                }}
                                            >{size}</button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    
                                    <div style={{ position: 'relative', width: '170px' }}>
                                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Sort by:</p>
                                        
                                        <div
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            style={{ 
                                                padding: '8px 10px', background: '#fff', border: '1px solid #ccc', 
                                                borderRadius: '5px', cursor: 'pointer', fontSize: '13px', 
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                                            }}
                                        >
                                            {currentSort === 'price_asc' ? 'Price: Low to High' : currentSort === 'price_desc' ? 'Price: High to Low' : 'Default'}
                                            <span style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0)', fontSize: '10px', marginLeft: '5px' }}>▼</span>
                                        </div>

                                        {isSortOpen && (
                                            <ul style={{
                                                position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff',
                                                border: '1px solid #ccc', borderRadius: '5px', listStyle: 'none', padding: '5px 0',
                                                margin: '5px 0 0 0', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}>
                                                <li
                                                    onClick={() => { updateFilter('sort', 'default'); setIsSortOpen(false); }}
                                                    style={{ 
                                                        padding: '8px 12px', cursor: 'pointer', fontSize: '13px', 
                                                        background: currentSort === 'default' ? '#000' : '#fff', 
                                                        color: currentSort === 'default' ? '#fff' : '#000' 
                                                    }}
                                                >
                                                    Default
                                                </li>
                                                <li
                                                    onClick={() => { updateFilter('sort', 'price_asc'); setIsSortOpen(false); }}
                                                    style={{ 
                                                        padding: '8px 12px', cursor: 'pointer', fontSize: '13px', 
                                                        background: currentSort === 'price_asc' ? '#000' : '#fff', 
                                                        color: currentSort === 'price_asc' ? '#fff' : '#000' 
                                                    }}
                                                >
                                                    Price: Low to High
                                                </li>
                                                <li
                                                    onClick={() => { updateFilter('sort', 'price_desc'); setIsSortOpen(false); }}
                                                    style={{ 
                                                        padding: '8px 12px', cursor: 'pointer', fontSize: '13px', 
                                                        background: currentSort === 'price_desc' ? '#000' : '#fff', 
                                                        color: currentSort === 'price_desc' ? '#fff' : '#000' 
                                                    }}
                                                >
                                                    Price: High to Low
                                                </li>
                                            </ul>
                                        )}
                                    </div>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer', marginTop: '30px' }}>
                                        <input
                                            type="checkbox"
                                            checked={inStock}
                                            onChange={(e) => updateFilter('instock', e.target.checked ? 'true' : null)}
                                            style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        In stock only
                                    </label>

                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button className={styles["navbar__btn-search"]}>
                    <Image src="/search.png" alt="Search" width={21} height={21} />
                </button>

                <button
                    className={styles["navbar__btn-cart"]}
                    onClick={() => setIsCartOpen(true)}
                >
                    <div id="cart-icon-target" className={styles.cartWrapper}>
                        <Image src="/trolley.png" alt="Cart" width={30} height={30} />
                        <span
                            suppressHydrationWarning
                            className={`${alata.className} ${styles.cartBadge}`}
                        >
                            {totalItems > 0 ? totalItems : ""}
                        </span>
                    </div>
                </button>

                <Link
                    href={resolvedUser ? "/profile" : "/login"}
                    className={styles.userAvatar}
                    style={{ background: avatarBackground }}
                    title={resolvedUser?.username || "Login"}
                >
                    {initial}
                </Link>

            </div>
        </header>
    );
}