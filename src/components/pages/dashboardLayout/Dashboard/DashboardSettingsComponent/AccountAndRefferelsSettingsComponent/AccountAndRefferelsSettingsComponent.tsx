"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Heading from "@/components/ui/Heading/Heading";

import p1 from "@/assets/images/dashboard/pro2.png"
import p2 from "@/assets/images/dashboard/pro1.png"

export default function AccountAndRefferelsSettingsComponent() {
  const [productCategory, setProductCategory] = useState("Electronics");
  const [imageCategory, setImageCategory] = useState("Electronics");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showImageDropdown, setShowImageDropdown] = useState(false);



  const products = [
    {
      id: 1,
      name: "WIRELESS HEADPHONES",
      price: 369.0,
      image: p1,
    },
    {
      id: 2,
      name: "BLUETOOTH SPEAKER",
      price: 129.99,
      image: p1,
    },
    {
      id: 3,
      name: "SMART WATCH",
      price: 199.95,
      image: p1,
    },
    {
      id: 4,
      name: "NOISE CANCELLING EARBUDS",
      price: 249.0,
      image: p1,
    },
  ];

  const imageItems = [
    {
      id: 1,
      name: "LEATHER HANDBAG",
      image: p2,
      action: "ENHANCE IMAGE",
      colorFrom: "#FF8A00 ",
      colorTo: "#FF3A44 ",
    },
    {
      id: 2,
      name: "RUNNING SHOES",
      image: p2,
      action: "REMOVE BG",
      colorFrom: "#A514FA",
      colorTo: "#49C8F2",
    },
    {
      id: 3,
      name: "WRIST WATCH",
      image: p2,
      action: "CONVERT TO 3D",
      colorFrom: "#FF8A00",
      colorTo: "#15BD74",
    },
    {
      id: 4,
      name: "SUNGLASSES",
      image: p2,
      action: "UPSCALE IMAGE",
      colorFrom: "#FF8A00",
      colorTo: "#FF3A44",
    },
  ];

  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];

  const handleProductClick = (
    productId: number,
    productName: string,
    price: number
  ) => {
    console.log(`Product clicked:
    ID: ${productId}
    Name: ${productName}
    Price: $${price.toFixed(2)}
    Category: ${productCategory}`);

    // In a real app: router.push(`/products/${productId}`)
  };

  const handleImageAction = (
    itemId: number,
    action: string,
    itemName: string
  ) => {
    console.log(`Image action triggered:
    ID: ${itemId}
    Name: ${itemName}
    Action: ${action}
    Category: ${imageCategory}`);

    // Example API call simulation
    setTimeout(() => {
      console.log(`Action "${action}" completed for item ${itemId}`);
    }, 1000);
  };

  const handleCategoryChange = (
    category: string,
    type: "product" | "image"
  ) => {
    const changeType = type === "product" ? "Product" : "Image";
    console.log(
      `${changeType} category changed from ${
        type === "product" ? productCategory : imageCategory
      } to ${category}`
    );

    if (type === "product") {
      setProductCategory(category);
      setShowProductDropdown(false);
    } else {
      setImageCategory(category);
      setShowImageDropdown(false);
    }
  };

  return (
    <div className="mx-auto sm:p-6 ">
      <Heading className="!text-[16px]    font-poppins !text-black !font-semibold !mt-0 mb-6">
        AI & Referrals
      </Heading>

      {/* Product Suggestions Section */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-6 sm:gap-0 gap-2">
          <h2 className="font-semibold text-black font-poppins text-[16px]">Product Suggestions</h2>
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-600 border border-gray-300 rounded-md px-3 py-1.5"
              onClick={() => setShowProductDropdown(!showProductDropdown)}
            >
              <span>{productCategory}</span>
              <ChevronDown size={16} />
            </button>
            {showProductDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleCategoryChange(category, "product")}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-md p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                handleProductClick(product.id, product.name, product.price)
              }
              
            >
              <div className="w-32 h-32 mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-[12px] font-poppins font-medium text-black uppercase mb-1.5">
                {product.name}
              </h3>
              <p className="text-[10px] font-semibold font-poppins text-text-secondary uppercase">
                ${product.price.toFixed(2)} UDT
              </p>
            </div>
          ))}
        </div>

        <div
          className="bg-gradient-to-r from-[#A514FA] to-[#49C8F2] text-white text-center py-4 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => console.log("Price alert banner clicked")}
        >
          <p className="text-sm font-medium tracking-[7px] sm:px-0 px-1">
            PRICES ARE INCREASING BY 5% THIS QUARTER.
          </p>
        </div>
      </div>

      {/* Image Optimization Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-6 sm:gap-0 gap-2" >
          <h2 className="font-semibold text-black font-poppins text-[16px]">Image Optimization</h2>
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-600 border border-gray-300 rounded-md px-3 py-1.5"
              onClick={() => setShowImageDropdown(!showImageDropdown)}
            >
              <span>{imageCategory}</span>
              <ChevronDown size={16} />
            </button>
            {showImageDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleCategoryChange(category, "image")}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {imageItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-md p-4 flex flex-col items-center"
            >
              <div className="w-32 h-32 mb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-[12px] font-poppins font-medium text-black uppercase mb-1.5">
                {item.name}
              </h3>
              <button
                className={`w-full py-2 text-white text-[14px] font-semibold font-poppins rounded-md bg-gradient-to-tl from-[${item.colorFrom}] to-[${item.colorTo}]  hover:opacity-90 transition-opacity`}
                onClick={() =>
                  handleImageAction(item.id, item.action, item.name)
                }
                 style={{
          background: `linear-gradient(to right, ${item.colorFrom}, ${item.colorTo})`
        }}
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
