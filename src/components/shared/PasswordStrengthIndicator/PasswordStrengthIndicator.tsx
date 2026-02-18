"use client";

import { getPasswordStrength } from "@/utils/passwordValidator";
import { useEffect, useState } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">(
    "weak"
  );

  useEffect(() => {
    if (!password) {
      setStrength("weak");
      return;
    }
    setStrength(getPasswordStrength(password));
  }, [password]);

  return (
    <div className="mt-1">
      <div className="flex items-center">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              strength === "weak"
                ? "w-1/3 bg-red-500"
                : strength === "medium"
                ? "w-2/3 bg-yellow-500"
                : "w-full bg-green-500"
            }`}
          />
        </div>
        <span
          className={`ml-2 text-xs ${
            strength === "weak"
              ? "text-red-500"
              : strength === "medium"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {strength === "weak"
            ? "Weak"
            : strength === "medium"
            ? "Medium"
            : "Strong"}
        </span>
      </div>
      {strength === "weak" && (
        <p className="text-xs text-red-500 mt-1">
          Make your password stronger by adding uppercase letters, numbers and
          special characters
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
