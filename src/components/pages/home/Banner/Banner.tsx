"use client";
import imgs from "@/assets/Banner/watch.png";
import imgs1 from "@/assets/Banner/watch2.png";
import BannerCard from "@/components/shared/BannerCard/BannerCard";
import bannerImg from "@/assets/Banner/ban2.png";
import Image from "next/image";
import ProductSlider from "./ProductSlider";

const Banner = () => {
  const imges = [imgs, imgs1, imgs];
  return (
    <div className="bg-[#ECF7FF] xl:px-20 2xl:px-0">
      <div className="container py-5 sm:py-6 overflow-hidden">
        <div className="flex flex-col xl:flex-row items-center justify-center gap-5 xl:gap-0">
          <div className="w-[1040px]">
            <ProductSlider />
          </div>
          <div className="flex flex-row xl:flex-col gap-3 md:gap-5  ">
            <Image
              src={bannerImg}
              alt="banner image"
              className="w-[200px] h-[155px] sm:w-[300px] sm:h-[230px] md:w-[350px] md:h-[360px] lg:w-[450px] xl:w-[335px] lg:h-auto "
            />
            <div className="w-full">
              <BannerCard
                images={imges}
                title={"Apple Watch Ultra"}
                price={"70"}
                rating={4.5}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;
