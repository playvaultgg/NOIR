import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            // UI Actions
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // Cart Operations
            addItem: (product) => {
                const currentItems = get().items;
                const existingItemIndex = currentItems.findIndex(
                    (item) => item.id === product.id && item.size === product.size
                );

                if (existingItemIndex > -1) {
                    const updatedItems = [...currentItems];
                    updatedItems[existingItemIndex].quantity += 1;
                    set({ items: updatedItems, isOpen: true });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity: 1 }],
                        isOpen: true
                    });
                }
            },

            removeItem: (productId, size) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.id === productId && item.size === size)
                    )
                }));
            },

            increaseQty: (productId, size) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId && item.size === size
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                }));
            },

            decreaseQty: (productId, size) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId && item.size === size && item.quantity > 1
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                }));
            },

            clearCart: () => set({ items: [] }),

            // ULTRA System Getters
            getSubtotal: () => {
                return get().items.reduce((total, item) => total + (item.priceAmount * item.quantity), 0);
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: 'noir-cart-storage',
        }
    )
);
