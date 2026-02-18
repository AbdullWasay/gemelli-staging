"use client";
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import prod from "@/assets/ProductImage/prod1.png";
import Image from "next/image";
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

const BestSells = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); // For the three featured products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "/api/home/products?section=best-sellers&limit=12"
        );
        const data = await response.json();

        if (data.success && data.data) {
          setProducts(data.data);
          // Set first 3 products as featured (shown in middle row)
          setFeaturedProducts(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching best seller products:", error);
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
            Our Best Sellers
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
          Our Best Sellers
        </h1>
        <div className="lg:max-w-2xl mx-auto mt-3">
          <p className="text-[#333] opacity-80 text-base md:text-[17px] font-medium">
            Discover the most popular items across all categories, handpicked
            for you loved by our customers for their quality and reliability!
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
          modules={[Autoplay]}
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

      <div className="md:flex items-center gap-5 hidden  mt-8 sm:mt-10 lg:mt-14">
        {featuredProducts.length > 0 && (
          <ProductCard
            images={
              featuredProducts[0]?.productImages.map((img) => img.url) || [
                "/placeholder.svg",
              ]
            }
            title={featuredProducts[0]?.name || "Product"}
            price={featuredProducts[0]?.price || 0}
            rating={4.5}
            itemsSold={featuredProducts[0]?.orderItems.length || 0}
            id={featuredProducts[0]?.id || ""}
          />
        )}
        <div className="relative poppins hidden lg:block">
          <Image src={prod} alt="product" />
          <div className="absolute bottom-8 left-8 text-white space-y-1">
            <h3 className="text-xl font-semibold">Furniture & Decor</h3>
            <p className="text-sm font-medium">300 Products</p>
          </div>
        </div>

        {featuredProducts.length > 1 && (
          <ProductCard
            images={
              featuredProducts[1]?.productImages.map((img) => img.url) || [
                "/placeholder.svg",
              ]
            }
            title={featuredProducts[1]?.name || "Product"}
            price={featuredProducts[1]?.price || 0}
            rating={4.5}
            itemsSold={featuredProducts[1]?.orderItems.length || 0}
            id={featuredProducts[1]?.id || ""}
          />
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block mt-6">
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

export default BestSells;
