// "use client";

// import Image, { StaticImageData } from "next/image";
// import { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa6";
// import { Star } from "lucide-react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { Currency } from "@/redux/reducers/currencySlice";

// interface ProductCardProps {
//   id: string;
//   images: string[] | StaticImageData[];
//   title: string;
//   price: string | number;
//   rating: number;
//   itemsSold?: number;
//   brand?: string;
//   size?: string;
//   currency?: Currency;
// }

// export default function ProductCard({
//   id,
//   images,
//   title,
//   price,
//   rating,
//   itemsSold,
//   brand = "Brand",
//   size = "Default",
//   currency = "MDL",
// }: ProductCardProps) {
//   const router = useRouter();
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isAdding, setIsAdding] = useState(false);

//   const { currency: globalCurrency, exchangeRates } = useSelector(
//     (state: RootState) => state.currency
//   );

//   const getConvertedPrice = () => {
//     const numericPrice = typeof price === "string"
//       ? parseFloat(price.replace(/[^0-9.]/g, ""))
//       : price;

//     if (currency === globalCurrency) {
//       return numericPrice;
//     }

//     let priceInUSD;
//     if (currency === "MDL") {
//       priceInUSD = numericPrice;
//     } else {
//       const sourceRate = exchangeRates[currency] || 1;
//       priceInUSD = numericPrice / sourceRate;
//     }

//     const targetRate = exchangeRates[globalCurrency] || 1;
//     return priceInUSD * targetRate;
//   };

//   // Format price based on currency
//   const formatPrice = (price: number) => {
//     const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
//       USD: { style: 'currency', currency: 'USD' },
//       EUR: { style: 'currency', currency: 'EUR' },
//       MDL: { style: 'currency', currency: 'MDL' },
//       RUB: { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 0 }
//     };

//     return new Intl.NumberFormat(
//       undefined,
//       currencyFormats[globalCurrency]
//     ).format(price);
//   };

//   const convertedPrice = getConvertedPrice();
//   const displayPrice = formatPrice(convertedPrice);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % images.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [images.length]);

//   useEffect(() => {
//     const checkFavoriteStatus = () => {
//       try {
//         const storedFavorites = localStorage.getItem("favorites");
//         if (storedFavorites) {
//           const favorites = JSON.parse(storedFavorites);
//           setIsFavorite(
//             favorites.some((item: { id: string }) => item.id === id)
//           );
//         }
//       } catch (error) {
//         console.error("Error loading favorites:", error);
//       }
//     };

//     checkFavoriteStatus();
//     window.addEventListener("storage", checkFavoriteStatus);
//     return () => window.removeEventListener("storage", checkFavoriteStatus);
//   }, [id]);

//   const goToImage = (index: number) => {
//     setCurrentImageIndex(index);
//   };

//   const handleFavoriteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const newFavoriteState = !isFavorite;
//     setIsFavorite(newFavoriteState);

//     const currentImage = images[currentImageIndex];
//     const imageUrl =
//       typeof currentImage === "string"
//         ? currentImage
//         : currentImage?.src || "/placeholder.svg";

//     try {
//       let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

//       if (newFavoriteState) {
//         if (!favorites.some((item: { id: string }) => item.id === id)) {
//           favorites.push({
//             id,
//             title,
//             price: convertedPrice,
//             currency: globalCurrency,
//             image: imageUrl,
//             brand,
//             size,
//           });
//           toast("Added to wishlist!", {
//             position: "bottom-right",
//             autoClose: 3000,
//           });
//         }
//       } else {
//         favorites = favorites.filter((item: { id: string }) => item.id !== id);
//         toast("Removed from wishlist", {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       }

//       localStorage.setItem("favorites", JSON.stringify(favorites));
//       window.dispatchEvent(new Event("storage"));
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//       toast.error("Failed to update wishlist. Please try again.", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//       setIsFavorite(!newFavoriteState);
//     }
//   };

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsAdding(true);

//     try {
//       const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
//       const existingItemIndex = currentCart.findIndex(
//         (item: { id: string }) => item.id === id
//       );

//       const currentImage = images[currentImageIndex];
//       const imageUrl =
//         typeof currentImage === "string"
//           ? currentImage
//           : currentImage?.src || "/placeholder.svg";

//       if (existingItemIndex >= 0) {
//         currentCart[existingItemIndex].quantity += 1;
//       } else {
//         currentCart.push({
//           id,
//           title,
//           price: convertedPrice,
//           currency: globalCurrency,
//           image: imageUrl,
//           quantity: 1,
//           brand,
//           size,
//         });
//       }

//       localStorage.setItem("cart", JSON.stringify(currentCart));

//       const event = new Event("cartUpdated");
//       window.dispatchEvent(event);

//       toast(`${title} added to cart!`, {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error updating cart:", error);
//       toast.error("Failed to add to cart. Please try again.", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setTimeout(() => setIsAdding(false), 300);
//     }
//   };

//   const handleCardClick = () => {
//     router.push(`/product/${id}`);
//   };

//   return (
//     <div
//       className="max-w-[320px] w-full mx-auto overflow-hidden poppins cursor-pointer"
//       onClick={handleCardClick}
//     >
//       <div className="bg-[#F9F9F9] rounded-2xl">
//         <div className="relative">
//           <div
//             className="relative overflow-hidden flex justify-center items-center"
//             style={{ height: "250px" }}
//           >
//             <Image
//               src={images[currentImageIndex] || "/placeholder.svg"}
//               alt={`${title} - Image ${currentImageIndex + 1}`}
//               width={200}
//               height={200}
//               className="object-contain transition-opacity duration-300 max-w-[200px]"
//             />
//           </div>

//           <button
//             className="absolute top-3 right-3 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
//             onClick={handleFavoriteClick}
//             aria-label={
//               isFavorite ? "Remove from favorites" : "Add to favorites"
//             }
//           >
//             {isFavorite ? (
//               <FaHeart size={18} className="fill-red-500 text-red-500" />
//             ) : (
//               <FaRegHeart size={18} className="text-[#FF3A44]" />
//             )}
//           </button>
//         </div>

//         <div className="-mt-1 pb-1">
//           <div className="flex justify-center space-x-2">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToImage(index);
//                 }}
//                 className="focus:outline-none"
//                 aria-label={`Go to image ${index + 1}`}
//               >
//                 <div
//                   className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === index
//                     ? "w-6 bg-gray-400"
//                     : "w-1.5 bg-gray-300"
//                     }`}
//                 ></div>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 space-y-[10px]">
//           <h2 className="text-lg font-medium text-center">{title}</h2>

//           <div className="flex items-center justify-center gap-2">
//             <span className="text-[#646464] text-base font-medium">
//               {displayPrice}
//             </span>
//             <Star className="text-[#FF9900] -mt-1" fill="#FF9900" size={20} />
//             <span className="text-gray-600 text-[15px]">{rating}/5</span>
//           </div>
//           {itemsSold && (
//             <p className="text-[#FF1E7F] text-[15px] font-medium text-center pb-1">
//               {itemsSold} SOLD
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="mt-6">
//         <button
//           onClick={handleAddToCart}
//           disabled={isAdding}
//           className={`w-full py-[14px] text-base font-semibold border-2 rounded-xl
//             ${isAdding
//               ? "border-primary/70 text-primary/70"
//               : "border-primary text-primary hover:border-primary/50 hover:text-primary/50"
//             } transition-colors`}
//         >
//           {isAdding ? "ADDING..." : "ADD TO CART"}
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Currency } from "@/redux/reducers/currencySlice";
import {
  selectCurrentUser,
  useCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { addToCart } from "@/utils/addToCart";
import { getFavorites, setFavorites } from "@/utils/favoritesUtils";

interface ProductCardProps {
  id: string;
  images: string[] | StaticImageData[];
  title: string;
  price: string | number;
  discountPrice?: number;
  onSale?: boolean;
  rating: number;
  itemsSold?: number;
  brand?: string;
  size?: string;
  currency?: Currency;
}

export default function ProductCard({
  id,
  images,
  title,
  price,
  discountPrice,
  onSale = false,
  rating,
  itemsSold,
  brand = "Brand",
  size = "Default",
}: ProductCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const { currency: globalCurrency } = useSelector(
    (state: RootState) => state.currency
  );

  // Authentication check
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(useCurrentToken);
  const isAuthenticated = !!user && !!accessToken;

  // RTK Query mutation for backend cart
  const [addToCartMutation] = useAddToCartMutation();

  // Legacy multi-currency price conversion (kept for future use)
  // const getConvertedPrice = () => {
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
  //     const sourceRate = exchangeRates[currency] || 1;
  //     priceInUSD = numericPrice / sourceRate;
  //   }
  //
  //   const targetRate = exchangeRates[globalCurrency] || 1;
  //   return priceInUSD * targetRate;
  // };

  const getConvertedPrice = () => {
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.]/g, ""))
        : price;

    // All prices are stored in MDL, no conversion needed
    return numericPrice;
  };

  // Format price based on currency
  // Legacy multi-currency formatter (kept for future use)
  // const formatPrice = (price: number) => {
  //   const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
  //     USD: { style: "currency", currency: "USD" },
  //     EUR: { style: "currency", currency: "EUR" },
  //     MDL: { style: "currency", currency: "MDL" },
  //     RUB: {
  //       style: "currency",
  //       currency: "RUB",
  //       minimumFractionDigits: 0,
  //       maximumFractionDigits: 0,
  //     },
  //   };
  //
  //   return new Intl.NumberFormat(
  //     undefined,
  //     currencyFormats[globalCurrency]
  //   ).format(price);
  // };

  const formatPrice = (price: number) => {
    // Display all prices in MDL across the app
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MDL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const convertedPrice = getConvertedPrice();
  const displayPrice = formatPrice(convertedPrice);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const checkFavoriteStatus = () => {
      try {
        const favorites = getFavorites(user?.id ?? null);
        setIsFavorite(
          favorites.some((item: { id: string }) => item.id === id)
        );
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    checkFavoriteStatus();
    window.addEventListener("favoritesUpdated", checkFavoriteStatus);
    window.addEventListener("logout", checkFavoriteStatus);
    return () => {
      window.removeEventListener("favoritesUpdated", checkFavoriteStatus);
      window.removeEventListener("logout", checkFavoriteStatus);
    };
  }, [id, user?.id]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    const currentImage = images[currentImageIndex];
    const imageUrl =
      typeof currentImage === "string"
        ? currentImage
        : currentImage?.src || "/placeholder.svg";

    try {
      const userId = user?.id ?? null;
      let favorites = getFavorites(userId);

      if (newFavoriteState) {
        if (!favorites.some((item: { id: string }) => item.id === id)) {
          favorites.push({
            id,
            title,
            price: convertedPrice,
            currency: globalCurrency,
            image: imageUrl,
            brand,
            size,
          });
          toast("Added to wishlist!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } else {
        favorites = favorites.filter((item: { id: string }) => item.id !== id);
        toast("Removed from wishlist", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }

      setFavorites(userId, favorites);
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update wishlist. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setIsFavorite(!newFavoriteState);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      const currentImage = images[currentImageIndex];
      const imageUrl =
        typeof currentImage === "string"
          ? currentImage
          : currentImage?.src || "/placeholder.svg";

      // Use the addToCart utility function (handles both backend and localStorage)
      const result = await addToCart({
        productId: id,
        quantity: 1,
        size: size === "Default" ? "" : size,
        isAuthenticated,
        addToCartMutation,
        productData: {
          id,
          name: title,
          price: convertedPrice,
          discountPrice: onSale && discountPrice != null ? discountPrice : undefined,
          onSale,
          image: imageUrl,
          brand,
          currency: globalCurrency,
        },
      });

      // Dispatch custom event for cart updates (for navbar badge, etc.)
      if (result.success) {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Toast is already handled in addToCart utility
    } finally {
      setTimeout(() => setIsAdding(false), 300);
    }
  };

  const handleCardClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <div
      className="max-w-[320px] w-full mx-auto overflow-hidden poppins cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="bg-[#F9F9F9] rounded-2xl">
        <div className="relative">
          <div
            className="relative overflow-hidden flex justify-center items-center"
            style={{ height: "250px" }}
          >
            {onSale && (
              <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full z-10">
                SALE
              </div>
            )}
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              width={200}
              height={200}
              className="object-contain transition-opacity duration-300 max-w-[200px]"
            />
          </div>

          <button
            className="absolute top-3 right-3 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart size={18} className="fill-red-500 text-red-500" />
            ) : (
              <FaRegHeart size={18} className="text-[#FF3A44]" />
            )}
          </button>
        </div>

        <div className="-mt-1 pb-1">
          <div className="flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                className="focus:outline-none"
                aria-label={`Go to image ${index + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === index
                      ? "w-6 bg-gray-400"
                      : "w-1.5 bg-gray-300"
                  }`}
                ></div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-[10px]">
          <h2 className="text-lg font-medium text-center">{title}</h2>

          <div className="flex items-center justify-center gap-2">
            {onSale && discountPrice ? (
              <div className="flex flex-col items-center">
                <span className="text-red-600 text-base font-medium">
                  {formatPrice(discountPrice)}
                </span>
                <span className="text-gray-500 text-xs line-through">
                  {displayPrice}
                </span>
              </div>
            ) : (
              <span className="text-[#646464] text-base font-medium">
                {displayPrice}
              </span>
            )}
            <Star className="text-[#FF9900] -mt-1" fill="#FF9900" size={20} />
            <span className="text-gray-600 text-[15px]">{rating}/5</span>
          </div>
          <p
            className={`${
              itemsSold ? "text-[#FF1E7F]" : "text-gray-600"
            } text-[15px] font-medium text-center pb-1`}
          >
            {itemsSold} SOLD
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-[14px] text-base font-semibold border-2 rounded-xl 
            ${
              isAdding
                ? "border-primary/70 text-primary/70"
                : "border-primary text-primary hover:border-primary/50 hover:text-primary/50"
            } transition-colors`}
        >
          {isAdding ? "ADDING..." : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
