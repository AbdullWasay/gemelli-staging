/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Dropdown, Space } from "antd";
import { ItemType } from "antd/es/menu/interface";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function GoogleTranslateProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.querySelector("#google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        if (window.google && !isInitialized) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,ro,ru",
              layout:
                window.google.translate.TranslateElement.InlineLayout
                  .HORIZONTAL,
            },
            "google_translate_element"
          );
          setIsInitialized(true);
        }
      };
    };

    addGoogleTranslateScript();
  }, [isInitialized]);

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      {children}
    </>
  );
}

export default GoogleTranslateProvider;

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    // Initialize language from localStorage or default to English
    const storedLang = localStorage.getItem("selectedLanguage");
    const initialLang = storedLang || "en";
    setSelectedLanguage(initialLang);

    // Set the Google Translate cookie
    document.cookie = initialLang === "en"
      ? "googtrans=/en/en; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/"
      : `googtrans=/en/${initialLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;

    // Ensure Google Translate select element is updated if it exists
    const timer = setTimeout(() => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select && select.value !== initialLang) {
        select.value = initialLang;
        select.dispatchEvent(new Event("change"));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (newLang: string) => {
    if (!newLang) return;

    setSelectedLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);

    // Update Google Translate cookie
    document.cookie = newLang === "en"
      ? "googtrans=/en/en; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/"
      : `googtrans=/en/${newLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;

    // Update Google Translate select element if it exists
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
    }

    // Force a small delay and then reload to ensure translation takes effect
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const languageOptions: ItemType[] = [
    {
      key: "en",
      label: "En",
    },
    {
      key: "ro",
      label: "Ro",
    },
    {
      key: "ru",
      label: "Ru",
    },
  ];

  // Normalize the displayed language code
  const displayedLanguage = selectedLanguage === "en"
    ? "En"
    : selectedLanguage === "ro"
      ? "Ro"
      : "Ru";

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        menu={{
          items: languageOptions,
          onClick: (e) => handleChange(e.key),
        }}
        placement="bottomLeft"
      >
        <Button
          size="small"
          className="flex items-center px-3 !py-4 rounded-[5px] bg-[#005BFF14] border-none hover:!bg-[#005BFF14]"
        >
          <Space className="flex items-center">
            <span className="text-primary text-sm font-poppins font-medium">
              {displayedLanguage}
            </span>
            <FaAngleDown className="text-primary font-bold text-xs" />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
}
