"use client";

import Image from "next/image";
import { useCart } from "./context/CartContext";
import styles from "./CartSidebar.module.css";

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

    // ❌ ВИДАЛИЛИ: if (!isCartOpen) return null;

    return (
        // ✅ ДОДАЛИ: Змінюємо класи залежно від isCartOpen
        <div 
            className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : styles.overlayClosed}`} 
            onClick={() => setIsCartOpen(false)}
        >
            <div 
                className={`${styles.sidebar} ${isCartOpen ? styles.sidebarOpen : styles.sidebarClosed}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2>Твій кошик</h2>
                    <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>✕</button>
                </div>

                <div className={styles.itemsList}>
                    {cartItems.length === 0 ? (
                        <p className={styles.emptyMsg}>Кошик порожній :(</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className={styles.item}>
                                <div className={styles.imgWrapper}>
                                    <Image src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'contain' }} />
                                </div>
                                <div className={styles.details}>
                                    <h4>{item.name}</h4>
                                    <p>₹ {item.price}</p>
                                    <div className={styles.quantityControls}>
                                        <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>
                                </div>
                                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                    🗑️

                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Разом:</span>
                            <span>₹ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button className={styles.checkoutBtn}>Оформити замовлення</button>
                    </div>
                )}
            </div>
        </div>
    );
}