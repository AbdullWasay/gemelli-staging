"use client";

import { useEffect, useState } from "react";
import img1 from "@/assets/promation/1.png";
import img2 from "@/assets/promation/d1.png";
import Image from "next/image";

export default function FirstPromation() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 11,
    seconds: 8,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes =
          newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;
        const newDays = newHours < 0 ? prevTime.days - 1 : prevTime.days;

        return {
          days: newDays < 0 ? 0 : newDays,
          hours:
            newHours < 0 ? 23 : (newMinutes < 0 ? newHours - 1 : newHours) % 24,
          minutes: newMinutes < 0 ? 59 : newMinutes % 60,
          seconds: newSeconds < 0 ? 59 : newSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <div className="w-full mx-auto rounded-2xl overflow-hidden poppins relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img1}
          alt="Background"
          fill
          className="object-cover"
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:px-20 pt-10 pb-8 md:pt-12 md:pb-10 text-center">
        <h2 className="text-white text-xs md:text-lg font-medium mb-1">
          Get Extra Discount
        </h2>

        <div className="mb-1 flex justify-center">
          <Image src={img2} alt="img2" />
        </div>

        <p className="text-white text-[10px] md:text-base font-medium mb-3">
          With A Purchase Of 3200 USDT Onwards
        </p>

        <p className="text-white text-[10px] md:text-base font-medium mb-3 md:mb-4">
          ENDS IN
        </p>

        <div className="flex justify-center gap-2 text-white">
          <div className="flex items-center">
            <span className="text-2xl md:text-4xl font-medium">
              {formatTime(timeLeft.days)}
            </span>
          </div>
          <span className="text-2xl md:text-4xl font-medium">:</span>
          <div className="flex items-center">
            <span className="text-2xl md:text-4xl font-medium">
              {formatTime(timeLeft.hours)}
            </span>
          </div>
          <span className="text-2xl md:text-4xl font-medium">:</span>
          <div className="flex items-center">
            <span className="text-2xl md:text-4xl font-medium">
              {formatTime(timeLeft.minutes)}
            </span>
          </div>
          <span className="text-2xl md:text-4xl font-medium">:</span>
          <div className="flex items-center">
            <span className="text-2xl md:text-4xl font-medium">
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
