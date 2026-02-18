"use client";
// import { useState } from "react";
import LoginImage from "@/assets/SignUp/log.png";

import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/shared/Loading/Loading";
import Button from "@/components/shared/Button/Button";
import { Form, Input } from "antd";
import Link from "next/link";


const ForgetPasswordPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const handleNavigation = (path: string) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(path);
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
                            Forgot Your Password
                        </h1>
                        <p className="text-[#646464] text-sm text-center">
                            Please enter the email address where you&apos;d like to receive your password reset information.
                        </p>
                    </div>
                    <Form>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[#0F0F0F] font-semibold text-base">
                                    Email
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-5">
                            <Button
                                htmlType=""
                                onClick={() => handleNavigation("/reset-password")}
                                label="NEXT"
                                size="medium"
                                type="submit"
                                className="bg-[#005BFF] text-white w-full hover:bg-[#005BFF]/90 transition-colors py-3.5 !rounded-[12px]"
                            />
                        </div>
                    </Form>
                    <div className="flex flex-col md:flex-row md:items-center justify-center">
                        {/* Forgot Password */}

                        <button
                            type="button"
                            className="text-[#646464] text-[15px] font-semibold "
                        >
                            <Link href={"/login"}>
                                <span className="!text-[#005BFF]">Back To Login</span>
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;
