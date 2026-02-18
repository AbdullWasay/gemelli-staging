/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/addToCart.ts
import { toast } from "react-toastify";

interface AddToCartParams {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  isAuthenticated: boolean;
  addToCartMutation?: (data: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }) => any; // Changed from Promise<any>
  productData?: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    onSale?: boolean;
    image: string;
    brand?: string;
    currency?: string;
    color?: string;
  };
}

/**
 * Universal add to cart function that works for both authenticated and guest users
 */
export const addToCart = async ({
  productId,
  quantity,
  size,
  color,
  isAuthenticated,
  addToCartMutation,
  productData,
}: AddToCartParams) => {
  try {
    if (isAuthenticated && addToCartMutation) {
      // Add to database cart for authenticated users
      const mutation = addToCartMutation({
        productId,
        quantity,
        size,
        color,
      });

      // Check if mutation has unwrap method (RTK Query)
      const result =
        "unwrap" in mutation ? await mutation.unwrap() : await mutation;

      if (result.success) {
        toast.success("Added to cart!");
        return { success: true };
      } else {
        toast.error(result.error || "Failed to add to cart");
        return { success: false };
      }
    } else {
      // Add to localStorage for guest users
      if (!productData) {
        toast.error("Product data is required for guest users");
        return { success: false };
      }

      const storedCart = localStorage.getItem("cart");
      const cart = storedCart ? JSON.parse(storedCart) : [];

      // Normalize size: "Default" and empty string are equivalent for matching
      const normalizedSize = (size === "Default" || !size) ? "" : String(size);
      const normalizedItemSize = (s: string) => (s === "Default" || !s) ? "" : String(s);

      // Check if item already exists (match by id, size, and color)
      const existingItemIndex = cart.findIndex(
        (item: any) =>
          item.id === productId &&
          normalizedItemSize(item.size || "") === normalizedSize &&
          (!color || (item.color || "") === (color || ""))
      );

      const effectivePrice = productData.onSale && productData.discountPrice != null
        ? productData.discountPrice
        : productData.price;

      if (existingItemIndex !== -1) {
        // Update quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.push({
          id: productId,
          title: productData.name,
          price: `${effectivePrice.toFixed(2)} ${
            productData.currency || "MDL"
          }`,
          currency: productData.currency || "MDL",
          image: productData.image,
          quantity,
          brand: productData.brand || "Brand",
          size: normalizedSize || "Default",
          color: color || undefined,
        });
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Added to cart!");
      return { success: true };
    }
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    toast.error(error?.data?.error || "Failed to add to cart");
    return { success: false, error };
  }
};

// Example usage in a product page component:
/*
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useSelector } from "react-redux";
import { selectCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";
import { addToCart } from "@/utils/addToCart";

function ProductPage() {
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(useCurrentToken);
  const isAuthenticated = !!user && !!accessToken;
  
  const [addToCartMutation] = useAddToCartMutation();

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      quantity: 1,
      size: selectedSize,
      isAuthenticated,
      addToCartMutation,
      productData: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        currency: "MDL",
      },
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
*/

