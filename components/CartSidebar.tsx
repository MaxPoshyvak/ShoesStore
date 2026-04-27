"use client";

import Image from "next/image";
import { useCart } from "./context/CartContext";
import styles from "./CartSidebar.module.css";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
    const { token } = useAuth(); // Get token for backend
    const router = useRouter();
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!token) {
            alert("Please log in to complete your order.");
            router.push('/login'); // Redirect to login
            return;
        }

        setIsCheckoutLoading(true);

        try {
            const orderItems = cartItems.map(item => ({
                good_id: String(item.id),
                quantity: item.quantity
            }));

            const orderResponse = await fetch('https://shoesstore-server.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass token!
                },
                body: JSON.stringify({
                    shipping_address: "Kyiv, Ukraine", // For now hardcoded, you don't have address form yet
                    payment_method: "card",
                    items: orderItems
                })
            });

            if (!orderResponse.ok) {
                // Читаємо справжню причину помилки від бекенду
                const errorData = await orderResponse.json().catch(() => ({}));
                const errorMessage = errorData.message || "Помилка сервера при створенні замовлення";

                alert(`Помилка: ${errorMessage}`);
                setIsCheckoutLoading(false);
                return; // Зупиняємо функцію, щоб не йти до Stripe
            }

            const orderData = await orderResponse.json();
            const orderId = orderData.order.id; // Get the ID of the created order

            const paymentResponse = await fetch(`https://shoesstore-server.onrender.com/api/payments/create/${orderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!paymentResponse.ok) {
                throw new Error("Failed to connect to Stripe");
            }

            const paymentData = await paymentResponse.json();

            // STEP 3: Redirect user to Stripe payment page
            if (paymentData.url) {
                window.location.href = paymentData.url;
            }

        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong while creating payment. Try again.");
        } finally {
            setIsCheckoutLoading(false);
        }
    };
    // State to show user that payment redirect is in progress
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
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
                                    <Image src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'contain' }} />
                                </div>
                                <div className={styles.details}>
                                    <h4>{item.name}</h4>
                                    <p>₹ {item.price.toFixed(2)}</p>
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
                            <span>₹ {totalPrice.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" >
                            <button
                                onClick={setIsCartOpen.bind(null, false)} // Close cart when going to checkout
                                className={styles.checkoutBtn} // Your button class
                                disabled={isCheckoutLoading} // Disable button while request is in progress
                            >Checkout</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}