"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useCartStore } from "@/store/useCartStore";

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock_quantity: number;
    sizes?: (number | string)[];

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
    const storeItems = useCartStore((state) => state.items);
    const updateStoreQuantity = useCartStore((state) => state.updateQuantity);
    const removeStoreItem = useCartStore((state) => state.removeItem);
    const addStoreItem = useCartStore((state) => state.addItem);
    useEffect(() => {
        // Ensure persist rehydrates ASAP (esp. after refresh)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useCartStore as any).persist?.rehydrate?.();
    }, []);

    const cartItems: CartItem[] = storeItems.map((item) => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        stock_quantity: item.stock_quantity ?? Number.POSITIVE_INFINITY,
        sizes: item.sizes,
    }));
    const [isCartOpen, setIsCartOpen] = useState(false);


    const addToCart = (product: CartItem) => {
        addStoreItem({
            id: Number(product.id),
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            stock_quantity: product.stock_quantity,
            sizes: product.sizes,
        });
        // setIsCartOpen(true); // Автоматично відкриваємо кошик при додаванні
    };

    const removeFromCart = (id: string) => {
        removeStoreItem(id);
    };

    const updateQuantity = (id: string, delta: number) => {
        updateStoreQuantity(id, delta);
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