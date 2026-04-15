"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock_quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void; // Додаємо видалення
    updateQuantity: (id: string, delta: number) => void; // Додаємо зміну кількості
    totalItems: number;
    totalPrice: number; // Додаємо загальну суму
    isCartOpen: boolean; // Стан кошика
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: CartItem) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity >= product.stock_quantity) return prev;
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Автоматично відкриваємо кошик при додаванні
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= item.stock_quantity) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQuantity, 
            totalItems, totalPrice, isCartOpen, setIsCartOpen 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}