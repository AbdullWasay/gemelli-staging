"use client";

import {
  type ChangeEvent,
  type ReactNode,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import Image from "next/image";
import {
  useGetMeQuery,
  useUpdateUserMutation,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
} from "@/redux/features/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getTokenFromLocalStorage } from "@/utils/tokenHandler";
import { UserWithRelations } from "@/types/api";
import { setUser } from "@/redux/features/auth/authSlice";
import { getProfileImageUrl } from "@/utils/imageUtils";
import defaultAvatar from "@/assets/images/manicon.png";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: ReactNode;
}

function EditModal({
  isOpen,
  onClose,
  title,
  children,
  onSave,
}: EditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !z-[1000000] p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 overflow-y-auto">{children}</div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (onSave) onSave();
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserProfile {
  name: string;
  profileImage: string;
}

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
}

const ProfileForm = forwardRef<{ saveChanges: () => void }, ProfileFormProps>(
  ({ profile, onUpdate }, ref) => {
    const [profileImage, setProfileImage] = useState<string>(
      profile.profileImage
    );
    const [fileSelected, setFileSelected] = useState<boolean>(false);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileSelected(true);
        setImageFile(file); // Store the file for later upload
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
      }
    };

    // Get access token from Redux store
    const access_token = useSelector(
      (state: RootState) => state.auth.access_token
    );

    // Function to upload the image file
    const uploadImage = async (): Promise<string | null> => {
      if (!imageFile) return null;

      setUploadingImage(true);
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("file", imageFile);

        // Get token from Redux or fallback to localStorage
        const token = access_token || getTokenFromLocalStorage();

        if (!token) {
          console.error("No auth token available");
          return null;
        }

        // Upload the file
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to upload image");
        }

        console.log("Image uploaded successfully:", result);
        return result.data.url; // Return the permanent URL
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      } finally {
        setUploadingImage(false);
      }
    };

    const saveChanges = async () => {
      // If a new image file was selected, upload it first - never save blob URLs
      let finalImageUrl = profileImage;
      if (fileSelected && imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          console.error("Image upload failed - not saving");
          return; // Don't save if upload failed (would save invalid blob URL)
        }
        finalImageUrl = uploadedUrl;
      }
      // Only update if we have a valid URL (not a blob URL)
      if (finalImageUrl && (finalImageUrl.startsWith("http") || finalImageUrl.startsWith("https"))) {
        onUpdate({ profileImage: finalImageUrl });
      }
    };

    // Expose saveChanges method via ref
    useImperativeHandle(ref, () => ({
      saveChanges,
    }));

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={getProfileImageUrl(profileImage, defaultAvatar)}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="profile-photo"
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer inline-block text-center"
              >
                Change Photo
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <span className="text-xs text-blue-600 flex items-center">
                  <div className="inline-block h-3 w-3 mr-1 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                  Uploading...
                </span>
              )}
              {fileSelected && !uploadingImage && (
                <span className="text-xs text-green-600">
                  New photo selected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProfileForm.displayName = "ProfileForm";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface PersonalInfoFormProps {
  info: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

const PersonalInfoForm = forwardRef<
  { saveChanges: () => void },
  PersonalInfoFormProps
>(({ info, onUpdate }, ref) => {
  const [formData, setFormData] = useState<PersonalInfo>(info);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveChanges = () => {
    console.log("Saving personal info changes:", formData);
    onUpdate(formData);
  };

  // Expose saveChanges method via ref
  useImperativeHandle(ref, () => ({
    saveChanges,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
          value={formData.bio}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

PersonalInfoForm.displayName = "PersonalInfoForm";

interface AddressInfo {
  id?: string;
  country: string;
  cityState: string;
  postalCode: string;
  sellerId?: string;
}

interface AddressFormProps {
  address: AddressInfo;
  onUpdate: (data: AddressInfo) => void;
}

const AddressForm = forwardRef<{ saveChanges: () => void }, AddressFormProps>(
  ({ address, onUpdate }, ref) => {
    const [formData, setFormData] = useState<AddressInfo>(address);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const saveChanges = () => {
      console.log("Saving address changes:", formData);
      onUpdate(formData);
    };

    // Expose saveChanges method via ref
    useImperativeHandle(ref, () => ({
      saveChanges,
    }));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/State
            </label>
            <input
              type="text"
              name="cityState"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.cityState}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller ID
            </label>
            <input
              type="text"
              name="sellerId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              value={formData.sellerId}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  }
);

AddressForm.displayName = "AddressForm";

export default function AccountSettingsComponent() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const access_token = useSelector(
    (state: RootState) => state.auth.access_token
  );
  const refresh_token = useSelector(
    (state: RootState) => state.auth.refresh_token
  );

  // Use RTK Query hooks for fetching and updating user data
  const {
    data: userData,
    isLoading: loading,
    error: fetchError,
  } = useGetMeQuery(undefined);
  const [updateUser, { isLoading: updateLoading, error: updateErrorResult }] =
    useUpdateUserMutation();

  // Extract error message from RTK Query error
  const error = fetchError
    ? typeof fetchError === "object" && "data" in fetchError
      ? (fetchError.data as { error?: string })?.error ||
        "An unknown error occurred"
      : "Failed to fetch user data"
    : null;

  const updateError = updateErrorResult
    ? typeof updateErrorResult === "object" && "data" in updateErrorResult
      ? (updateErrorResult.data as { error?: string })?.error ||
        "Failed to update profile"
      : "Failed to update profile"
    : null;

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    profileImage: "/placeholder.svg?height=80&width=80",
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    country: "",
    cityState: "",
    postalCode: "",
    sellerId: "",
  });

  // Update local state when user data is fetched, and sync auth for header avatar
  useEffect(() => {
    if (!userData || !userData.data) return;

    const user = userData.data;

    // Sync auth slice with latest user from API (fixes header avatar after reload)
    dispatch(
      setUser({
        user: { ...user },
        access_token,
        refresh_token,
      })
    );

    // Update profile data
    setProfile({
      name: user.name || "",
      profileImage: user.profilePic || "/placeholder.svg?height=80&width=80",
    });

    // Update personal info
    const nameParts = (user.name || "").split(" ");
    setPersonalInfo({
      firstName: nameParts[0] || "",
      lastName: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
      email: user.email || "",
      phone: user.phoneNumber || "",
      bio: user.bio || "",
    });

    // Update address info if available
    if (user.addresses && user.addresses.length > 0) {
      const primaryAddress = user.addresses[0];
      setAddressInfo({
        id: primaryAddress.id,
        country: primaryAddress.country || "",
        cityState: primaryAddress.cityState || "",
        postalCode: primaryAddress.postalCode || "",
        sellerId: user.id || "",
      });
    }
  }, [userData, dispatch, access_token, refresh_token]);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    console.log("Updating profile with:", data);

    // Update local UI state first
    setProfile((prev) => ({
      ...prev,
      ...data,
    }));

    // Update name if first/last name changed
    if (data.name) {
      setPersonalInfo((prev) => ({
        ...prev,
        firstName: data.name?.split(" ")[0] || prev.firstName,
        lastName: data.name?.split(" ")[1] || prev.lastName,
      }));
    }

    // Prepare data for API update
    const apiUpdateData: Partial<UserWithRelations> = {
      profilePic: data.profileImage,
    };

    try {
      // Send update to server - use API response to update Redux with fresh user data
      const result = await updateUser(apiUpdateData).unwrap();
      setUpdateSuccess(true);

      if (result.data) {
        dispatch(
          setUser({
            user: result.data,
            access_token,
            refresh_token,
          })
        );
      }
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      // Error handling is managed by RTK Query
    }
  };

  const updatePersonalInfo = async (data: PersonalInfo) => {
    console.log("Updating personal info with:", data);

    // Update local UI state
    setPersonalInfo(data);
    setProfile((prev) => ({
      ...prev,
      name: `${data.firstName} ${data.lastName}`,
    }));

    // Prepare data for API update
    const apiUpdateData: Partial<UserWithRelations> = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phoneNumber: data.phone,
      bio: data.bio,
    };

    try {
      // Send update to server using RTK Query mutation
      await updateUser(apiUpdateData).unwrap();
      setUpdateSuccess(true);

      // Reset the success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating personal info:", err);
      // Error handling is managed by RTK Query
    }
  };

  const [createUserAddress, { isLoading: addressCreating }] =
    useCreateUserAddressMutation();
  const [updateUserAddress, { isLoading: addressUpdating }] =
    useUpdateUserAddressMutation();

  const updateAddress = async (data: AddressInfo) => {
    console.log("Updating address with:", data);

    // Update local UI state
    setAddressInfo(data);

    try {
      // Extract address data
      const { id, country, cityState, postalCode } = data;
      const addressData = { country, cityState, postalCode };

      let result;

      // If the address has an ID, update the existing address
      if (id) {
        console.log(`Updating existing address with ID: ${id}`);
        result = await updateUserAddress({ id, ...addressData }).unwrap();
        console.log("Address updated successfully:", result);
      }
      // If no ID but user has addresses, create a new one
      else if (!userData?.data?.addresses?.length) {
        console.log("User has no addresses, creating first address");
        result = await createUserAddress(addressData).unwrap();
        console.log("Address created successfully:", result);
      }
      // Otherwise create a new address
      else {
        console.log("Creating additional address");
        result = await createUserAddress(addressData).unwrap();
        console.log("Additional address created successfully:", result);
      }

      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  // References to form save methods
  const profileFormRef = useRef<{ saveChanges: () => void } | null>(null);
  const personalInfoFormRef = useRef<{ saveChanges: () => void } | null>(null);
  const addressFormRef = useRef<{ saveChanges: () => void } | null>(null);

  return (
    <>
      <h2 className="!text-[16px]">Account</h2>

      {/* Update Status Messages */}
      {updateSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">Profile updated successfully!</span>
        </div>
      )}

      {updateError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">Error: {updateError}</span>
        </div>
      )}

      {(updateLoading || addressCreating || addressUpdating) && (
        <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded relative mb-4 flex items-center">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent mr-2"></div>
          <span>Updating profile...</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 mt-5 flex justify-center items-center">
          <div className="text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2">Loading your profile data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg border border-red-200 p-6 mb-6 mt-5">
          <div className="text-red-600">
            <h3 className="font-bold">Error loading profile data</h3>
            <p>{error}</p>
            <button
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Profile Card */}
      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 mt-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={getProfileImageUrl(profile.profileImage, defaultAvatar)}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-base sm:text-lg font-bold uppercase">
                  {profile.name || "No Name"}
                </h2>
                <p className="text-blue-600 font-medium uppercase">
                  {userData?.data?.role}
                </p>
                <p className="text-gray-500 text-sm">
                  {userData?.data?.addresses?.[0]
                    ? `${userData?.data?.addresses?.[0]?.cityState}, ${userData?.data?.addresses?.[0]?.country}`
                    : "No location set"}
                </p>
              </div>
            </div>
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors text-sm sm:text-base"
              onClick={() => openModal("profile")}
            >
              Edit Profile Picture
            </button>
          </div>
        </div>
      )}

      {/* Personal Information */}
      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Personal Information
            </h2>
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors text-sm sm:text-base"
              onClick={() => openModal("personal")}
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <p className="text-gray-500 mb-1">First Name</p>
              <p className="font-medium uppercase">
                {personalInfo.firstName || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Last Name</p>
              <p className="font-medium uppercase">
                {personalInfo.lastName || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Email Address</p>
              <p className="font-medium">{personalInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Phone</p>
              <p className="font-medium">{personalInfo.phone || "Not set"}</p>
            </div>
            <div className="sm:col-span-2 col-span-1">
              <p className="text-gray-500 mb-1">Bio</p>
              <p className="font-medium">
                {personalInfo.bio || "No bio available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address */}
      {!loading && !error && userData?.data?.addresses?.length ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Address</h2>
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors text-sm sm:text-base"
              onClick={() => openModal("address")}
            >
              Update Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-gray-500 mb-1">Country</p>
              <p className="font-medium uppercase">
                {addressInfo.country || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">City/State</p>
              <p className="font-medium uppercase">
                {addressInfo.cityState || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Postal Code</p>
              <p className="font-medium">
                {addressInfo.postalCode || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">User ID</p>
              <p className="font-medium">
                {addressInfo.sellerId || "Not available"}
              </p>
            </div>
          </div>
        </div>
      ) : !loading && !error ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Address</h2>
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors text-sm sm:text-base"
              onClick={() => openModal("address")}
            >
              Add Address
            </button>
          </div>

          <p className="text-gray-500">
            No address information available. Click Add Address to add one.
          </p>
        </div>
      ) : null}

      {/* Modals */}
      <EditModal
        isOpen={activeModal === "profile"}
        onClose={closeModal}
        title="Edit Profile"
        onSave={() => profileFormRef.current?.saveChanges()}
      >
        <ProfileForm
          profile={profile}
          onUpdate={updateProfile}
          ref={profileFormRef}
        />
      </EditModal>

      <EditModal
        isOpen={activeModal === "personal"}
        onClose={closeModal}
        title="Edit Personal Information"
        onSave={() => personalInfoFormRef.current?.saveChanges()}
      >
        <PersonalInfoForm
          info={personalInfo}
          onUpdate={updatePersonalInfo}
          ref={personalInfoFormRef}
        />
      </EditModal>

      <EditModal
        isOpen={activeModal === "address"}
        onClose={closeModal}
        title={addressInfo.id ? "Update Address" : "Add Address"}
        onSave={() => addressFormRef.current?.saveChanges()}
      >
        <AddressForm
          address={addressInfo}
          onUpdate={updateAddress}
          ref={addressFormRef}
        />
      </EditModal>
    </>
  );
}
