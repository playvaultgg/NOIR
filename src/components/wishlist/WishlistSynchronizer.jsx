"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";

export default function WishlistSynchronizer() {
    const { data: session } = useSession();
    const initializeWishlist = useWishlistStore(state => state.initializeWishlist);

    useEffect(() => {
        if (session?.user) {
            initializeWishlist();
        }
    }, [session, initializeWishlist]);

    return null; // Side-effect only component
}
