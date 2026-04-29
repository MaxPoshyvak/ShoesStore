import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Описуємо, як виглядає один товар у кошику
export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    stock_quantity?: number;
    sizes?: (number | string)[];
}

// 2. Описуємо, що взагалі вміє наш кошик
interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string | number) => void;
    updateQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    isHydrated: boolean;
    setHydrated: (value: boolean) => void;
}

const normalizePrice = (price: number | string) => Number(price) || 0;

const normalizeItem = (item: CartItem): CartItem => ({
    ...item,
    id: Number(item.id),
    price: normalizePrice(item.price),
});

// 3. Створюємо саме сховище з магією persist (збереження в localStorage)
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isHydrated: false,

            setHydrated: (value: boolean) => set({ isHydrated: value }),

            // Функція додавання товару
            addItem: (newItem) => set((state) => {
                const normalizedNewItem = normalizeItem(newItem);
                const incomingQuantity = Math.max(1, Math.floor(Number(newItem.quantity) || 1));
                console.log('🛒 Adding item:', normalizedNewItem);
                const existingItem = state.items.find((item) => item.id === normalizedNewItem.id);
                
                if (existingItem) {
                    console.log('⬆️ Item exists, increasing quantity');
                    const maxQty = existingItem.stock_quantity;
                    const nextQuantity = existingItem.quantity + incomingQuantity;
                    if (typeof maxQty === 'number' && nextQuantity > maxQty) {
                        return { items: state.items };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.id === normalizedNewItem.id
                                ? { ...normalizeItem(item), quantity: nextQuantity }
                                : item
                        ),
                    };
                }
                console.log('✨ Adding new item');
                return { items: [...state.items, { ...normalizedNewItem, quantity: incomingQuantity }] };
            }),

            // Функція видалення товару
            removeItem: (id) => {
                const normalizedId = Number(id);
                return set((state) => ({
                    items: state.items.filter((item) => item.id !== normalizedId),
                }));
            },

            updateQuantity: (id, delta) => {
                const normalizedId = Number(id);
                return set((state) => ({
                    items: state.items.map((item) => {
                        if (item.id !== normalizedId) return item;

                        const nextQty = item.quantity + delta;
                        if (nextQty <= 0) return item;

                        const maxQty = item.stock_quantity;
                        if (typeof maxQty === 'number' && nextQty > maxQty) return item;

                        return { ...item, quantity: nextQty };
                    }),
                }));
            },

            // Функція повного очищення кошика
            clearCart: () => set({ items: [] }),

            // Функція для підрахунку загальної суми
            getTotalPrice: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'slick-store-cart',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.items = state.items.map(normalizeItem);
                    console.log('✅ Store hydrated:', state.items.length, 'items');
                    state.setHydrated(true);
                }
            },
        }
    )
);