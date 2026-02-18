import React from "react";
import clsx from "clsx";

interface ReusableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "fill" | "outline";
    isLoading?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
    variant = "fill",
    isLoading = false,
    className = "",
    children,
    disabled,
    ...props
}) => {
    const isDisabled = disabled || isLoading;

    const baseClasses = "text-base font-semibold rounded-xl transition-colors uppercase";

    const fillClasses = isDisabled
        ? "bg-primary/70 text-white"
        : "bg-primary text-white hover:bg-primary/85";

    const outlineClasses = isDisabled
        ? "border-2 border-primary/70 text-primary/70"
        : "border-2 border-primary text-primary hover:border-primary/50 hover:text-primary/50";

    return (
        <button
            disabled={isDisabled}
            className={clsx(
                baseClasses,
                variant === "fill" ? fillClasses : outlineClasses,
                className
            )}
            {...props}
        >
            {isLoading ? "ADDING..." : children}
        </button>
    );
};

export default ReusableButton;
