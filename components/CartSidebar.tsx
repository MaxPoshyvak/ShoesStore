'use client';

import Image from 'next/image';
import { useCart } from './context/CartContext';
import styles from './CartSidebar.module.css';
import Link from 'next/link';
// 🔥 Додали ShoppingBag з lucide-react
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

    return (
        <div
            className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : styles.overlayClosed}`}
            onClick={() => setIsCartOpen(false)}>
            <div
                className={`${styles.sidebar} ${isCartOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
                onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Your Cart</h2>
                    <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
                        ✕
                    </button>
                </div>

                <div className={styles.itemsList}>
                    {cartItems.length === 0 ? (
                        /* 🔥 НОВИЙ КРУТИЙ ДИЗАЙН ПУСТОГО КОШИКА */
                        <div className={styles.emptyCartContainer}>
                            <div className={styles.emptyCartIcon}>
                                <ShoppingBag size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className={styles.emptyCartTitle}>Your cart is empty</h3>
                            <p className={styles.emptyCartDesc}>
                                Looks like you haven&apos;t added any sneakers yet.
                                <br /> Discover our latest drops!
                            </p>
                            <Link href="/shop" onClick={() => setIsCartOpen(false)} className={styles.emptyCartBtn}>
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={`${item.id}-${item.size ?? 'nosize'}-${index}`} className={styles.item}>
                                <div className={styles.imgWrapper}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.detailsTop}>
                                        <h4>{item.name}</h4>
                                        {item.size && <p className={styles.size}>Size: {item.size}</p>}
                                        <p className={styles.price}>₴ {Number(item.price).toFixed(2)}</p>
                                    </div>

                                    {/* Групуємо кнопки кількості та видалення в один рядок */}
                                    <div className={styles.actionsRow}>
                                        <div className={styles.quantityControls}>
                                            <button onClick={() => updateQuantity(item.id, -1, item.size)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1, item.size)}>+</button>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeFromCart(item.id, item.size)}>
                                            <Trash2 width={18} height={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Total:</span>
                            <span>₴ {totalPrice.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout">
                            <button onClick={() => setIsCartOpen(false)} className={styles.checkoutBtn}>
                                Checkout
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
