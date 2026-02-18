"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import card from "@/assets/images/dashboard/pmcard.png";
import ai from "@/assets/images/dashboard/AI.png";
import Heading from "@/components/ui/Heading/Heading";
import Button from "@/components/shared/Button/Button";
import { useLowStockProducts } from "@/hooks/useLowStockProducts";
import ImagePreview from "@/components/shared/ImagePreview/ImagePreview";
import { useUpdateProductMutation } from "@/redux/features/products/productsApi";
import { toast } from "react-toastify";

const PMcard = () => {
  // Get products with low stock
  const { lowStockProducts, isLoading, refetch } = useLowStockProducts();
  const [updateProduct, { isLoading: isApplyingDiscount }] =
    useUpdateProductMutation();

  // Get the product with the lowest stock for display
  const lowestStockProduct = lowStockProducts[0];

  // Track if alerts should be shown
  const [showAlerts, setShowAlerts] = useState(true);

  // State for image preview
  const [previewImages, setPreviewImages] = useState<Array<{
    url: string;
    isPrimary?: boolean;
  }> | null>(null);
  const [previewProductName, setPreviewProductName] = useState("");
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // Hide the alert when dismissed
  const dismissAlert = () => {
    setShowAlerts(false);
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
  };

  // Close image preview
  const closePreview = () => {
    setPreviewImages(null);
  };

  // Apply 10% discount to clear inventory
  const handleApplyDiscount = async () => {
    if (!lowestStockProduct) {
      toast.info("No low stock product to apply discount to.");
      return;
    }
    try {
      const discountPrice = Math.round(lowestStockProduct.price * 0.9 * 100) / 100;
      await updateProduct({
        id: lowestStockProduct.id,
        productData: {
          discountPrice,
          onSale: true,
        },
      }).unwrap();
      toast.success(`10% discount applied to ${lowestStockProduct.name}`);
      refetch();
    } catch {
      toast.error("Failed to apply discount. Please try again.");
    }
  };
  return (
    <div className="mt-6 sm:mt-9">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="xl:col-span-2 relative min-h-[220px] sm:min-h-[280px] xl:min-h-[300px] rounded-lg overflow-hidden">
          <Image src={card} alt="card" fill className="" />

          <Image
            src={ai}
            alt="card"
            className="size-12 absolute top-8 left-10"
          />

          <div className="absolute top-16 sm:top-24 left-4 sm:left-12 right-4">
            <Heading className="!text-[18px] sm:!text-[22px] max-w-[487px] !text-white">
              offer 10% discount to clear inventory for &apos;{lowestStockProduct?.name || "your product"}&apos;
            </Heading>

            <Button
              label={isApplyingDiscount ? "Applying..." : "Apply Discount"}
              className="!bg-[#FFD800] mt-5 !text-black disabled:opacity-70"
              onClick={handleApplyDiscount}
              disabled={!lowestStockProduct || isApplyingDiscount}
            />
          </div>
        </div>

        <div className="xl:col-span-1 p-3 bg-[#F9F9F9] rounded-lg">
          <div className=" rounded-lg  overflow-hidden">
            {/* Alert Section */}
            {isLoading ? (
              <div className="p-4 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : !showAlerts || lowStockProducts.length === 0 ? (
              <div className="p-4 flex items-center justify-center flex-col text-center bg-white">
                <p className="text-gray-600">No low stock alerts</p>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center flex-col text-center bg-white relative">
                {/* Close button */}
                <button
                  onClick={dismissAlert}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mb-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M12 9v4M12 17h.01" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  {lowStockProducts.length === 1
                    ? "1 product has low stock"
                    : `${lowStockProducts.length} products have low stock`}
                </p>
                <p className="text-orange-500 font-medium mt-1">
                  Restock immediately
                </p>
              </div>
            )}

            {/* Product Info Section */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : !lowestStockProduct ? (
                <div className="text-center py-2">
                  <p className="text-gray-500">No products with low stock</p>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  {/* Product Image with Preview Support */}
                  {lowestStockProduct.productImages &&
                  lowestStockProduct.productImages.length > 0 ? (
                    (() => {
                      // Find primary image first
                      const primaryImage =
                        lowestStockProduct.productImages.find(
                          (img) => img.isPrimary
                        );
                      const imageToShow =
                        primaryImage || lowestStockProduct.productImages[0];
                      const primaryIndex = primaryImage
                        ? lowestStockProduct.productImages.indexOf(primaryImage)
                        : 0;

                      return (
                        <div
                          className="relative w-[60px] h-[60px] cursor-pointer"
                          onClick={() =>
                            openImagePreview(lowestStockProduct, primaryIndex)
                          }
                        >
                          <Image
                            fill
                            unoptimized
                            src={imageToShow.url}
                            alt={lowestStockProduct.name}
                            className="w-full h-full object-cover rounded-md hover:opacity-80 transition-opacity"
                          />
                          {lowestStockProduct.productImages.length > 1 && (
                            <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {lowestStockProduct.productImages.length}
                            </span>
                          )}
                        </div>
                      );
                    })()
                  ) : lowestStockProduct.primaryImageUrl ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => openImagePreview(lowestStockProduct)}
                    >
                      <Image
                        fill
                        unoptimized
                        src={lowestStockProduct.primaryImageUrl}
                        alt={lowestStockProduct.name}
                        className="rounded-md object-cover hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ) : (
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded-md flex items-center justify-center">
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

                  {/* Product Info */}
                  <div>
                    <Link
                      href={`/dashboard/product-management/edit-product/${lowestStockProduct.id}`}
                    >
                      <h3 className="font-semibold text-gray-900 hover:text-primary">
                        {lowestStockProduct.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mt-2">
                      Current Stock:{" "}
                      <span className="text-red-600 font-medium">
                        {lowestStockProduct.inventory} unit
                        {lowestStockProduct.inventory !== 1 ? "s" : ""}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Product Button */}
      <div className="flex justify-center sm:justify-end mt-4 sm:mt-6">
        <Link href="/dashboard/product-management/add-product">
          <Button
            label="+ Add New Product"
            className="!bg-primary !text-white"
          />
        </Link>
      </div>

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
};

export default PMcard;
