// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button, Dropdown, Space, Badge, Input } from "antd";
// import { MenuOutlined, HeartOutlined } from "@ant-design/icons";
// import { FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import { IoSearch } from "react-icons/io5";
// import { LuImage } from "react-icons/lu";
// import { FiPackage } from "react-icons/fi";
// import { TbShoppingBag } from "react-icons/tb";

// import star from "@/assets/navbar/sparkles.png";
// import calender from "@/assets/navbar/calender.png";
// import mapIcon from "@/assets/navbar/map.png";
// import Logo from "@/assets/navbar/logo.png";
// import avt from "@/assets/navbar/down.png";
// import { CartModal } from "@/components/ui/CartModal/CartModal";
// import { LogOut, UserRound } from "lucide-react";
// import { LanguageSwitcher } from "@/lib/GoogleTranslatorProvider";
// import { RxDashboard } from "react-icons/rx";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutHandler } from "@/utils/handleLogout";
// import { Currency, setCurrency } from "@/redux/reducers/currencySlice";
// import { RootState } from "@/redux/store";
// import {
//   selectCurrentUser,
//   useCurrentToken,
// } from "@/redux/features/auth/authSlice";
// // import { RootState } from "@/redux/store";

// type Location = {
//   city?: string;
//   country?: string;
// };

// interface CartItem {
//   id: string;
//   name: string;
//   title: string;
//   price: string;
//   image: string;
//   quantity: number;
//   brand?: string;
//   size?: string;
//   currency?: string;
// }

// export default function Header() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const navContainerRef = useRef<HTMLDivElement>(null);
//   const [hasScrolledRight, setHasScrolledRight] = useState(false);
//   const [desktopCatalogueOpen, setDesktopCatalogueOpen] = useState(false);
//   const [mobileCatalogueOpen, setMobileCatalogueOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [cartItemCount, setCartItemCount] = useState(0);

//   const [location, setLocation] = useState<Location>({});

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;

//         // Call reverse geocoding API here
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//         );
//         const data = await res.json();

//         setLocation({
//           city:
//             data.address.city ||
//             data.address.town ||
//             data.address.village ||
//             "",
//           country: data.address.country || "",
//         });
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const updateCart = () => {
//       try {
//         const storedCart = localStorage.getItem("cart");
//         if (storedCart) {
//           const parsedCart = JSON.parse(storedCart);
//           setCartItems(parsedCart);

//           const totalItems = parsedCart.reduce(
//             (total: number, item: CartItem) => total + item.quantity,
//             0
//           );
//           setCartItemCount(totalItems);
//         }
//       } catch (error) {
//         console.error("Error loading cart data:", error);
//       }
//     };

//     updateCart();

//     window.addEventListener("storage", updateCart);

//     window.addEventListener("cartUpdated", updateCart);

//     return () => {
//       window.removeEventListener("storage", updateCart);
//       window.removeEventListener("cartUpdated", updateCart);
//     };
//   }, []);

//   const openCartModal = () => {
//     try {
//       const storedCart = localStorage.getItem("cart");
//       if (storedCart) {
//         const parsedCart = JSON.parse(storedCart);

//         const formattedCartItems = parsedCart.map((item: CartItem) => ({
//           id: item.id,
//           name: item.title,
//           brand: item.brand ?? "Brand",
//           size: item.size || "Default",
//           price: parseFloat(item.price.replace(/[^0-9.]/g, "")),
//           currency: item.currency || "USD",
//           image: item.image,
//           quantity: item.quantity,
//         }));

//         setCartItems(formattedCartItems);
//       }
//     } catch (error) {
//       console.error("Error loading cart data:", error);
//     }

//     setIsCartOpen(true);
//   };

//   const closeCartModal = () => {
//     setIsCartOpen(false);
//   };

//   const globalCurrency = useSelector(
//     (state: RootState) => state.currency.currency
//   );

//   const currencyItems: { key: Currency; label: Currency }[] = [
//     { key: "USD", label: "USD" },
//     { key: "EUR", label: "EUR" },
//     { key: "MDL", label: "MDL" },
//   ];

//   const navItems = [
//     "ELECTRONICS & GADGETS",
//     "FASHION & ACCESSORIES",
//     "HOME & LIVING",
//     "HEALTH & WELLNESS",
//     "SPORTS & OUTDOORS",
//     "Books & Media",
//     "Groceries & Food",
//     "Automotive",
//     "Office & School Supplies",
//     "Pet Supplies",
//     "Travel & Luggage",
//     "Gifts & Occasions",
//   ];

//   const catalogueItems = [
//     {
//       key: "1",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "ELECTRONICS & GADGETS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Electronics & Gadgets
//         </Link>
//       ),
//     },
//     {
//       key: "2",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "FASHION & ACCESSORIES"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Fashion & Accessories
//         </Link>
//       ),
//     },
//     {
//       key: "3",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("HOME & LIVING")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Home & Living
//         </Link>
//       ),
//     },
//     {
//       key: "4",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "HEALTH & WELLNESS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Health & Wellness
//         </Link>
//       ),
//     },
//     {
//       key: "5",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "SPORTS & OUTDOORS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Sports & Outdoors
//         </Link>
//       ),
//     },
//     {
//       key: "6",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("BOOKS & MEDIA")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Books & Media
//         </Link>
//       ),
//     },
//     {
//       key: "7",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "GROCERIES & FOOD"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Groceries & Food
//         </Link>
//       ),
//     },
//     {
//       key: "8",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("AUTOMOTIVE")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Automotive
//         </Link>
//       ),
//     },
//     {
//       key: "9",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "OFFICE & SCHOOL SUPPLIES"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Office & School Supplies
//         </Link>
//       ),
//     },
//     {
//       key: "10",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("PET SUPPLIES")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Pet Supplies
//         </Link>
//       ),
//     },
//     {
//       key: "11",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "TRAVEL & LUGGAGE"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Travel & Luggage
//         </Link>
//       ),
//     },
//     {
//       key: "12",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "GIFTS & OCCASIONS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Gifts & Occasions
//         </Link>
//       ),
//     },
//   ];

//   const handleSlide = (direction: "left" | "right") => {
//     if (navContainerRef.current) {
//       const container = navContainerRef.current;
//       const scrollAmount = 200;

//       if (direction === "left" && hasScrolledRight) {
//         container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
//       } else if (direction === "right") {
//         container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//         setHasScrolledRight(true);
//       }

//       if (
//         container.scrollLeft + container.clientWidth >=
//         container.scrollWidth
//       ) {
//         container.scrollTo({ left: 0, behavior: "smooth" });
//       }
//     }
//   };

//   const user = useSelector(selectCurrentUser);
//   const accessToken = useSelector(useCurrentToken);
//   const isAuthenticated = !!user && !!accessToken;
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     logoutHandler(dispatch, router);
//     window.dispatchEvent(new Event("logout"));
//   };

//   // search function
//   const handleSearch = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();

//     if (searchQuery.trim()) {
//       // Navigate to all-product page with search query
//       router.push(`/all-product?search=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   //
//   const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // For favorites and orders - keep localStorage for now
//   const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
//   const favtLength = favorites ? favorites.length : 0;

//   const orderData = JSON.parse(localStorage.getItem("orders") || "[]");
//   const orderLength = orderData ? orderData.length : 0;

//   return (
//     <div>
//       <header className="w-full bg-[#ECF7FF] pt-2 pb-4 poppins xl:px-20 font-poppins">
//         {/* Top bar */}
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
//           <div className="flex items-center gap-2 md:gap-4">
//             {/* Language selector */}
//             <LanguageSwitcher />

//             {/* Currency selector */}
//             <Dropdown
//               menu={{
//                 items: currencyItems,
//                 defaultValue: "MDL",
//                 onClick: ({ key }) => {
//                   dispatch(setCurrency(key as Currency));
//                 },
//               }}
//               placement="bottomLeft"
//             >
//               <Button
//                 size="small"
//                 className="flex items-center px-3 !py-4 rounded-[5px] bg-[#005BFF14] border-none hover:!bg-[#005BFF14]"
//               >
//                 <Space className="flex items-center">
//                   <span className="text-primary text-sm font-medium">
//                     {globalCurrency}
//                   </span>
//                   <FaAngleDown className="text-primary font-bold text-xs" />
//                 </Space>
//               </Button>
//             </Dropdown>
//           </div>

//           {/* Location */}
//           {/* Location */}
//           <div className="flex items-center text-sm">
//             <button className="flex items-center text-sm font-medium text-primary gap-1">
//               <Image
//                 src={mapIcon}
//                 alt="Map"
//                 width={25}
//                 height={25}
//                 className="w-5 md:w-6"
//               />
//               {location.city && location.country
//                 ? `${location.city}, ${location.country}`
//                 : "Detecting..."}
//             </button>
//           </div>
//         </div>

//         {/* Main header */}
//         <div className="container mx-auto pt-2 pb-4 flex flex-col lg:flex-row items-center justify-between gap-3">
//           {/* Logo */}
//           <Link href="/" className="flex-shrink-0">
//             <div className="flex items-center">
//               <Image
//                 src={Logo}
//                 alt="Logo"
//                 width={130}
//                 height={100}
//                 className="w-44 lg:block hidden"
//               />
//               <div className="text-primary font-bold tracking-wide text-[28px] md:text-4xl block lg:hidden">
//                 Gemelli
//               </div>
//             </div>
//           </Link>

//           <div className="flex items-center gap-8 w-full justify-center lg:justify-between lg:w-[75%]">
//             {/* Search */}
//             <div className="relative flex-grow max-w-2xl w-full">
//               <Input
//                 placeholder="Search in AXL"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleSearchKeyPress}
//                 className="py-2 pl-5"
//                 style={{
//                   borderRadius: "32px",
//                   border: "none",
//                 }}
//                 suffix={
//                   <div className="flex items-center gap-1">
//                     <Button
//                       type="text"
//                       icon={
//                         <LuImage className="text-2xl opacity-50 rounded mt-1" />
//                       }
//                     />
//                     <div className="bg-[#b4d2ff]/50 hover:!bg-[#b4d2ff]/50 rounded-full flex items-center justify-center p-1">
//                       <Button
//                         type="text"
//                         className="!bg-none hover:!bg-transparent"
//                         icon={
//                           <IoSearch className="!text-primary text-xl mt-1" />
//                         }
//                         onClick={handleSearch}
//                       />
//                     </div>
//                   </div>
//                 }
//               />
//             </div>

//             {/* Desktop Icons */}
//             <div className="lg:flex items-center gap-3 hidden">
//               <Badge count={favtLength}>
//                 <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                   <Link href={"/wishlist"}>
//                     <Button
//                       type="text"
//                       className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                       icon={
//                         <HeartOutlined
//                           style={{ fontSize: "22px", color: "#666" }}
//                         />
//                       }
//                     />
//                   </Link>
//                 </div>
//               </Badge>

//               <Badge count={orderLength} style={{ backgroundColor: "#4046DE" }}>
//                 <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                   <Link href={"/order-details"}>
//                     <Button
//                       type="text"
//                       className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                       icon={
//                         <FiPackage
//                           style={{ fontSize: "22px", color: "#666" }}
//                         />
//                       }
//                     />
//                   </Link>
//                 </div>
//               </Badge>

//               {/* Cart Icon - Now with onClick to open modal */}
//               <Badge count={cartItemCount}>
//                 <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                   <Button
//                     type="text"
//                     className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                     icon={
//                       <TbShoppingBag
//                         style={{ fontSize: "24px", color: "#666" }}
//                       />
//                     }
//                     onClick={openCartModal}
//                   />
//                 </div>
//               </Badge>

//               {isAuthenticated ? (
//                 <Dropdown
//                   menu={{
//                     items: [
//                       ...(user?.role === "SELLER"
//                         ? [
//                             {
//                               key: "1",
//                               label: (
//                                 <Link href="/dashboard" className="text-lg">
//                                   <span className="flex items-center gap-2">
//                                     <RxDashboard size={18} /> Dashboard
//                                   </span>
//                                 </Link>
//                               ),
//                             },
//                           ]
//                         : []),
//                       {
//                         key: "2",
//                         label: (
//                           <div
//                             onClick={handleLogout}
//                             className="text-red-500 text-lg"
//                           >
//                             <span className="flex items-center gap-2">
//                               <LogOut size={18} />
//                               Logout
//                             </span>
//                           </div>
//                         ),
//                       },
//                     ],
//                   }}
//                   placement="bottomRight"
//                   trigger={["click"]}
//                 >
//                   <div className="bg-white rounded-[28px] py-3 flex items-center justify-center overflow-hidden cursor-pointer">
//                     <Button
//                       type="text"
//                       className="flex items-center justify-center hover:!bg-white"
//                     >
//                       <div className="w-10 h-10 rounded-full overflow-hidden">
//                         <Image
//                           src={getProfileImageUrl(user?.profilePic, avt)}
//                           alt={user?.name || "User"}
//                           width={100}
//                           height={100}
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                       <span className="font-medium !text-base pr-3">
//                         {user?.name || "Account"}
//                       </span>
//                     </Button>
//                   </div>
//                 </Dropdown>
//               ) : (
//                 <Dropdown
//                   menu={{
//                     items: [
//                       {
//                         key: "1",
//                         label: (
//                           <Link href="/login" className="text-lg">
//                             <span className="flex items-center gap-2">
//                               <UserRound size={18} /> Login
//                             </span>
//                           </Link>
//                         ),
//                       },
//                       {
//                         key: "2",
//                         label: (
//                           <Link href="/signup" className="text-lg">
//                             <span className="flex items-center gap-2">
//                               <UserRound size={18} /> Sign Up
//                             </span>
//                           </Link>
//                         ),
//                       },
//                     ],
//                   }}
//                   placement="bottomRight"
//                   trigger={["click"]}
//                 >
//                   <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                     <Button
//                       type="text"
//                       className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                       icon={<UserRound style={{ color: "#666" }} />}
//                     />
//                   </div>
//                 </Dropdown>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="pt-1 md:pt-2">
//           <div className="container mx-auto md:px-4 flex items-center gap-6">
//             <div className="flex items-center justify-between w-full lg:w-auto">
//               <div className="hidden md:flex items-center gap-3 lg:w-[300px]">
//                 <Dropdown
//                   menu={{ items: catalogueItems }}
//                   trigger={["click"]}
//                   open={desktopCatalogueOpen}
//                   onOpenChange={(visible) => setDesktopCatalogueOpen(visible)}
//                   placement="bottomLeft"
//                   overlayStyle={{
//                     width: 256,
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                   }}
//                 >
//                   <div
//                     className="flex items-center gap-3 h-12 rounded-lg w-[190px] cursor-pointer"
//                     style={{
//                       background: "#005BFF",
//                       border: "none",
//                       padding: "0 16px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <MenuOutlined className="text-white text-xs md:text-base" />
//                     <span className="text-white text-xs md:text-base font-medium">
//                       Catalogue
//                     </span>
//                   </div>
//                 </Dropdown>
//                 <div className="bg-[#005BFF14] flex items-center justify-center p-[10px] rounded-[10px]">
//                   <Image src={star} alt="star" className="w-7" />
//                 </div>
//                 <div className="bg-[#005BFF14] flex items-center justify-center p-[10px] rounded-[10px]">
//                   <Image src={calender} alt="calendar" className="w-7" />
//                 </div>
//               </div>

//               {/* Mobile view - Catalogue dropdown */}
//               <div className="md:hidden flex items-center">
//                 <Dropdown
//                   menu={{ items: catalogueItems }}
//                   trigger={["click"]}
//                   open={mobileCatalogueOpen}
//                   onOpenChange={(visible) => setMobileCatalogueOpen(visible)}
//                   placement="bottomLeft"
//                   overlayStyle={{
//                     width: 256,
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                   }}
//                 >
//                   <div
//                     className="flex items-center gap-2 h-10 rounded-lg cursor-pointer"
//                     style={{
//                       background: "#005BFF",
//                       border: "none",
//                       padding: "0 12px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <MenuOutlined className="text-white text-sm" />
//                     <span className="text-white text-sm font-medium md:text-base">
//                       Catalogue
//                     </span>
//                   </div>
//                 </Dropdown>
//               </div>

//               {/* Right side icons - mobile */}
//               <div className="flex items-center gap-2 lg:hidden ">
//                 <Badge count={favtLength} size="small">
//                   <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                     <Link href={"/wishlist"}>
//                       <Button
//                         type="text"
//                         className="flex items-center justify-center p-0 m-0 hover:!bg-white"
//                         icon={
//                           <HeartOutlined
//                             style={{ fontSize: "17px", color: "#666" }}
//                           />
//                         }
//                       />
//                     </Link>
//                   </div>
//                 </Badge>

//                 <Badge
//                   count={orderLength}
//                   style={{ backgroundColor: "#4046DE" }}
//                   size="small"
//                 >
//                   <Link href={"/order-details"}>
//                     <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                       <Button
//                         type="text"
//                         className="flex items-center justify-center p-0 m-0 hover:!bg-white"
//                         icon={
//                           <FiPackage
//                             style={{ fontSize: "20px", color: "#666" }}
//                           />
//                         }
//                       />
//                     </div>
//                   </Link>
//                 </Badge>

//                 {/* Mobile Cart Icon - with onClick to open modal */}
//                 <Badge count={cartItemCount} size="small">
//                   <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                     <Button
//                       type="text"
//                       className="flex items-center justify-center p-0 m-0 hover:!bg-white"
//                       icon={
//                         <TbShoppingBag
//                           style={{ fontSize: "21px", color: "#666" }}
//                         />
//                       }
//                       onClick={openCartModal}
//                     />
//                   </div>
//                 </Badge>

//                 {/* small device avatar show but when login avatar show otherwise handle it with any icon */}
//                 {/* Mobile avatar/login dropdown */}
//                 <div className="rounded-full flex items-center justify-center">
//                   {isAuthenticated ? (
//                     <Dropdown
//                       menu={{
//                         items: [
//                           ...(user?.role === "SELLER"
//                             ? [
//                                 {
//                                   key: "1",
//                                   label: (
//                                     <Link href="/dashboard" className="text-sm">
//                                       <span className="flex items-center gap-2">
//                                         Dashboard
//                                       </span>
//                                     </Link>
//                                   ),
//                                 },
//                               ]
//                             : []),
//                           {
//                             key: "2",
//                             label: (
//                               <div
//                                 onClick={handleLogout}
//                                 className="text-red-500 text-sm"
//                               >
//                                 <span className="flex items-center gap-2">
//                                   Logout
//                                 </span>
//                               </div>
//                             ),
//                           },
//                         ],
//                       }}
//                       placement="bottomRight"
//                       trigger={["click"]}
//                     >
//                       <Button
//                         type="text"
//                         className="flex items-center hover:!bg-white p-0"
//                       >
//                         <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden">
//                           <Image
//                             src={getProfileImageUrl(user?.profilePic, avt)}
//                             alt={user?.name || "User"}
//                             width={40}
//                             height={40}
//                             className="object-cover w-full h-full"
//                           />
//                         </div>
//                       </Button>
//                     </Dropdown>
//                   ) : (
//                     // Show dropdown menu when not logged in
//                     <Dropdown
//                       menu={{
//                         items: [
//                           {
//                             key: "1",
//                             label: (
//                               <Link href="/login" className="text-sm ">
//                                 Login
//                               </Link>
//                             ),
//                           },
//                           {
//                             key: "2",
//                             label: (
//                               <Link href="/signup" className="text-sm">
//                                 Sign Up
//                               </Link>
//                             ),
//                           },
//                         ],
//                       }}
//                       placement="bottomRight"
//                       trigger={["click"]}
//                     >
//                       <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                         <Button
//                           type="text"
//                           className="flex items-center justify-center hover:!bg-transparent p-0"
//                           icon={
//                             <UserRound
//                               size={20}
//                               style={{ fontSize: "20px", color: "#666" }}
//                             />
//                           }
//                         />
//                       </div>
//                     </Dropdown>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Navigation items with scroll */}
//             <div className="hidden lg:flex items-center gap-4 overflow-hidden">
//               <button
//                 onClick={() => handleSlide("left")}
//                 className="bg-[#005BFF14] flex items-center justify-center rounded-full p-2 cursor-pointer"
//                 disabled={!hasScrolledRight}
//               >
//                 <FaAngleLeft />
//               </button>

//               <div
//                 ref={navContainerRef}
//                 className="flex items-center gap-4 overflow-x-auto scroll-smooth"
//                 style={{ scrollBehavior: "smooth" }}
//               >
//                 {navItems.map((item, index) => (
//                   <NavItem key={index} label={item} />
//                 ))}
//               </div>

//               <button
//                 onClick={() => handleSlide("right")}
//                 className="bg-[#005BFF14] flex items-center justify-center rounded-full p-2"
//               >
//                 <FaAngleRight />
//               </button>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* Cart Modal */}
//       <CartModal
//         isOpen={isCartOpen}
//         onClose={closeCartModal}
//         items={cartItems}
//       />
//     </div>
//   );
// }

// // In your Header component, modify the NavItem component
// function NavItem({ label }: { label: string }) {
//   return (
//     <Link href={`/all-product?category=${encodeURIComponent(label)}`}>
//       <Button
//         type="text"
//         className="h-12 xl:px-7 2xl:px-8 rounded-none font-medium text-base text-[#0F0F0F] hover:!bg-[#ECF7FF] hover:!text-primary"
//       >
//         {label}
//       </Button>
//     </Link>
//   );
// }

// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button, Dropdown, Space, Badge, Input } from "antd";
// import { MenuOutlined, HeartOutlined } from "@ant-design/icons";
// import { FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import { IoSearch } from "react-icons/io5";
// import { LuImage } from "react-icons/lu";
// import { FiPackage } from "react-icons/fi";
// import { TbShoppingBag } from "react-icons/tb";

// import star from "@/assets/navbar/sparkles.png";
// import calender from "@/assets/navbar/calender.png";
// import mapIcon from "@/assets/navbar/map.png";
// import Logo from "@/assets/navbar/logo.png";
// import avt from "@/assets/navbar/down.png";
// import { CartModal } from "@/components/ui/CartModal/CartModal";
// import { LogOut, UserRound } from "lucide-react";
// import { LanguageSwitcher } from "@/lib/GoogleTranslatorProvider";
// import { RxDashboard } from "react-icons/rx";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutHandler } from "@/utils/handleLogout";
// import { Currency, setCurrency } from "@/redux/reducers/currencySlice";
// import { RootState } from "@/redux/store";
// import {
//   selectCurrentUser,
//   useCurrentToken,
// } from "@/redux/features/auth/authSlice";
// import { useGetCartQuery } from "@/redux/features/cart/cartApi";

// type Location = {
//   city?: string;
//   country?: string;
// };

// interface CartItem {
//   id: string;
//   name: string;
//   title: string;
//   price: string | number;
//   image: string;
//   quantity: number;
//   brand?: string;
//   size?: string;
//   currency?: string;
// }

// export default function Header() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const navContainerRef = useRef<HTMLDivElement>(null);
//   const [hasScrolledRight, setHasScrolledRight] = useState(false);
//   const [desktopCatalogueOpen, setDesktopCatalogueOpen] = useState(false);
//   const [mobileCatalogueOpen, setMobileCatalogueOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
//   const [cartItemCount, setCartItemCount] = useState(0);

//   const [location, setLocation] = useState<Location>({});

//   // Authentication check
//   const user = useSelector(selectCurrentUser);
//   const accessToken = useSelector(useCurrentToken);
//   const isAuthenticated = !!user && !!accessToken;
//   const router = useRouter();
//   const dispatch = useDispatch();

//   // Fetch cart from database if authenticated
//   const { data: cartData } = useGetCartQuery(undefined, {
//     skip: !isAuthenticated,
//   });

//   const dbCartItems = cartData?.data?.cart?.items || [];

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;

//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//         );
//         const data = await res.json();

//         setLocation({
//           city:
//             data.address.city ||
//             data.address.town ||
//             data.address.village ||
//             "",
//           country: data.address.country || "",
//         });
//       });
//     }
//   }, []);

//   // Update cart count for authenticated users
//   useEffect(() => {
//     if (isAuthenticated && dbCartItems) {
//       const totalItems = dbCartItems.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );
//       setCartItemCount(totalItems);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated, dbCartItems.length]);

//   // Update cart count for non-authenticated users
//   useEffect(() => {
//     if (!isAuthenticated) {
//       const updateLocalCart = () => {
//         try {
//           const storedCart = localStorage.getItem("cart");
//           if (storedCart) {
//             const parsedCart = JSON.parse(storedCart);
//             setLocalCartItems(parsedCart);

//             const totalItems = parsedCart.reduce(
//               (total: number, item: CartItem) => total + item.quantity,
//               0
//             );
//             setCartItemCount(totalItems);
//           } else {
//             setLocalCartItems([]);
//             setCartItemCount(0);
//           }
//         } catch (error) {
//           console.error("Error loading cart data:", error);
//           setLocalCartItems([]);
//           setCartItemCount(0);
//         }
//       };

//       updateLocalCart();

//       window.addEventListener("storage", updateLocalCart);
//       window.addEventListener("cartUpdated", updateLocalCart);

//       return () => {
//         window.removeEventListener("storage", updateLocalCart);
//         window.removeEventListener("cartUpdated", updateLocalCart);
//       };
//     }
//   }, [isAuthenticated]);

//   const openCartModal = () => {
//     if (!isAuthenticated) {
//       // For non-authenticated users, refresh localStorage cart
//       try {
//         const storedCart = localStorage.getItem("cart");
//         if (storedCart) {
//           const parsedCart = JSON.parse(storedCart);
//           setLocalCartItems(parsedCart);
//         }
//       } catch (error) {
//         console.error("Error loading cart data:", error);
//       }
//     }
//     // For authenticated users, CartModal will handle fetching from database
//     setIsCartOpen(true);
//   };

//   const closeCartModal = () => {
//     setIsCartOpen(false);
//   };

//   const globalCurrency = useSelector(
//     (state: RootState) => state.currency.currency
//   );

//   const currencyItems: { key: Currency; label: Currency }[] = [
//     { key: "USD", label: "USD" },
//     { key: "EUR", label: "EUR" },
//     { key: "MDL", label: "MDL" },
//   ];

//   const navItems = [
//     "ELECTRONICS & GADGETS",
//     "FASHION & ACCESSORIES",
//     "HOME & LIVING",
//     "HEALTH & WELLNESS",
//     "SPORTS & OUTDOORS",
//     "Books & Media",
//     "Groceries & Food",
//     "Automotive",
//     "Office & School Supplies",
//     "Pet Supplies",
//     "Travel & Luggage",
//     "Gifts & Occasions",
//   ];

//   const catalogueItems = [
//     {
//       key: "1",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "ELECTRONICS & GADGETS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Electronics & Gadgets
//         </Link>
//       ),
//     },
//     {
//       key: "2",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "FASHION & ACCESSORIES"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Fashion & Accessories
//         </Link>
//       ),
//     },
//     {
//       key: "3",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("HOME & LIVING")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Home & Living
//         </Link>
//       ),
//     },
//     {
//       key: "4",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "HEALTH & WELLNESS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Health & Wellness
//         </Link>
//       ),
//     },
//     {
//       key: "5",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "SPORTS & OUTDOORS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Sports & Outdoors
//         </Link>
//       ),
//     },
//     {
//       key: "6",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("BOOKS & MEDIA")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Books & Media
//         </Link>
//       ),
//     },
//     {
//       key: "7",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "GROCERIES & FOOD"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Groceries & Food
//         </Link>
//       ),
//     },
//     {
//       key: "8",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("AUTOMOTIVE")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Automotive
//         </Link>
//       ),
//     },
//     {
//       key: "9",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "OFFICE & SCHOOL SUPPLIES"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Office & School Supplies
//         </Link>
//       ),
//     },
//     {
//       key: "10",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent("PET SUPPLIES")}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Pet Supplies
//         </Link>
//       ),
//     },
//     {
//       key: "11",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "TRAVEL & LUGGAGE"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Travel & Luggage
//         </Link>
//       ),
//     },
//     {
//       key: "12",
//       label: (
//         <Link
//           href={`/all-product?category=${encodeURIComponent(
//             "GIFTS & OCCASIONS"
//           )}`}
//           className="text-sm md:text-base font-medium uppercase font-poppins"
//         >
//           Gifts & Occasions
//         </Link>
//       ),
//     },
//   ];

//   const handleSlide = (direction: "left" | "right") => {
//     if (navContainerRef.current) {
//       const container = navContainerRef.current;
//       const scrollAmount = 200;

//       if (direction === "left" && hasScrolledRight) {
//         container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
//       } else if (direction === "right") {
//         container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//         setHasScrolledRight(true);
//       }

//       if (
//         container.scrollLeft + container.clientWidth >=
//         container.scrollWidth
//       ) {
//         container.scrollTo({ left: 0, behavior: "smooth" });
//       }
//     }
//   };

//   const handleLogout = () => {
//     logoutHandler(dispatch, router);
//     window.dispatchEvent(new Event("logout"));
//   };

//   const handleSearch = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();

//     if (searchQuery.trim()) {
//       router.push(`/all-product?search=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // For favorites and orders - keep localStorage for now
//   const [favtLength, setFavtLength] = useState(0);
//   const [orderLength, setOrderLength] = useState(0);

//   useEffect(() => {
//     try {
//       const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
//       setFavtLength(favorites ? favorites.length : 0);

//       const orderData = JSON.parse(localStorage.getItem("orders") || "[]");
//       setOrderLength(orderData ? orderData.length : 0);
//     } catch (error) {
//       console.error("Error loading favorites or orders:", error);
//     }
//   }, []);

//   return (
//     <div>
//       <header className="w-full bg-[#ECF7FF] pt-2 pb-4 poppins xl:px-20 font-poppins">
//         {/* Top bar */}
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
//           <div className="flex items-center gap-2 md:gap-4">
//             {/* Language selector */}
//             <LanguageSwitcher />

//             {/* Currency selector */}
//             <Dropdown
//               menu={{
//                 items: currencyItems,
//                 defaultValue: "MDL",
//                 onClick: ({ key }) => {
//                   dispatch(setCurrency(key as Currency));
//                 },
//               }}
//               placement="bottomLeft"
//             >
//               <Button
//                 size="small"
//                 className="flex items-center px-3 !py-4 rounded-[5px] bg-[#005BFF14] border-none hover:!bg-[#005BFF14]"
//               >
//                 <Space className="flex items-center">
//                   <span className="text-primary text-sm font-medium">
//                     {globalCurrency}
//                   </span>
//                   <FaAngleDown className="text-primary font-bold text-xs" />
//                 </Space>
//               </Button>
//             </Dropdown>
//           </div>

//           {/* Location */}
//           <div className="flex items-center text-sm">
//             <button className="flex items-center text-sm font-medium text-primary gap-1">
//               <Image
//                 src={mapIcon}
//                 alt="Map"
//                 width={25}
//                 height={25}
//                 className="w-5 md:w-6"
//               />
//               {location.city && location.country
//                 ? `${location.city}, ${location.country}`
//                 : "Detecting..."}
//             </button>
//           </div>
//         </div>

//         {/* Main header */}
//         <div className="container mx-auto pt-2 pb-4 flex flex-col lg:flex-row items-center justify-between gap-3">
//           {/* Logo */}
//           <Link href="/" className="flex-shrink-0">
//             <div className="flex items-center">
//               <Image
//                 src={Logo}
//                 alt="Logo"
//                 width={130}
//                 height={100}
//                 className="w-44 lg:block hidden"
//               />
//               <div className="text-primary font-bold tracking-wide text-[28px] md:text-4xl block lg:hidden">
//                 Gemelli
//               </div>
//             </div>
//           </Link>

//           <div className="flex items-center gap-8 w-full justify-center lg:justify-between lg:w-[75%]">
//             {/* Search */}
//             <div className="relative flex-grow max-w-2xl w-full">
//               <Input
//                 placeholder="Search in AXL"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleSearchKeyPress}
//                 className="py-2 pl-5"
//                 style={{
//                   borderRadius: "32px",
//                   border: "none",
//                 }}
//                 suffix={
//                   <div className="flex items-center gap-1">
//                     <Button
//                       type="text"
//                       icon={
//                         <LuImage className="text-2xl opacity-50 rounded mt-1" />
//                       }
//                     />
//                     <div className="bg-[#b4d2ff]/50 hover:!bg-[#b4d2ff]/50 rounded-full flex items-center justify-center p-1">
//                       <Button
//                         type="text"
//                         className="!bg-none hover:!bg-transparent"
//                         icon={
//                           <IoSearch className="!text-primary text-xl mt-1" />
//                         }
//                         onClick={handleSearch}
//                       />
//                     </div>
//                   </div>
//                 }
//               />
//             </div>

//             {/* Desktop Icons */}
//             <div className="lg:flex items-center gap-3 hidden">
//               <Badge count={favtLength}>
//                 <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                   <Link href={"/wishlist"}>
//                     <Button
//                       type="text"
//                       className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                       icon={
//                         <HeartOutlined
//                           style={{ fontSize: "22px", color: "#666" }}
//                         />
//                       }
//                     />
//                   </Link>
//                 </div>
//               </Badge>

//               <Badge count={orderLength} style={{ backgroundColor: "#4046DE" }}>
//                 <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                   <Link href={"/order-details"}>
//                     <Button
//                       type="text"
//                       className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                       icon={
//                         <FiPackage
//                           style={{ fontSize: "22px", color: "#666" }}
//                         />
//                       }
//                     />
//                   </Link>
//                 </div>
//               </Badge>

//               {/* Cart Icon */}
//               <Badge count={cartItemCount}>
//                 <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                   <Button
//                     type="text"
//                     className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                     icon={
//                       <TbShoppingBag
//                         style={{ fontSize: "24px", color: "#666" }}
//                       />
//                     }
//                     onClick={openCartModal}
//                   />
//                 </div>
//               </Badge>

//               {isAuthenticated ? (
//                 <Dropdown
//                   menu={{
//                     items: [
//                       ...(user?.role === "SELLER"
//                         ? [
//                             {
//                               key: "1",
//                               label: (
//                                 <Link href="/dashboard" className="text-lg">
//                                   <span className="flex items-center gap-2">
//                                     <RxDashboard size={18} /> Dashboard
//                                   </span>
//                                 </Link>
//                               ),
//                             },
//                           ]
//                         : []),
//                       {
//                         key: "2",
//                         label: (
//                           <div
//                             onClick={handleLogout}
//                             className="text-red-500 text-lg"
//                           >
//                             <span className="flex items-center gap-2">
//                               <LogOut size={18} />
//                               Logout
//                             </span>
//                           </div>
//                         ),
//                       },
//                     ],
//                   }}
//                   placement="bottomRight"
//                   trigger={["click"]}
//                 >
//                   <div className="bg-white rounded-[28px] py-3 flex items-center justify-center overflow-hidden cursor-pointer">
//                     <Button
//                       type="text"
//                       className="flex items-center justify-center hover:!bg-white"
//                     >
//                       <div className="w-10 h-10 rounded-full overflow-hidden">
//                         <Image
//                           src={getProfileImageUrl(user?.profilePic, avt)}
//                           alt={user?.name || "User"}
//                           width={100}
//                           height={100}
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                       <span className="font-medium !text-base pr-3">
//                         {user?.name || "Account"}
//                       </span>
//                     </Button>
//                   </div>
//                 </Dropdown>
//               ) : (
//                 <Dropdown
//                   menu={{
//                     items: [
//                       {
//                         key: "1",
//                         label: (
//                           <Link href="/login" className="text-lg">
//                             <span className="flex items-center gap-2">
//                               <UserRound size={18} /> Login
//                             </span>
//                           </Link>
//                         ),
//                       },
//                       {
//                         key: "2",
//                         label: (
//                           <Link href="/signup" className="text-lg">
//                             <span className="flex items-center gap-2">
//                               <UserRound size={18} /> Sign Up
//                             </span>
//                           </Link>
//                         ),
//                       },
//                     ],
//                   }}
//                   placement="bottomRight"
//                   trigger={["click"]}
//                 >
//                   <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
//                     <Button
//                       type="text"
//                       className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
//                       icon={<UserRound style={{ color: "#666" }} />}
//                     />
//                   </div>
//                 </Dropdown>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="pt-1 md:pt-2">
//           <div className="container mx-auto md:px-4 flex items-center gap-6">
//             <div className="flex items-center justify-between w-full lg:w-auto">
//               <div className="hidden md:flex items-center gap-3 lg:w-[300px]">
//                 <Dropdown
//                   menu={{ items: catalogueItems }}
//                   trigger={["click"]}
//                   open={desktopCatalogueOpen}
//                   onOpenChange={(visible) => setDesktopCatalogueOpen(visible)}
//                   placement="bottomLeft"
//                   overlayStyle={{
//                     width: 256,
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                   }}
//                 >
//                   <div
//                     className="flex items-center gap-3 h-12 rounded-lg w-[190px] cursor-pointer"
//                     style={{
//                       background: "#005BFF",
//                       border: "none",
//                       padding: "0 16px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <MenuOutlined className="text-white text-xs md:text-base" />
//                     <span className="text-white text-xs md:text-base font-medium">
//                       Catalogue
//                     </span>
//                   </div>
//                 </Dropdown>
//                 <div className="bg-[#005BFF14] flex items-center justify-center p-[10px] rounded-[10px]">
//                   <Image src={star} alt="star" className="w-7" />
//                 </div>
//                 <div className="bg-[#005BFF14] flex items-center justify-center p-[10px] rounded-[10px]">
//                   <Image src={calender} alt="calendar" className="w-7" />
//                 </div>
//               </div>

//               {/* Mobile view - Catalogue dropdown */}
//               <div className="md:hidden flex items-center">
//                 <Dropdown
//                   menu={{ items: catalogueItems }}
//                   trigger={["click"]}
//                   open={mobileCatalogueOpen}
//                   onOpenChange={(visible) => setMobileCatalogueOpen(visible)}
//                   placement="bottomLeft"
//                   overlayStyle={{
//                     width: 256,
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                   }}
//                 >
//                   <div
//                     className="flex items-center gap-2 h-10 rounded-lg cursor-pointer"
//                     style={{
//                       background: "#005BFF",
//                       border: "none",
//                       padding: "0 12px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <MenuOutlined className="text-white text-sm" />
//                     <span className="text-white text-sm font-medium md:text-base">
//                       Catalogue
//                     </span>
//                   </div>
//                 </Dropdown>
//               </div>

//               {/* Right side icons - mobile */}
//               <div className="flex items-center gap-2 lg:hidden ">
//                 <Badge count={favtLength} size="small">
//                   <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                     <Link href={"/wishlist"}>
//                       <Button
//                         type="text"
//                         className="flex items-center justify-center p-0 m-0 hover:!bg-white"
//                         icon={
//                           <HeartOutlined
//                             style={{ fontSize: "17px", color: "#666" }}
//                           />
//                         }
//                       />
//                     </Link>
//                   </div>
//                 </Badge>

//                 <Badge
//                   count={orderLength}
//                   style={{ backgroundColor: "#4046DE" }}
//                   size="small"
//                 >
//                   <Link href={"/order-details"}>
//                     <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                       <Button
//                         type="text"
//                         className="flex items-center justify-center p-0 m-0 hover:!bg-white"
//                         icon={
//                           <FiPackage
//                             style={{ fontSize: "20px", color: "#666" }}
//                           />
//                         }
//                       />
//                     </div>
//                   </Link>
//                 </Badge>

//                 {/* Mobile Cart Icon */}
//                 <Badge count={cartItemCount} size="small">
//                   <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                     <Button
//                       type="text"
//                       className="flex items-center justify-center p-0 m-0 hover:!bg-white"
//                       icon={
//                         <TbShoppingBag
//                           style={{ fontSize: "21px", color: "#666" }}
//                         />
//                       }
//                       onClick={openCartModal}
//                     />
//                   </div>
//                 </Badge>

//                 {/* Mobile avatar/login dropdown */}
//                 <div className="rounded-full flex items-center justify-center">
//                   {isAuthenticated ? (
//                     <Dropdown
//                       menu={{
//                         items: [
//                           ...(user?.role === "SELLER"
//                             ? [
//                                 {
//                                   key: "1",
//                                   label: (
//                                     <Link href="/dashboard" className="text-sm">
//                                       <span className="flex items-center gap-2">
//                                         Dashboard
//                                       </span>
//                                     </Link>
//                                   ),
//                                 },
//                               ]
//                             : []),
//                           {
//                             key: "2",
//                             label: (
//                               <div
//                                 onClick={handleLogout}
//                                 className="text-red-500 text-sm"
//                               >
//                                 <span className="flex items-center gap-2">
//                                   Logout
//                                 </span>
//                               </div>
//                             ),
//                           },
//                         ],
//                       }}
//                       placement="bottomRight"
//                       trigger={["click"]}
//                     >
//                       <Button
//                         type="text"
//                         className="flex items-center hover:!bg-white p-0"
//                       >
//                         <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden">
//                           <Image
//                             src={getProfileImageUrl(user?.profilePic, avt)}
//                             alt={user?.name || "User"}
//                             width={40}
//                             height={40}
//                             className="object-cover w-full h-full"
//                           />
//                         </div>
//                       </Button>
//                     </Dropdown>
//                   ) : (
//                     <Dropdown
//                       menu={{
//                         items: [
//                           {
//                             key: "1",
//                             label: (
//                               <Link href="/login" className="text-sm ">
//                                 Login
//                               </Link>
//                             ),
//                           },
//                           {
//                             key: "2",
//                             label: (
//                               <Link href="/signup" className="text-sm">
//                                 Sign Up
//                               </Link>
//                             ),
//                           },
//                         ],
//                       }}
//                       placement="bottomRight"
//                       trigger={["click"]}
//                     >
//                       <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
//                         <Button
//                           type="text"
//                           className="flex items-center justify-center hover:!bg-transparent p-0"
//                           icon={
//                             <UserRound
//                               size={20}
//                               style={{ fontSize: "20px", color: "#666" }}
//                             />
//                           }
//                         />
//                       </div>
//                     </Dropdown>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Navigation items with scroll */}
//             <div className="hidden lg:flex items-center gap-4 overflow-hidden">
//               <button
//                 onClick={() => handleSlide("left")}
//                 className="bg-[#005BFF14] flex items-center justify-center rounded-full p-2 cursor-pointer"
//                 disabled={!hasScrolledRight}
//               >
//                 <FaAngleLeft />
//               </button>

//               <div
//                 ref={navContainerRef}
//                 className="flex items-center gap-4 overflow-x-auto scroll-smooth"
//                 style={{ scrollBehavior: "smooth" }}
//               >
//                 {navItems.map((item, index) => (
//                   <NavItem key={index} label={item} />
//                 ))}
//               </div>

//               <button
//                 onClick={() => handleSlide("right")}
//                 className="bg-[#005BFF14] flex items-center justify-center rounded-full p-2"
//               >
//                 <FaAngleRight />
//               </button>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* Cart Modal - Pass the appropriate items based on auth status */}
//       <CartModal
//         isOpen={isCartOpen}
//         onClose={closeCartModal}
//         items={localCartItems}
//       />
//     </div>
//   );
// }

// function NavItem({ label }: { label: string }) {
//   return (
//     <Link href={`/all-product?category=${encodeURIComponent(label)}`}>
//       <Button
//         type="text"
//         className="h-12 xl:px-7 2xl:px-8 rounded-none font-medium text-base text-[#0F0F0F] hover:!bg-[#ECF7FF] hover:!text-primary"
//       >
//         {label}
//       </Button>
//     </Link>
//   );
// }

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Dropdown, Badge, Input } from "antd";
import { MenuOutlined, HeartOutlined } from "@ant-design/icons";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { LuImage } from "react-icons/lu";
import { FiPackage } from "react-icons/fi";
import { TbShoppingBag } from "react-icons/tb";

import star from "@/assets/navbar/sparkles.png";
import mapIcon from "@/assets/navbar/map.png";
import Logo from "@/assets/navbar/logo.png";
import avt from "@/assets/navbar/down.png";
import { CartModal } from "@/components/ui/CartModal/CartModal";
import { Bell, LogOut, UserRound, X } from "lucide-react";
import { LanguageSwitcher } from "@/lib/GoogleTranslatorProvider";
import { RxDashboard } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutHandler } from "@/utils/handleLogout";
import { getFavorites } from "@/utils/favoritesUtils";
import { getProfileImageUrl } from "@/utils/imageUtils";
import {
  selectCurrentUser,
  useCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";
import {
  useGetUnreadNotificationsCountQuery,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/user";
import { format } from "date-fns";

type Location = {
  city?: string;
  country?: string;
};

interface CartItem {
  id: string;
  name: string;
  title: string;
  price: string | number;
  image: string;
  quantity: number;
  brand?: string;
  size?: string;
  currency?: string;
}

// Notification dropdown component
function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Get unread notifications count
  const { data: unreadNotifications, refetch: refetchCount } =
    useGetUnreadNotificationsCountQuery();
  const hasUnreadNotifications =
    unreadNotifications && unreadNotifications.count > 0;

  // Get recent notifications
  const { data: notificationsData, refetch } = useGetNotificationsQuery({
    page: 1,
    pageSize: 5,
    sortOrder: "newest",
  });

  // Mark notification as read
  const [updateNotification] = useUpdateNotificationMutation();

  // Format notification time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notificationId: string) => {
    try {
      await updateNotification({ notificationId, isRead: true });
      refetch();
      refetchCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative md:!z-[100000]">
      {/* Badge wrapper with notification icon */}
      <div className="relative inline-block">
        {/* Notification badge */}
        <div
          className="bg-[#005BFF14] flex items-center justify-center p-[10px] rounded-[10px] cursor-pointer"
          onClick={toggleDrawer}
        >
          <div className="relative">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-[#005BFF]" />
            {hasUnreadNotifications && (
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-[#FF008A] rounded-full flex items-center justify-center text-white text-xs">
                {unreadNotifications.count > 9
                  ? "9+"
                  : unreadNotifications.count}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Drawer/Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-[100000]`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 ">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button onClick={toggleDrawer} className="text-gray-600 ">
            <X size={18} />
          </button>
        </div>
        <div className="p-4">
          {/* Notifications Content */}
          <ul className="max-h-[calc(100vh-120px)] overflow-y-auto">
            {notificationsData && notificationsData.notifications.length > 0 ? (
              notificationsData.notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-2 mb-2 rounded ${
                    notification.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <Link
                    href={notification.actionUrl || "#"}
                    className="text-gray-700 block"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    {notification.actionText && (
                      <span
                        className="text-xs mt-1 py-0.5 px-2 rounded inline-block"
                        style={{
                          backgroundColor:
                            notification.actionBgColor || "#E5EFFF",
                          color: "#005BFF",
                        }}
                      >
                        {notification.actionText}
                      </span>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No notifications
              </li>
            )}
          </ul>
          {notificationsData && notificationsData.notifications.length > 0 && (
            <Link
              href="/dashboard/notifications"
              className="mt-3 text-center block w-full text-sm text-primary font-medium p-2 hover:bg-blue-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        } z-[99999]`}
        onClick={toggleDrawer}
      ></div>
    </div>
  );
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledRight, setHasScrolledRight] = useState(false);
  const [desktopCatalogueOpen, setDesktopCatalogueOpen] = useState(false);
  const [mobileCatalogueOpen, setMobileCatalogueOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [location, setLocation] = useState<Location>({});
  const [favtLength, setFavtLength] = useState(0);
  const [orderLength, setOrderLength] = useState(0);

  // Authentication check
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(useCurrentToken);
  const isAuthenticated = !!user && !!accessToken;
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch cart from database if authenticated
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const dbCartItems = cartData?.data?.cart?.items || [];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        setLocation({
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          country: data.address.country || "",
        });
      });
    }
  }, []);

  // Update cart count for authenticated users
  useEffect(() => {
    if (isAuthenticated && dbCartItems) {
      const totalItems = dbCartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, dbCartItems.length]);

  // Update cart count for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const updateLocalCart = () => {
        try {
          const storedCart = localStorage.getItem("cart");
          if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setLocalCartItems(parsedCart);

            const totalItems = parsedCart.reduce(
              (total: number, item: CartItem) => total + item.quantity,
              0
            );
            setCartItemCount(totalItems);
          } else {
            setLocalCartItems([]);
            setCartItemCount(0);
          }
        } catch (error) {
          console.error("Error loading cart data:", error);
          setLocalCartItems([]);
          setCartItemCount(0);
        }
      };

      updateLocalCart();

      window.addEventListener("storage", updateLocalCart);
      window.addEventListener("cartUpdated", updateLocalCart);

      return () => {
        window.removeEventListener("storage", updateLocalCart);
        window.removeEventListener("cartUpdated", updateLocalCart);
      };
    }
  }, [isAuthenticated]);

  // For favorites and orders (user-scoped wishlist)
  useEffect(() => {
    const updateFavoritesAndOrders = () => {
      try {
        const favorites = getFavorites(user?.id ?? null);
        setFavtLength(favorites ? favorites.length : 0);

        const orderData = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrderLength(orderData ? orderData.length : 0);
      } catch (error) {
        console.error("Error loading favorites or orders:", error);
      }
    };

    updateFavoritesAndOrders();
    window.addEventListener("favoritesUpdated", updateFavoritesAndOrders);
    window.addEventListener("logout", updateFavoritesAndOrders);
    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoritesAndOrders);
      window.removeEventListener("logout", updateFavoritesAndOrders);
    };
  }, [user?.id]);

  const openCartModal = () => {
    if (!isAuthenticated) {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setLocalCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    }
    setIsCartOpen(true);
  };

  const closeCartModal = () => {
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/all-product?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSlide = (direction: "left" | "right") => {
    if (navContainerRef.current) {
      const container = navContainerRef.current;
      const scrollAmount = 200;

      if (direction === "left" && hasScrolledRight) {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else if (direction === "right") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setHasScrolledRight(true);
      }

      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  };

  const navItems = [
    "ELECTRONICS & GADGETS",
    "FASHION & ACCESSORIES",
    "HOME & LIVING",
    "HEALTH & WELLNESS",
    "SPORTS & OUTDOORS",
    "Books & Media",
    "Groceries & Food",
    "Automotive",
    "Office & School Supplies",
    "Pet Supplies",
    "Travel & Luggage",
    "Gifts & Occasions",
  ];

  const catalogueItems = useMemo(
    () => [
      {
        key: "electronics",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "ELECTRONICS & GADGETS"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Electronics & Gadgets
          </Link>
        ),
      },
      {
        key: "fashion",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "FASHION & ACCESSORIES"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Fashion & Accessories
          </Link>
        ),
      },
      {
        key: "home",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "HOME & LIVING"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Home & Living
          </Link>
        ),
      },
      {
        key: "health",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "HEALTH & WELLNESS"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Health & Wellness
          </Link>
        ),
      },
      {
        key: "sports",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "SPORTS & OUTDOORS"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Sports & Outdoors
          </Link>
        ),
      },
      {
        key: "books",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "BOOKS & MEDIA"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Books & Media
          </Link>
        ),
      },
      {
        key: "groceries",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "GROCERIES & FOOD"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Groceries & Food
          </Link>
        ),
      },
      {
        key: "automotive",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent("AUTOMOTIVE")}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Automotive
          </Link>
        ),
      },
      {
        key: "office",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "OFFICE & SCHOOL SUPPLIES"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Office & School Supplies
          </Link>
        ),
      },
      {
        key: "pet",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent("PET SUPPLIES")}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Pet Supplies
          </Link>
        ),
      },
      {
        key: "travel",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "TRAVEL & LUGGAGE"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Travel & Luggage
          </Link>
        ),
      },
      {
        key: "gifts",
        label: (
          <Link
            href={`/all-product?category=${encodeURIComponent(
              "GIFTS & OCCASIONS"
            )}`}
            className="text-sm md:text-base font-medium uppercase font-poppins"
          >
            Gifts & Occasions
          </Link>
        ),
      },
    ],
    []
  );

  // Memoize user menu items
  const desktopUserMenuItems = useMemo(() => {
    if (isAuthenticated) {
      return [
        ...(user?.role === "SELLER"
          ? [
              {
                key: "dashboard",
                label: (
                  <Link href="/dashboard" className="text-lg">
                    <span className="flex items-center gap-2">
                      <RxDashboard size={18} /> Dashboard
                    </span>
                  </Link>
                ),
              },
            ]
          : []),
        {
          key: "logout",
          label: (
            <div onClick={handleLogout} className="text-red-500 text-lg">
              <span className="flex items-center gap-2">
                <LogOut size={18} />
                Logout
              </span>
            </div>
          ),
        },
      ];
    }

    return [
      {
        key: "login",
        label: (
          <Link href="/login" className="text-lg">
            <span className="flex items-center gap-2">
              <UserRound size={18} /> Login
            </span>
          </Link>
        ),
      },
      {
        key: "signup",
        label: (
          <Link href="/signup" className="text-lg">
            <span className="flex items-center gap-2">
              <UserRound size={18} /> Sign Up
            </span>
          </Link>
        ),
      },
    ];
  }, [isAuthenticated, user?.role]);

  const mobileUserMenuItems = useMemo(() => {
    if (isAuthenticated) {
      return [
        ...(user?.role === "SELLER"
          ? [
              {
                key: "dashboard",
                label: (
                  <Link href="/dashboard" className="text-sm">
                    <span className="flex items-center gap-2">Dashboard</span>
                  </Link>
                ),
              },
            ]
          : []),
        {
          key: "logout",
          label: (
            <div onClick={handleLogout} className="text-red-500 text-sm">
              <span className="flex items-center gap-2">Logout</span>
            </div>
          ),
        },
      ];
    }

    return [
      {
        key: "login",
        label: (
          <Link href="/login" className="text-sm">
            Login
          </Link>
        ),
      },
      {
        key: "signup",
        label: (
          <Link href="/signup" className="text-sm">
            Sign Up
          </Link>
        ),
      },
    ];
  }, [isAuthenticated, user?.role]);

  return (
    <div>
      <header className="w-full bg-[#ECF7FF] pt-2 pb-4 poppins xl:px-20 font-poppins">
        {/* Top bar */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language selector */}
            <LanguageSwitcher />

            {/* Currency selector (disabled while app uses MDL only)
            <Dropdown
              key="currency-dropdown"
              menu={{
                items: currencyItems,
                defaultValue: "MDL",
                onClick: ({ key }) => {
                  dispatch(setCurrency(key as Currency));
                },
              }}
              placement="bottomLeft"
            >
              <Button
                size="small"
                className="flex items-center px-3 !py-4 rounded-[5px] bg-[#005BFF14] border-none hover:!bg-[#005BFF14]"
              >
                <Space className="flex items-center">
                  <span className="text-primary text-sm font-medium">
                    {globalCurrency}
                  </span>
                  <FaAngleDown className="text-primary font-bold text-xs" />
                </Space>
              </Button>
            </Dropdown>
            */}
          </div>

          {/* Location */}
          <div className="flex items-center text-sm">
            <button className="flex items-center text-sm font-medium text-primary gap-1">
              <Image
                src={mapIcon}
                alt="Map"
                width={25}
                height={25}
                className="w-5 md:w-6"
              />
              {location.city && location.country
                ? `${location.city}, ${location.country}`
                : "Detecting..."}
            </button>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto pt-2 pb-4 flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt="Logo"
                width={80}
                height={80}
                className="w-20 lg:block hidden"
              />
              <div className="text-primary font-bold tracking-wide text-[28px] md:text-4xl block lg:hidden">
                Gemelli
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-8 w-full justify-center lg:justify-between lg:w-[75%]">
            {/* Search */}
            <div className="relative flex-grow max-w-2xl w-full">
              <Input
                placeholder="Search in Gemelli"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="py-2 pl-5"
                style={{
                  borderRadius: "32px",
                  border: "none",
                }}
                suffix={
                  <div className="flex items-center gap-1">
                    <Button
                      type="text"
                      icon={
                        <LuImage className="text-2xl opacity-50 rounded mt-1" />
                      }
                    />
                    <div className="bg-[#b4d2ff]/50 hover:!bg-[#b4d2ff]/50 rounded-full flex items-center justify-center p-1">
                      <Button
                        type="text"
                        className="!bg-none hover:!bg-transparent"
                        icon={
                          <IoSearch className="!text-primary text-xl mt-1" />
                        }
                        onClick={handleSearch}
                      />
                    </div>
                  </div>
                }
              />
            </div>

            {/* Desktop Icons */}
            <div className="lg:flex items-center gap-3 hidden">
              <Badge count={favtLength}>
                <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
                  <Link href={"/wishlist"}>
                    <Button
                      type="text"
                      className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
                      icon={
                        <HeartOutlined
                          style={{ fontSize: "22px", color: "#666" }}
                        />
                      }
                    />
                  </Link>
                </div>
              </Badge>

              {isAuthenticated && (
                <Badge
                  count={orderLength}
                  style={{ backgroundColor: "#4046DE" }}
                >
                  <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
                    <Link href={"/order-details"}>
                      <Button
                        type="text"
                        className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
                        icon={
                          <FiPackage
                            style={{ fontSize: "22px", color: "#666" }}
                          />
                        }
                      />
                    </Link>
                  </div>
                </Badge>
              )}

              {/* Cart Icon */}
              <Badge count={cartItemCount}>
                <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
                  <Button
                    type="text"
                    className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
                    icon={
                      <TbShoppingBag
                        style={{ fontSize: "24px", color: "#666" }}
                      />
                    }
                    onClick={openCartModal}
                  />
                </div>
              </Badge>

              {isAuthenticated ? (
                <Dropdown
                  key="desktop-user-dropdown"
                  menu={{ items: desktopUserMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="bg-white rounded-[28px] py-3 flex items-center justify-center overflow-hidden cursor-pointer">
                    <Button
                      type="text"
                      className="flex items-center justify-center hover:!bg-white"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={getProfileImageUrl(user?.profilePic, avt)}
                          alt={user?.name || "User"}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="font-medium !text-base pr-3">
                        {user?.name || "Account"}
                      </span>
                    </Button>
                  </div>
                </Dropdown>
              ) : (
                <Dropdown
                  key="desktop-guest-dropdown"
                  menu={{ items: desktopUserMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
                    <Button
                      type="text"
                      className="bg-white rounded-full flex items-center justify-center overflow-hidden hover:!bg-white"
                      icon={<UserRound style={{ color: "#666" }} />}
                    />
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pt-1 md:pt-2">
          <div className="container mx-auto md:px-4 flex items-center gap-6">
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div className="hidden md:flex items-center gap-3 lg:w-fit">
                <Dropdown
                  key="desktop-catalogue-dropdown"
                  menu={{ items: catalogueItems }}
                  trigger={["click"]}
                  open={desktopCatalogueOpen}
                  onOpenChange={(visible) => setDesktopCatalogueOpen(visible)}
                  placement="bottomLeft"
                  overlayStyle={{
                    width: 256,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div
                    className="flex items-center gap-3 h-12 rounded-lg w-[190px] cursor-pointer"
                    style={{
                      background: "#005BFF",
                      border: "none",
                      padding: "0 16px",
                      textAlign: "center",
                    }}
                  >
                    <MenuOutlined className="text-white text-xs md:text-base" />
                    <span className="text-white text-xs md:text-base font-medium">
                      Catalogue
                    </span>
                  </div>
                </Dropdown>
                <div className="bg-[#005BFF14] flex items-center justify-center p-[10px] rounded-[10px]">
                  <Image src={star} alt="star" className="w-7" />
                </div>
                {isAuthenticated && <NotificationDropdown />}
              </div>

              {/* Mobile view - Catalogue dropdown */}
              <div className="md:hidden flex items-center">
                <Dropdown
                  key="mobile-catalogue-dropdown"
                  menu={{ items: catalogueItems }}
                  trigger={["click"]}
                  open={mobileCatalogueOpen}
                  onOpenChange={(visible) => setMobileCatalogueOpen(visible)}
                  placement="bottomLeft"
                  overlayStyle={{
                    width: 256,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 h-10 rounded-lg cursor-pointer"
                    style={{
                      background: "#005BFF",
                      border: "none",
                      padding: "0 12px",
                      textAlign: "center",
                    }}
                  >
                    <MenuOutlined className="text-white text-sm" />
                    <span className="text-white text-sm font-medium md:text-base">
                      Catalogue
                    </span>
                  </div>
                </Dropdown>
              </div>

              {/* Right side icons - mobile */}
              <div className="flex items-center gap-2 lg:hidden ">
                {isAuthenticated && <NotificationDropdown />}
                <Badge count={favtLength} size="small">
                  <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
                    <Link href={"/wishlist"}>
                      <Button
                        type="text"
                        className="flex items-center justify-center p-0 m-0 hover:!bg-white"
                        icon={
                          <HeartOutlined
                            style={{ fontSize: "17px", color: "#666" }}
                          />
                        }
                      />
                    </Link>
                  </div>
                </Badge>

                {isAuthenticated && (
                  <Badge
                    count={orderLength}
                    style={{ backgroundColor: "#4046DE" }}
                    size="small"
                  >
                    <Link href={"/order-details"}>
                      <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
                        <Button
                          type="text"
                          className="flex items-center justify-center p-0 m-0 hover:!bg-white"
                          icon={
                            <FiPackage
                              style={{ fontSize: "20px", color: "#666" }}
                            />
                          }
                        />
                      </div>
                    </Link>
                  </Badge>
                )}

                {/* Mobile Cart Icon */}
                <Badge count={cartItemCount} size="small">
                  <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
                    <Button
                      type="text"
                      className="flex items-center justify-center p-0 m-0 hover:!bg-white"
                      icon={
                        <TbShoppingBag
                          style={{ fontSize: "21px", color: "#666" }}
                        />
                      }
                      onClick={openCartModal}
                    />
                  </div>
                </Badge>

                {/* Mobile avatar/login dropdown */}
                <div className="rounded-full flex items-center justify-center">
                  {isAuthenticated ? (
                    <Dropdown
                      key="mobile-user-dropdown"
                      menu={{ items: mobileUserMenuItems }}
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <Button
                        type="text"
                        className="flex items-center hover:!bg-white p-0"
                      >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden">
                          <Image
                            src={getProfileImageUrl(user?.profilePic, avt)}
                            alt={user?.name || "User"}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </Button>
                    </Dropdown>
                  ) : (
                    <Dropdown
                      key="mobile-guest-dropdown"
                      menu={{ items: mobileUserMenuItems }}
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <div className="bg-white rounded-full p-[2px] md:p-1.5 flex items-center justify-center">
                        <Button
                          type="text"
                          className="flex items-center justify-center hover:!bg-transparent p-0"
                          icon={
                            <UserRound
                              size={20}
                              style={{ fontSize: "20px", color: "#666" }}
                            />
                          }
                        />
                      </div>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation items with scroll */}
            <div className="hidden lg:flex items-center gap-4 overflow-hidden">
              <button
                onClick={() => handleSlide("left")}
                className="bg-[#005BFF14] flex items-center justify-center rounded-full p-2 cursor-pointer"
                disabled={!hasScrolledRight}
              >
                <FaAngleLeft />
              </button>

              <div
                ref={navContainerRef}
                className="flex items-center gap-4 overflow-x-auto scroll-smooth"
                style={{ scrollBehavior: "smooth" }}
              >
                {navItems.map((item, index) => (
                  <NavItem key={index} label={item} />
                ))}
              </div>

              <button
                onClick={() => handleSlide("right")}
                className="bg-[#005BFF14] flex items-center justify-center rounded-full p-2"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Modal - Pass the appropriate items based on auth status */}
      <CartModal
        isOpen={isCartOpen}
        onClose={closeCartModal}
        items={localCartItems}
      />
    </div>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <Link href={`/all-product?category=${encodeURIComponent(label)}`}>
      <Button
        type="text"
        className="h-12 xl:px-7 2xl:px-8 rounded-none font-medium text-base text-[#0F0F0F] hover:!bg-[#ECF7FF] hover:!text-primary"
      >
        {label}
      </Button>
    </Link>
  );
}
