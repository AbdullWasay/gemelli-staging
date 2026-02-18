import Heading from "@/components/ui/Heading/Heading";
import Image from "next/image";
import one from "@/assets/images/campaign/one.png";
import two from "@/assets/images/campaign/two.png";
import three from "@/assets/images/campaign/three.png";

const CompainsOverview = () => {
  return (
    <div className=" ">
      <Heading className="!text-[18px]">Campaigns overview</Heading>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
        <div className="relative">
          <Image src={one} alt="one" />
          <div className="absolute top-1/2 -translate-y-1/2 left-8">
            <h5 className="text-white font-poppins text-[28px] font-semibold mb-2">
              10
            </h5>
            <p className="text-white font-poppins text-[14px] font-medium">Active Campaigns</p>
          </div>
        </div>
        <div className="relative">
          <Image src={two} alt="one" />

           <div className="absolute top-1/2 -translate-y-1/2 left-8">
            <h5 className="text-white font-poppins text-[28px] font-semibold mb-2">
              08
            </h5>
            <p className="text-white font-poppins text-[14px] font-medium">Completed Campaigns</p>
          </div>
        </div>
        <div className="relative">
          <Image src={three} alt="one" />

           <div className="absolute top-1/2 -translate-y-1/2 left-8">
            <h5 className="text-white font-poppins text-[28px] font-semibold mb-2">
             02
            </h5>
            <p className="text-white font-poppins text-[14px] font-medium">Inactive Campaigns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompainsOverview;
