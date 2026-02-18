
// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Minus, Plus } from "lucide-react";
// import { Dialog, DialogContent, DialogTitle } from "../Dialog/dialog";
// import { Button } from "antd";
// import { CloseOutlined } from "@ant-design/icons";
// import { LuTrash2 } from "react-icons/lu";
// import { TbTruckDelivery } from "react-icons/tb";
// import { useRouter } from "next/navigation";
// import { Currency } from "@/redux/reducers/currencySlice";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";

// // Add global style to hide scrollbars while maintaining scroll functionality
// const scrollbarHideStyle = `
//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
//   .scrollbar-hide {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
// `;

// interface CartItem {
//   id: string;
//   name: string;
//   title: string;
//   price: string | number;
//   image: string;
//   quantity: number;
//   brand?: string;
//   size?: string;
//   currency?: string;
// }

// interface CartModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   items: CartItem[];
// }

// export function CartModal({ isOpen, onClose, items }: CartModalProps) {
//   const [cartItems, setCartItems] = useState<CartItem[]>(items);
//   const router = useRouter();

//   useEffect(() => {
//     setCartItems(items);
//   }, [items]);

//   const { currency: globalCurrency, exchangeRates } = useSelector(
//     (state: RootState) => state.currency
//   );

//   const getConvertedPrice = (
//     price: string | number,
//     currency: string = "USD"
//   ): number => {
//     const numericPrice =
//       typeof price === "string"
//         ? parseFloat(price.replace(/[^0-9.]/g, ""))
//         : price;

//     if (currency === globalCurrency) {
//       return numericPrice;
//     }

//     let priceInUSD;
//     if (currency === "USD") {
//       priceInUSD = numericPrice;
//     } else {
//       const sourceRate = exchangeRates[currency as Currency] || 1;
//       priceInUSD = numericPrice / sourceRate;
//     }

//     const targetRate = exchangeRates[globalCurrency] || 1;
//     return priceInUSD * targetRate;
//   };

//   const formatPrice = (price: number): string => {
//     const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
//       USD: {
//         style: "currency",
//         currency: "USD",
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       },
//       EUR: {
//         style: "currency",
//         currency: "EUR",
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       },
//       MDL: {
//         style: "currency",
//         currency: "MDL",
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       },
//       RUB: {
//         style: "currency",
//         currency: "RUB",
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       },
//     };

//     return new Intl.NumberFormat(
//       undefined,
//       currencyFormats[globalCurrency]
//     ).format(price);
//   };

//   const getPriceDisplay = (
//     price: string | number,
//     currency: string = "USD"
//   ): string => {
//     const convertedPrice = getConvertedPrice(price, currency);
//     return formatPrice(convertedPrice);
//   };

//   const getPriceValue = (price: string | number): number => {
//     if (typeof price === "number") return price;

//     const numericPrice = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
//     return isNaN(numericPrice) ? 0 : numericPrice;
//   };

//   const updateQuantity = (id: string, change: number) => {
//     const updatedItems = cartItems.map((item) => {
//       if (item.id === id) {
//         const newQuantity = Math.max(1, item.quantity + change);
//         return { ...item, quantity: newQuantity };
//       }
//       return item;
//     });

//     setCartItems(updatedItems);
//     updateLocalStorage(updatedItems);
//   };

//   const removeItem = (id: string) => {
//     const filteredItems = cartItems.filter((item) => item.id !== id);
//     setCartItems(filteredItems);
//     updateLocalStorage(filteredItems);
//   };

//   const updateLocalStorage = (items: any) => {
//     try {
//       const storageItems = items.map((item: any) => ({
//         id: item.id,
//         title: item.name || item.title,
//         price:
//           typeof item.price === "string"
//             ? item.price
//             : `${item.price} ${item.currency || "USD"}`,
//         image: item.image,
//         quantity: item.quantity,
//         brand: item.brand || "BRAND",
//         size: item.size || "5",
//         currency: item.currency || "USD",
//       }));

//       localStorage.setItem("cart", JSON.stringify(storageItems));

//       const event = new Event("cartUpdated");
//       window.dispatchEvent(event);
//     } catch (error) {
//       console.error("Error updating cart in localStorage:", error);
//     }
//   };

//   // Handle view cart navigation
//   const handleViewCart = () => {
//     updateLocalStorage(cartItems);
//     onClose();
//     router.push("/view-cart");
//   };

//   const handleCheckout = () => {
//     updateLocalStorage(cartItems);
//     onClose();
//     router.push("/checkout");
//   };

//   // Calculate subtotal with proper price handling
//   const subtotal = cartItems.reduce((sum, item) => {
//     const price = getPriceValue(item.price);
//     const currency = item.currency || "USD";
//     const convertedPrice = getConvertedPrice(price, currency);
//     return sum + convertedPrice * item.quantity;
//   }, 0);

//   return (
//     <div className="font-poppins">
//       <style jsx global>
//         {scrollbarHideStyle}
//       </style>
//       <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//         <DialogContent className="sm:max-w-md">
//           <div className="flex items-center justify-between">
//             <DialogTitle className="text-xl font-semibold">My Cart</DialogTitle>
//             <Button
//               type="text"
//               icon={<CloseOutlined style={{ fontSize: 14 }} />}
//               onClick={onClose}
//               style={{ width: 32, height: 32 }}
//             />
//           </div>

//           <div
//             className="mt-4 space-y-6 max-h-[40vh] overflow-y-auto scrollbar-hide"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {cartItems.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500 text-lg">Your cart is empty</p>
//               </div>
//             ) : (
//               cartItems.map((item) => (
//                 <div
//                   key={`${item.id}-${item.name || item.title}`}
//                   className="flex items-start space-x-4 pb-6 border-b"
//                 >
//                   <div className="bg-[#F9F9F9] rounded-xl p-2 w-24 sm:w-32 h-32 flex items-center justify-center">
//                     <Image
//                       src={item.image || "/placeholder.svg"}
//                       alt="image"
//                       width={100}
//                       height={100}
//                       className="object-contain w-36"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <div className="flex gap-1 justify-between">
//                       <h3 className="font-semibold text-text-black text-base md:text-lg">
//                         {item.name || item.title}
//                       </h3>
//                       <Button
//                         type="text"
//                         icon={
//                           <LuTrash2
//                             className="text-lg"
//                             style={{ color: "#FF3A44" }}
//                           />
//                         }
//                         onClick={() => removeItem(item.id)}
//                         style={{ width: 24, height: 24 }}
//                         className="hover:!bg-red-50"
//                       />
//                     </div>
//                     <div className="text-base md:text-lg font-medium text-text-secondary/70 mt-[2px]">
//                       SIZE : {"5"}, {item.brand || "NIKE"}
//                     </div>
//                     <div className="mt-1 font-medium text-primary text-base md:text-lg">
//                       {getPriceDisplay(item.price, item.currency)}
//                     </div>

//                     <div className="flex items-center justify-end">
//                       <Button
//                         type="default"
//                         onClick={() => updateQuantity(item.id, -1)}
//                         className="!w-7 !h-7 !p-0 !rounded-full bg-[#F9F9F9] border border-[#F9F9F9] flex items-center justify-center"
//                       >
//                         <Minus size={16} className="text-gray-600" />
//                       </Button>

//                       <span className="mx-2 w-6 text-center">
//                         {item.quantity.toString().padStart(2, "0")}
//                       </span>

//                       <Button
//                         type="default"
//                         onClick={() => updateQuantity(item.id, 1)}
//                         className="!w-7 !h-7 !p-0 !rounded-full bg-[#F9F9F9] border border-[#F9F9F9] flex items-center justify-center"
//                       >
//                         <Plus size={16} className="text-gray-600" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {cartItems.length > 0 && (
//             <div className="mt-4">
//               <div className="flex justify-between p-3 rounded-lg bg-[#F9F9F9]">
//                 <span className="font-medium text-base text-text-secondary">
//                   Sub-Total
//                 </span>
//                 <span className="font-medium text-base text-text-secondary">
//                   {formatPrice(subtotal)}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-2 mt-4">
//                 <Button
//                   type="default"
//                   onClick={handleViewCart}
//                   className="w-full border border-primary text-primary hover:border-primary/85 hover:text-primary/85 text-sm font-medium rounded-lg py-5"
//                 >
//                   VIEW CART
//                 </Button>
//                 <Button
//                   onClick={handleCheckout}
//                   className="w-full bg-primary text-white text-sm font-medium rounded-lg py-5 hover:!bg-primary/90 hover:!text-white transition-colors"
//                 >
//                   CHECKOUT
//                 </Button>
//               </div>

//               <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
//                 <TbTruckDelivery className="text-xl mr-[6px]" />
//                 <span className="text-base text-text-secondary">
//                   Express Shipping - 1 Hour Delivery.
//                 </span>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../Dialog/dialog";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { LuTrash2 } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Currency } from "@/redux/reducers/currencySlice";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";
import { 
    useGetCartQuery, 
    useUpdateCartItemMutation, 
    useRemoveFromCartMutation 
} from "@/redux/features/cart/cartApi";

// Add global style to hide scrollbars while maintaining scroll functionality
const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface CartItem {
  id: string;
  name: string;
  title: string;
  price: string | number;
  image: string;
  quantity: number;
  brand?: string;
  size?: string;
  color?: string;
  currency?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
}

export function CartModal({ isOpen, onClose, items }: CartModalProps) {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>(items);
  const router = useRouter();

  // Authentication check
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(useCurrentToken);
  const isAuthenticated = !!user && !!accessToken;

  // Fetch cart from database if authenticated
  // pollingInterval will auto-refresh when modal is open
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated || !isOpen,
    pollingInterval: isOpen && isAuthenticated ? 3000 : 0, // Refresh every 3 seconds when modal is open
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cart = cartData?.data?.cart;
  const dbCartItems = cart?.items || [];

  // Update local cart items when props change (for non-authenticated users)
  // Only update when modal opens and user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      setLocalCartItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAuthenticated]);
  
  
  // Separate effect to handle items changes only when modal is already open
  useEffect(() => {
    if (!isAuthenticated && isOpen && items.length > 0) {
      setLocalCartItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, isAuthenticated, isOpen]);

  const { currency: globalCurrency } = useSelector(
    (state: RootState) => state.currency
  );

  // Legacy multi-currency conversion (kept for future use)
  // const getConvertedPrice = (
  //   price: string | number,
  //   currency: string = "MDL"
  // ): number => {
  //   const numericPrice =
  //     typeof price === "string"
  //       ? parseFloat(price.replace(/[^0-9.]/g, ""))
  //       : price;
  //
  //   if (currency === globalCurrency) {
  //     return numericPrice;
  //   }
  //
  //   let priceInUSD;
  //   if (currency === "USD") {
  //     priceInUSD = numericPrice;
  //   } else {
  //     const sourceRate = exchangeRates[currency as Currency] || 1;
  //     priceInUSD = numericPrice / sourceRate;
  //   }
  //
  //   const targetRate = exchangeRates[globalCurrency] || 1;
  //   return priceInUSD * targetRate;
  // };

  const getConvertedPrice = (
    price: string | number,
    currency: string = "MDL"
  ): number => {
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.]/g, ""))
        : price;

    // All prices are stored in MDL, no conversion needed
    return numericPrice;
  };

  const formatPrice = (price: number): string => {
    // Display all prices in MDL across the app
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MDL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getPriceDisplay = (
    price: string | number,
    currency: string = "MDL"
  ): string => {
    const convertedPrice = getConvertedPrice(price, currency);
    return formatPrice(convertedPrice);
  };

  const getPriceValue = (price: string | number): number => {
    if (typeof price === "number") return price;

    const numericPrice = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  const updateQuantity = async (itemIdentifier: string, change: number) => {
    if (isAuthenticated) {
      // Find the cart item from database by cart item id
      const cartItem = dbCartItems.find(item => item.id === itemIdentifier);
      if (cartItem) {
        const newQuantity = Math.max(1, Math.min(cartItem.product?.inventory ?? 999, cartItem.quantity + change));
        try {
          await updateCartItem({
            cartItemId: itemIdentifier,
            quantity: newQuantity,
          }).unwrap();
        } catch (error) {
          console.error("Error updating cart item:", error);
        }
      }
    } else {
      // Update localStorage - itemIdentifier is "productId|size|color"
      const [productId, size, color] = itemIdentifier.split("|");
      const updatedItems = localCartItems.map((item) => {
        const match = item.id === productId && (item.size || "") === (size || "") && (item as any).color === color;
        if (match) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setLocalCartItems(updatedItems);
      updateLocalStorage(updatedItems);
    }
  };

  const removeItem = async (itemIdentifier: string) => {
    if (isAuthenticated) {
      // Remove from database by cart item id
      const cartItem = dbCartItems.find(item => item.id === itemIdentifier);
      if (cartItem) {
        try {
          await removeFromCart(cartItem.id).unwrap();
        } catch (error) {
          console.error("Error removing cart item:", error);
        }
      }
    } else {
      // Remove from localStorage - itemIdentifier is "productId|size|color" for local cart
      const [productId, size, color] = itemIdentifier.split("|");
      const filteredItems = localCartItems.filter(
        (item) => !(item.id === productId && (item.size || "") === (size || "") && ((item as any).color || "") === (color || ""))
      );
      setLocalCartItems(filteredItems);
      updateLocalStorage(filteredItems);
    }
  };

  const updateLocalStorage = (items: any) => {
    try {
      const storageItems = items.map((item: any) => ({
        id: item.id,
        title: item.name || item.title,
        price:
          typeof item.price === "string"
            ? item.price
            : `${item.price} ${item.currency || "MDL"}`,
        image: item.image,
        quantity: item.quantity,
        brand: item.brand || "BRAND",
        size: item.size || "",
        color: item.color,
        currency: item.currency || "MDL",
      }));

      localStorage.setItem("cart", JSON.stringify(storageItems));

      const event = new Event("cartUpdated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error updating cart in localStorage:", error);
    }
  };

  // Handle view cart navigation
  const handleViewCart = () => {
    if (!isAuthenticated) {
      updateLocalStorage(localCartItems);
    }
    onClose();
    router.push("/view-cart");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      updateLocalStorage(localCartItems);
    }
    onClose();
    router.push("/checkout");
  };

  // Determine which cart items to display
  const displayCartItems = isAuthenticated ? dbCartItems : localCartItems;

  // Calculate subtotal with proper price handling
  const subtotal = displayCartItems.reduce((sum, item) => {
    if (isAuthenticated) {
      // For database items - use discountPrice when onSale
      const dbItem = item as any;
      const product = dbItem.product;
      const price = (product?.onSale && product?.discountPrice != null)
        ? product.discountPrice
        : (product?.price || 0);
      const convertedPrice = getConvertedPrice(price, "MDL");
      return sum + convertedPrice * item.quantity;
    } else {
      // For localStorage items
      const localItem = item as CartItem;
      const price = getPriceValue(localItem.price);
      const currency = localItem.currency || "MDL";
      const convertedPrice = getConvertedPrice(price, currency);
      return sum + convertedPrice * localItem.quantity;
    }
  }, 0);

  return (
    <div className="font-poppins">
      <style jsx global>
        {scrollbarHideStyle}
      </style>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">My Cart</DialogTitle>
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: 14 }} />}
              onClick={onClose}
              style={{ width: 32, height: 32 }}
            />
          </div>

          <div
            className="mt-4 space-y-6 max-h-[40vh] overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              displayCartItems.map((item) => {
                // Handle both database and localStorage items
                const dbItem = item as any;
                const localItem = item as CartItem;
                const itemIdentifier = isAuthenticated ? dbItem.id : `${localItem.id}|${localItem.size || ""}|${localItem.color || ""}`;
                const itemName = isAuthenticated ? dbItem.product?.name : (localItem.name || localItem.title);
                const product = dbItem.product;
                const itemPrice = isAuthenticated
                  ? ((product?.onSale && product?.discountPrice != null) ? product.discountPrice : product?.price)
                  : localItem.price;
                const itemCurrency = isAuthenticated ? "MDL" : (localItem.currency || "MDL");
                const itemImage = isAuthenticated 
                  ? (product?.productImages?.find((img: any) => img.isPrimary)?.url || product?.productImages?.[0]?.url)
                  : localItem.image;
                const itemBrand = isAuthenticated ? (product?.seller?.name || "NIKE") : (localItem.brand || "NIKE");
                const itemSize = isAuthenticated ? (dbItem.size || "—") : (localItem.size || "—");

                return (
                  <div
                    key={itemIdentifier}
                    className="flex items-start space-x-4 pb-6 border-b"
                  >
                    <div className="bg-[#F9F9F9] rounded-xl p-2 w-24 sm:w-32 h-32 flex items-center justify-center">
                      <Image
                        src={itemImage || "/placeholder.svg"}
                        alt="image"
                        width={100}
                        height={100}
                        className="object-contain w-36"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex gap-1 justify-between">
                        <h3 className="font-semibold text-text-black text-base md:text-lg">
                          {itemName}
                        </h3>
                        <Button
                          type="text"
                          icon={
                            <LuTrash2
                              className="text-lg"
                              style={{ color: "#FF3A44" }}
                            />
                          }
                          onClick={() => removeItem(itemIdentifier)}
                          style={{ width: 24, height: 24 }}
                          className="hover:!bg-red-50"
                        />
                      </div>
                      <div className="text-base md:text-lg font-medium text-text-secondary/70 mt-[2px]">
                        SIZE : {itemSize}, {itemBrand}
                      </div>
                      <div className="mt-1 font-medium text-primary text-base md:text-lg">
                        {getPriceDisplay(itemPrice, itemCurrency)}
                      </div>

                      <div className="flex items-center justify-end">
                        <Button
                          type="default"
                          onClick={() => updateQuantity(itemIdentifier, -1)}
                          className="!w-7 !h-7 !p-0 !rounded-full bg-[#F9F9F9] border border-[#F9F9F9] flex items-center justify-center"
                        >
                          <Minus size={16} className="text-gray-600" />
                        </Button>

                        <span className="mx-2 w-6 text-center">
                          {item.quantity.toString().padStart(2, "0")}
                        </span>

                        <Button
                          type="default"
                          onClick={() => updateQuantity(itemIdentifier, 1)}
                          className="!w-7 !h-7 !p-0 !rounded-full bg-[#F9F9F9] border border-[#F9F9F9] flex items-center justify-center"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {displayCartItems.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between p-3 rounded-lg bg-[#F9F9F9]">
                <span className="font-medium text-base text-text-secondary">
                  Sub-Total
                </span>
                <span className="font-medium text-base text-text-secondary">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  type="default"
                  onClick={handleViewCart}
                  className="w-full border border-primary text-primary hover:border-primary/85 hover:text-primary/85 text-sm font-medium rounded-lg py-5"
                >
                  VIEW CART
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white text-sm font-medium rounded-lg py-5 hover:!bg-primary/90 hover:!text-white transition-colors"
                >
                  CHECKOUT
                </Button>
              </div>

              <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                <TbTruckDelivery className="text-xl mr-[6px]" />
                <span className="text-base text-text-secondary">
                  Express Shipping - 1 Hour Delivery.
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}