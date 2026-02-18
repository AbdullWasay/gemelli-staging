"use client";
import LoginImage from "@/assets/SignUp/log.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "@/components/shared/Loading/Loading";
import { useCreateStoreMutation } from "@/redux/features/user/userApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import Button from "@/components/shared/Button/Button";
import { Form, Input, Select } from "antd";
import Link from "next/link";

const { Option } = Select;

const categories = [
  "Fashion",
  "Electronics",
  "Grocery",
  "Home Decor",
  "Toys",
  "Books",
];

const CompleteStoreForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [storeCategory, setStoreCategory] = useState("");
  const [agree, setAgree] = useState(false);
  const [createStore] = useCreateStoreMutation();
  const { data: meResponse, isLoading: meLoading, isError: meError } = useGetMeQuery();

  useEffect(() => {
    if (meLoading) return;
    if (meError || !meResponse?.data) {
      router.replace("/signup-seller");
      return;
    }
    const user = meResponse.data;
    if (user.role !== "SELLER") {
      router.replace("/");
      return;
    }
    if (user.store) {
      router.replace("/dashboard");
    }
  }, [meResponse, meLoading, meError, router]);

  const handleSubmit = async (values: {
    storeName: string;
    storeWebsite?: string;
  }) => {
    if (!storeCategory) {
      toast.error("Please select a store category");
      return;
    }
    if (!agree) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your store...");
    try {
      await createStore({
        storeName: values.storeName,
        storeCategory,
        storeWebsite: values.storeWebsite || "",
      }).unwrap();

      toast.success("Store created successfully", {
        id: toastId,
        duration: 2000,
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Create store error:", error);
      toast.error(
        (error as { data?: { error?: string } })?.data?.error ||
          "Failed to create store",
        { id: toastId, duration: 1500 }
      );
    } finally {
      setLoading(false);
    }
  };

  if (meLoading || !meResponse?.data || meError) {
    return <Loading />;
  }

  const user = meResponse.data as { role?: string; store?: unknown };
  if (user.store) {
    return null; // redirecting in useEffect
  }

  return (
    <div className="font-jost min-h-screen flex poppins">
      {loading && <Loading />}
      <div className="hidden lg:flex lg:w-1/2 xl:w-1/2 bg-[#ECF7FF]">
        <div className="relative w-full h-full">
          <Image
            src={LoginImage}
            alt="Sign up"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
      <div className="w-full lg:w-1/2 xl:w-6/12 px-8 py-10 lg:px-14 flex items-center justify-center bg-white overflow-y-auto max-h-screen">
        <div className="w-full max-w-xl space-y-6 md:space-y-8 pb-10">
          <div className="space-y-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold tracking-wide text-[#0F0F0F] text-center">
              Complete Your Store
            </h1>
            <p className="text-text-secondary text-sm text-center">
              Add your store details to start selling on our platform.
            </p>
          </div>
          <Form onFinish={handleSubmit} layout="vertical">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#0F0F0F] mb-4">
                Store Information
              </h2>
              <Form.Item
                name="storeName"
                label={
                  <span className="text-[#0F0F0F] font-semibold text-base">
                    Store Name
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your store name",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter Your Store Name"
                  className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                />
              </Form.Item>
              <div>
                <label className="block text-[#0F0F0F] font-semibold text-base mb-1.5">
                  Store Category
                </label>
                <Select
                  value={storeCategory || undefined}
                  onChange={(value) => setStoreCategory(value)}
                  placeholder="Select your store category"
                  className="w-full custom-ant-select"
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
              <div className="mt-4">
                <Form.Item
                  name="storeWebsite"
                  label={
                    <span className="text-[#0F0F0F] font-semibold text-base">
                      Store Website{" "}
                      <span className="text-[#646464] text-sm">(Optional)</span>
                    </span>
                  }
                >
                  <Input
                    type="text"
                    placeholder="Enter Your Store Website"
                    className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                  />
                </Form.Item>
              </div>
              <div className="flex items-start space-x-2 mt-4">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="mt-1 scale-110 accent-[#A240DE] cursor-pointer"
                />
                <label className="text-sm text-[#646464] font-semibold">
                  I Agree To The{" "}
                  <a href="/terms" className="text-[#A240DE]">
                    Terms Of Service
                  </a>{" "}
                  And{" "}
                  <a href="/privacy" className="text-[#A240DE]">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <div className="mt-7">
                <Button
                  htmlType="submit"
                  label="Complete Setup"
                  size="medium"
                  type="submit"
                  className="bg-primary text-white w-full hover:bg-primary/90 transition-colors py-3.5 !rounded-[12px]"
                  disabled={!agree || !storeCategory}
                />
              </div>
            </div>
          </Form>
          <div className="flex justify-center">
            <button type="button" className="text-[#646464] text-[15px] font-semibold">
              Already Have An Account?{" "}
              <Link href="/login-seller">
                <span className="!text-primary">Login</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteStoreForm;
