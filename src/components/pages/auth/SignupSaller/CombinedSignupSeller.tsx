"use client";
import LoginImage from "@/assets/SignUp/log.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "@/components/shared/Loading/Loading";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import Button from "@/components/shared/Button/Button";
import { Form, Input, Select } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import LoginWithGoogle from "@/components/LoginWithGoogle";
const { Option } = Select;

const CombinedSignupSeller = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [registerApi] = useRegisterMutation();
  const [storeCategory, setStoreCategory] = useState("");
  const [agree, setAgree] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Initialize form when component loads
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  const categories = [
    "Fashion",
    "Electronics",
    "Grocery",
    "Home Decor",
    "Toys",
    "Books",
  ];

  const handleNextStep = async () => {
    try {
      // Validate current step fields
      const values = await form.validateFields([
        "name",
        "email",
        "password",
        "confirmPassword",
      ]);

      // Save first step data to state
      setFormData({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Move to next step
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);

    // Restore values from first step when going back
    form.setFieldsValue({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.password,
    });
  };

  const handleSignUp = async (step2Data: {
    storeName: string;
    storeWebsite?: string;
  }) => {
    setLoading(true);
    const toastId = toast.loading("Creating account...");
    console.log("Step 1 data:", formData);
    console.log("Step 2 data:", step2Data);

    // Validation checks for the second step
    if (!storeCategory) {
      toast.error("Please select a store category", {
        id: toastId,
        duration: 1500,
      });
      setLoading(false);
      return;
    }

    if (!agree) {
      toast.error("Please agree to the terms and conditions", {
        id: toastId,
        duration: 1500,
      });
      setLoading(false);
      return;
    }

    try {
      // Combine all data from both steps
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "SELLER",
        store: {
          storeName: step2Data.storeName,
          storeCategory,
          storeWebsite: step2Data.storeWebsite || "",
        },
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
            access_token: response.user.accessToken || "",
            refresh_token: response.user.refreshToken || "",
          })
        );

        // Redirect to dashboard
        router.push("/dashboard");
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
      <div className="w-full lg:w-1/2 xl:w-6/12 px-8 py-10 lg:px-14 flex items-center justify-center bg-white overflow-y-auto max-h-screen">
        <div className="w-full max-w-xl space-y-6 md:space-y-8 pb-10">
          <div className="flex items-center justify-center mb-12">
            {/* image */}
          </div>
          <div className="space-y-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold tracking-wide text-[#0F0F0F] text-center">
              Sign Up as Seller
              <span className="text-sm font-normal block mt-1">
                Step {currentStep} of 2
              </span>
            </h1>
            <p className="text-text-secondary text-sm text-center">
              {currentStep === 1
                ? "Create your account to start selling on our platform."
                : "Tell us about your store to complete your registration."}
            </p>
          </div>
          <Form
            form={form}
            onFinish={handleSignUp}
            layout="vertical"
            initialValues={formData}
          >
            {/* Hidden fields to preserve step 1 data */}
            {currentStep === 2 && (
              <>
                <Form.Item name="name" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="email" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="password" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="confirmPassword" hidden>
                  <Input />
                </Form.Item>
              </>
            )}

            {/* Step 1: Sign in with Google or enter details manually */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-5">
                  <LoginWithGoogle
                    variant="signup"
                    role="SELLER"
                    redirectTo="/signup-seller/complete-store"
                  />
                </div>
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#64646452]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#646464]">Or enter details manually</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-[#0F0F0F]">
                  Personal Details
                </h2>
                <div>
                  <Form.Item
                    name="name"
                    label={
                      <span className="text-[#0F0F0F] font-semibold text-base">
                        Name
                      </span>
                    }
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Your Name"
                      className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="email"
                    label={
                      <span className="text-[#0F0F0F] font-semibold text-base">
                        Email
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="password"
                    label={
                      <span className="text-[#0F0F0F] font-semibold text-base">
                        Password
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password",
                        min: 8,
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter Your Password"
                      className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="confirmPassword"
                    label={
                      <span className="text-[#0F0F0F] font-semibold text-base">
                        Confirm Password
                      </span>
                    }
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password",
                      },
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
                  >
                    <Input.Password
                      placeholder="Confirm Your Password"
                      className="py-3 border border-[#64646452] bg-[#F9F9F9] focus:bg-[#F9F9F9] hover:bg-[#F9F9F9] placeholder:text-[#646464]/60 placeholder:font-semibold placeholder:text-sm"
                    />
                  </Form.Item>
                </div>

                <div className="mt-7">
                  <Button
                    htmlType="button"
                    onClick={handleNextStep}
                    label="Next"
                    size="medium"
                    type="button"
                    className="bg-primary text-white w-full hover:bg-primary/90 transition-colors py-3.5 !rounded-[12px]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Store Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#0F0F0F] mb-4">
                  Store Information
                </h2>
                <div>
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
                </div>
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
                        <span className="text-[#646464] text-sm">
                          (Optional)
                        </span>
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
                    <a href="/terms" className="text-[#A240DE] ">
                      Terms Of Service
                    </a>{" "}
                    And{" "}
                    <a href="/privacy" className="text-[#A240DE] ">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="mt-7 flex space-x-4">
                  <Button
                    htmlType="button"
                    onClick={handlePrevStep}
                    label="Back"
                    size="medium"
                    type="button"
                    className="bg-white text-primary border border-primary w-1/3 hover:bg-gray-50 transition-colors py-3.5 !rounded-[12px]"
                  />
                  <Button
                    htmlType="submit"
                    label="Sign Up"
                    size="medium"
                    type="submit"
                    className="bg-primary text-white w-2/3 hover:bg-primary/90 transition-colors py-3.5 !rounded-[12px]"
                    disabled={!agree || !storeCategory}
                  />
                </div>
              </div>
            )}
          </Form>
          <div className="flex flex-col md:flex-row md:items-center justify-center">
            <button
              type="button"
              className="text-[#646464] text-[15px] font-semibold"
            >
              Already Have An Account?{" "}
              <Link href={"/login-seller"}>
                <span className="!text-primary">Login</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedSignupSeller;
