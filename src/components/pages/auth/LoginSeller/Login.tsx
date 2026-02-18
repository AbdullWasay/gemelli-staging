/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { useState } from "react";
import LoginImage from "@/assets/SignUp/log.png";

import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/shared/Loading/Loading";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import Cookie from "js-cookie";

import { jwtDecode } from "jwt-decode";

import Button from "@/components/shared/Button/Button";
import { Form, Input } from "antd";
import Link from "next/link";
import LoginWithGoogle from "@/components/LoginWithGoogle";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginApi] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const totastId = toast.loading("Loging in...");
    if (data) {
      try {
        const response = await loginApi(data).unwrap();
        if (response?.data) {
          router.refresh();
          const decodedToken: any = jwtDecode(response?.data?.accessToken);

          console.log(response);

          dispatch(
            setUser({
              access_token: response?.data?.accessToken,
              user: {
                id: decodedToken?.id,
                email: decodedToken?.email,
                profilePic: decodedToken.profilePic,
                role: decodedToken.role,
                name: decodedToken.name,
              },
            })
          );
          Cookie.set("accessToken", response?.data?.accessToken);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", "seller");
          toast.success("Login Successful", { id: totastId, duration: 2000 });
          router.push("/dashboard");
        }
      } catch {
        toast.error("Login Successful", { id: totastId, duration: 1500 });
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", "seller");
      } finally {
        setLoading(false);
      }
    }
  };

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
              Login as Seller
            </h1>

            <p className="text-text-secondary text-sm text-center">
              Lorem ipsum dolor sit amet consectetur. Congue feugiat ultricies
              faucibus malesuada habitant adipiscing. Amet dolor porta mollis
              feugiat natoque erat.
            </p>
          </div>
          <Form onFinish={handleLogin}>
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
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Password
                </label>
                <Input.Password
                  name="password"
                  placeholder="Enter your Password"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
            </div>
            <div className="flex flex-row md:items-center justify-end mt-3 gap-1 md:gap-0">
              {/* Forgot Password */}

              <button
                type="button"
                className="text-[#646464] text-[15px] font-semibold "
              >
                Forgot Password ?{" "}
                <Link href={"/forget-password"}>
                  <span className="!text-[#005BFF]">Reset</span>
                </Link>
              </button>
            </div>
            <div className="mt-5">
              <Button
                htmlType=""
                onClick={() => handleNavigation("/dashboard")}
                label="Login"
                size="medium"
                type="submit"
                className="bg-[#005BFF] text-white w-full hover:bg-[#005BFF]/90 transition-colors py-3.5 !rounded-[12px]"
              />
            </div>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#64646452]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#646464]">Or continue with</span>
              </div>
            </div>
            <LoginWithGoogle variant="login" redirectTo="/dashboard" />
          </Form>
          <div className="flex flex-col md:flex-row md:items-center justify-center">
            {/* Forgot Password */}

            <button
              type="button"
              className="text-[#646464] text-[15px] font-semibold "
            >
              Don’t have an account ?{" "}
              <Link href={"/signup"}>
                <span className="!text-[#005BFF]">Sign Up</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
