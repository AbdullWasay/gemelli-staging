"use client"
import ReviewCard from '@/components/shared/ReviewCard/ReviewCard'
import React, { useRef, useState, useEffect } from 'react'
import imageData from "@/assets/Review/Review.png"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import ReusableButton from '@/components/shared/Button/MakeButton';

// Fallback when no reviews from API
const fallbackReviewData = [
    { id: "1", name: "Williamson John", role: "Youtuber", image: imageData },
    { id: "2", name: "Emma Watson", role: "Blogger", image: imageData },
    { id: "3", name: "Liam Smith", role: "Podcaster", image: imageData },
];


const ReviewVideoDetails = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);
    const [reviewData, setReviewData] = useState<Array<{ id: string; name: string; role: string; image: string | typeof imageData }>>([]);

    useEffect(() => {
        fetch("/api/blogger-reviews")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data?.length > 0) {
                    setReviewData(
                        data.data.map((r: { id: string; name: string; role: string; imageUrl: string }) => ({
                            id: r.id,
                            name: r.name,
                            role: r.role,
                            image: r.imageUrl,
                        }))
                    );
                } else {
                    setReviewData(fallbackReviewData);
                }
            })
            .catch(() => setReviewData(fallbackReviewData));
    }, []);

    const goToImage = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };
    return (
        <div className="container mx-auto mb-7 mt-12 sm:mt-20 lg:mt-20 font-poppins">
            <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="">
                    <h1 className="font-semibold text-[24px] md:text-[32px] text-left">
                        Blogger Reviews
                    </h1>
                    <div className="lg:max-w-2xl mt-3">
                        <p className="text-[#333] opacity-80 text-[15px] md:text-[17px] text-left font-medium">
                            Discover what top bloggers are saying about this product honest reviews and expert insights!
                        </p>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <ReusableButton
                        variant="fill"
                        className="px-8 py-4 text-sm font-semibold uppercase"
                    >
                        Share your experience
                    </ReusableButton>
                </div>
            </div>
            {/* Responsive Slider */}
            <div className="mt-8 lg:mt-10">
                <Swiper
                    spaceBetween={16}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                        1280: {
                            slidesPerView: 4,
                        },
                    }}
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setCurrentImageIndex(swiper.realIndex);
                    }}
                >
                    {reviewData.map((review) => (
                        <SwiperSlide key={review.id}>
                            <ReviewCard name={review.name} role={review.role} image={review.image} id={review.id} />

                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* Pagination Dots */}
            <div className="flex justify-center items-center space-x-2 mt-8 md:mt-12">
                {reviewData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className="focus:outline-none"
                        aria-label={`Go to image ${index + 1}`}
                    >
                        <div
                            className={`h-2 sm:h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
                                ? "w-6 sm:w-6 bg-primary"
                                : "w-1.5 sm:w-1.5 bg-primary/30"
                                }`}
                        ></div>
                    </button>
                ))}
            </div>
            <div className="lg:hidden mt-6 flex items-center justify-center">
                <ReusableButton
                    variant="fill"
                    className="px-8 py-4 text-sm font-semibold uppercase"
                >
                    Share your experience
                </ReusableButton>
            </div>
        </div>
    )
}

export default ReviewVideoDetails