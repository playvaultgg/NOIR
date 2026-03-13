import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            initializeWishlist: async () => {
                set({ isLoading: true });
                try {
                    const res = await fetch('/api/wishlist/get');
                    if (res.ok) {
                        const data = await res.json();
                        set({ items: data });
                    }
                } catch (err) {
                    console.error("Wishlist Initialization Error:", err);
                } finally {
                    set({ isLoading: false });
                }
            },

            toggleWishlist: async (product) => {
                const currentItems = get().items;
                const isExisting = currentItems.some(item => item.id === product.id);

                // Optimistic UI Update
                if (isExisting) {
                    set({ items: currentItems.filter(item => item.id !== product.id) });
                    try {
                        await fetch('/api/wishlist/remove', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId: product.id })
                        });
                    } catch (err) {
                        console.error("Wishlist Sync Error (Remove):", err);
                    }
                } else {
                    set({ items: [...currentItems, product] });
                    try {
                        await fetch('/api/wishlist/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId: product.id })
                        });
                    } catch (err) {
                        console.error("Wishlist Sync Error (Add):", err);
                    }
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
