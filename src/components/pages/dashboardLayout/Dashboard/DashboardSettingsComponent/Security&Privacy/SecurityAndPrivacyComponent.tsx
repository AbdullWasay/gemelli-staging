"use client";

import Heading from "@/components/ui/Heading/Heading";
import { useState } from "react";

export default function SecurityAndPrivacyComponent() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState({
    email: false,
    phone: false,
    address: false,
    password: false,
  });

  const [userData, setUserData] = useState({
    email: "alex.ossenmacher@gmail.com",
    phone: "044 2345 2314",
    address: "lorem 24, ipsum California",
    password: "••••••••",
  });

  const [tempData, setTempData] = useState({
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    email: "Only Me",
    phone: "Public",
    address: "Only Me",
  });

  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState({
    email: false,
    phone: false,
    address: false,
  });

  const handleEdit = (field: keyof typeof isEditing) => {
    if (field === "password") {
      setTempData({
        ...tempData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setTempData({
        ...tempData,
        [field]: userData[field],
      });
    }
    setIsEditing({
      ...isEditing,
      [field]: true,
    });
  };

  const handleSave = (field: keyof typeof isEditing) => {
    if (field === "password") {
      console.log("Password change data:", {
        currentPassword: tempData.currentPassword,
        newPassword: tempData.newPassword,
        confirmPassword: tempData.confirmPassword,
      });
      // In a real app, you would validate and update the password here
    } else {
      console.log(`${field} change data:`, tempData[field]);
      setUserData({
        ...userData,
        [field]: tempData[field],
      });
    }
    setIsEditing({
      ...isEditing,
      [field]: false,
    });
  };

  const handleCancel = (field: keyof typeof isEditing) => {
    setIsEditing({
      ...isEditing,
      [field]: false,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Changing ${field} to:`, value);
    setTempData({
      ...tempData,
      [field]: value,
    });
  };

  const toggleVisibilityDropdown = (
    field: keyof typeof showVisibilityDropdown
  ) => {
    setShowVisibilityDropdown({
      ...showVisibilityDropdown,
      [field]: !showVisibilityDropdown[field],
    });
  };

  const changeVisibility = (field: keyof typeof visibility, value: string) => {
    console.log(`Changing ${field} visibility to:`, value);
    setVisibility({
      ...visibility,
      [field]: value,
    });
    setShowVisibilityDropdown({
      ...showVisibilityDropdown,
      [field]: false,
    });
  };

  return (
    <div className="mx-auto sm:p-6 overflow-hidden font-poppins">
      <Heading className="!text-[16px] !mt-0  mb-6 font-poppins !text-black !font-semibold">
        Security & Privacy
      </Heading>

      {/* Authentication Section */}
      <section className="mb-8 ">
        <h2 className="font-semibold text-black font-poppins text-[16px]  mb-4">
          Authentication
        </h2>

        <div className=" bg-white rounded-xl px-8 py-5 mb-4">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-0 gap-2">
            <div>
              <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
                Password
              </p>
              <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
                Set a unique password to protect your account.
              </p>
            </div>
            <button
              onClick={() => handleEdit("password")}
              className="px-4 py-2 flex-shrink-0 w-max rounded-full text-purple-500 border border-purple-500 text-sm font-medium"
            >
              Change Password
            </button>
          </div>

          {isEditing.password && (
            <div className="mt-3">
              <input
                type="password"
                value={tempData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Current password"
              />
              <input
                type="password"
                value={tempData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New password"
              />
              <input
                type="password"
                value={tempData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Confirm new password"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("password")}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel("password")}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex sm:flex-r justify-between sm:items-center bg-white rounded-xl px-8 py-5">
          <div>
            <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
              2-Step Verification
            </p>
            <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
              Make your account extra secure. Along with your password,
              you&#39;ll need to enter a code
            </p>
          </div>

          <button
            className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${
              twoFactorEnabled ? "bg-purple-500" : "bg-gray-200"
            }`}
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              console.log("2-Step Verification toggled to:", !twoFactorEnabled);
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                twoFactorEnabled ? "translate-x-6" : "translate-x-1"
              } shadow-sm`}
            />

            {!twoFactorEnabled && (
              <span className="absolute h-2 w-2 rounded-full bg-white  top-1/2 right-2 -translate-y-1/2 border border-gray-200"></span>
            )}
          </button>
        </div>
      </section>

      {/* Privacy Settings Section */}
      <section className="mb-8">
        <h2 className="font-semibold text-black font-poppins text-[16px] mb-4">
          Privacy Settings
        </h2>

        <div className="bg-white rounded-xl px-8 py-5 mb-">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-0 gap-2">
            <div>
              <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
                Email Address
              </p>
              <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
                {userData.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => toggleVisibilityDropdown("email")}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {visibility.email}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showVisibilityDropdown.email && (
                  <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-1 z-10 w-24">
                    <button
                      className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => changeVisibility("email", "Public")}
                    >
                      Public
                    </button>
                    <button
                      className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => changeVisibility("email", "Only Me")}
                    >
                      Only Me
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleEdit("email")}
                className="px-4 py-1 rounded-full text-purple-500 border border-purple-500 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>

          {isEditing.email && (
            <div className="mt-3">
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Email address"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("email")}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel("email")}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl px-8 py-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-0 gap-2">
            <div>
              <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
                Phone No.
              </p>
              <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
                {userData.phone}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => toggleVisibilityDropdown("phone")}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {visibility.phone}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showVisibilityDropdown.phone && (
                  <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-1 z-10 w-24">
                    <button
                      className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => changeVisibility("phone", "Public")}
                    >
                      Public
                    </button>
                    <button
                      className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => changeVisibility("phone", "Only Me")}
                    >
                      Only Me
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleEdit("phone")}
                className="px-4 py-1 rounded-full text-purple-500 border border-purple-500 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>

          {isEditing.phone && (
            <div className="mt-3">
              <input
                type="tel"
                value={tempData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Phone number"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("phone")}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel("phone")}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl px-8 py-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-0 gap-2">
            <div>
              <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
                Address
              </p>
              <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
                {userData.address}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => toggleVisibilityDropdown("address")}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {visibility.address}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showVisibilityDropdown.address && (
                  <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-1 z-10 w-24">
                    <button
                      className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => changeVisibility("address", "Public")}
                    >
                      Public
                    </button>
                    <button
                      className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => changeVisibility("address", "Only Me")}
                    >
                      Only Me
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleEdit("address")}
                className="px-4 py-1 rounded-full text-purple-500 border border-purple-500 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>

          {isEditing.address && (
            <div className="mt-3">
              <input
                type="text"
                value={tempData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Address"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("address")}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel("address")}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Third-Party Access Section */}
      <section className="bg-white rounded-xl px-8 py-5 pb-6 mb-6">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-0 gap-2">
          <div>
            <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
              Third-Party Access
            </p>
            <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
              Review apps connected to your account and revoke access if
              necessary.
            </p>
          </div>
          <button
            onClick={() => console.log("Manage Connected Apps clicked")}
            className="px-4 py-2 h-max w-max rounded-full text-purple-500 border border-purple-500 text-sm font-medium flex-shrink-0"
          >
            Manage Connected Apps
          </button>
        </div>
      </section>

      {/* Last Login Section */}
      <section className="bg-white rounded-xl px-8 py-5 pb-6 mb-6">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-0 gap-2">
          <div>
            <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
              Last Login
            </p>
            <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
              14th Dec 2024, IP: 192.168.0.1, Location: Chisinau, Moldova.
            </p>
          </div>
          <button
            onClick={() => console.log("Logout All Devices clicked")}
            className="px-4 py-2 flex-shrink-0 w-max h-max rounded-full text-purple-500 border border-purple-500 text-sm font-medium"
          >
            Logout All Devices
          </button>
        </div>
      </section>

      {/* Deactivate Account Section */}
      <section className="bg-white rounded-xl px-8 py-5 pb-6 mb-6">
        <div className="flex justify-between sm:items-center">
          <div>
            <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
              Deactivate My Account
            </p>
            <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
              This will shut down your account. Your account will be reactive
              when you sign in again.
            </p>
          </div>
          <button
            onClick={() => console.log("Deactivate Account clicked")}
            className="px-4 flex-shrink-0 h-max py-2 rounded-full text-gray-500 border border-gray-300 text-sm font-medium"
          >
            Deactivate
          </button>
        </div>
      </section>

      {/* Delete Account Section */}
      <section>
        <div className="flex justify-between sm:items-center bg-white rounded-xl px-8 py-5">
          <div>
            <p className="font-semibold text-text-black font-poppins text-[14px] mb-1">
              Delete Account
            </p>
            <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
              This will delete your account. Your account will be permanently
              deleted from Gemelli.
            </p>
          </div>
          <button
            onClick={() => console.log("Delete Account clicked")}
            className="px-4 flex-shrink-0 w-max h-max py-2 rounded-full text-red-500 border border-red-500 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
