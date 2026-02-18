"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProductForm from "../AddProducts/AddProductForm";
import { useGetProductByIdMutation } from "@/redux/features/products/productsApi";
import { useAppDispatch } from "@/redux/hooks";
import {
  updateFormData,
  setProductImages,
} from "@/redux/features/products/productSlice";

export default function EditProductForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: productId } = useParams();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // API mutations
  const [
    getProduct,
    { data: productData, isLoading: isProductLoading, error: productError },
  ] = useGetProductByIdMutation();

  // We don't use updateProduct directly here, it's used in the ProductForm component

  // Fetch product data when component mounts
  useEffect(() => {
    // Trigger the mutation to get product data
    console.log(productId);
    getProduct(productId as string);
  }, [productId, getProduct]);

  // Initialize form with product data when it loads
  useEffect(() => {
    if (productData?.data?.product && !isProductLoading) {
      const product = productData.data.product;

      // Format the data to match form fields
      const formData = {
        productTitle: product.name,
        description: product.description || "",
        price: product.price.toString(),
        inventory: product.inventory.toString(),
        category: product.category || "",
        taxRate: product.taxRate || "",
        discountPrice: product.discountPrice
          ? product.discountPrice.toString()
          : "",
        onSale: Boolean(product.onSale),
        sku: product.sku || "",
        trackInventory: product.trackInventory || "Yes",
        lowStockAlert: product.lowStockAlert
          ? product.lowStockAlert.toString()
          : "5",
        size: product.size || "",
        color: product.color || "",
        material: product.material || "",
        length: product.length ? product.length.toString() : "",
        width: product.width ? product.width.toString() : "",
        height: product.height ? product.height.toString() : "",
        weight: product.weight ? product.weight.toString() : "",
        seoTitle: product.seoTitle || "",
        metaDescription: product.metaDescription || "",
        productTags: product.productTags || "",
        visibility: product.visibility || "Public",
        status: product.status || "Published",
      };

      // Update the Redux store with the product data
      dispatch(updateFormData(formData));

      // Format product images for the form
      if (product.productImages && product.productImages.length > 0) {
        const formattedImages = product.productImages.map(
          (img: { id: string; url: string; isPrimary?: boolean }) => ({
            id: img.id,
            previewUrl: img.url,
            file: null, // We don't have the file object for existing images
            isPrimary: img.isPrimary || false,
            isUploaded: true, // Mark as already uploaded
          })
        );

        dispatch(setProductImages(formattedImages));
      }

      setIsLoading(false);
    }
  }, [productData, isProductLoading, dispatch]);

  // Show error if product fetching fails
  useEffect(() => {
    if (productError) {
      Swal.fire({
        title: "Error!",
        text: "Failed to load product data. Please try again.",
        icon: "error",
        confirmButtonText: "Go Back",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        router.push("/dashboard/product-management");
      });
    }
  }, [productError, router]);

  if (isLoading || isProductLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <ProductForm isEditMode={true} productId={productId as string} />
    </div>
  );
}
