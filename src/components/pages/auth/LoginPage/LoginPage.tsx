/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LoginImage from "@/assets/SignUp/log.png";
import Image from "next/image";
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

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginApi] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    
    if (data) {
      try {
        const response = await loginApi(data).unwrap();

        if (response?.success && response?.data?.accessToken) {
          const decodedToken: any = jwtDecode(response.data.accessToken);

          // Dispatch to Redux with CORRECT key name
          dispatch(
            setUser({
              access_token: response.data.accessToken, // Match what baseApi expects
              user: {
                id: decodedToken.id,
                email: decodedToken.email,
                profilePic: decodedToken.profilePic,
                role: decodedToken.role,
                name: decodedToken.name,
              },
            })
          );

          // Store in Cookie
          Cookie.set("accessToken", response.data.accessToken, { 
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          // Store token in localStorage as backup
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", "buyer");

          toast.success("Login Successful", { id: toastId, duration: 2000 });
          
          // Force a small delay to ensure Redux state updates
          await new Promise(resolve => setTimeout(resolve, 100));
          
          router.refresh();
          router.push("/");
        } else {
          toast.error("Login failed. Please try again.", {
            id: toastId,
            duration: 1500,
          });
        }
      } catch (error: any) {
        console.error("Login error:", error);
        const errorMessage = error?.data?.message || "Login failed. Please check your credentials.";
        toast.error(errorMessage, {
          id: toastId,
          duration: 1500,
        });
      } finally {
        setLoading(false);
      }
    }
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
      <div className="w-full lg:w-1/2 xl:w-6/12 px-8 py-10 lg:px-14 flex items-center justify-center bg-white">
        <div className="w-full max-w-xl space-y-6 md:space-y-8">
          <div className="flex items-center justify-center mb-12">
            {/* image */}
          </div>
          <div className="space-y-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold tracking-wide text-[#0F0F0F] text-center">
              Login
            </h1>
            <p className="text-text-secondary text-sm text-center">
              Welcome back! Please enter your details.
            </p>
          </div>
          <Form onFinish={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Email
                </label>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                  className="mb-1"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                  />
                </Form.Item>
              </div>
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Password
                </label>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                  className="mb-1"
                >
                  <Input.Password
                    placeholder="Enter your Password"
                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex flex-row md:items-center justify-end mt-3 gap-1 md:gap-0">
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
                htmlType="submit"
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
            <LoginWithGoogle variant="login" />
          </Form>
          <div className="flex flex-col md:flex-row md:items-center justify-center">
            <button
              type="button"
              className="text-[#646464] text-[15px] font-semibold "
            >
              Do not have an account ?{" "}
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

export default LoginPage;