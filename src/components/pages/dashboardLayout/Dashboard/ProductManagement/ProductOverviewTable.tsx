"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { useAppSelector } from "@/redux/hooks";
import ImagePreview from "@/components/shared/ImagePreview/ImagePreview";
import Image from "next/image";

export function ProductOverviewTable() {
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(10);

  // State for image preview
  const [previewImages, setPreviewImages] = useState<Array<{
    url: string;
    isPrimary?: boolean;
  }> | null>(null);
  const [previewProductName, setPreviewProductName] = useState("");
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // Close image preview
  const closePreview = () => {
    setPreviewImages(null);
  };

  // Open image preview for a product
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openImagePreview = (product: any, initialIndex: number = 0) => {
    // If product has multiple images
    if (product.productImages && product.productImages.length > 0) {
      setPreviewImages(product.productImages);
      setPreviewProductName(product.name);
      setInitialImageIndex(initialIndex);
    }
    // If product has only primaryImageUrl
    else if (product.primaryImageUrl) {
      setPreviewImages([{ url: product.primaryImageUrl, isPrimary: true }]);
      setPreviewProductName(product.name);
      setInitialImageIndex(0);
    }
    // No images to preview
    else {
      return;
    }
  };

  // Get user ID from auth state
  const user = useAppSelector((state) => state.auth.user);
  const sellerId = user?.id;

  // Fetch products from API using RTK Query
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({
    sellerId,
    page,
    limit,
  });

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination;

  // Handle refresh action
  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-red-500 font-medium">
          Error loading products:{" "}
          {error
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as any).data?.error || "Unknown error"
            : "Unknown error"}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={handleRefresh}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="w-full py-8 sm:py-10 text-center px-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-4">
          No products found
        </h3>
        <Link href="/dashboard/product-management/add-product">
          <span className="px-4 py-2 bg-primary text-white rounded-md inline-block text-sm sm:text-base">
            Add Your First Product
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg mt-4 sm:mt-6">
      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-4">
        {products.map((product, index) => {
          const primaryImage = product.productImages?.find((img) => img.isPrimary);
          const imageToShow = primaryImage || product.productImages?.[0];
          const primaryIndex = primaryImage
            ? product.productImages?.indexOf(primaryImage) ?? 0
            : 0;

          return (
            <div
              key={product.id || index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div
                  className="relative w-16 h-16 shrink-0 cursor-pointer rounded-md overflow-hidden bg-gray-100"
                  onClick={() => openImagePreview(product, primaryIndex)}
                >
                  {imageToShow ? (
                    <Image
                      fill
                      unoptimized
                      src={imageToShow.url}
                      alt={product.name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">${product.price.toFixed(2)}</p>
                  <span className={`inline-block mt-1 text-sm font-medium ${product.inventory > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.inventory > 0 ? `In Stock (${product.inventory})` : "Out of Stock"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Link
                  href={`/dashboard/product-management/edit-product/${product.id}`}
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-[#2797FF] border border-[#2797FF] rounded-md"
                >
                  Edit
                </Link>
                <Link
                  href={`/dashboard/product-management/delete-product/${product.id}`}
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-[#F94A57] border border-[#F94A57] rounded-md"
                >
                  Delete
                </Link>
                <button
                  onClick={handleRefresh}
                  className="px-3 py-2 text-sm font-medium text-[#7244FF] border border-[#7244FF] rounded-md"
                >
                  Refresh
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg">
      <div className="min-w-full grid grid-cols-5 gap-y-4">
        {/* Table Header */}
        <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 rounded-tl-md rounded-bl-md col-span-1">
          Image
        </div>
        <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 col-span-2 md:col-span-1">
          Product Name
        </div>
        <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 col-span-1">
          Price
        </div>
        <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 col-span-1">
          Inventory
        </div>
        <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 rounded-tr-md rounded-br-md col-span-2 md:col-span-1">
          Actions
        </div>

        {/* Table Rows */}
        {products.map((product, index) => (
          <React.Fragment key={`product-${product.id || index}`}>
            <div className="py-2 bg-[#F9F9F9] px-2 rounded-tl-md rounded-bl-md col-span-1 flex items-center justify-center">
              {/* Product Image */}
              {product.productImages && product.productImages.length > 0 ? (
                // Find primary image first
                (() => {
                  const primaryImage = product.productImages.find(
                    (img) => img.isPrimary
                  );
                  const imageToShow = primaryImage || product.productImages[0];
                  const primaryIndex = primaryImage
                    ? product.productImages.indexOf(primaryImage)
                    : 0;

                  return (
                    <div
                      className="relative w-12 h-12 md:w-16 md:h-16 cursor-pointer"
                      onClick={() => openImagePreview(product, primaryIndex)}
                    >
                      <Image
                        fill
                        unoptimized
                        src={imageToShow.url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity"
                      />
                      {product.productImages.length > 1 && (
                        <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {product.productImages.length}
                        </span>
                      )}
                    </div>
                  );
                })()
              ) : product.primaryImageUrl ? (
                <div
                  className="cursor-pointer"
                  onClick={() => openImagePreview(product)}
                >
                  <Image
                    fill
                    unoptimized
                    src={product.primaryImageUrl}
                    alt={product.name}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md hover:opacity-90 transition-opacity"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className="py-4 bg-[#F9F9F9] px-4 col-span-2 md:col-span-1 font-medium text-[15px] text-text-secondary font-poppins">
              {product.name}
            </div>
            <div className="py-4 bg-[#F9F9F9] px-4 col-span-1 font-medium text-[15px] text-text-secondary font-poppins">
              ${product.price.toFixed(2)}
            </div>
            <div className="py-4 bg-[#F9F9F9] px-4 col-span-1">
              <span
                className={`inline-flex items-center rounded-full font-medium text-[15px] font-poppins ${
                  product.inventory > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inventory > 0
                  ? `• In Stock (${product.inventory})`
                  : "• Out of Stock"}
              </span>
            </div>
            <div className="py-4 bg-[#F9F9F9] px-4 rounded-tr-md rounded-br-md flex flex-wrap gap-2 sm:gap-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-1 font-medium text-[15px] text-text-secondary font-poppins">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                >
                  <g clipPath="url(#clip0_37_3079)">
                    <mask
                      id="mask0_37_3079"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="14"
                      height="14"
                    >
                      <path d="M0 0H14V14H0V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_37_3079)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0173 1.16667C11.8051 1.16667 11.6089 1.23334 11.4381 1.40415L6.00217 6.84017L5.52518 8.47548L7.16056 7.99849L12.5965 2.56252C12.7217 2.43734 12.834 2.17687 12.834 1.98333C12.834 1.54716 12.4535 1.16667 12.0173 1.16667ZM10.6132 0.579195C11.0257 0.166681 11.5296 0 12.0173 0C13.0978 0 14.0007 0.902831 14.0007 1.98333C14.0007 2.48979 13.763 3.046 13.4215 3.38748L7.87981 8.92914C7.81051 8.9985 7.72482 9.04919 7.63067 9.07667L4.83067 9.89333C4.62619 9.95295 4.40546 9.89642 4.25485 9.74581C4.10424 9.59519 4.04769 9.37446 4.10733 9.17L4.92399 6.37C4.95145 6.27591 5.00218 6.19022 5.07152 6.12086L10.6132 0.579195Z"
                        fill="#2797FF"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 4.08366C0 2.47816 1.31117 1.16699 2.91667 1.16699H6.41667C6.73884 1.16699 7 1.42816 7 1.75033C7 2.07249 6.73884 2.33366 6.41667 2.33366H2.91667C1.9555 2.33366 1.16667 3.12249 1.16667 4.08366V11.0837C1.16667 12.0448 1.9555 12.8337 2.91667 12.8337H9.91667C10.8778 12.8337 11.6667 12.0448 11.6667 11.0837V7.58366C11.6667 7.26148 11.9278 7.00033 12.25 7.00033C12.5722 7.00033 12.8333 7.26148 12.8333 7.58366V11.0837C12.8333 12.6892 11.5222 14.0003 9.91667 14.0003H2.91667C1.31117 14.0003 0 12.6892 0 11.0837V4.08366Z"
                        fill="#2797FF"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_37_3079">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <Link
                  href={`/dashboard/product-management/edit-product/${product.id}`}
                  className="text-[#2797FF] whitespace-nowrap"
                >
                  Edit
                </Link>
              </div>
              <div className="flex items-center gap-1 font-medium text-[15px] text-text-secondary font-poppins">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                >
                  <path
                    d="M12.2493 2.33333H10.441C10.3056 1.67499 9.94741 1.08345 9.42675 0.658419C8.90608 0.233386 8.2548 0.000848473 7.58268 0L6.41602 0C5.7439 0.000848473 5.09262 0.233386 4.57195 0.658419C4.05129 1.08345 3.69307 1.67499 3.55768 2.33333H1.74935C1.59464 2.33333 1.44627 2.39479 1.33687 2.50419C1.22747 2.61358 1.16602 2.76196 1.16602 2.91667C1.16602 3.07138 1.22747 3.21975 1.33687 3.32915C1.44627 3.43854 1.59464 3.5 1.74935 3.5H2.33268V11.0833C2.33361 11.8566 2.6412 12.5979 3.18798 13.1447C3.73476 13.6915 4.47609 13.9991 5.24935 14H8.74935C9.52261 13.9991 10.2639 13.6915 10.8107 13.1447C11.3575 12.5979 11.6651 11.8566 11.666 11.0833V3.5H12.2493C12.4041 3.5 12.5524 3.43854 12.6618 3.32915C12.7712 3.21975 12.8327 3.07138 12.8327 2.91667C12.8327 2.76196 12.7712 2.61358 12.6618 2.50419C12.5524 2.39479 12.4041 2.33333 12.2493 2.33333ZM6.41602 1.16667H7.58268C7.94451 1.16711 8.29734 1.27947 8.59279 1.48834C8.88824 1.69721 9.11184 1.99237 9.23293 2.33333H4.76577C4.88686 1.99237 5.11046 1.69721 5.40591 1.48834C5.70136 1.27947 6.05419 1.16711 6.41602 1.16667ZM10.4993 11.0833C10.4993 11.5475 10.315 11.9926 9.98679 12.3208C9.6586 12.649 9.21348 12.8333 8.74935 12.8333H5.24935C4.78522 12.8333 4.3401 12.649 4.01191 12.3208C3.68372 11.9926 3.49935 11.5475 3.49935 11.0833V3.5H10.4993V11.0833Z"
                    fill="#F94A57"
                  />
                  <path
                    d="M5.83333 10.4997C5.98804 10.4997 6.13642 10.4382 6.24581 10.3288C6.35521 10.2194 6.41667 10.0711 6.41667 9.91634V6.41634C6.41667 6.26163 6.35521 6.11326 6.24581 6.00386C6.13642 5.89447 5.98804 5.83301 5.83333 5.83301C5.67862 5.83301 5.53025 5.89447 5.42085 6.00386C5.31146 6.11326 5.25 6.26163 5.25 6.41634V9.91634C5.25 10.0711 5.31146 10.2194 5.42085 10.3288C5.53025 10.4382 5.67862 10.4997 5.83333 10.4997Z"
                    fill="#F94A57"
                  />
                  <path
                    d="M8.16732 10.4997C8.32203 10.4997 8.4704 10.4382 8.5798 10.3288C8.68919 10.2194 8.75065 10.0711 8.75065 9.91634V6.41634C8.75065 6.26163 8.68919 6.11326 8.5798 6.00386C8.4704 5.89447 8.32203 5.83301 8.16732 5.83301C8.01261 5.83301 7.86424 5.89447 7.75484 6.00386C7.64544 6.11326 7.58398 6.26163 7.58398 6.41634V9.91634C7.58398 10.0711 7.64544 10.2194 7.75484 10.3288C7.86424 10.4382 8.01261 10.4997 8.16732 10.4997Z"
                    fill="#F94A57"
                  />
                </svg>
                <Link
                  href={`/dashboard/product-management/delete-product/${product.id}`}
                  className="text-[#F94A57] whitespace-nowrap"
                >
                  Delete
                </Link>
              </div>
              <div className="flex items-center gap-1 font-medium text-[15px] text-text-secondary font-poppins">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                >
                  <g clipPath="url(#clip0_37_3094)">
                    <path
                      d="M7.00069 1.16683C7.77448 1.16937 8.5401 1.32534 9.25321 1.62573C9.96633 1.92611 10.6128 2.36495 11.1552 2.91683H9.33402C9.17931 2.91683 9.03094 2.97829 8.92154 3.08768C8.81215 3.19708 8.75069 3.34545 8.75069 3.50016C8.75069 3.65487 8.81215 3.80324 8.92154 3.91264C9.03094 4.02204 9.17931 4.08349 9.33402 4.08349H11.7508C12.038 4.08334 12.3135 3.96916 12.5166 3.76605C12.7197 3.56293 12.8339 3.28749 12.834 3.00024V0.583494C12.834 0.428785 12.7726 0.280412 12.6632 0.171015C12.5538 0.0616191 12.4054 0.000160979 12.2507 0.000160979C12.096 0.000160979 11.9476 0.0616191 11.8382 0.171015C11.7288 0.280412 11.6674 0.428785 11.6674 0.583494V1.79566C10.7032 0.927342 9.51637 0.344567 8.23975 0.112598C6.96313 -0.119371 5.64714 0.00862628 4.43915 0.482255C3.23116 0.955884 2.17886 1.75644 1.40011 2.79428C0.621359 3.83212 0.146896 5.06626 0.0298545 6.35849C0.0223198 6.43973 0.0317887 6.52164 0.0576578 6.59901C0.083527 6.67638 0.125229 6.74752 0.180107 6.80789C0.234986 6.86825 0.301836 6.91652 0.3764 6.94963C0.450964 6.98273 0.531606 6.99994 0.613188 7.00016C0.755864 7.00198 0.894083 6.95048 1.00079 6.85575C1.10749 6.76102 1.175 6.62988 1.1901 6.48799C1.31996 5.03593 1.98809 3.6849 3.06324 2.70032C4.13838 1.71573 5.54283 1.16875 7.00069 1.16683Z"
                      fill="#7244FF"
                    />
                    <path
                      d="M13.3874 7.00005C13.2448 6.99823 13.1065 7.04972 12.9998 7.14445C12.8931 7.23918 12.8256 7.37033 12.8105 7.51221C12.7141 8.62243 12.3012 9.68169 11.6209 10.5643C10.9406 11.447 10.0213 12.1159 8.97227 12.4919C7.92319 12.8678 6.7883 12.9349 5.70222 12.6853C4.61614 12.4356 3.62447 11.8797 2.84485 11.0834H4.66602C4.82073 11.0834 4.9691 11.0219 5.07849 10.9125C5.18789 10.8031 5.24935 10.6548 5.24935 10.5C5.24935 10.3453 5.18789 10.197 5.07849 10.0876C4.9691 9.97817 4.82073 9.91671 4.66602 9.91671H2.24927C2.10699 9.91664 1.96609 9.9446 1.83463 9.99901C1.70317 10.0534 1.58373 10.1332 1.48312 10.2338C1.38252 10.3344 1.30273 10.4539 1.24832 10.5853C1.19391 10.7168 1.16594 10.8577 1.16602 11V13.4167C1.16602 13.5714 1.22747 13.7198 1.33687 13.8292C1.44627 13.9386 1.59464 14 1.74935 14C1.90406 14 2.05243 13.9386 2.16183 13.8292C2.27122 13.7198 2.33268 13.5714 2.33268 13.4167V12.2045C3.29683 13.0729 4.48367 13.6556 5.76029 13.8876C7.03691 14.1196 8.3529 13.9916 9.56089 13.518C10.7689 13.0443 11.8212 12.2438 12.5999 11.2059C13.3787 10.1681 13.8531 8.93395 13.9702 7.64171C13.9777 7.56048 13.9682 7.47857 13.9424 7.4012C13.9165 7.32382 13.8748 7.25269 13.8199 7.19232C13.765 7.13196 13.6982 7.08368 13.6236 7.05058C13.5491 7.01747 13.469 7.00026 13.3874 7.00005Z"
                      fill="#7244FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_37_3094">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <button
                  className="text-[#7244FF] whitespace-nowrap"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
            products
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-primary text-white"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className={`px-3 py-1 rounded ${
                page === pagination.totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-primary text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImages && (
        <ImagePreview
          images={previewImages}
          productName={previewProductName}
          onClose={closePreview}
          initialIndex={initialImageIndex}
        />
      )}
    </div>
  );
}
