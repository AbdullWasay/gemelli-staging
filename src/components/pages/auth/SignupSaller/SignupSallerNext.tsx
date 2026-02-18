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
import { Select } from "antd";
const { Option } = Select;

const SignupSallerNext = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginApi] = useLoginMutation();
  const dispatch = useAppDispatch();
  const [storeCategory, setStoreCategory] = useState("");
  const [agree, setAgree] = useState(false);

  const categories = [
    "Fashion",
    "Electronics",
    "Grocery",
    "Home Decor",
    "Toys",
    "Books",
  ];

  const handleSignUp = async (data: { email: string; password: string }) => {
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
          toast.success("Logged in", { id: totastId, duration: 2000 });
          router.push("/login");
        }
      } catch {
        toast.error("Incorrect Password", { id: totastId, duration: 1500 });
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
              Sign Up as Seller
            </h1>
            <p className="text-text-secondary text-sm text-center">
              Lorem ipsum dolor sit amet consectetur. Congue feugiat ultricies
              faucibus malesuada habitant adipiscing. Amet dolor porta mollis
              feugiat natoque erat.
            </p>
          </div>
          <Form onFinish={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Store Name
                </label>
                <Input
                  name="storeName"
                  type="text"
                  placeholder="Enter Your Store Name"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
              <div>
                <label className="block text-[#0F0F0F] font-semibold text-base mb-1.5">
                  Store Category
                </label>
                <Select
                  value={storeCategory || undefined}
                  onChange={(value) => setStoreCategory(value)}
                  placeholder="Select your store category"
                  className="w-full custom-ant-select "
                  size="large"
                  style={{ height: "46px" }}
                >
                  {categories.map((cat, index) => (
                    <Option key={index} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[#0F0F0F] font-semibold text-base">
                  Store Website{" "}
                  <span className="text-[#646464] text-sm">(Optional)</span>
                </label>
                <Input
                  name="storeWebsite"
                  type="text"
                  placeholder="Enter Your Store Name"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] mt-2 placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="mt-1 scale-110 accent-[#A240DE] cursor-pointer"
                />
                <label className="text-sm text-[#646464] font-semibold">
                  I Agree To The{" "}
                  <a href="/terms" className="text-[#A240DE] ">
                    Terms Of Service
                  </a>{" "}
                  And{" "}
                  <a href="/privacy" className="text-[#A240DE] ">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <div className="mt-7">
              <Button
                htmlType=""
                onClick={() => handleNavigation("/signup-confirm-seller")}
                label="Next"
                size="medium"
                type="submit"
                className="bg-primary text-white w-full hover:bg-primary/90 transition-colors py-3.5 !rounded-[12px]"
              />
            </div>
          </Form>
          <div className="flex flex-col md:flex-row md:items-center justify-center ">
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

export default SignupSallerNext;
