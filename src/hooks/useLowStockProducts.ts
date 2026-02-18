import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { useAppSelector } from "@/redux/hooks";

/**
 * Custom hook to fetch products with low stock
 * @returns Array of products with inventory below their lowStockAlert threshold
 */
export function useLowStockProducts() {
  const user = useAppSelector((state) => state.auth.user);
  const sellerId = user?.id;

  // Fetch all products for the current seller
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({
    sellerId,
    // Fetch more products to ensure we get all low stock items
    limit: 100,
  });

  // Extract products from the response
  const allProducts = data?.data?.products || [];

  // Filter products to only include those with low stock
  const lowStockProducts = allProducts.filter((product) => {
    // If lowStockAlert is set, use that value, otherwise default to 5
    const threshold = product.lowStockAlert || 5;
    // Product is considered low stock if inventory is below the threshold
    return product.inventory <= threshold;
  });

  // Sort by inventory level (lowest first)
  const sortedLowStockProducts = [...lowStockProducts].sort(
    (a, b) => a.inventory - b.inventory
  );

  return {
    lowStockProducts: sortedLowStockProducts,
    isLoading,
    isError,
    error,
    refetch,
  };
}
