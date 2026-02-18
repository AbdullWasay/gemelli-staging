"use client";

import type React from "react";
import { useRef, type ChangeEvent, type FormEvent, useState } from "react";
import Image from "next/image";
// import ProductPreview from "./components/product-preview"
import Swal from "sweetalert2";

import {
  updateFormData,
  addProductImage,
  removeProductImage,
  setPrimaryImage,
  reorderImages,
  resetForm,
  type ProductImage,
} from "@/redux/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "@/redux/features/products/productsApi";
import { useAuthToken } from "@/utils/auth-helpers";

interface ProductFormProps {
  isEditMode?: boolean;
  productId?: string;
}

export default function ProductForm({
  isEditMode = false,
  productId = "",
}: ProductFormProps) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.productForm.formData);
  const productImages = useAppSelector(
    (state) => state.productForm.productImages
  );

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);

  // Get the auth token
  const token = useAuthToken();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "radio") {
      dispatch(updateFormData({ [name]: value }));
    } else if (type === "checkbox") {
      dispatch(
        updateFormData({ [name]: (e.target as HTMLInputElement).checked })
      );
    } else {
      dispatch(updateFormData({ [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newImage: ProductImage = {
            id: crypto.randomUUID(),
            file: file,
            previewUrl: reader.result as string,
            isPrimary: productImages.length === 0,
          };

          dispatch(addProductImage(newImage));
        };
        reader.readAsDataURL(file);
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOverFiles = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            const newImage: ProductImage = {
              id: crypto.randomUUID(),
              file: file,
              previewUrl: reader.result as string,
              isPrimary: productImages.length === 0, // First image is primary by default
            };

            dispatch(addProductImage(newImage));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    dispatch(removeProductImage(id));
  };

  const handleSetPrimary = (id: string) => {
    dispatch(setPrimaryImage(id));
  };

  const handleDragStart = (id: string) => {
    setDraggedImageId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (draggedImageId && draggedImageId !== targetId) {
      dispatch(reorderImages({ draggedId: draggedImageId, targetId }));
    }

    setDraggedImageId(null);
  };

  const handlePreviewClick = () => {
    router.push("/dashboard/product-management/preview");
  };

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating || isUploading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Check if we have a valid authentication token
      if (!token) {
        setSubmitError("Authentication required. Please log in again.");
        console.error("No authentication token available");
        return;
      }

      

      // Prepare product data - log for debugging
      const productData = {
        // Map form fields to API fields
        name: formData.productTitle,
        description: formData.productDescription,
        price: parseFloat(formData.price), // Make sure price is a number, not string
        inventory: parseInt(formData.stockQuantity || "0"), // Map stockQuantity to inventory
        category: formData.category,
        taxRate: formData.taxRate,
        discountPrice:
          formData.discountPrice && formData.discountPrice.trim() !== ""
            ? parseFloat(formData.discountPrice)
            : null,
        onSale: Boolean(formData.onSale),
        sku: formData.sku,
        trackInventory: formData.trackInventory,
        lowStockAlert:
          formData.lowStockAlert && formData.lowStockAlert.trim() !== ""
            ? parseInt(formData.lowStockAlert)
            : 5,
        size: formData.size,
        color: formData.color,
        material: formData.material,
        length:
          formData.length && formData.length.trim() !== ""
            ? parseFloat(formData.length)
            : null,
        width:
          formData.width && formData.width.trim() !== ""
            ? parseFloat(formData.width)
            : null,
        height:
          formData.height && formData.height.trim() !== ""
            ? parseFloat(formData.height)
            : null,
        weight:
          formData.weight && formData.weight.trim() !== ""
            ? parseFloat(formData.weight)
            : null,
        seoTitle: formData.seoTitle,
        metaDescription: formData.metaDescription,
        productTags: formData.productTags,
        visibility: formData.visibility || "Public",
        status: formData.status || "Published",
      };

      

      let savedProductId = productId;

      // Create or update product based on mode
      if (isEditMode && productId) {
        // Update existing product
        try {
          const updateProductResponse = await updateProduct({
            id: productId,
            productData,
          }).unwrap();

          console.log("Update product response:", updateProductResponse);

          if (
            !updateProductResponse.success ||
            !updateProductResponse.data?.product
          ) {
            throw new Error(
              updateProductResponse.error || "Failed to update product"
            );
          }

          savedProductId = updateProductResponse.data.product.id;
          
        } catch (apiError) {
          console.error("API Error during update:", apiError);
          if (
            typeof apiError === "object" &&
            apiError !== null &&
            "data" in apiError &&
            typeof apiError.data === "object" &&
            apiError.data !== null &&
            "error" in apiError.data
          ) {
            throw new Error((apiError.data as { error: string }).error);
          }
          throw apiError;
        }
      } else {
        // Create new product
        try {
          const createProductResponse = await createProduct(
            productData
          ).unwrap();
          console.log("Create product response:", createProductResponse);

          if (
            !createProductResponse.success ||
            !createProductResponse.data?.product
          ) {
            throw new Error(
              createProductResponse.error || "Failed to create product"
            );
          }

          // Get the ID of the created product
          savedProductId = createProductResponse.data.product.id;
          
        } catch (apiError) {
          console.error("API Error during creation:", apiError);
          if (
            typeof apiError === "object" &&
            apiError !== null &&
            "data" in apiError &&
            typeof apiError.data === "object" &&
            apiError.data !== null &&
            "error" in apiError.data
          ) {
            throw new Error((apiError.data as { error: string }).error);
          }
          throw apiError;
        }
      }

      // Upload new images (skip already uploaded ones)
      if (productImages.length > 0) {
        console.log(`Uploading new images for product...`);

        // Filter out images that are already uploaded (for edit mode)
        const newImages = productImages.filter((img) => !img.isUploaded);

        console.log(`Found ${newImages.length} new images to upload`);

        // Upload in sequence to maintain order
        for (let i = 0; i < newImages.length; i++) {
          const image = newImages[i];
          if (!image.file) {
            console.log(`Skipping image ${i + 1} - no file data`);
            continue;
          }

          try {
            console.log(
              `Uploading image ${i + 1}/${newImages.length}, isPrimary: ${
                image.isPrimary
              }`
            );
            const uploadResponse = await uploadImage({
              file: image.file,
              productId: savedProductId,
              isPrimary: image.isPrimary,
              order: i,
            }).unwrap();
            console.log(`Image ${i + 1} uploaded:`, uploadResponse);
          } catch (uploadError) {
            console.error(`Error uploading image ${i + 1}:`, uploadError);
            // Continue with other images even if one fails
            if (
              typeof uploadError === "object" &&
              uploadError !== null &&
              "data" in uploadError &&
              typeof uploadError.data === "object" &&
              uploadError.data !== null &&
              "error" in uploadError.data
            ) {
              console.error(
                "Upload API error:",
                (uploadError.data as { error: string }).error
              );
            }
          }
        }
      }

      // Success! Reset form and show success message
      dispatch(resetForm());

      // Show success message with SweetAlert
      Swal.fire({
        title: "Success!",
        text: isEditMode
          ? "Product updated successfully"
          : "Product created successfully",
        icon: "success",
        confirmButtonText: "View Products",
        confirmButtonColor: "#4ade80", // Green color
        timer: 3000,
      }).then(() => {
        // Navigate to product management page
        router.push("/dashboard/product-management");
      });
    } catch (error) {
      console.error(
        isEditMode ? "Error updating product:" : "Error creating product:",
        error
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
          ? "Failed to update product"
          : "Failed to create product";
      setSubmitError(errorMessage);

      // Show error message with SweetAlert
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444", // Red color
      });
    }
  };

  return (
    <div className="   bg-white">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Product Title */}
          <div className="space-y-2">
            <label
              htmlFor="productTitle"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Product Title
            </label>
            <input
              type="text"
              id="productTitle"
              name="productTitle"
              value={formData.productTitle}
              onChange={handleInputChange}
              className="w-full px-[22px]  rounded-xl bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                
                <option value="ELECTRONICS & GADGETS">ELECTRONICS & GADGETS</option>
                <option value="FASHION & ACCESSORIES">FASHION & ACCESSORIES</option>
                <option value="HOME & LIVING">HOME & LIVING</option>
                <option value="HEALTH & WELLNESS">HEALTH & WELLNESS</option>
                <option value="SPORTS & OUTDOORS">SPORTS & OUTDOORS</option>
                <option value="Books & Media">Books & Media</option>
                <option value="Groceries & Food">Groceries & Food</option>
                <option value="Automotive">Automotive</option>
                <option value="Office & School Supplies">Office & School Supplies</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Travel & Luggage">Travel & Luggage</option>
                <option value="Gifts & Occasions">Gifts & Occasions</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Price <sup className="text-xs text-gray-500">Suggested by AI</sup>
            </label>
            <div className="relative">
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium  border text-white border-gray-300 rounded-xl   bg-gradient-to-r from-[#A514FA] to-[#49C8F2]"
                required
              />
            </div>
          </div>

          {/* Tax Rate */}
          <div className="space-y-2">
            <label
              htmlFor="taxRate"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Tax Rate
            </label>
            <div className="relative">
              <select
                id="taxRate"
                name="taxRate"
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                <option value="5%">5%</option>
                <option value="10%">10%</option>
                <option value="15%">15%</option>
                <option value="20%">20%</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Discount Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ">
              <label
                htmlFor="discountPrice"
                className="block text-[16px] font-medium text-black font-poppins"
              >
                Discount Price
              </label>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="onSale"
                  name="onSale"
                  checked={formData.onSale as boolean}
                  onChange={handleInputChange}
                  className="h-3 w-3 text-blue-600 focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor="onSale"
                  className="ml-1 text-sm font-medium text-[#FF3A44]"
                >
                  On Sale
                </label>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
                />
              </div>
            </div>
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <label
              htmlFor="sku"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <label
              htmlFor="stockQuantity"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Stock Quantity
            </label>
            <input
              type="text"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>

          {/* Track Inventory */}
          <div className="space-y-2">
            <label
              htmlFor="trackInventory"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Track Inventory
            </label>
            <div className="relative">
              <select
                id="trackInventory"
                name="trackInventory"
                value={formData.trackInventory}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="space-y-2">
            <label
              htmlFor="lowStockAlert"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Low Stock Alert
            </label>
            <input
              type="text"
              id="lowStockAlert"
              name="lowStockAlert"
              value={formData.lowStockAlert}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-8">
          <label
            htmlFor="productDescription"
            className="block text-[16px] font-medium text-black font-poppins mb-2"
          >
            Product Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleInputChange}
            rows={1}
            className="w-full px-[22px] bg-[#F9F9F9] py-5 h-auto  text-[16px] font-poppins font-medium text-[#646464] rounded-xl flex items-center     overflow-hidden"
          />
        </div>

        {/* Upload Image/Video */}
        <div className="mb-8">
          <label className="block text-[16px] font-medium text-black font-poppins mb-2">
            Upload Images
          </label>
          <div
            className="border-2 border-dashed border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center bg-blue-50"
            onDragOver={handleDragOverFiles}
            onDrop={handleDropFiles}
          >
            {productImages.length > 0 ? (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {productImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative border rounded-xl overflow-hidden ${
                        image.isPrimary ? "ring-2 ring-primary" : ""
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(image.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, image.id)}
                    >
                      <div className="relative pt-[100%]">
                        <Image
                          src={image.previewUrl || "/placeholder.svg"}
                          alt={image.file ? image.file.name : "Product image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-0 right-0 p-1 flex gap-1">
                        {!image.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(image.id)}
                            className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600"
                            title="Set as primary image"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          title="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      {image.isPrimary && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs py-1 text-center">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 h-full min-h-[100px]"
                    onClick={handleBrowseClick}
                  >
                    <div className="text-center p-4">
                      <svg
                        className="w-8 h-8 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="mt-1 text-[18px] font-medium text-text-secondary font-poppins">
                        Add more
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[16px] font-medium text-text-secondary font-poppins text-center">
                  Drag images to reorder. Click the checkmark to set as primary
                  image.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto  rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_37_6368)">
                        <path
                          d="M34.4501 13.6964C33.8138 13.5699 33.2944 13.1731 33.028 12.6058C30.0533 6.33637 23.1705 2.83079 16.2859 4.09962C10.0145 5.24962 5.0983 10.256 4.04988 16.5599C3.73938 18.421 3.76238 20.284 4.11313 22.099C4.22813 22.6913 3.97321 23.3506 3.44996 23.826C1.25538 25.8212 -0.00195312 28.6636 -0.00195312 31.6268C-0.00195312 37.4381 4.72646 42.1685 10.5397 42.1685H31.623C39.5504 42.1685 45.998 35.7208 45.998 27.7935C45.998 20.9605 41.1412 15.0323 34.4482 13.6983L34.4501 13.6964ZM31.625 38.3332H10.5416C6.84246 38.3332 3.8333 35.324 3.8333 31.6249C3.8333 29.7408 4.63446 27.9295 6.0298 26.6607C7.5363 25.2903 8.24355 23.2625 7.87555 21.365C7.61105 20.0003 7.59571 18.5954 7.82955 17.1847C8.60196 12.5425 12.3625 8.71112 16.974 7.86587C17.7119 7.73171 18.446 7.66654 19.1685 7.66654C23.5999 7.66654 27.6134 10.1371 29.5607 14.2484C30.3542 15.9197 31.8607 17.087 33.6969 17.455C38.6016 18.4344 42.1628 22.7795 42.1628 27.7935C42.1628 33.6048 37.4344 38.3351 31.6211 38.3351L31.625 38.3332Z"
                          fill="#005BFF"
                        />
                        <path
                          d="M28.9823 23.5616C29.7317 24.311 29.7317 25.5223 28.9823 26.2717C28.2329 27.0212 27.0215 27.0212 26.2721 26.2717L23.0004 23V32.5833C23.0004 33.6432 22.1417 34.5 21.0837 34.5C20.0257 34.5 19.167 33.6432 19.167 32.5833V23L15.8953 26.2717C15.1459 27.0212 13.9345 27.0212 13.1851 26.2717C12.4357 25.5223 12.4357 24.311 13.1851 23.5616L18.3735 18.3732C19.1153 17.6314 20.0909 17.2577 21.0664 17.2538L21.0837 17.25L21.1009 17.2538C22.0765 17.2577 23.0521 17.6314 23.7939 18.3732L28.9823 23.5616Z"
                          fill="#005BFF"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_37_6368">
                          <rect width="46" height="46" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-[18px] text-text-secondary font-poppins font-medium">
                  Drop Your Images Here Or{" "}
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="text-primary hover:text-blue-700 font-semibold"
                  >
                    Browse
                  </button>
                </p>
                <p className="text-[16px] text-text-secondary font-poppins font-medium mt-4">
                  Max. File Size: 100MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-8">
          {/* Size */}
          <div className="space-y-2">
            <label
              htmlFor="size"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Size
            </label>
            <div className="relative">
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label
              htmlFor="color"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Color
            </label>
            <div className="relative">
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Material */}
          <div className="space-y-2">
            <label
              htmlFor="material"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Material
            </label>
            <div className="relative">
              <select
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                <option value="Cotton">Cotton</option>
                <option value="Polyester">Polyester</option>
                <option value="Leather">Leather</option>
                <option value="Metal">Metal</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Length */}
          <div className="space-y-2">
            <label
              htmlFor="length"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Length
            </label>
            <input
              type="text"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <label
              htmlFor="height"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Height
            </label>
            <input
              type="text"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>

          {/* Width */}
          <div className="space-y-2">
            <label
              htmlFor="width"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Width
            </label>
            <input
              type="text"
              id="width"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label
              htmlFor="weight"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Weight <sup className="text-xs text-gray-500">kg/lbs</sup>
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>

          {/* SEO Title */}
          <div className="space-y-2 lg:col-span-2">
            <label
              htmlFor="seoTitle"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              SEO Title
            </label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
            />
          </div>
        </div>

        {/* Meta Description */}
        <div className="mb-8">
          <label
            htmlFor="metaDescription"
            className="block text-[16px] font-medium text-black font-poppins mb-2"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleInputChange}
            rows={1}
            className="w-full px-[22px] bg-[#F9F9F9] py-5  h-auto  text-[16px] font-poppins font-medium text-[#646464] rounded-xl flex items-center     overflow-hidden "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Product Tags */}
          <div className="space-y-2">
            <label
              htmlFor="productTags"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Product Tags
            </label>
            <input
              type="text"
              id="productTags"
              name="productTags"
              value={formData.productTags}
              onChange={handleInputChange}
              className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl "
              placeholder="Separate tags with commas"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <label
              htmlFor="visibility"
              className="block text-[16px] font-medium text-black font-poppins"
            >
              Visibility
            </label>
            <div className="relative">
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl appearance-none "
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Draft">Draft</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2 mt-2">
            <label className="block text-[16px] font-medium text-black font-poppins">
              Status
            </label>
            <div className="flex sm:flex-row flex-col sm:items-center sm:space-x-8 pt-2.5 sm:space-y-0 space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="statusPublished"
                  name="status"
                  value="Published"
                  checked={formData.status === "Published"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor="statusPublished"
                  className="ml-2 text-text-secondary text-[16px] font-poppins font-medium"
                >
                  Published
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="statusComingSoon"
                  name="status"
                  value="Coming Soon"
                  checked={formData.status === "Coming Soon"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor="statusComingSoon"
                  className="ml-2 text-text-secondary text-[16px] font-poppins font-medium"
                >
                  Coming Soon
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex md:flex-row flex-col max-w-full gap-4 pt-5">
          <button
            type="button"
            className="flex-shrink-0 flex-1 px-4 py-4 bg-text-secondary/30 text-[#4C4C4C] rounded-xl  focus:outline-none focus:ring-2 focus:ring-gray-500 col-span-1 font-semibold"
          >
            DISCARD
          </button>
          <button
            type="button"
            onClick={handlePreviewClick}
            className="flex-grow px-4 py-4 bg-white border border-primary text-primary rounded-xl col-span-2 font-semibold"
          >
            PREVIEW PRODUCT
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-shrink-0 flex-1 px-4 py-4 ${
              isSubmitting ? "bg-primary/70" : "bg-primary"
            } text-white rounded-xl col-span-1 font-semibold flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isCreating ? "CREATING..." : "UPLOADING IMAGES..."}
              </>
            ) : (
              "SAVE PRODUCT"
            )}
          </button>

          {submitError && (
            <div className="col-span-full mt-4 text-red-500 text-sm">
              {submitError}
            </div>
          )}
        </div>
      </form>

      {/* Product Preview Modal */}
      {/* {showPreview && <ProductPreview onClose={handleClosePreview} />} */}
    </div>
  );
}
