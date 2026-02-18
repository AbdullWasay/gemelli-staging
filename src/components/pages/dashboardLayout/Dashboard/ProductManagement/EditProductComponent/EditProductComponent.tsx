"use client";

import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { products } from "@/data/products";
import Link from "antd/es/typography/Link";
import Heading from "@/components/ui/Heading/Heading";
import { toast } from "sonner";

const allCategories = Array.from(
  new Set(products.map((product) => product.category))
);

export default function EditProductComponent() {
  const router = useRouter();
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<(typeof products)[0]>();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    status: "active" as "active" | "inactive",
    productImage: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = products.find((p) => p.id == productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          price: foundProduct.price.replace(" USD", ""),
          category: foundProduct.category,
          description: foundProduct.description,
          status: foundProduct.status as "active" | "inactive",
          productImage: foundProduct.productImage,
        });
        setPreviewImage(foundProduct.productImage);
        setShowPreview(true);
      } else {
        // router.push("/products");
      }
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [productId, router, previewImage]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be less than 20MB");
      return;
    }

    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);
    setShowPreview(false);

    const objectUrl = URL.createObjectURL(file);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setFormData((prev) => ({
            ...prev,
            productImage: objectUrl,
          }));
          setPreviewImage(objectUrl);
          setShowPreview(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedFileName("");
    setPreviewImage(formData.productImage);
    setShowPreview(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    toast.success("Product updated successfully!");
  };

  const handleCancel = () => {
    router.push("/dashboard/product-management");
  };

  if (isLoading) {
    return (
      <div className=" mx-auto ">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className=" mx-auto ">
        <div className=" text-center py-10">
          <p>Product not found</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto font-poppins">
      <Link
        href={"/dashboard/product-management"}
        className="flex items-center gap-2 mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="16"
          viewBox="0 0 24 16"
          fill="none"
          className="-mt-2"
        >
          <path
            d="M23 9C23.5523 9 24 8.55228 24 8C24 7.44772 23.5523 7 23 7V9ZM0.292892 7.29289C-0.0976315 7.68342 -0.0976315 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM23 7L1 7V9L23 9V7Z"
            fill="#646464"
          />
        </svg>
        <Heading className="!mt-0 text-[#0F0F0F]">Edit Product</Heading>
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3 items-center">
            {/* Product Title */}
            <div>
              <label
                htmlFor="name"
                className="block text-[16px] font-medium text-black font-poppins mb-3"
              >
                Product Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-[22px]   bg-[#F9F9F9] h-[60px] text-[16px] font-poppins font-medium text-[#646464]  rounded-xl"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-[16px] font-medium text-black font-poppins mb-1"
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
                  <option value="">Select a category</option>
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
            <div>
              <label
                htmlFor="price"
                className="block text-[16px] font-medium text-black font-poppins mb-3"
              >
                Price Suggested by AI
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
          </div>

          {/* Product Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-[16px] font-medium text-black font-poppins mb-3"
            >
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-[22px] bg-[#F9F9F9] py-5  h-auto  text-[16px] font-poppins font-medium text-[#646464] rounded-xl flex items-center     overflow-hidden"
              placeholder="Write here..."
              required
            />
          </div>

          <div>
            <label className="block text-[16px] font-medium text-black font-poppins mb-3">
              Product Image
            </label>
            <div
              className="border-2 relative border-dashed border-blue-200 rounded-xl  flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {showPreview && previewImage ? (
                <div className="text-center w-full h-72">
                  <div className="relative w-full h-full mx-auto mb-4">
                    <Image
                      src={previewImage}
                      alt={formData.name}
                      fill
                      className="h-full w-full object-contain"
                      unoptimized
                      priority
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="text-white text-sm font-medium absolute top-3 right-3 bg-[rgba(0,0,0,0.2)] px-1 py-1 rounded "
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Drag and drop your image here or{" "}
                    <button
                      type="button"
                      onClick={handleBrowseClick}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: JPG, PNG up to 20MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-700 truncate max-w-xs">
                  Uploading: {uploadedFileName}
                </span>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Cancel upload"
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
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/*  */}
          {previewImage && !isUploading && (
            <div className="mx-auto text-center bg-gradient-to-r from-[#A514FA] to-[#49C8F2] bg-clip-text text-transparent text-base font-medium !font-poppins">
              3D Model Preview (Auto-generated)
            </div>
          )}

          {/* Action Buttons */}
          {!isUploading && (
            <div className="flex justify-between space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="h-[46px] w-[173px] bg-text-secondary/30 rounded-xl text-[#4C4C4C] hover:bg-text-secondary/50 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                className="h-[46px] w-[173px] px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
