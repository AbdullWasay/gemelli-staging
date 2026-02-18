"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProductCardProps {
  images: string[] | StaticImageData[];
  title: string;
  price: string;
  rating: number;
}

export default function BannerCard({
  images,
  title,
  price,
  rating,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const { currency: globalCurrency } = useSelector(
    (state: RootState) => state.currency
  );


  return (
    <div className="max-w-[240px] xs:max-w-[280px] sm:max-w-[335px] md:w-[335px]  w-full overflow-hidden poppins">
      <div className="bg-white rounded-[20px] md:rounded-[44px] py-3 sm:py-4 md:py-7">
        <h1 className="uppercase text-center font-semibold text-[10px] xs:text-xs sm:text-sm md:text-lg lg:text-xl ">
          recommended for you
        </h1>
        <div className="relative -mt-2 xs:-mt-3 -mb-6 xs:-mb-7 sm:-mb-8 md:-mt-2 md:-mb-4">
          {/* Image slider */}
          <div className="relative overflow-hidden flex justify-center items-center h-[100px] xs:h-[120px] sm:h-[150px] md:h-[200px] lg:h-[250px]">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`Image ${currentImageIndex + 1}`}
              className="object-cover transition-opacity duration-300 w-[50px] xs:w-[65px] sm:w-[80px] md:w-[130px] lg:w-[150px]"
            />
          </div>
        </div>

        <div className="p-2 xs:p-3 sm:p-4 space-y-1 md:space-y-[10px]">
          {/* title */}
          <h2 className="text-[9px] xs:text-[10px] sm:text-xs md:text-lg font-medium text-center">
            {title}
          </h2>

          <div className="flex items-center justify-center gap-1 md:gap-2">
            {/* price */}
            <span className="text-[#646464] text-[8px] xs:text-[9px] sm:text-xs md:text-base font-medium">
              {price} {globalCurrency}
            </span>
            {/* rating */}
            <Star
              className="text-[#FF9900] -mt-1 w-2 xs:w-2.5 sm:w-3 md:w-auto"
              fill="#FF9900"
              size={20}
            />
            <span className="text-gray-600 text-[7px] xs:text-[8px] sm:text-[10px] md:text-[15px]">
              {rating}/5
            </span>
          </div>
        </div>
        {/* pagination dots */}
        <div className="-mt-1 md:mt-0">
          <div className="flex justify-center space-x-1 sm:space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className="focus:outline-none"
                aria-label={`Go to image ${index + 1}`}
              >
                <div
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === index
                    ? "w-4 sm:w-5 md:w-6 bg-gradient-to-r from-[#00CCC4] to-[#8D3FAE]"
                    : "w-1 sm:w-1.5 bg-gray-300"
                    }`}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
