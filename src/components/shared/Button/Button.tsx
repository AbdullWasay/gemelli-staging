// components/Button.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps {
  label: string;
  size?: "small" | "medium" | "large";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  htmlType?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  size = "medium",
  className,
  type = "button",
  onClick,
  disabled = false,
}) => {
  const sizeClasses: Record<string, string> = {
    small: "px-6 py-3 text-sm",
    outline: "px-6 py-3 bg-white border",
    medium: "px-8 py-3 text-base",
    large: "px-8 py-4 text-xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(`rounded-lg font-semibold ${sizeClasses[size]}`, className)}
    >
      {label}
    </button>
  );
};

export default Button;
