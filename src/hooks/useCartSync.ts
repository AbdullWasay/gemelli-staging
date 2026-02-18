"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";

export function useCartSync() {
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector(
    (state: RootState) => state.auth.access_token
  );
  const [addToCart] = useAddToCartMutation();

  useEffect(() => {
    const syncCart = async () => {
      // Only sync if user just logged in
      if (!user || !accessToken) return;

      try {
        const localCart = localStorage.getItem("cart");
        if (!localCart) return;

        const cartItems = JSON.parse(localCart);
        if (!Array.isArray(cartItems) || cartItems.length === 0) return;

        console.log("🔄 Syncing", cartItems.length, "items to database...");

        // Add each item to database
        for (const item of cartItems) {
          try {
            await addToCart({
              productId: item.id,
              quantity: item.quantity,
              size: item.size === "Default" ? undefined : item.size,
            }).unwrap();

            console.log("✅ Synced:", item.title);
          } catch (error) {
            console.error("❌ Error syncing:", item.title, error);
          }
        }

        // Clear localStorage after successful sync
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        console.log("✅ Cart sync complete!");
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    // Small delay to ensure user state is fully loaded
    const timeout = setTimeout(syncCart, 1000);
    return () => clearTimeout(timeout);
  }, [user, accessToken, addToCart]);
}
