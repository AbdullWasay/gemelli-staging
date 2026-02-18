"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterState {
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSale: boolean;
  sortBy: string;
  sortOrder: string;
}

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Preserve existing search and category
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Clear all params and rebuild
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("inStock");
    params.delete("onSale");
    params.delete("sortBy");
    params.delete("sortOrder");

    if (category) params.set("category", category);
    if (search) params.set("search", search);

    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.inStock) params.set("inStock", "true");
    if (filters.onSale) params.set("onSale", "true");
    if (filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
    if (filters.sortOrder !== "desc") params.set("sortOrder", filters.sortOrder);

    router.push(`/all-product?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) params.set("category", category);
    if (search) params.set("search", search);

    setFilters({
      minPrice: "",
      maxPrice: "",
      inStock: false,
      onSale: false,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    router.push(`/all-product?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sm:mb-6">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-primary text-white rounded-lg mb-4"
      >
        <span className="font-medium">Filters & Sort</span>
        <svg
          className={`w-5 h-5 transition-transform ${showFilters ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Container */}
      <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="inventory">Stock Level</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange("onSale", e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">On Sale</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.minPrice && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Min: ${filters.minPrice}
            </span>
          )}
          {filters.maxPrice && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Max: ${filters.maxPrice}
            </span>
          )}
          {filters.inStock && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              In Stock
            </span>
          )}
          {filters.onSale && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              On Sale
            </span>
          )}
        </div>
      </div>
    </div>
  );
}