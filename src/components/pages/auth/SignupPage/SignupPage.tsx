"use client";
import LoginImage from "@/assets/SignUp/log.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/shared/Loading/Loading";
import Button from "@/components/shared/Button/Button";
const SignupPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState<"buyer" | "seller" | null>(null);

    const handleNavigation = () => {
        if (!selectedCard) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(selectedCard === "buyer" ? "/signup-buyer" : "/signup-seller");
        }, 200);
    };

    return (
        <div className="font-jost min-h-screen flex poppins">
            {loading && <Loading />}
            <div className="hidden lg:flex lg:w-1/2 xl:w-1/2 bg-[#ECF7FF]">
                <div className="relative w-full h-full">
                    <Image
                        src={LoginImage}
                        alt="Login page image"
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>
            {/* form */}
            <div className="w-full lg:w-1/2 xl:w-6/12 px-8 py-10 lg:px-14 flex items-center justify-center bg-white">
                <div className="w-full max-w-xl space-y-6 md:space-y-8">
                    <div className="flex items-center justify-center mb-12">
                        {/* image */}
                    </div>
                    <div className="space-y-6 max-w-lg mx-auto">
                        <h1 className="text-3xl font-semibold tracking-wide text-[#0F0F0F] text-center">
                            Create Your Account
                        </h1>

                        <p className="text-text-secondary text-sm text-center">
                            Lorem ipsum dolor sit amet consectetur. Congue feugiat ultricies faucibus malesuada habitant adipiscing. Amet dolor porta mollis feugiat
                            natoque erat.
                        </p>

                    </div>

                    <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                            {/* card 1 - Seller */}
                            <div
                                className={`w-full max-w-[270px] bg-[#F9F9F9] rounded-lg shadow-sm p-6 cursor-pointer transition-all ${selectedCard === "seller" ? "border-2 border-primary" : "border-2 border-transparent"}`}
                                onClick={() => setSelectedCard("seller")}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <g clipPath="url(#clip0_15_10960)">
                                            <path
                                                d="M25.3333 8H22.516C22.136 6.156 20.996 4.52 19.3333 3.56C18.6947 3.18933 17.8813 3.40933 17.512 4.04533C17.144 4.684 17.3613 5.49867 17.9987 5.86667C19.232 6.58 19.9987 7.908 19.9987 9.33333V24H5.33333C3.86267 24 2.66667 22.804 2.66667 21.3333V17.3333C2.66667 16.596 2.06933 16 1.33333 16C0.597333 16 0 16.596 0 17.3333V21.3333C0 23.8413 1.74533 25.936 4.08133 26.5027C4.03067 26.7747 4 27.052 4 27.3333C4 29.9067 6.09333 32 8.66667 32C11.24 32 13.3333 29.9067 13.3333 27.3333C13.3333 27.108 13.3107 26.8867 13.2787 26.6667H18.7213C18.6893 26.8867 18.6667 27.108 18.6667 27.3333C18.6667 29.9067 20.76 32 23.3333 32C25.9067 32 28 29.9067 28 27.3333C28 27.052 27.968 26.7747 27.9187 26.5027C30.2547 25.936 32 23.8413 32 21.3333V14.6667C32 10.9907 29.0093 8 25.3333 8ZM29.3333 14.6667V16H22.6667V10.6667H25.3333C27.5387 10.6667 29.3333 12.4613 29.3333 14.6667ZM10.6667 27.3333C10.6667 28.436 9.76933 29.3333 8.66667 29.3333C7.564 29.3333 6.66667 28.436 6.66667 27.3333C6.66667 27.0813 6.71867 26.86 6.79067 26.6667H10.544C10.616 26.86 10.668 27.0813 10.668 27.3333H10.6667ZM23.3333 29.3333C22.2307 29.3333 21.3333 28.436 21.3333 27.3333C21.3333 27.0813 21.3853 26.86 21.4573 26.6667H25.2107C25.2827 26.86 25.3347 27.0813 25.3347 27.3333C25.3347 28.436 24.436 29.3333 23.3333 29.3333ZM26.6667 24H22.6667V18.6667H29.3333V21.3333C29.3333 22.804 28.1373 24 26.6667 24ZM4 13.3333H10.6667C12.872 13.3333 14.6667 11.5387 14.6667 9.33333V4C14.6667 1.79467 12.872 0 10.6667 0H4C1.79467 0 0 1.79467 0 4V9.33333C0 11.5387 1.79467 13.3333 4 13.3333ZM2.66667 4C2.66667 3.264 3.26533 2.66667 4 2.66667H10.6667C11.4013 2.66667 12 3.264 12 4V9.33333C12 10.0693 11.4013 10.6667 10.6667 10.6667H4C3.26533 10.6667 2.66667 10.0693 2.66667 9.33333V4ZM5.33333 5.33333C5.33333 4.596 5.93067 4 6.66667 4H8C8.736 4 9.33333 4.596 9.33333 5.33333C9.33333 6.07067 8.736 6.66667 8 6.66667H6.66667C5.93067 6.66667 5.33333 6.07067 5.33333 5.33333Z"
                                                fill={selectedCard === "seller" ? "#005BFF" : "#0F0F0F"}
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_15_10960">
                                                <rect width="32" height="32" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <h3 className={`font-semibold text-lg xl:text-xl mt-4 mb-[10px] ${selectedCard === "seller" ? "text-primary" : "text-black"}`}>
                                        Sign Up as Seller
                                    </h3>

                                    <p className="text-text-secondary text-sm">
                                        Access your dashboard, track sales, and grow your business with us.
                                    </p>
                                </div>
                            </div>
                            {/* card 2 - Buyer */}
                            <div
                                className={`w-full max-w-[270px] bg-[#F9F9F9] rounded-lg shadow-sm p-6 cursor-pointer transition-all ${selectedCard === "buyer" ? "border-2 border-primary" : "border-2 border-transparent"}`}
                                onClick={() => setSelectedCard("buyer")}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <g clipPath="url(#clip0_15_10967)">
                                            <path
                                                d="M31.9547 30.3212C32.1467 31.0332 31.724 31.7639 31.012 31.9545C30.896 31.9852 30.78 32.0012 30.6653 32.0012C30.0773 32.0012 29.5387 31.6079 29.3787 31.0132C28.904 29.2399 27.24 28.0012 25.3333 28.0012C23.4267 28.0012 21.7627 29.2399 21.288 31.0132C21.096 31.7239 20.3653 32.1465 19.6547 31.9559C18.9427 31.7652 18.52 31.0345 18.712 30.3225C19.5 27.3852 22.2227 25.3345 25.3333 25.3345C28.444 25.3345 31.1667 27.3852 31.9547 30.3225V30.3212ZM25.3333 17.3332C23.4947 17.3332 22 18.8279 22 20.6665C22 22.5052 23.4947 23.9999 25.3333 23.9999C27.172 23.9999 28.6667 22.5052 28.6667 20.6665C28.6667 18.8279 27.172 17.3332 25.3333 17.3332ZM5.33333 19.9999H6.66667C8.26667 19.9999 9.688 19.2772 10.6667 18.1572C11.6453 19.2772 13.0667 19.9999 14.6667 19.9999H17.3333C17.944 19.9999 18.5427 19.8972 19.112 19.6945C19.8067 19.4479 20.1693 18.6865 19.9227 17.9919C19.6747 17.2972 18.912 16.9372 18.2213 17.1812C17.9387 17.2812 17.6387 17.3319 17.3333 17.3319H14.6667C13.196 17.3319 12 16.1359 12 14.6652C12 13.9292 11.4027 13.3319 10.6667 13.3319C9.93067 13.3319 9.33333 13.9292 9.33333 14.6652C9.33333 16.1359 8.13733 17.3319 6.66667 17.3319H5.33333C3.896 17.3319 2.72133 16.1892 2.668 14.7639L4.196 5.49854C4.70667 3.82787 6.26933 2.6652 8.02267 2.6652H9.33333V6.6652C9.33333 7.4012 9.93067 7.99854 10.6667 7.99854C11.4027 7.99854 12 7.4012 12 6.6652V2.6652H20V6.6652C20 7.4012 20.596 7.99854 21.3333 7.99854C22.0707 7.99854 22.6667 7.4012 22.6667 6.6652V2.6652H23.976C25.728 2.6652 27.292 3.82654 27.8027 5.49854L29.3307 14.7639C29.32 15.0345 29.2693 15.2999 29.18 15.5545C28.9347 16.2492 29.3 17.0105 29.9933 17.2559C30.6893 17.5025 31.4493 17.1372 31.6947 16.4425C31.8947 15.8719 31.9987 15.2732 31.9987 14.6652C31.9987 14.5919 30.4 4.88253 30.3853 4.8332C29.572 1.98654 26.9347 -0.00146484 23.9747 -0.00146484H8.02267C5.06267 -0.00013151 2.42667 1.98787 1.612 4.83454C1.59733 4.88387 0 14.5932 0 14.6665C0 16.0065 0.513333 17.2185 1.33333 18.1572V26.6665C1.33333 29.6079 3.72533 31.9999 6.66667 31.9999H14.6667C15.4027 31.9999 16 31.4025 16 30.6665C16 29.9305 15.4027 29.3332 14.6667 29.3332H6.66667C5.196 29.3332 4 28.1372 4 26.6665V19.8105C4.42933 19.9225 4.87067 19.9999 5.33333 19.9999Z"
                                                fill={selectedCard === "buyer" ? "#005BFF" : "#0F0F0F"}
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_15_10967">
                                                <rect width="32" height="32" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <h3 className={`font-semibold text-lg xl:text-xl mt-4 mb-[10px] ${selectedCard === "buyer" ? "text-primary" : "text-black"}`}>
                                        Sign Up as Buyer
                                    </h3>

                                    <p className="text-text-secondary text-sm">
                                        Discover exclusive deals, save items to your wishlist, and enjoy a seamless shopping experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <Button
                            htmlType="button"
                            onClick={handleNavigation}
                            label="NEXT"
                            size="medium"
                            type="submit"
                            disabled={!selectedCard}
                            className={`bg-primary text-white w-full hover:bg-primary/90 transition-colors py-3.5 !rounded-[12px] ${!selectedCard ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;