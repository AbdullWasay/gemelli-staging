/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { StarIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import ReusableButton from "@/components/shared/Button/MakeButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getFavorites } from "@/utils/favoritesUtils";

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
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id ?? null;

  useEffect(() => {
    setFavorites(getFavorites(userId));
    const handleUpdate = () => setFavorites(getFavorites(userId));
    window.addEventListener("favoritesUpdated", handleUpdate);
    window.addEventListener("logout", handleUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate);
      window.removeEventListener("logout", handleUpdate);
    };
  }, [userId]);

  const handleAddToCart = (product: ProductCardProps) => {
    setIsAdding(true);

    try {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = currentCart.findIndex(
        (item: { id: string }) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          currency: product.currency || "MDL",
          image: product.images || "/placeholder.svg",
          quantity: 1,
          brand: product.brand || "Brand",
          size: product.size || "Default",
        });
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));

      const event = new Event("cartUpdated");
      window.dispatchEvent(event);

      toast(`${product.title} added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to add to cart. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setTimeout(() => setIsAdding(false), 300);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 mt-10 font-poppins">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              Your favorites list is empty
            </h2>
            <p className="text-text-secondary mb-6">
              You haven&apos;t added any items to your favorites yet. Start
              exploring our collection!
            </p>
            <Link href="/">
              <ReusableButton
                variant="fill"
                className="px-8 py-3 !rounded-lg text-sm font-medium"
              >
                Add Products
              </ReusableButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 font-poppins space-y-6">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="flex flex-row gap-5 bg-white rounded-lg overflow-hidden w-full p-0 sm:p-6"
        >
          {/* Image Container */}
          <div className="bg-[#f9f9f9] p-4 flex items-center justify-center w-[160px] h-[110px] md:w-1/3 lg:w-1/4 sm:h-[220px] md:h-[180px] lg:h-[220px] rounded-xl">
            <Image
              src={favorite.image || "/placeholder.svg"}
              width={200}
              height={200}
              alt={favorite.title}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          {/* Content Container */}
          <div className="flex-1 flex flex-col lg:flex-row gap-0 md:gap-6">
            <div className="space-y-1 md:space-y-3 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold truncate">
                {favorite.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-secondary text-sm sm:text-base">
                  {String(favorite.price)} {favorite.currency || "MDL"}
                </span>
                <StarIcon className="h-4 w-4 fill-[#FF9900] text-[#FF9900]" />
                <span className="text-xs sm:text-sm text-text-secondary">
                  4.5/5
                </span>
              </div>
              <p className="text-text-secondary font-medium text-xs sm:text-sm lg:text-base hidden md:block">
                {favorite.description ||
                  "Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push your style full-speed ahead. Taking the revolutionary full-length Nike Air unit that shook up the running world and adding fresh colors and crisp details, it lets you ride in first-class comfort."}
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end lg:justify-center">
              <ReusableButton
                variant="fill"
                className="w-full md:w-auto px-6 sm:px-11 py-[10px] md:py-3 text-xs sm:text-sm font-medium !rounded-lg"
                onClick={() => handleAddToCart(favorite)}
                disabled={isAdding}
              >
                {isAdding ? "ADDING..." : "ADD TO CART"}
              </ReusableButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
