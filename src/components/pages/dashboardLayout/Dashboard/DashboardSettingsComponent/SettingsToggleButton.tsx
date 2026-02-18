"use client";

import { IoSettingsOutline } from "react-icons/io5";

export default function SettingsToggleButton() {
  return (
    <button
      className="xl:hidden p-2"
      onClick={() => {
        window.dispatchEvent(new Event("toggleSidebar"));
      }}
    >
      <IoSettingsOutline
        className="
    animate-spin 
    hover:animate-none 
    size-6 
    xl:hidden 
    block 
    text-red-400 
    duration-1000 
    ease-linear
    transition-all
  "
        style={{
          animationDuration: "3s",
        }}
      />
    </button>
  );
}
