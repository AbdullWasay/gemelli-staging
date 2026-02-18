// "use client"
// import ViewCartCard from "@/components/ui/ViewCartCard/ViewCartCard";
// import { useState, useEffect } from "react";
// import paymentMethod from "@/assets/images/payment.png";
// import Image from "next/image";
// import PromoBanner from "./PromoBanner";
// import Link from "next/link";

// type CartItem = {
//     id: string;
//     title: string;
//     price: string;
//     currency: string;
//     image: string;
//     quantity: number;
//     brand: string;
//     size: string;
// };

// function ViewCart() {
//     const [cartItems, setCartItems] = useState<CartItem[]>([]);
//     const [isLoaded, setIsLoaded] = useState(false);

//     useEffect(() => {
//         const loadCartData = () => {
//             try {
//                 const storedCart = localStorage.getItem("cart");
//                 if (storedCart) {
//                     const parsedCart = JSON.parse(storedCart);
//                     setCartItems(parsedCart);
//                 }
//             } catch (error) {
//                 console.error("Error loading cart from localStorage:", error);
//             } finally {
//                 setIsLoaded(true);
//             }
//         };

//         // Load cart on mount
//         loadCartData();

//         const handleCartUpdate = () => {
//             loadCartData();
//         };

//         window.addEventListener("cartUpdated", handleCartUpdate);

//         // Cleanup
//         return () => {
//             window.removeEventListener("cartUpdated", handleCartUpdate);
//         };
//     }, []);

//     const updateLocalStorage = (updatedItems: CartItem[]) => {
//         try {
//             localStorage.setItem("cart", JSON.stringify(updatedItems));

//             const event = new Event("cartUpdated");
//             window.dispatchEvent(event);
//         } catch (error) {
//             console.error("Error updating cart in localStorage:", error);
//         }
//     };

//     const handleIncrease = (id: string) => {
//         const updatedItems = cartItems.map(item =>
//             item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//         setCartItems(updatedItems);
//         updateLocalStorage(updatedItems);
//     };

//     const handleDecrease = (id: string) => {
//         const updatedItems = cartItems.map(item =>
//             item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
//         );
//         setCartItems(updatedItems);
//         updateLocalStorage(updatedItems);
//     };

//     const handleRemove = (id: string) => {
//         const updatedItems = cartItems.filter(item => item.id !== id);
//         setCartItems(updatedItems);
//         updateLocalStorage(updatedItems);
//     };

//     // Show loading state while cart data is being loaded
//     if (!isLoaded) {
//         return <div className="container mt-5 text-center">Loading cart...</div>;
//     }

//     return (
//         <div className="container mx-auto mb-7 mt-12 sm:mt-12 font-poppins">
//             <h1 className="text-[28px] md:text-[32px] font-semibold text-center">My Cart</h1>
//             <div className="my-8"><PromoBanner /></div>
//             <div className="flex flex-col lg:flex-row gap-4 md:gap-5">
//                 <div className="space-y-4 w-full">
//                     {cartItems.map(item => (
//                         <ViewCartCard
//                             key={item.id}
//                             product={{
//                                 id: item.id,
//                                 name: item.title,
//                                 size: item.size || "5",
//                                 brand: item.brand || "BRAND",
//                                 price: typeof item.price === "string" && item.price.includes(" ")
//                                     ? parseFloat(item.price.split(" ")[0])
//                                     : Number(item.price),
//                                 currency: item.currency || "MDL",
//                                 imageUrl: item.image,
//                                 quantity: item.quantity
//                             }}
//                             onIncrease={handleIncrease}
//                             onDecrease={handleDecrease}
//                             onRemove={handleRemove}
//                         />
//                     ))}
//                 </div>

//                 <hr />
//                 {/* Cart summary section */}
//                 <div className="md:bg-[#F9F9F9] p-3 md:p-6 rounded-lg w-full h-full min-h-fit flex flex-col">
//                     <h1 className="text-lg md:text-xl text-text-black font-semibold">Order Summary</h1>
//                     <div className="flex justify-between mb-2 mt-5 md:mt-7">
//                         <span className="text-text-secondary font-medium text-base md:text-lg">Sub-Total</span>
//                         <span className="font-medium text-text-secondary text-base md:text-lg">
//                             {cartItems.reduce((sum, item) => {
//                                 const price = typeof item.price === "string" && item.price.includes(" ")
//                                     ? parseFloat(item.price.split(" ")[0])
//                                     : Number(item.price);
//                                 return sum + (price * item.quantity);
//                             }, 0).toFixed(2)} {cartItems[0]?.currency || "USD"}
//                         </span>
//                     </div>
//                     <div className="flex justify-between mb-4">
//                         <span className="text-text-secondary font-medium text-base md:text-lg">Total</span>
//                         <span className="font-medium text-text-secondary text-base md:text-lg">
//                             {cartItems.reduce((sum, item) => {
//                                 const price = typeof item.price === "string" && item.price.includes(" ")
//                                     ? parseFloat(item.price.split(" ")[0])
//                                     : Number(item.price);
//                                 return sum + (price * item.quantity);
//                             }, 0).toFixed(2)} {cartItems[0]?.currency || "USD"}
//                         </span>
//                     </div>
//                     <div>
//                         <p className="text-base text-[#FF3A44] font-medium text-center mt-5">Pay In 3 Installments</p>
//                         <p className="text-base text-center text-text-secondary font-medium my-3">Or</p>
//                         <Link href={"/checkout"}>
//                             <button className="w-full bg-primary text-white py-[15px] rounded-xl font-semibold hover:bg-primary/90 transition-colors uppercase">
//                                 CHECKOUT
//                             </button>
//                         </Link>
//                         <Link href={"/"}>
//                             <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:border-primary/60 hover:text-primary/60 transition-colors uppercase mt-4">
//                                 continue shopping
//                             </button>
//                         </Link>
//                     </div>
//                     <div className="flex flex-col items-center justify-center">
//                         <p className="text-lg text-text-black font-medium text-center my-5">We accept</p>
//                         <Image src={paymentMethod} alt="Payment Methods" width={320} height={50} />
//                         <p className="text-sm md:text-lg text-text-secondary font-medium text-center my-5">Got a discount code? Add it in the next step.</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ViewCart;

/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import ViewCartCard from "@/components/ui/ViewCartCard/ViewCartCard";
import { useState, useEffect } from "react";
import paymentMethod from "@/assets/images/payment.png";
import Image from "next/image";
import PromoBanner from "./PromoBanner";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";
import { 
    useGetCartQuery, 
    useUpdateCartItemMutation, 
    useRemoveFromCartMutation 
} from "@/redux/features/cart/cartApi";

type LocalCartItem = {
    id: string;
    title: string;
    price: string | number;
    currency: string;
    image: string;
    quantity: number;
    brand: string;
    size: string;
};

function ViewCart() {
    const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const user = useSelector(selectCurrentUser);
    const accessToken = useSelector(useCurrentToken);
    const isAuthenticated = !!user && !!accessToken;

    // Fetch cart from database if authenticated
    const { data: cartData, isLoading: cartLoading } = useGetCartQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cart = cartData?.data?.cart;
    const dbCartItems = cart?.items || [];

    // Load localStorage cart for non-authenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            const loadCartData = () => {
                try {
                    const storedCart = localStorage.getItem("cart");
                    if (storedCart) {
                        const parsedCart = JSON.parse(storedCart);
                        setLocalCartItems(parsedCart);
                    }
                } catch (error) {
                    console.error("Error loading cart from localStorage:", error);
                } finally {
                    setIsLoaded(true);
                }
            };

            loadCartData();

            const handleCartUpdate = () => {
                loadCartData();
            };

            window.addEventListener("cartUpdated", handleCartUpdate);

            return () => {
                window.removeEventListener("cartUpdated", handleCartUpdate);
            };
        } else {
            setIsLoaded(true);
        }
    }, [isAuthenticated]);

    const updateLocalStorage = (updatedItems: LocalCartItem[]) => {
        try {
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            const event = new Event("cartUpdated");
            window.dispatchEvent(event);
        } catch (error) {
            console.error("Error updating cart in localStorage:", error);
        }
    };

    const handleIncrease = async (id: string) => {
        if (isAuthenticated) {
            // Find the cart item
            const cartItem = dbCartItems.find(item => item.productId === id);
            if (cartItem) {
                try {
                    await updateCartItem({
                        cartItemId: cartItem.id,
                        quantity: cartItem.quantity + 1,
                    }).unwrap();
                } catch (error) {
                    console.error("Error updating cart item:", error);
                }
            }
        } else {
            const updatedItems = localCartItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setLocalCartItems(updatedItems);
            updateLocalStorage(updatedItems);
        }
    };

    const handleDecrease = async (id: string) => {
        if (isAuthenticated) {
            const cartItem = dbCartItems.find(item => item.productId === id);
            if (cartItem && cartItem.quantity > 1) {
                try {
                    await updateCartItem({
                        cartItemId: cartItem.id,
                        quantity: cartItem.quantity - 1,
                    }).unwrap();
                } catch (error) {
                    console.error("Error updating cart item:", error);
                }
            }
        } else {
            const updatedItems = localCartItems.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
            );
            setLocalCartItems(updatedItems);
            updateLocalStorage(updatedItems);
        }
    };

    const handleRemove = async (id: string) => {
        if (isAuthenticated) {
            const cartItem = dbCartItems.find(item => item.productId === id);
            if (cartItem) {
                try {
                    await removeFromCart(cartItem.id).unwrap();
                } catch (error) {
                    console.error("Error removing cart item:", error);
                }
            }
        } else {
            const updatedItems = localCartItems.filter(item => item.id !== id);
            setLocalCartItems(updatedItems);
            updateLocalStorage(updatedItems);
        }
    };

    // Show loading state
    if (!isLoaded || (isAuthenticated && cartLoading)) {
        return (
            <div className="container mx-auto mt-5">
                <div className="flex justify-center items-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    // Determine which cart to display
    const cartItems = isAuthenticated ? dbCartItems : localCartItems;
    const isEmpty = cartItems.length === 0;

    // Helper: effective price (discount when on sale) for DB cart items
    const getEffectivePrice = (product: { price: number; onSale?: boolean; discountPrice?: number | null }) =>
        (product?.onSale && product?.discountPrice != null) ? product.discountPrice! : (product?.price ?? 0);

    // Calculate totals
    const subTotal = isAuthenticated
        ? dbCartItems.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0)
        : localCartItems.reduce((sum, item) => {
            const price = typeof item.price === "string" && item.price.toString().includes(" ")
                ? parseFloat(item.price.toString().split(" ")[0])
                : Number(item.price);
            return sum + price * item.quantity;
        }, 0);

    const currency = "MDL";

    if (isEmpty) {
        return (
            <div className="container mx-auto mb-7 mt-12 sm:mt-12 font-poppins">
                <h1 className="text-[28px] md:text-[32px] font-semibold text-center">My Cart</h1>
                <div className="text-center py-10 mt-8">
                    <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
                    <Link href="/all-product">
                        <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mb-7 mt-12 sm:mt-12 font-poppins">
            <h1 className="text-[28px] md:text-[32px] font-semibold text-center">My Cart</h1>
            <div className="my-8"><PromoBanner /></div>
            <div className="flex flex-col lg:flex-row gap-4 md:gap-5">
                <div className="space-y-4 w-full">
                    {isAuthenticated ? (
                        // Database cart items - use discount price when on sale
                        dbCartItems.map((item) => {
                            const primaryImage = item.product.productImages.find(img => img.isPrimary);
                            const imageUrl = primaryImage?.url || item.product.productImages[0]?.url;
                            const product = item.product as { price: number; onSale?: boolean; discountPrice?: number | null };
                            const effectivePrice = getEffectivePrice(product);
                            const originalPrice = product.onSale && product.discountPrice != null ? product.price : undefined;

                            return (
                                <ViewCartCard
                                    key={item.id}
                                    product={{
                                        id: item.productId,
                                        name: item.product.name,
                                        size: item.size || "Default",
                                        brand: item.product.seller?.name || "Brand",
                                            price: effectivePrice,
                                            currency: "MDL",
                                            originalPrice,
                                            onSale: product.onSale,
                                        imageUrl: imageUrl || "/placeholder.svg",
                                        quantity: item.quantity,
                                    }}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemove}
                                />
                            );
                        })
                    ) : (
                        // LocalStorage cart items
                        localCartItems.map((item) => (
                            <ViewCartCard
                                key={item.id}
                                product={{
                                    id: item.id,
                                    name: item.title,
                                    size: item.size || "5",
                                    brand: item.brand || "BRAND",
                                    price: typeof item.price === "string" && item.price.toString().includes(" ")
                                        ? parseFloat(item.price.toString().split(" ")[0])
                                        : Number(item.price),
                                    currency: item.currency || "MDL",
                                    imageUrl: item.image,
                                    quantity: item.quantity,
                                }}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={handleRemove}
                            />
                        ))
                    )}
                </div>

                <hr />
                {/* Cart summary section */}
                <div className="md:bg-[#F9F9F9] p-3 md:p-6 rounded-lg w-full h-full min-h-fit flex flex-col">
                    <h1 className="text-lg md:text-xl text-text-black font-semibold">Order Summary</h1>
                    <div className="flex justify-between mb-2 mt-5 md:mt-7">
                        <span className="text-text-secondary font-medium text-base md:text-lg">Sub-Total</span>
                        <span className="font-medium text-text-secondary text-base md:text-lg">
                            {subTotal.toFixed(2)} {currency}
                        </span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-text-secondary font-medium text-base md:text-lg">Total</span>
                        <span className="font-medium text-text-secondary text-base md:text-lg">
                            {subTotal.toFixed(2)} {currency}
                        </span>
                    </div>
                    <div>
                        <p className="text-base text-[#FF3A44] font-medium text-center mt-5">Pay In 3 Installments</p>
                        <p className="text-base text-center text-text-secondary font-medium my-3">Or</p>
                        <Link href={"/checkout"}>
                            <button className="w-full bg-primary text-white py-[15px] rounded-xl font-semibold hover:bg-primary/90 transition-colors uppercase">
                                CHECKOUT
                            </button>
                        </Link>
                        <Link href={"/all-product"}>
                            <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:border-primary/60 hover:text-primary/60 transition-colors uppercase mt-4">
                                continue shopping
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg text-text-black font-medium text-center my-5">We accept</p>
                        <Image src={paymentMethod} alt="Payment Methods" width={320} height={50} />
                        <p className="text-sm md:text-lg text-text-secondary font-medium text-center my-5">Got a discount code? Add it in the next step.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewCart;