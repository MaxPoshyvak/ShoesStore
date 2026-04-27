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
}

// 2. Описуємо, що взагалі вміє наш кошик
interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string | number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    isHydrated: boolean;
    setHydrated: (value: boolean) => void;
}

// 3. Створюємо саме сховище з магією persist (збереження в localStorage)
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isHydrated: false,

            setHydrated: (value: boolean) => set({ isHydrated: value }),

            // Функція додавання товару
            addItem: (newItem) => set((state) => {
                console.log('🛒 Adding item:', newItem);
                const existingItem = state.items.find((item) => item.id === newItem.id);
                
                if (existingItem) {
                    console.log('⬆️ Item exists, increasing quantity');
                    return {
                        items: state.items.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }
                console.log('✨ Adding new item');
                return { items: [...state.items, { ...newItem, quantity: 1 }] };
            }),

            // Функція видалення товару
            removeItem: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            })),

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
                    console.log('✅ Store hydrated:', state.items.length, 'items');
                    state.setHydrated(true);
                }
            },
        }
    )
);