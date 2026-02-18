"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import Promation from "../Promation/Promation";

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  productImages: ProductImage[];
  inventory: number;
  sellerId: string;
  createdAt: string;
  onSale?: boolean;
  discountPrice?: number;
  size?: string | null;
}

interface Store {
  id: string;
  storeName: string;
  storeCategory?: string;
}

interface Seller {
  id: string;
  name?: string;
  email: string;
  store: Store;
}

interface StoreWithProducts {
  seller: Seller;
  store: Store;
  featuredProducts: Product[];
}

const StoreProducts = () => {
  const [storeData, setStoreData] = useState<StoreWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoresWithProducts = async () => {
      try {
        setLoading(true);
        
        // Use our new API endpoint to fetch stores with products in one request
        const response = await fetch('/api/stores?limit=5&productsPerStore=4');
        
        if (!response.ok) {
          // Fallback to the original method if the new API isn't working
          throw new Error('Failed to fetch stores with products');
        }

        const data = await response.json();

        if (data.success && data.data && data.data.stores) {
          setStoreData(data.data.stores);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching store products:', err);
        setError('Failed to load store products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoresWithProducts();
  }, []);

  // Calculate rating (demo function)
  const calculateRating = () => {
    // For now, returning a random rating between 4.0 and 5.0
    return Math.round((4.0 + Math.random()) * 10) / 10;
  };

  if (loading) {
    return (
      <div className="container mx-auto my-10">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-600">Loading store products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-10">
        <div className="text-center py-8">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {storeData.length > 0 ? (
        <div className="space-y-20">
          {storeData.map((storeItem) => (
            <div key={storeItem.seller.id} className="mb-10">
              {/* Store Name Header with Decorative Elements */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent w-full max-w-xs"></div>
                  <h2 className="text-2xl md:text-3xl font-bold mx-6 whitespace-nowrap">
                    {storeItem.store.storeName}
                  </h2>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent w-full max-w-xs"></div>
                </div>
                {storeItem.store.storeCategory && (
                  <p className="text-gray-500 mt-2 font-medium">
                    {storeItem.store.storeCategory}
                  </p>
                )}
              </div>
              
              {/* Store Promotions Section */}
              <Promation/>
              
              {/* Featured Products Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Featured Products</h3>
                    <p className="text-sm text-gray-500">Special selections from {storeItem.store.storeName}</p>
                  </div>
                  <a 
                    href={`/all-product?sellerId=${storeItem.seller.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                
                {storeItem.featuredProducts?.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {storeItem.featuredProducts.map((product) => {
                      // Get the primary image or first image
                      const primaryImage = product.productImages?.find(img => img.isPrimary);
                      const images = primaryImage 
                        ? [primaryImage.url, ...(product.productImages?.filter(img => !img.isPrimary).map(img => img.url) || [])]
                        : product.productImages?.map(img => img.url) || [];

                      return (
                        <ProductCard
                          key={product.id}
                          images={images.length > 0 ? images : ['/placeholder.svg']}
                          title={product.name}
                          price={product.price}
                          discountPrice={product.onSale ? product.discountPrice : undefined}
                          onSale={product.onSale}
                          rating={calculateRating()}
                          itemsSold={10}
                          id={product.id}
                          size={product.size ?? ""}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No products available for this store</p>
                  </div>
                )}
              </div>
              
              {/* Store divider */}
              <div className="mt-16 border-b border-gray-100"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No stores available</p>
        </div>
      )}
    </div>
  );
};

export default StoreProducts;
