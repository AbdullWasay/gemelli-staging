"use client";
// import { useState } from "react";
import LoginImage from "@/assets/SignUp/log.png";

import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/shared/Loading/Loading";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";

import Button from "@/components/shared/Button/Button";
import { Form, Input } from "antd";
import Link from "next/link";
import LoginWithGoogle from "@/components/LoginWithGoogle";

const SignupBuyer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [registerApi] = useRegisterMutation();

  const handleSignUp = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    const toastId = toast.loading("Creating account...");

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", { id: toastId, duration: 1500 });
      setLoading(false);
      return;
    }

    if (data) {
      try {
        const userData = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: "USER",
        };

        const response = await registerApi(userData).unwrap();

        if (response?.success) {
          toast.success("Account created successfully", {
            id: toastId,
            duration: 2000,
          });

          // Save user in Redux store
          dispatch(
            setUser({
              user: response.user,
              access_token: response.token || "",
              refresh_token: response.refreshToken || "",
            })
          );

          // Redirect to dashboard
          router.push("/");
        }
      } catch (error: unknown) {
        console.error("Registration error:", error);
        toast.error(
          (error as { data: { error: string } })?.data?.error ||
            "Failed to create account",
          {
            id: toastId,
            duration: 1500,
          }
        );
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
      {/* form */}
      <div className="w-full lg:w-1/2 xl:w-6/12 px-8 py-10 lg:px-14 flex items-center justify-center bg-white">
        <div className="w-full max-w-xl space-y-6 md:space-y-8">
          <div className="flex items-center justify-center mb-12">
            {/* image */}
          </div>
          <div className="space-y-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold tracking-wide text-[#0F0F0F] text-center">
              Sign Up as Buyer
            </h1>
            <p className="text-text-secondary text-sm text-center">
              Sign in with Google or enter your details below to create your account.
            </p>
          </div>
          <div className="mb-5">
            <LoginWithGoogle variant="signup" redirectTo="/" />
          </div>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#64646452]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#646464]">Or enter details manually</span>
            </div>
          </div>
          <Form onFinish={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Name
                </label>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                  className="mb-1"
                >
                  <Input
                    type="text"
                    placeholder="Enter Your Name"
                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                  />
                </Form.Item>
              </div>
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
                    placeholder="Enter Your Email"
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
                      min: 8,
                    },
                  ]}
                  className="mb-1"
                >
                  <Input.Password
                    placeholder="Enter Your Password"
                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                  />
                </Form.Item>
              </div>
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Confirm Password
                </label>
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The passwords do not match")
                        );
                      },
                    }),
                  ]}
                  className="mb-1"
                >
                  <Input.Password
                    placeholder="Confirm Your Password"
                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mt-7">
              <Button
                htmlType="submit"
                label="Sign Up"
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
              Already Have An Account ?{" "}
              <Link href={"/login"}>
                <span className="!text-[#005BFF]">Login</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupBuyer;
