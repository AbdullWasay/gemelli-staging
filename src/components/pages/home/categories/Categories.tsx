/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReusableButton from "@/components/shared/Button/MakeButton";

// Import your existing category images
import img1 from "@/assets/categories/1.png";
import img2 from "@/assets/categories/2.png";
import img3 from "@/assets/categories/3.png";
import img4 from "@/assets/categories/4.png";
import img5 from "@/assets/categories/5.png";
import img6 from "@/assets/categories/6.png";
import img7 from "@/assets/categories/7.png";
import img8 from "@/assets/categories/8.png";
import img9 from "@/assets/categories/9.png";
import img10 from "@/assets/categories/10.png";
import img11 from "@/assets/categories/11.png";

interface Category {
  name: string;
  image: any;
  productCount: number;
}

// Map of category names to images
const categoryImageMap: { [key: string]: any } = {
  "ELECTRONICS & GADGETS": img1,
  "FASHION & ACCESSORIES": img2,
  "HEALTH & WELLNESS": img3,
  "GROCERIES & FOOD": img4,
  "AUTOMOTIVE": img5,
  "OFFICE & SCHOOL SUPPLIES": img6,
  "SPORTS & OUTDOORS": img7,
  "BOOKS & MEDIA": img8,
  "PET SUPPLIES": img9,
  "TRAVEL & LUGGAGE": img10,
  "GIFTS & OCCASIONS": img11,
};

// Default categories to show if no products exist yet
const defaultCategories: Category[] = [
  { name: "ELECTRONICS & GADGETS", image: img1, productCount: 0 },
  { name: "FASHION & ACCESSORIES", image: img2, productCount: 0 },
  { name: "HEALTH & WELLNESS", image: img3, productCount: 0 },
  { name: "GROCERIES & FOOD", image: img4, productCount: 0 },
  { name: "AUTOMOTIVE", image: img5, productCount: 0 },
  { name: "OFFICE & SCHOOL SUPPLIES", image: img6, productCount: 0 },
  { name: "SPORTS & OUTDOORS", image: img7, productCount: 0 },
  { name: "BOOKS & MEDIA", image: img8, productCount: 0 },
  { name: "PET SUPPLIES", image: img9, productCount: 0 },
  { name: "TRAVEL & LUGGAGE", image: img10, productCount: 0 },
  { name: "GIFTS & OCCASIONS", image: img11, productCount: 0 },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all products to extract unique categories
        const response = await fetch('/api/products?limit=1000');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.data?.products) {
            const products = data.data.products;
            
            // Extract unique categories and count products
            const categoryCount: { [key: string]: number } = {};
            
            products.forEach((product: any) => {
              if (product.category) {
                const normalizedCategory = product.category.toUpperCase().trim();
                categoryCount[normalizedCategory] = (categoryCount[normalizedCategory] || 0) + 1;
              }
            });

            // Map categories with their counts
            const activeCategoriesSet = new Set(Object.keys(categoryCount));
            
            // Update categories with product counts
            const updatedCategories = defaultCategories.map(cat => ({
              ...cat,
              productCount: categoryCount[cat.name] || 0
            }));

            // Add any new categories from database that aren't in default list
            Object.keys(categoryCount).forEach(categoryName => {
              if (!defaultCategories.find(c => c.name === categoryName)) {
                updatedCategories.push({
                  name: categoryName,
                  image: img1, // Use default image for new categories
                  productCount: categoryCount[categoryName]
                });
              }
            });

            // Sort by product count (descending) and show only categories with products(to implement that logic uncomment the line below)
            const sortedCategories = updatedCategories
              // .filter(cat => cat.productCount > 0)
              // .sort((a, b) => b.productCount - a.productCount);

            // If no categories have products, show all default categories
            setCategories(sortedCategories.length > 0 ? sortedCategories : defaultCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep default categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatCategoryDisplay = (categoryName: string) => {
    return categoryName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Group categories for display (first 4, next 3, last 4)
  const firstRowCategories = categories.slice(0, 4);
  const secondRowCategories = categories.slice(4, 7);
  const thirdRowCategories = categories.slice(7, 11);

  if (loading) {
    return (
      <div className="container mx-auto mb-7 mt-12 poppins">
        <div className="text-center">
          <h1 className="font-semibold text-[28px] md:text-[32px]">Categories</h1>
          <div className="mt-12 flex justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-7 mt-12 poppins">
      <div className="text-center poppins">
        <h1 className="font-semibold text-[28px] md:text-[32px]">Categories</h1>
        <div className="lg:max-w-2xl mx-auto mt-3">
          <p className="text-[#333] opacity-80 text-base md:text-[17px] font-medium">
            Find exactly what you need from our diverse categories.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 lg:gap-5 mt-6 sm:mt-10 lg:mt-14">
        {/* First row - 4 categories */}
        {firstRowCategories.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-3 lg:gap-5 w-full">
            {firstRowCategories.map((category) => (
              <Link
                key={category.name}
                href={`/all-product?category=${encodeURIComponent(category.name)}`}
                className="relative group cursor-pointer"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg" />
                <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white px-2 py-4 md:text-xl text-base lg:text-nowrap font-medium text-center">
                  {formatCategoryDisplay(category.name)}
                  {category.productCount > 0 && (
                    <span className="block text-xs mt-1">
                      ({category.productCount} items)
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Second row - 3 categories */}
        {secondRowCategories.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-3 lg:gap-5 w-full">
            {secondRowCategories.map((category) => (
              <Link
                key={category.name}
                href={`/all-product?category=${encodeURIComponent(category.name)}`}
                className="relative group cursor-pointer"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg" />
                <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white px-2 py-4 md:text-xl text-base lg:text-nowrap font-medium text-center">
                  {formatCategoryDisplay(category.name)}
                  {category.productCount > 0 && (
                    <span className="block text-xs mt-1">
                      ({category.productCount} items)
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Third row - 4 categories */}
        {thirdRowCategories.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-3 lg:gap-5 w-full">
            {thirdRowCategories.map((category) => (
              <Link
                key={category.name}
                href={`/all-product?category=${encodeURIComponent(category.name)}`}
                className="relative group cursor-pointer"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg" />
                <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white px-2 py-4 md:text-xl text-base lg:text-nowrap font-medium text-center">
                  {formatCategoryDisplay(category.name)}
                  {category.productCount > 0 && (
                    <span className="block text-xs mt-1">
                      ({category.productCount} items)
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7 md:mt-12 flex items-center justify-center">
        <Link href="/all-product">
          <ReusableButton
            variant="fill"
            className="px-8 py-4 text-sm font-semibold"
          >
            VIEW ALL
          </ReusableButton>
        </Link>
      </div>
    </div>
  );
};

export default Categories;