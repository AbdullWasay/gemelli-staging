// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Card, Button } from "antd";
// import { ClockCircleOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
// import { TbView360Number } from "react-icons/tb";
// import { Star } from "lucide-react";
// import { LuTruck } from "react-icons/lu";
// import { toast } from "react-toastify";
// import { useParams, useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { Currency } from "@/redux/reducers/currencySlice";

// interface ProductImage {
//     id: string;
//     url: string;
//     isPrimary: boolean;
//     order: number;
// }

// interface Seller {
//     id: string;
//     name: string | null;
//     email: string;
// }

// interface ProductData {
//     id: string;
//     name: string;
//     description: string | null;
//     price: number;
//     inventory: number;
//     category: string | null;
//     sku: string | null;
//     productImages: ProductImage[];
//     seller: Seller;
//     createdAt: string;
// }

// export default function ProductPage() {
//     const params = useParams();
//     const productId = params.id as string;
//     const router = useRouter();

//     const [selectedSize, setSelectedSize] = useState(8);
//     const [loading, setLoading] = useState(false);
//     const [isFavorite, setIsFavorite] = useState(false);
//     const [productData, setProductData] = useState<ProductData | null>(null);
//     const [loadingProduct, setLoadingProduct] = useState(true);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     const { currency: globalCurrency, exchangeRates } = useSelector(
//         (state: RootState) => state.currency
//     );

//     const sizes = [
//         3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5,
//         11, 11.5, 12, 12.5, 13, 13.5, 14, 15, 16, 17
//     ];

//     const verificationLogos = [1, 2, 3, 4];

//     // Currency conversion functions
//     const getConvertedPrice = (price: number) => {
//         const priceInUSD = price;
//         const targetRate = exchangeRates[globalCurrency] || 1;
//         return priceInUSD * targetRate;
//     };

//     const formatPrice = (price: number) => {
//         const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
//             USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 },
//             EUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 },
//             MDL: { style: 'currency', currency: 'MDL', minimumFractionDigits: 2, maximumFractionDigits: 2 },
//             RUB: { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 0 }
//         };

//         return new Intl.NumberFormat(undefined, currencyFormats[globalCurrency]).format(price);
//     };

//     const getDisplayPrice = () => {
//         if (!productData) return "N/A";
//         const convertedPrice = getConvertedPrice(productData.price);
//         return formatPrice(convertedPrice);
//     };

//     // Fetch product data from API
//     useEffect(() => {
//         const fetchProductData = async () => {
//             setLoadingProduct(true);

//             try {
//                 const response = await fetch(`/api/products?id=${productId}`);

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch product');
//                 }

//                 const data = await response.json();

//                 if (data.success && data.data?.product) {
//                     setProductData(data.data.product);
//                 } else {
//                     throw new Error('Product not found');
//                 }

//                 // Check favorite status
//                 const storedFavorites = localStorage.getItem("favorites");
//                 if (storedFavorites) {
//                     const favorites = JSON.parse(storedFavorites);
//                     setIsFavorite(favorites.some((item: { id: string }) => item.id === productId));
//                 }
//             } catch (error) {
//                 console.error("Error fetching product:", error);
//                 toast.error("Failed to load product details");
//             } finally {
//                 setLoadingProduct(false);
//             }
//         };

//         if (productId) {
//             fetchProductData();
//         }
//     }, [productId]);

//     const handleAddToCart = () => {
//         if (!productData) return;

//         setLoading(true);

//         try {
//             const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
//             const existingItemIndex = currentCart.findIndex((item: { id: string }) => item.id === productData.id);

//             const primaryImage = productData.productImages.find(img => img.isPrimary);
//             const imageUrl = primaryImage?.url || productData.productImages[0]?.url || "/placeholder.svg";

//             if (existingItemIndex >= 0) {
//                 currentCart[existingItemIndex].quantity += 1;
//             } else {
//                 currentCart.push({
//                     id: productData.id,
//                     title: productData.name,
//                     price: productData.price,
//                     currency: "MDL",
//                     image: imageUrl,
//                     quantity: 1,
//                     brand: productData.seller.name || "Brand",
//                     size: selectedSize
//                 });
//             }

//             localStorage.setItem("cart", JSON.stringify(currentCart));

//             const event = new Event("cartUpdated");
//             window.dispatchEvent(event);

//             toast(`${productData.name} added to cart!`, {
//                 position: "bottom-right",
//                 autoClose: 3000,
//             });
//         } catch (error) {
//             console.error("Error updating cart:", error);
//             toast.error("Failed to add to cart. Please try again.", {
//                 position: "bottom-right",
//                 autoClose: 3000,
//             });
//         } finally {
//             setTimeout(() => setLoading(false), 300);
//         }
//     };

//     const handleFavoriteClick = () => {
//         if (!productData) return;

//         const newFavoriteState = !isFavorite;
//         setIsFavorite(newFavoriteState);

//         try {
//             const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
//             const primaryImage = productData.productImages.find(img => img.isPrimary);
//             const imageUrl = primaryImage?.url || productData.productImages[0]?.url || "/placeholder.svg";

//             if (newFavoriteState) {
//                 if (!favorites.some((item: { id: string }) => item.id === productData.id)) {
//                     favorites.push({
//                         id: productData.id,
//                         title: productData.name,
//                         price: productData.price,
//                         currency: "MDL",
//                         image: imageUrl,
//                         brand: productData.seller.name || "Brand",
//                         size: selectedSize
//                     });
//                     toast("Added to wishlist!", {
//                         position: "bottom-right",
//                         autoClose: 3000,
//                     });
//                 }
//                 localStorage.setItem("favorites", JSON.stringify(favorites));
//             } else {
//                 const updatedFavorites = favorites.filter((item: { id: string }) => item.id !== productData.id);
//                 localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//                 toast("Removed from wishlist", {
//                     position: "bottom-right",
//                     autoClose: 3000,
//                 });
//             }
//         } catch (error) {
//             console.error("Error updating favorites:", error);
//             toast.error("Failed to update wishlist. Please try again.", {
//                 position: "bottom-right",
//                 autoClose: 3000,
//             });
//         }
//     };

//     const goToCheckout = () => {
//         if (productData && productData.inventory > 0) {
//             router.push('/checkout');
//         } else {
//             toast.info("We'll notify you when this product is back in stock!", {
//                 position: "bottom-right",
//                 autoClose: 3000,
//             });
//         }
//     };

//     if (loadingProduct) {
//         return (
//             <div className="container mx-auto font-poppins mt-10">
//                 <div className="flex justify-center items-center h-64">
//                     <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (!productData) {
//         return (
//             <div className="container mx-auto font-poppins mt-10">
//                 <div className="flex justify-center items-center h-64">
//                     <p>Product not found!</p>
//                 </div>
//             </div>
//         );
//     }

//     const inStock = productData.inventory > 0;
//     const sortedImages = [...productData.productImages].sort((a, b) => {
//         if (a.isPrimary) return -1;
//         if (b.isPrimary) return 1;
//         return a.order - b.order;
//     });

//     return (
//         <div className="container mx-auto font-poppins mt-10">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Product Image Gallery Section */}
//                 <div className="relative">
//                     <Card className="bg-gray-50 p-6 rounded-xl">
//                         <div className="flex justify-center items-center lg:h-[400px]">
//                             <Image
//                                 src={sortedImages[currentImageIndex]?.url || "/placeholder.svg"}
//                                 alt={productData.name}
//                                 width={400}
//                                 height={400}
//                                 className="object-contain"
//                             />
//                         </div>

//                         {sortedImages.length > 1 && (
//                             <div className="flex justify-center mt-4 gap-2">
//                                 {sortedImages.map((img, index) => (
//                                     <button
//                                         key={img.id}
//                                         onClick={() => setCurrentImageIndex(index)}
//                                         className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
//                                             currentImageIndex === index ? 'border-primary' : 'border-gray-200'
//                                         }`}
//                                     >
//                                         <Image
//                                             src={img.url}
//                                             alt={`${productData.name} ${index + 1}`}
//                                             width={64}
//                                             height={64}
//                                             className="object-cover w-full h-full"
//                                         />
//                                     </button>
//                                 ))}
//                             </div>
//                         )}

//                         <div className="flex justify-center mt-4">
//                             <div className="w-14 h-14">
//                                 <Button
//                                     shape="circle"
//                                     icon={<TbView360Number className="text-xl" />}
//                                     className="!w-full !h-full !rounded-full flex items-center justify-center text-primary text-xl !border !border-transparent shadow-xl shadow-blue-100"
//                                 />
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Verification Section */}
//                     <div className="mt-6 hidden lg:block">
//                         <p className="text-xl font-medium mb-2">Verified By</p>
//                         <div className="flex flex-wrap items-center gap-5">
//                             {verificationLogos.map((i) => (
//                                 <div key={i} className="w-20 h-10 lg:w-36 lg:h-20 flex items-center bg-gray-100 rounded-lg p-2">
//                                     <span className="text-sm text-gray-500">Verified</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Product Details Section */}
//                 <div>
//                     <div className="flex justify-between items-start">
//                         <h1 className="m-0 text-2xl md:text-3xl font-semibold">
//                             {productData.name}
//                         </h1>
//                         <p className={`font-medium ${inStock ? 'text-[#09B122]' : 'text-[#FF1B1B]'}`}>
//                             {inStock ? `In Stock (${productData.inventory})` : 'Sold Out'}
//                         </p>
//                     </div>

//                     <div className="flex justify-between items-start mt-2">
//                         <div className="flex items-center gap-2 font-medium">
//                             <p className="text-text-secondary text-lg">{getDisplayPrice()}</p>
//                             <Star className="text-[#FF9900]" fill="#FF9900" size={18} />
//                             <p className="text-text-secondary/70 text-lg">4.5/5</p>
//                         </div>
//                         {productData.sku && (
//                             <p className="text-lg text-text-secondary">SKU: {productData.sku}</p>
//                         )}
//                     </div>

//                     <div className="mt-6">
//                         <p className="text-base text-text-secondary/80 text-justify font-medium">
//                             {productData.description || "No description available for this product."}
//                         </p>
//                     </div>

//                     {productData.category && (
//                         <div className="mt-4">
//                             <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
//                                 {productData.category}
//                             </span>
//                         </div>
//                     )}

//                     <div className="mt-8">
//                         <div className="flex justify-between items-center">
//                             <p className="text-text-black text-lg font-medium">Select Size</p>
//                         </div>

//                         <div className="grid grid-cols-7 gap-2 mt-3">
//                             {sizes.map((size) => (
//                                 <Button
//                                     key={size}
//                                     className={`rounded-md py-5 ${
//                                         size === selectedSize ? 'border-2 border-primary' : 'bg-white'
//                                     }`}
//                                     onClick={() => setSelectedSize(size)}
//                                 >
//                                     {size}
//                                 </Button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="mt-8 flex flex-col gap-3">
//                         <div className="flex gap-3">
//                             <Button
//                                 type="primary"
//                                 size="large"
//                                 className={`h-12 rounded-xl text-base font-medium ${
//                                     !inStock
//                                         ? '!bg-text-secondary/30 !text-text-secondary cursor-not-allowed'
//                                         : 'bg-primary'
//                                 }`}
//                                 onClick={handleAddToCart}
//                                 loading={loading && inStock}
//                                 disabled={!inStock}
//                                 block
//                             >
//                                 {!inStock ? 'RESTOCK SOON' : loading ? 'ADDING...' : 'ADD TO CART'}
//                             </Button>

//                             <div className={`rounded-full w-12 h-12 flex items-center justify-center border ${
//                                 !inStock ? 'border-text-secondary' : 'border-primary'
//                             }`}>
//                                 <Button
//                                     type="text"
//                                     className="flex items-center justify-center p-0"
//                                     onClick={handleFavoriteClick}
//                                     disabled={!inStock}
//                                     icon={
//                                         isFavorite ? (
//                                             <HeartFilled className={!inStock ? 'text-text-secondary' : 'text-[#005BFF]'} />
//                                         ) : (
//                                             <HeartOutlined className={!inStock ? 'text-text-secondary' : 'text-[#005BFF]'} />
//                                         )
//                                     }
//                                 />
//                             </div>
//                         </div>

//                         <Button
//                             size="large"
//                             className={`h-12 rounded-xl text-base font-medium !text-white ${
//                                 !inStock
//                                     ? 'bg-[#0F0F0F] hover:!bg-[#0F0F0F]/80'
//                                     : 'bg-[#4046DE] hover:!bg-[#4046DE]/80'
//                             }`}
//                             onClick={goToCheckout}
//                         >
//                             {!inStock ? 'You Will Be Notified When Available' : 'BUY NOW'}
//                         </Button>
//                     </div>

//                     <div className="flex flex-col items-center justify-center mt-6">
//                         <div className="flex items-center gap-2 text-text-secondary text-base">
//                             <ClockCircleOutlined />
//                             <p>Seller: {productData.seller.name || productData.seller.email}</p>
//                         </div>

//                         <div className="mt-4 flex items-center gap-2 text-text-secondary text-base">
//                             <LuTruck className="text-xl" />
//                             <p>Express Shipping - 1 Hour Delivery</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, Button } from "antd";
import {
  ClockCircleOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { TbView360Number } from "react-icons/tb";
import { Star } from "lucide-react";
import { LuTruck } from "react-icons/lu";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  useCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { addToCart } from "@/utils/addToCart";
import { getFavorites, setFavorites } from "@/utils/favoritesUtils";

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

interface Seller {
  id: string;
  name: string | null;
  email: string;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  inventory: number;
  productImages: ProductImage[];
  sku: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPrice?: number | null;
  onSale?: boolean;
  inventory: number;
  category: string | null;
  sku: string | null;
  size: string | null;
  color: string | null;
  material: string | null;
  productImages: ProductImage[];
  seller: Seller;
  createdAt: string;
  variants?: ProductVariant[];
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<number | string>(8);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableSizes, setAvailableSizes] = useState<(number | string)[]>([]);

  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(useCurrentToken);
  const isAuthenticated = !!user && !!accessToken;

  const [addToCartMutation] = useAddToCartMutation();

  const sizes = [
    3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12,
    12.5, 13, 13.5, 14, 15, 16, 17,
  ];

  const verificationLogos = [1, 2, 3, 4];

  // Currency conversion functions
  // Legacy multi-currency implementation (kept for future use)
  // const getConvertedPrice = (price: number) => {
  //   const priceInUSD = price;
  //   const targetRate = exchangeRates[globalCurrency] || 1;
  //   return priceInUSD * targetRate;
  // };
  //
  // const formatPrice = (price: number) => {
  //   const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
  //     USD: {
  //       style: "currency",
  //       currency: "USD",
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     },
  //     EUR: {
  //       style: "currency",
  //       currency: "EUR",
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     },
  //     MDL: {
  //       style: "currency",
  //       currency: "MDL",
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     },
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

  const getConvertedPrice = (price: number) => {
    // All prices are stored in MDL, no conversion needed
    return price;
  };

  const formatPrice = (price: number) => {
    // Display all prices in MDL across the app
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MDL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getDisplayPrice = () => {
    if (!productData) return "N/A";
    const priceToShow = productData.onSale && productData.discountPrice != null
      ? productData.discountPrice
      : productData.price;
    const convertedPrice = getConvertedPrice(priceToShow);
    return formatPrice(convertedPrice);
  };

  const getOriginalPriceDisplay = () => {
    if (!productData || !productData.onSale || productData.discountPrice == null) return null;
    const convertedPrice = getConvertedPrice(productData.price);
    return formatPrice(convertedPrice);
  };

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoadingProduct(true);

      try {
        const response = await fetch(`/api/products?id=${productId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (data.success && data.data?.product) {
          const product = data.data.product;
          setProductData(product);

          // Set default color if available
          if (product.color) {
            setSelectedColor(product.color);
          }

          // Set default size if available
          if (product.size) {
            // Check if size is numeric or string
            const sizeValue = !isNaN(Number(product.size))
              ? Number(product.size)
              : product.size;
            setSelectedSize(sizeValue);
          }

          // Process variants
          if (product.variants && product.variants.length > 0) {
            // Get available sizes (combine from main product and variants)
            const allSizes = new Set<string | number>();

            // Add main product size if available
            if (product.size) {
              // Convert to number if it's a numeric string
              const mainSize = !isNaN(Number(product.size))
                ? Number(product.size)
                : product.size;
              allSizes.add(mainSize);
            }

            // Add variant sizes
            product.variants.forEach((variant: ProductVariant) => {
              if (variant.size) {
                const variantSize = !isNaN(Number(variant.size))
                  ? Number(variant.size)
                  : variant.size;
                allSizes.add(variantSize);
              }
            });

            // Convert to array and sort
            const sizeArray = Array.from(allSizes);
            sizeArray.sort((a, b) => {
              // If both are numbers, sort numerically
              if (typeof a === "number" && typeof b === "number") {
                return a - b;
              }
              // Convert to strings for comparison
              return String(a).localeCompare(String(b));
            });

            setAvailableSizes(sizeArray);
          }
        } else {
          throw new Error("Product not found");
        }

        // Check favorite status (user-scoped)
        const favorites = getFavorites(user?.id ?? null);
        setIsFavorite(
          favorites.some((item: { id: string }) => item.id === productId)
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoadingProduct(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  // Update favorite status when user changes (login/logout)
  useEffect(() => {
    if (!productId) return;
    const favorites = getFavorites(user?.id ?? null);
    setIsFavorite(
      favorites.some((item: { id: string }) => item.id === productId)
    );
  }, [productId, user?.id]);


  const handleAddToCart = async () => {
    if (!productData) return;

    setLoading(true);
    try {
      // Find the selected variant or use main product
      let selectedProductId = productData.id;
      const selectedProductPrice = productData.price;
      let selectedProductImage =
        productData.productImages.find((img) => img.isPrimary)?.url ||
        productData.productImages[0]?.url ||
        "/placeholder.svg";

      // Check if we're selecting a variant
      if (productData.variants && productData.variants.length > 0) {
        const selectedVariant = productData.variants.find(
          (v) =>
            selectedSize &&
            v.size &&
            v.size.toString() === selectedSize.toString() &&
            selectedColor &&
            v.color === selectedColor
        );

        // If we found a matching variant, use its data
        if (selectedVariant) {
          selectedProductId = selectedVariant.id;

          // If the variant has a primary image, use it
          if (selectedVariant.productImages?.length > 0) {
            selectedProductImage = selectedVariant.productImages[0].url;
          }
        }
      }

      const normalizedSize = productData.size ?? selectedSize?.toString() ?? "";

      await addToCart({
        productId: selectedProductId,
        quantity: 1,
        size: normalizedSize ? String(normalizedSize) : "",
        color: selectedColor || undefined,
        isAuthenticated,
        addToCartMutation,
        productData: {
          id: selectedProductId,
          name: productData.name,
          price: selectedProductPrice,
          discountPrice: productData.onSale ? (productData.discountPrice ?? undefined) : undefined,
          onSale: productData.onSale,
          image: selectedProductImage,
          brand: productData.seller.name || "Brand",
          currency: "MDL",
          color: selectedColor || undefined,
        },
      });

      toast(`${productData.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (!productData) return;

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      const userId = user?.id ?? null;
      const favorites = getFavorites(userId);
      const primaryImage = productData.productImages.find(
        (img) => img.isPrimary
      );
      const imageUrl =
        primaryImage?.url ||
        productData.productImages[0]?.url ||
        "/placeholder.svg";

      if (newFavoriteState) {
        if (
          !favorites.some((item: { id: string }) => item.id === productData.id)
        ) {
          favorites.push({
            id: productData.id,
            title: productData.name,
            price: productData.price,
            currency: "MDL",
            image: imageUrl,
            brand: productData.seller.name || "Brand",
            size: selectedSize,
          });
          toast("Added to wishlist!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
        setFavorites(userId, favorites);
      } else {
        const updatedFavorites = favorites.filter(
          (item: { id: string }) => item.id !== productData.id
        );
        setFavorites(userId, updatedFavorites);
        toast("Removed from wishlist", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update wishlist. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const goToCheckout = () => {
    if (productData && productData.inventory > 0) {
      router.push("/checkout");
    } else {
      toast.info("We'll notify you when this product is back in stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  if (loadingProduct) {
    return (
      <div className="container mx-auto font-poppins mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto font-poppins mt-10">
        <div className="flex justify-center items-center h-64">
          <p>Product not found!</p>
        </div>
      </div>
    );
  }

  const inStock = productData.inventory > 0;
  const sortedImages = [...productData.productImages].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  return (
    <div className="container mx-auto font-poppins mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Gallery Section */}
        <div className="relative">
          <Card className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-center items-center lg:h-[400px]">
              <Image
                src={sortedImages[currentImageIndex]?.url || "/placeholder.svg"}
                alt={productData.name}
                width={400}
                height={400}
                className="object-contain"
              />
            </div>

            {sortedImages.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {sortedImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${productData.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-4">
              <div className="w-14 h-14">
                <Button
                  shape="circle"
                  icon={<TbView360Number className="text-xl" />}
                  className="!w-full !h-full !rounded-full flex items-center justify-center text-primary text-xl !border !border-transparent shadow-xl shadow-blue-100"
                />
              </div>
            </div>
          </Card>

          {/* Verification Section */}
          <div className="mt-6 hidden lg:block">
            <p className="text-xl font-medium mb-2">Verified By</p>
            <div className="flex flex-wrap items-center gap-5">
              {verificationLogos.map((i) => (
                <div
                  key={i}
                  className="w-20 h-10 lg:w-36 lg:h-20 flex items-center bg-gray-100 rounded-lg p-2"
                >
                  <span className="text-sm text-gray-500">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="m-0 text-2xl md:text-3xl font-semibold">
              {productData.name}
            </h1>
            <p
              className={`font-medium ${
                inStock ? "text-[#09B122]" : "text-[#FF1B1B]"
              }`}
            >
              {inStock ? `In Stock (${productData.inventory})` : "Sold Out"}
            </p>
          </div>

          <div className="flex justify-between items-start mt-2">
            <div className="flex items-center gap-2 font-medium flex-wrap">
              {productData.onSale && productData.discountPrice != null ? (
                <div className="flex flex-col gap-0">
                  <span className="text-red-600 text-lg font-semibold">{getDisplayPrice()}</span>
                  <span className="text-text-secondary/70 text-base line-through">{getOriginalPriceDisplay()}</span>
                </div>
              ) : (
                <p className="text-text-secondary text-lg">{getDisplayPrice()}</p>
              )}
              <Star className="text-[#FF9900]" fill="#FF9900" size={18} />
              <p className="text-text-secondary/70 text-lg">4.5/5</p>
            </div>
            {productData.sku && (
              <p className="text-lg text-text-secondary">
                SKU: {productData.sku}
              </p>
            )}
          </div>

          <div className="mt-6">
            <p className="text-base text-text-secondary/80 text-justify font-medium">
              {productData.description ||
                "No description available for this product."}
            </p>
          </div>

          {productData.category && (
            <div className="mt-4">
              <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {productData.category}
              </span>
            </div>
          )}

          {/* Size Selection */}
          {(availableSizes.length > 0 || productData.size) && (
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <p className="text-text-black text-lg font-medium">
                  Select Size
                </p>
              </div>

              <div className="grid grid-cols-7 gap-2 mt-3">
                {(availableSizes.length > 0 ? availableSizes : sizes).map(
                  (size) => (
                    <Button
                      key={String(size)}
                      className={`rounded-md py-5 ${
                        size === selectedSize
                          ? "border-2 border-primary"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {(productData.color ||
            (productData.variants &&
              productData.variants.some((v) => v.color))) && (
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <p className="text-text-black text-lg font-medium">
                  Select Color
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {/* Main product color */}
                {productData.color && (
                  <div
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      selectedColor === productData.color
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    style={{ backgroundColor: productData.color }}
                    onClick={() => setSelectedColor(productData.color)}
                    title={productData.color}
                  />
                )}

                {/* Variant colors */}
                {productData.variants?.map(
                  (variant) =>
                    variant.color &&
                    variant.color !== productData.color && (
                      <div
                        key={variant.id}
                        className={`w-8 h-8 rounded-full cursor-pointer ${
                          selectedColor === variant.color
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: variant.color }}
                        onClick={() => setSelectedColor(variant.color)}
                        title={variant.color}
                      />
                    )
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex gap-3">
              <Button
                type="primary"
                size="large"
                className={`h-12 rounded-xl text-base font-medium ${
                  !inStock
                    ? "!bg-text-secondary/30 !text-text-secondary cursor-not-allowed"
                    : "bg-primary"
                }`}
                onClick={handleAddToCart}
                loading={loading && inStock}
                disabled={!inStock}
                block
              >
                {!inStock
                  ? "RESTOCK SOON"
                  : loading
                  ? "ADDING..."
                  : "ADD TO CART"}
              </Button>

              <div
                className={`rounded-full w-12 h-12 flex items-center justify-center border ${
                  !inStock ? "border-text-secondary" : "border-primary"
                }`}
              >
                <Button
                  type="text"
                  className="flex items-center justify-center p-0"
                  onClick={handleFavoriteClick}
                  disabled={!inStock}
                  icon={
                    isFavorite ? (
                      <HeartFilled
                        className={
                          !inStock ? "text-text-secondary" : "text-[#005BFF]"
                        }
                      />
                    ) : (
                      <HeartOutlined
                        className={
                          !inStock ? "text-text-secondary" : "text-[#005BFF]"
                        }
                      />
                    )
                  }
                />
              </div>
            </div>

            <Button
              size="large"
              className={`h-12 rounded-xl text-base font-medium !text-white ${
                !inStock
                  ? "bg-[#0F0F0F] hover:!bg-[#0F0F0F]/80"
                  : "bg-[#4046DE] hover:!bg-[#4046DE]/80"
              }`}
              onClick={goToCheckout}
            >
              {!inStock ? "You Will Be Notified When Available" : "BUY NOW"}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            <div className="flex items-center gap-2 text-text-secondary text-base">
              <ClockCircleOutlined />
              <p>
                Seller: {productData.seller.name || productData.seller.email}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-text-secondary text-base">
              <LuTruck className="text-xl" />
              <p>Express Shipping - 1 Hour Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
