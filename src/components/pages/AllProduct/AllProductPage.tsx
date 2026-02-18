/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ReusableButton from "@/components/shared/Button/MakeButton";
import ProductFilters from "@/components/ProductFilters/ProductFilters";


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
    discountPrice?: number;
    onSale?: boolean;
    size?: string | null;
    category: string | null;
    productImages: ProductImage[];
    inventory: number;
    sellerId: string;
    createdAt: string;
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const AllProductPage = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const onSale = searchParams.get('onSale');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });

    const normalizeCategory = (cat: string) => 
        cat.toLowerCase().replace(/\s+/g, ' ').trim();

    const formatCategoryTitle = (cat: string | null) => {
        if (!cat) return "All Products";
        return cat.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Build API URL with query parameters
                const params = new URLSearchParams({
                    limit: pagination.limit.toString(),
                    page: pagination.page.toString(),
                });

                // Add category filter if present
                if (category) {params.append('category', category);}
                if (searchQuery) {params.append('search', searchQuery);}
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);
                if (inStock) params.append('inStock', inStock);
                if (onSale) params.append('onSale', onSale);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortOrder) params.append('sortOrder', sortOrder);

                const response = await fetch(`/api/products?${params}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();

                if (data.success && data.data) {
                    setProducts(data.data.products || []);
                    if (data.data.pagination) {
                        setPagination(data.data.pagination);
                    }
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

       fetchProducts();
    }, [
        pagination.page, 
        pagination.limit, 
        category, 
        searchQuery,
        minPrice,
        maxPrice,
        inStock,
        onSale,
        sortBy,
        sortOrder
    ]);
    
    const filteredProducts = products;

    const getPageTitle = () => {
        if (searchQuery) {
            return `Search Results for "${searchQuery}"`;
        }
        if (category) {
            return formatCategoryTitle(category);
        }
        return "All Products";
        
    };

    

    const getPageDescription = () => {
        if (searchQuery) {
            return `Found ${pagination.total} product${pagination.total !== 1 ? 's' : ''} matching "${searchQuery}"`;
        }
        if (category) {
            return `Explore our curated selection of ${formatCategoryTitle(category)} - quality and variety in one place.`;
        }
        return "Explore a curated selection of top-rated items across all categories—quality, variety, and value in one place.";
    };

    // Calculate rating (Gonna add this to schema later)
    const calculateRating = (product: Product) => {
        // For now, returning a random rating between 4.0 and 5.0
        // Later, will add a ratings table to the database
        return Math.round((4.0 + Math.random()) * 10) / 10;
    };

    if (loading) {
        return (
            <div className="container mx-auto my-20">
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto my-20">
                <div className="text-center py-10">
                    <h1 className="font-semibold text-[28px] md:text-[32px] mb-3 text-red-500">
                        Error Loading Products
                    </h1>
                    <p className="text-lg text-[#333] opacity-80 mb-4">{error}</p>
                    <ReusableButton
                        variant="fill"
                        className="px-8 py-4 text-sm font-semibold"
                        onClick={() => window.location.reload()}
                    >
                        TRY AGAIN
                    </ReusableButton>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-2 sm:mt-4 md:mt-6 mb-6 md:mb-10 px-4">
            {/* Page Title */}
            {(filteredProducts.length > 0 || !category) && (
                <div className="text-center poppins">
                    <h1 className="font-semibold text-[28px] md:text-[32px]">
                        {getPageTitle()}
                    </h1>
                    <div className="lg:max-w-2xl mx-auto mt-3">
                        <p className="text-[#333] opacity-80 text-base md:text-[17px]">
                            {getPageDescription()}
                        </p>
                    </div>
                </div>
            )}

            <ProductFilters />

            {/* Products grid or empty state */}
            <div className="mt-4 sm:mt-6 lg:mt-8">
                {filteredProducts.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredProducts.map((product) => {
                                // Get the primary image or first image
                                const primaryImage = product.productImages.find(img => img.isPrimary);
                                const images = primaryImage 
                                    ? [primaryImage.url, ...product.productImages.filter(img => !img.isPrimary).map(img => img.url)]
                                    : product.productImages.map(img => img.url);

                                return (
                                    <ProductCard
                                        key={product.id}
                                        images={images.length > 0 ? images : ['/placeholder.svg']}
                                        title={product.name}
                                        price={product.price}
                                        discountPrice={product.onSale ? product.discountPrice : undefined}
                                        onSale={product.onSale}
                                        rating={calculateRating(product)}
                                        itemsSold={10}
                                        id={product.id}
                                        size={product.size ?? ""}
                                    />
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {!category && pagination.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <ReusableButton
                                    variant="outline"
                                    className="px-6 py-3 text-sm font-semibold"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                >
                                    PREVIOUS
                                </ReusableButton>
                                
                                <span className="text-base font-medium">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>

                                <ReusableButton
                                    variant="outline"
                                    className="px-6 py-3 text-sm font-semibold"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                                    disabled={pagination.page === pagination.totalPages}
                                >
                                    NEXT
                                </ReusableButton>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-6 sm:py-8">
                        <h1 className="font-semibold text-[22px] sm:text-[28px] md:text-[32px] mb-2 sm:mb-3">
                            No Products Found
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-[#333] opacity-80 mb-4 max-w-md mx-auto px-2">
                            We couldn&apos;t find any products in the &quot;{formatCategoryTitle(category)}&quot; category.
                        </p>
                        <Link href={"/all-product"}>
                            <ReusableButton
                                variant="fill"
                                className="px-8 py-4 text-sm font-semibold"
                            >
                                BROWSE ALL PRODUCTS
                            </ReusableButton>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductPage;