"use client";

import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";

export default function ProductPreview() {
  const formData = useAppSelector((state) => state.productForm.formData);
  const productImages = useAppSelector(
    (state) => state.productForm.productImages
  );

  const primaryImage =
    productImages.find((img) => img.isPrimary) || productImages[0];

  const discountPercentage = formData.onSale
    ? Math.round(
        ((Number(formData.price) - Number(formData.discountPrice)) /
          Number(formData.price)) *
          100
      )
    : 0;

  return (
    <div className=" bg-[#F9F9F9]  overflow-auto p-3">
      <div className=" mx-auto ">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className=" overflow-hidden ">
              {primaryImage ? (
                <div className="relative aspect-video">
                  <Image
                    src={primaryImage.previewUrl || "/placeholder.svg"}
                    alt={formData.productTitle}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className=" flex items-center justify-center bg-gray-100">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-[16px] font-semibold text-black font-poppins">
              {formData.productTitle}
            </h1>

            <p className="text-[16px] text-[#646464] font-poppins">
              {formData.productDescription}
            </p>

            <div className="flex items-center space-x-1">
              <span className="font-medium text-black">
                <span className="font-medium text-[16px] text-[#646464]">
                  Price:
                </span>
                {` ${formData.price} USD`}
              </span>
            </div>

            <div>
              <span className="text-[#646464] font-medium text-[16px] font-poppins">
                Category:{" "}
              </span>
              <span className="text-black text-[16px] font-medium font-poppins">
                {formData.category}
              </span>
            </div>

            {formData.onSale && (
              <div>
                <span className="text-[#646464] text-[16px] font-medium font-poppins">
                  Discount:{" "}
                </span>
                <span className="text-black text-[16px] font-medium font-poppins">
                  {discountPercentage}%
                </span>
              </div>
            )}

            <div>
              <span className="text-[#646464] text-[16px] font-medium font-poppins">
                SKU:{" "}
              </span>
              <span className="text-black text-[16px] font-medium font-poppins">
                {formData.sku}
              </span>
            </div>
          </div>

          {/* <div className="pt-4 border-t border-gray-200">
              <h2 className="font-medium mb-2">Specifications</h2>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Size: </span>
                  <span>{formData.size}</span>
                </div>
                <div>
                  <span className="text-gray-500">Color: </span>
                  <span>{formData.color}</span>
                </div>
                <div>
                  <span className="text-gray-500">Material: </span>
                  <span>{formData.material}</span>
                </div>
                <div>
                  <span className="text-gray-500">Weight: </span>
                  <span>{formData.weight} kg</span>
                </div>
                <div>
                  <span className="text-gray-500">Dimensions: </span>
                  <span>{`${formData.length} × ${formData.width} × ${formData.height} cm`}</span>
                </div>
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
}
