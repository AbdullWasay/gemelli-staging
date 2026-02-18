"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuTrash2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import SalesGraphCard from "./SalesGraphCard";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { getFavorites, setFavorites } from "@/utils/favoritesUtils";

interface ProductCardProps {
    id: string;
    images: string[] | StaticImageData[];
    title: string;
    price: string | number;
    rating: number;
    itemsSold?: number;
    brand?: string;
    size?: string;
    currency?: string;
    isFavoriteView?: boolean;
    onRemove?: (id: string) => void;
    userId?: string | null;
}

export default function WishListCard({
    id,
    images,
    title,
    price,
    rating,
    brand = "Brand",
    size = "Default",
    currency = "MDL",
    isFavoriteView = false,
    onRemove,
    userId: userIdProp
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const authUser = useSelector((state: RootState) => state.auth.user);
    const userId = userIdProp ?? authUser?.id ?? null;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Legacy multi-currency logic (kept for future use)
    // const { currency: globalCurrency, exchangeRates } = useSelector(
    //     (state: RootState) => state.currency
    // );
    //
    // const getConvertedPrice = () => {
    //     const numericPrice = typeof price === "string"
    //         ? parseFloat(price.replace(/[^0-9.]/g, ""))
    //         : price;
    //
    //     if (currency === globalCurrency) {
    //         return numericPrice;
    //     }
    //
    //     let priceInUSD;
    //     if (currency === "USD") {
    //         priceInUSD = numericPrice;
    //     } else {
    //         const sourceRate = exchangeRates[currency as Currency] || 1;
    //         priceInUSD = numericPrice / sourceRate;
    //     }
    //
    //     const targetRate = exchangeRates[globalCurrency] || 1;
    //     return priceInUSD * targetRate;
    // };
    //
    // const formatPrice = (price: number) => {
    //     const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
    //         USD: {
    //             style: 'currency',
    //             currency: 'MDL',
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2
    //         },
    //         EUR: {
    //             style: 'currency',
    //             currency: 'EUR',
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2
    //         },
    //         MDL: {
    //             style: 'currency',
    //             currency: 'MDL',
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2
    //         },
    //         RUB: {
    //             style: 'currency',
    //             currency: 'RUB',
    //             minimumFractionDigits: 0,
    //             maximumFractionDigits: 0
    //         }
    //     };
    //
    //     return new Intl.NumberFormat(
    //         undefined,
    //         currencyFormats[globalCurrency]
    //     ).format(price);
    // };
    //
    // const convertedPrice = getConvertedPrice();
    // const displayPriceLegacy = formatPrice(convertedPrice);

    // Prices are stored and displayed in MDL across the app
    const numericPrice = typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.]/g, ""))
        : price;

    const displayPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MDL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numericPrice);

    useEffect(() => {
        const favorites = getFavorites(userId);
        setIsFavorite(favorites.some((item: { id: string }) => item.id === id));
    }, [id, userId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleShowSalesHistory = () => {
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const favorites = getFavorites(userId);

        if (isFavorite) {
            const updatedFavorites = favorites.filter((item: { id: string }) => item.id !== id);
            setFavorites(userId, updatedFavorites);
            setIsFavorite(false);

            if (isFavoriteView && onRemove) {
                onRemove(id);
            }

            toast(`${title} removed from favorites!`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        } else {
            const currentImage = images[currentImageIndex];
            const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.src || '/placeholder.svg';

            const newFavorite = {
                id,
                title,
                price: numericPrice,
                currency,
                image: imageUrl,
                brand,
                size,
                rating
            };

            setFavorites(userId, [...favorites, newFavorite]);
            setIsFavorite(true);

            toast(`${title} added to favorites!`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        }

        const event = new Event("favoritesUpdated");
        window.dispatchEvent(event);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAdding(true);

        try {
            const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const existingItemIndex = currentCart.findIndex((item: { id: string }) => item.id === id);

            const currentImage = images[currentImageIndex];
            const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.src || '/placeholder.svg';

            if (existingItemIndex >= 0) {
                currentCart[existingItemIndex].quantity += 1;
            } else {
                currentCart.push({
                    id,
                    title,
                    price: `${numericPrice}`,
                    currency,
                    image: imageUrl,
                    quantity: 1,
                    brand,
                    size
                });
            }

            localStorage.setItem("cart", JSON.stringify(currentCart));

            const favorites = getFavorites(userId);
            const updatedFavorites = favorites.filter((item: { id: string }) => item.id !== id);
            setFavorites(userId, updatedFavorites);
            setIsFavorite(false);

            if (isFavoriteView && onRemove) {
                onRemove(id);
            }

            const cartEvent = new Event("cartUpdated");
            window.dispatchEvent(cartEvent);

            const favoritesEvent = new Event("favoritesUpdated");
            window.dispatchEvent(favoritesEvent);

            toast(`${title} added to cart and removed from favorites!`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error updating cart/favorites:", error);
            toast.error("Failed to add to cart. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
            });
        } finally {
            setTimeout(() => setIsAdding(false), 300);
        }
    };

    const router = useRouter();
    const handleCardClick = () => {
        router.push(`/product/${id}`);
    };

    return (
        <div
            className="max-w-[320px] w-full mx-auto overflow-hidden poppins relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-[#F9F9F9] rounded-2xl relative">
                <div className="relative cursor-pointer" onClick={handleCardClick}>
                    <div
                        className="relative overflow-hidden flex justify-center items-center"
                        style={{ height: "250px" }}
                    >
                        <Image
                            src={images[currentImageIndex] || "/placeholder.svg"}
                            alt={`${title} - Image ${currentImageIndex + 1}`}
                            width={200}
                            height={200}
                            className="object-contain transition-opacity duration-300 max-w-[200px]"
                        />
                    </div>
                    {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-[#FD4D57] text-white px-5 py-3 rounded-md font-medium text-base">
                                Sale in 3 days
                            </div>
                        </div>
                    )}
                    <button
                        className="absolute top-3 right-3 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors z-50"
                        onClick={handleFavoriteToggle}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <LuTrash2 size={18} className="text-[#FF3A44]" />
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
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === index
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
                    <p className="text-center text-sm font-medium text-text-secondary">
                        Earn <span className="text-[#FF1E7F]">50 points</span> with this purchase
                    </p>

                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[#646464] text-base font-medium">
                            {displayPrice}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShowSalesHistory();
                            }}
                            className="focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                <g clipPath="url(#clip0_15_6633)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8 16C1.412 16 0 14.588 0 8C0 1.412 1.412 0 8 0C14.588 0 16 1.412 16 8C16 14.588 14.588 16 8 16ZM4.66666 8C5.03484 8 5.33331 8.29847 5.33331 8.66666V11.3333C5.33331 11.7015 5.03484 12 4.66666 12C4.29847 12 4 11.7015 4 11.3333V8.66669C4 8.29847 4.29847 8 4.66666 8ZM8.66666 4.66666C8.66666 4.29847 8.36819 4 8 4C7.63181 4 7.33334 4.29847 7.33334 4.66666V11.3333C7.33334 11.7015 7.63181 12 8 12C8.36819 12 8.66666 11.7015 8.66666 11.3333V4.66666ZM11.3333 6.66666C11.7015 6.66666 12 6.96513 12 7.33331V11.3333C12 11.7015 11.7015 12 11.3333 12C10.9652 12 10.6667 11.7015 10.6667 11.3333V7.33331C10.6667 6.96513 10.9651 6.66666 11.3333 6.66666Z" fill="#005BFF" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_15_6633">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isFavoriteView && (
                <div className="mt-6">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`w-full py-[14px] text-base font-semibold border-2 rounded-xl transition-all 
                            ${isAdding
                                ? "border-primary/70 text-primary/70 cursor-not-allowed"
                                : "border-primary text-primary hover:bg-primary hover:text-white"
                            }`}
                    >
                        {isAdding ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            )}

            <Modal
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={null}
                width={1000}
                centered
            >
                <SalesGraphCard />
            </Modal>
        </div>
    );
}