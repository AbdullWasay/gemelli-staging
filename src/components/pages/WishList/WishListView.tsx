/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ReusableButton from "@/components/shared/Button/MakeButton";
import WishListCard from "@/components/ui/WishListCard/WishListCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Select } from 'antd';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getFavorites } from "@/utils/favoritesUtils";

export default function WishListView() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<string>("price");
    const [sortOrder, setSortOrder] = useState<string>("lowToHigh");
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id ?? null;

    useEffect(() => {
        setFavorites(getFavorites(userId));

        const handleStorageChange = () => {
            setFavorites(getFavorites(userId));
        };

        window.addEventListener("favoritesUpdated", handleStorageChange);
        window.addEventListener("logout", handleStorageChange);
        return () => {
            window.removeEventListener("favoritesUpdated", handleStorageChange);
            window.removeEventListener("logout", handleStorageChange);
        };
    }, [userId]);

    const handleRemoveFavorite = (id: string) => {
        setFavorites(prev => prev.filter(item => item.id !== id));
    };

    const handleSortByChange = (value: string) => {
        setSortBy(value);
    };

    const handleSortOrderChange = (value: string) => {
        setSortOrder(value);
    };

    const sortedFavorites = [...favorites].sort((a, b) => {
        if (sortBy === "price") {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return sortOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
        } else if (sortBy === "name") {
            return sortOrder === "lowToHigh"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        } else if (sortBy === "rating") {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return sortOrder === "lowToHigh" ? ratingA - ratingB : ratingB - ratingA;
        }
        return 0;
    });

    return (
        <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
            {favorites.length > 0 && (
                <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-4 lg:mb-10">
                    WishList
                </h1>
            )}


            {favorites.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-6 lg:mb-12">
                    <span className="text-lg text-text-secondary font-medium">Sort By</span>
                    <div className="flex flex-wrap gap-4">
                        <Select
                            defaultValue="price"
                            onChange={handleSortByChange}
                            options={[
                                { value: 'price', label: 'Price' },
                                { value: 'name', label: 'Name' },
                                { value: 'rating', label: 'Rating' },
                            ]}
                            className="h-10 rounded-md w-[150px] md:w-[250px]"
                        />

                        <Select
                            defaultValue="lowToHigh"
                            onChange={handleSortOrderChange}
                            options={[
                                { value: 'lowToHigh', label: 'Low To High' },
                                { value: 'highToLow', label: 'High To Low' },
                            ]}
                            className="h-10 rounded-md w-[150px] md:w-[250px]"
                        />

                    </div>
                </div>
            )}

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
                            Your Wishlist list is empty
                        </h2>
                        <p className="text-text-secondary mb-6">
                            You haven&apos;t added any items to your wishlist yet. Start
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
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {sortedFavorites.map((product) => (
                        <WishListCard
                            key={product.id}
                            id={product.id}
                            images={[product.image]}
                            title={product.title}
                            price={product.price}
                            currency={product.currency}
                            rating={product.rating || 4}
                            brand={product.brand}
                            size={product.size}
                            isFavoriteView={true}
                            onRemove={handleRemoveFavorite}
                            userId={userId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}