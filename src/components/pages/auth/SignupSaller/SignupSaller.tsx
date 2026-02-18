"use client";
import LoginImage from "@/assets/SignUp/log.png";
import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/shared/Loading/Loading";
import Button from "@/components/shared/Button/Button";
import { Form, Input } from "antd";
import Link from "next/link";


const SignupSaller = () => {
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
              Sign Up as Seller
            </h1>

            <p className="text-text-secondary text-sm text-center">
              Lorem ipsum dolor sit amet consectetur. Congue feugiat ultricies
              faucibus malesuada habitant adipiscing. Amet dolor porta mollis
              feugiat natoque erat.
            </p>

          </div>
          <Form>
            <div className="space-y-4">
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Name
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter Your Name"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Password
                </label>
                <Input.Password
                  name="password"
                  placeholder="Enter Your Password"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Confirm Password
                </label>
                <Input.Password
                  name="confirmPassword"
                  placeholder="Confirm Your Password"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
            </div>

            <div className="mt-7">
              <Button
                htmlType=""
                onClick={() =>
                  handleNavigation("/signup-seller/signup-confirm-seller")
                }
                label="Next"
                size="medium"
                type="submit"
                className="bg-primary text-white w-full hover:bg-primary/90 transition-colors py-3.5 !rounded-[12px]"
              />
            </div>
          </Form>
          <div className="flex flex-col md:flex-row md:items-center justify-center">
            {/* Forgot Password */}

            <button
              type="button"
              className="text-[#646464] text-[15px] font-semibold "
            >
              Already Have An Account ?{" "}
              <Link href={"/login"}>
                <span className="!text-primary">Login</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSaller;
