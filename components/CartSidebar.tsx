"use client";

import Image from "next/image";
import { useCart } from "./context/CartContext";
import styles from "./CartSidebar.module.css";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
    return (
        <div
            className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : styles.overlayClosed}`}
            onClick={() => setIsCartOpen(false)}
        >
            <div
                className={`${styles.sidebar} ${isCartOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2>Your Cart</h2>
                    <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>✕</button>
                </div>

                <div className={styles.itemsList}>
                    {cartItems.length === 0 ? (
                        <p className={styles.emptyMsg}>Your cart is empt :(</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className={styles.item}>
                                <div className={styles.imgWrapper}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <h4>{item.name}</h4>
                                    <p>₴ {Number(item.price).toFixed(2)}</p>
                                    {item.size && <p className={styles.size}>Size: {item.size}</p>}
                                    <div className={styles.quantityControls}>
                                        <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>
                                </div>
                                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                    <Trash2 width={20} height={20}/>
                                </button>
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
                        <Link href="/checkout" >
                            <button
                                onClick={setIsCartOpen.bind(null, false)} // Close cart when going to checkout
                                className={styles.checkoutBtn} // Your button class
                            >Checkout</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}