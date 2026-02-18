import { logoutHandler } from "@/utils/handleLogout";
import { getProfileImageUrl } from "@/utils/imageUtils";
import { LogOut, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import icon from "@/assets/images/manicon.png";
import { StaticImageData } from "next/image";
interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface Profile01Props {
  name: string;
  role: string;
  avatar: string | StaticImageData;
  subscription?: string;
}

const defaultProfile = {
  name: "Admin",
  role: "Founder",
  avatar: icon,
  subscription: "Free Trial",
} satisfies Required<Profile01Props>;

export default function Profile01({
  name,
  role,
  avatar,
}: Partial<Profile01Props> = defaultProfile) {
  const menuItems: MenuItem[] = [];
  const userData = useSelector(selectCurrentUser);

  // Use Redux user data if available, otherwise use props or defaults
  const displayName = userData?.name || name || defaultProfile.name;
  const displayRole = userData?.role || role || defaultProfile.role;
  const displayAvatar = getProfileImageUrl(
    userData?.profilePic,
    avatar || defaultProfile.avatar
  ) as string | StaticImageData;

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <div className="relative w-full max-w-sm mx-auto z-[100000]">
      <div className="relative overflow-hidden rounded-lg border border-zinc-200  ">
        <div className="relative px-6 pt-6 pb-6 z-[999999]">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <Image
                src={displayAvatar}
                alt={displayName}
                width={72}
                height={72}
                className="rounded-full ring-4 ring-white object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white " />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 ">
                {displayName}
              </h2>
              <p className="text-zinc-600 ">{displayRole}</p>
            </div>
          </div>
          <div className="h-px bg-zinc-200 my-3" />
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 
                                    rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm lg:text-base font-medium text-zinc-700 ">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center">
                  {item.value && (
                    <span className="text-sm text-zinc-500 mr-2">
                      {item.value}
                    </span>
                  )}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50
                                rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="text-sm lg:text-base font-medium text-zinc-700 ">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
