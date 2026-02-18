// lib/api/products.ts
// Utility functions for product API calls

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
    order: number;
}

export interface Seller {
    id: string;
    name: string | null;
    email: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    inventory: number;
    category: string | null;
    taxRate: string | null;
    discountPrice: number | null;
    onSale: boolean;
    sku: string | null;
    trackInventory: string | null;
    lowStockAlert: number | null;
    size: string | null;
    color: string | null;
    material: string | null;
    length: number | null;
    width: number | null;
    height: number | null;
    weight: number | null;
    seoTitle: string | null;
    metaDescription: string | null;
    productTags: string | null;
    visibility: string | null;
    status: string | null;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
    productImages: ProductImage[];
    seller: Seller;
}

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductsResponse {
    success: boolean;
    data: {
        products: Product[];
        pagination: PaginationData;
    };
}

export interface SingleProductResponse {
    success: boolean;
    data: {
        product: Product;
    };
}

export interface ProductFilters {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    onSale?: boolean;
    sortBy?: 'createdAt' | 'price' | 'name' | 'inventory';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch products with filters
 */
export async function fetchProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
): Promise<ProductsResponse> {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (filters?.category) {
            params.append('category', filters.category);
        }

        if (filters?.search) {
            params.append('search', filters.search);
        }

        if (filters?.minPrice !== undefined) {
            params.append('minPrice', filters.minPrice.toString());
        }

        if (filters?.maxPrice !== undefined) {
            params.append('maxPrice', filters.maxPrice.toString());
        }

        if (filters?.inStock) {
            params.append('inStock', 'true');
        }

        if (filters?.onSale) {
            params.append('onSale', 'true');
        }

        if (filters?.sortBy) {
            params.append('sortBy', filters.sortBy);
        }

        if (filters?.sortOrder) {
            params.append('sortOrder', filters.sortOrder);
        }

        const response = await fetch(`/api/products?${params}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<SingleProductResponse> {
    try {
        const response = await fetch(`/api/products?id=${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

/**
 * Fetch products by seller ID
 */
export async function fetchProductsBySeller(
    sellerId: string,
    page: number = 1,
    limit: number = 20
): Promise<ProductsResponse> {
    try {
        const params = new URLSearchParams({
            sellerId: sellerId,
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await fetch(`/api/products?${params}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch seller products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching seller products:', error);
        throw error;
    }
}

/**
 * Filter products by category (client-side filtering)
 * Note: Server-side filtering is preferred for better performance
 */
export function filterProductsByCategory(
    products: Product[],
    category: string
): Product[] {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, ' ').trim();
    
    return products.filter(product => 
        product.category && 
        product.category.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedCategory
    );
}

/**
 * Search products by query (client-side search)
 * Note: Server-side search is preferred for better performance
 */
export function searchProducts(
    products: Product[],
    query: string
): Product[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    return products.filter(product => {
        const searchableFields = [
            product.name,
            product.description,
            product.productTags,
            product.category,
        ].filter(Boolean).map(field => field!.toLowerCase());
        
        return searchableFields.some(field => field.includes(normalizedQuery));
    });
}

/**
 * Get primary image URL from product
 */
export function getPrimaryImageUrl(product: Product): string {
    const primaryImage = product.productImages.find(img => img.isPrimary);
    return primaryImage?.url || product.productImages[0]?.url || '/placeholder.svg';
}

/**
 * Get all image URLs sorted by order
 */
export function getProductImageUrls(product: Product): string[] {
    const sorted = [...product.productImages].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return a.order - b.order;
    });
    
    return sorted.map(img => img.url);
}

/**
 * Calculate a mock rating (until you implement a ratings system)
 */
export function calculateMockRating(): number {
    return Math.round((4.0 + Math.random()) * 10) / 10;
}

/**
 * Format category for display
 */
export function formatCategoryTitle(category: string | null): string {
    if (!category) return "All Products";
    
    return category.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'MDL'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(price);
}

/**
 * Check if product is in stock
 */
export function isProductInStock(product: Product): boolean {
    return product.inventory > 0;
}

/**
 * Check if product has low stock
 */
export function hasLowStock(product: Product): boolean {
    const threshold = product.lowStockAlert || 5;
    return product.inventory > 0 && product.inventory <= threshold;
}

/**
 * Get product availability status
 */
export function getProductStatus(product: Product): {
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    label: string;
    color: string;
} {
    if (product.inventory === 0) {
        return {
            status: 'out-of-stock',
            label: 'Out of Stock',
            color: 'text-red-600'
        };
    }
    
    if (hasLowStock(product)) {
        return {
            status: 'low-stock',
            label: `Low Stock (${product.inventory})`,
            color: 'text-orange-600'
        };
    }
    
    return {
        status: 'in-stock',
        label: `In Stock (${product.inventory})`,
        color: 'text-green-600'
    };
}