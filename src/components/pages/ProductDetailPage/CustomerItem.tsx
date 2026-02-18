"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import ProductCard from "@/components/shared/ProductCard/ProductCard";

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  rating?: number;
  itemsSold?: number;
  productImages: ProductImage[];
}

interface ProductsData {
  products: RelatedProduct[];
}

const CustomerItem = () => {
  const params = useParams();
  const productId = params.id as string;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch related products based on the current product category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);

      try {
        // First fetch the current product to get its category
        const productResponse = await fetch(`/api/products?id=${productId}`);

        if (!productResponse.ok) {
          throw new Error("Failed to fetch current product");
        }

        const productData = await productResponse.json();

        if (!productData.success || !productData.data?.product) {
          throw new Error("Current product not found");
        }

        const currentProduct = productData.data.product;
        const category = currentProduct.category;

        // Then fetch related products with the same category, excluding the current product
        if (category) {
          const relatedResponse = await fetch(
            `/api/products?category=${encodeURIComponent(category)}&limit=6`
          );

          if (!relatedResponse.ok) {
            throw new Error("Failed to fetch related products");
          }

          const relatedData = (await relatedResponse.json()) as {
            success: boolean;
            data: ProductsData;
          };

          if (relatedData.success && relatedData.data?.products) {
            // Filter out the current product from related products
            const filtered = relatedData.data.products
              .filter((product) => product.id !== productId)
              .slice(0, 6); // Limit to 6 products

            setRelatedProducts(filtered);
          }
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  const goToImage = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  // If there are no related products, don't render the component
  if (relatedProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="container mx-auto mb-7 mt-12 sm:mt-16 lg:mt-20">
      <div className="text-left md:text-center font-poppins ">
        <h1 className="font-semibold text-[24px] md:text-[32px]">
          Customers who bought this item also purchased
        </h1>
        <div className="mt-4 max-w-xl mx-auto">
          <p className="text-[#333] opacity-80 text-[15px] md:text-[17px] font-medium">
            Customers who bought this item also purchased complementary products
            for a complete setup.
          </p>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Responsive Slider */}
      {!loading && relatedProducts.length > 0 && (
        <div className="mt-8 lg:mt-10">
          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setCurrentImageIndex(swiper.realIndex);
            }}
          >
            {relatedProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  images={product.productImages.map((img) => img.url)}
                  title={product.name}
                  price={product.price}
                  rating={product.rating || 4.5}
                  itemsSold={
                    product.itemsSold || Math.floor(Math.random() * 5000) + 5000
                  }
                  id={product.id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Pagination Dots */}
      {!loading && relatedProducts.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-8 md:mt-12">
          {relatedProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className="focus:outline-none"
              aria-label={`Go to image ${index + 1}`}
            >
              <div
                className={`h-2 sm:h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index
                    ? "w-6 sm:w-6 bg-primary"
                    : "w-1.5 sm:w-1.5 bg-primary/30"
                }`}
              ></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerItem;
