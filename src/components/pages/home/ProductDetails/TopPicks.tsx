"use client";
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Import the Autoplay module
import "swiper/css";
import ReusableButton from "@/components/shared/Button/MakeButton";
import Link from "next/link";

// Type definition for product data
interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Product {
  id: string;
  name: string;
  price: number;
  orderItems: OrderItem[];
  productImages: ProductImage[];
}
const TopPicks = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "/api/home/products?section=top-picks&limit=12"
        );
        const data = await response.json();

        if (data.success && data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching top picks products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fallback UI during loading
  if (isLoading) {
    return (
      <div className="container mx-auto mb-7 mt-12 sm:mt-24 lg:mt-28">
        <div className="text-center poppins">
          <h1 className="font-semibold text-[28px] md:text-[32px]">
            Our Top Picks For You
          </h1>
          <div className="lg:max-w-2xl mx-auto mt-3">
            <p className="text-[#333] opacity-80 text-base md:text-[17px] font-medium">
              Loading products...
            </p>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-2xl h-[350px] animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-7 mt-12 sm:mt-24 lg:mt-28">
      <div className="text-center poppins">
        <h1 className="font-semibold text-[28px] md:text-[32px]">
          Our Top Picks For You
        </h1>
        <div className="lg:max-w-2xl mx-auto mt-3">
          <p className="text-[#333] opacity-80 text-base md:text-[17px] font-medium">
            Handpicked options that match your interests, ensuring the ultimate
            personalized experience.
          </p>
        </div>
      </div>

      {/* Mobile Slider */}
      <div className="block md:hidden mt-8">
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]} // Add the Autoplay module here
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                images={
                  product.productImages.map((img) => img.url) || [
                    "/placeholder.svg",
                  ]
                }
                title={product.name}
                price={product.price}
                rating={4.5} // Default rating since we don't have a rating system
                itemsSold={product.orderItems.length}
                id={product.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block mt-8 sm:mt-10 lg:mt-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              images={
                product.productImages.map((img) => img.url) || [
                  "/placeholder.svg",
                ]
              }
              title={product.name}
              price={product.price}
              rating={4.5} // Default rating since we don't have a rating system
              itemsSold={product.orderItems.length}
              id={product.id}
            />
          ))}
        </div>
      </div>

      <div className="mt-9 md:mt-12 flex items-center justify-center">
        <Link href={"/all-product"}>
          <ReusableButton
            variant="fill"
            className="px-8 py-4 text-sm font-semibold"
          >
            SHOP ALL PRODUCTS
          </ReusableButton>
        </Link>
      </div>
    </div>
  );
};

export default TopPicks;
