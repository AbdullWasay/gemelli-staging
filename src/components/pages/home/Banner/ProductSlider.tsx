"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import sliderImg2 from "@/assets/Banner/Bud2.jpg"; // Fallback image

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import vector from "@/assets/Banner/Vectornew.png";
import { Rate } from "antd";
import LinkIcon from "@/assets/Banner/icon2.png";
import Link from "next/link";

// Type definitions for product data
interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  productImages: ProductImage[];
}

export default function ProductSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  let swiperInstance: SwiperType | null = null;

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          "/api/home/products?section=featured&limit=4"
        );
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setProducts(data.data);
          setCurrentProduct(data.data[0]);
        } else {
          console.warn("No featured products found");
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const goToImage = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  // Show loading state if data is being fetched
  if (isLoading || !currentProduct) {
    return (
      <div className="w-full mx-auto container poppins">
        <div className="relative h-[350px] md:h-[500px] bg-gray-100 animate-pulse rounded-[12px] sm:rounded-[20px] md:rounded-[44px]">
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-sm w-[300px] h-[100px]">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto container poppins">
      <div className="relative">
        <Swiper
          ref={(node) => {
            if (node) swiperInstance = node.swiper;
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="product-swiper rounded-[12px] sm:rounded-[20px] md:rounded-[44px] overflow-hidden w-full mx-auto  sm:max-w-[500px] md:max-w-[730px] lg:max-w-[950px] xl:max-w-[880px] 2xl:max-w-[1300px]
    max-w-[37%] 
    [@media(max-width:425px) and (min-width:376px)]:max-w-[35%] 
    [@media(max-width:375px)]:max-w-[35%]"
          onSlideChange={(swiper) => {
            setCurrentImageIndex(swiper.activeIndex);
            setCurrentProduct(products[swiper.activeIndex]);
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] w-full bg-white h-[350px] md:h-[500px] lg:h-[600px] xl:h-[730px]">
                <Image
                  src={
                    product.productImages && product.productImages.length > 0
                      ? product.productImages[0].url
                      : sliderImg2
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 1200px"
                />

                {/* Add this inside the relative container */}
                <div className="absolute left-1/4 lg:left-1/3 top-1/3 md:top-1/3 lg:top-1/2 z-10 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform">
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={LinkIcon}
                      alt="Link Icon"
                      width={100}
                      height={100}
                      className="h-10 w-16 md:w-full md:h-full"
                    />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pb-3 md:pb-6 absolute bottom-0 left-20 md:left-0 right-0 z-10 ">
          <div className="mx-auto flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 -mb-5 md:-mb-[26px] lg:-mb-6 xl:-mb-[26px] 2xl:-mb-6 xl:-ml-[20px] 2xl:-ml-[1px] lg:ml-[23px] md:ml-[135px] ml-[233px]  relative ">
              {/* Vector Image */}
              <Image
                src={vector}
                alt="vector"
                className="w-[300px] md:w-[400px] xl:w-[800px]"
              />

              {/* Details Section */}
              <div className="absolute -bottom-[1px] left-[14.8%] md:left-[35%] lg:left-[35%] xl:left-[44%] transform -translate-x-1/2 max-w-xs sm:max-w-sm md:max-w-md bg-white p-3 sm:p-4 lg:p-4 xl:p-5 rounded-b-[20px] md:rounded-b-[35px] rounded-tl-[20px] md:rounded-tl-[35px] rounded-tr-[12px] md:rounded-tr-[22px] w-[255px] sm:w-[350px] lg:w-[350px] xl:w-[380px] 2xl:w-[440px] h-[130px] md:h-[170px] lg:h-[170px] xl:h-[190px] 2xl:h-[215px] shadow-sm ">
                <div className="space-y-[2px] sm:space-y-[3px]">
                  <h1 className="uppercase text-[10px] sm:text-base lg:text-lg font-semibold">
                    {currentProduct.name}
                  </h1>
                  <Rate
                    disabled
                    defaultValue={5}
                    className="custom-rate !text-xs lg:!text-base"
                  />
                  <p className="text-[#646464] font-medium text-[7px] md:text-xs lg::text-sm">
                    {currentProduct.description ||
                      "Premium quality product at great value."}
                  </p>
                </div>
                <div className="">
                  <button className="uppercase px-4 py-2 sm:px-6 sm:py-2 md:px-8 xl:py-4 text-xs lg:text-base font-semibold bg-primary rounded-[20px] md:rounded-[28px] text-white hover:bg-primary/85 transition-colors w-full mt-2 sm:mt-3 xl:mt-3 2xl:mt-5">
                    {currentProduct.discountPrice
                      ? `${currentProduct.discountPrice} USDT - Add to Cart`
                      : `${currentProduct.price} USDT - Add to Cart`}
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex ml-0 lg:ml-32 xl:ml-40 2xl:ml-48 justify-center items-end space-x-2 mx-auto xl:mt-2 md:mt-0">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className="focus:outline-none"
                  aria-label={`Go to image ${index + 1}`}
                >
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? "w-4 sm:w-6 bg-white/95"
                        : "w-1 sm:w-1.5 bg-white/50"
                    }`}
                  ></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
