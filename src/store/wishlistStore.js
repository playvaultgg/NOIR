import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            toggleWishlist: (product) => {
                const currentItems = get().items;
                const isExisting = currentItems.some(item => item.id === product.id);

                if (isExisting) {
                    set({ items: currentItems.filter(item => item.id !== product.id) });
                } else {
                    set({ items: [...currentItems, product] });
                }
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== productId)
                }));
            },

            isInWishlist: (productId) => {
                return get().items.some(item => item.id === productId);
            }
        }),
        {
            name: 'noir-wishlist-storage',
        }
    )
);
