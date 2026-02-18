"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import qr from "@/assets/Footer/QR2.png";
import apple from "@/assets/Footer/apple.png";
import play from "@/assets/Footer/playstore.png";
import { FaTiktok, FaCcVisa, FaCcMastercard, FaInstagram, FaFacebook } from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/constants/socialLinks";

export default function Footer() {
  return (
    <footer className="bg-[#ECF7FF] pt-16 pb-8 lg:px-4 font-poppins text-[#515557]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Left: QR Code Section */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <div
              className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-md transition-all w-full max-w-[320px] border border-[#005BFF]/5 flex flex-col items-center text-center"
            >
              <div className="bg-[#ECF7FF] rounded-2xl p-4 mb-8 flex justify-center items-center">
                <div className="relative w-32 h-32">
                  <Image
                    src={qr || "/placeholder.svg"}
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0F0F0F] uppercase leading-tight tracking-tight">
                  SCAN QR AND DOWNLOAD
                </h3>
                <h3 className="text-xl font-bold text-[#0F0F0F] uppercase leading-tight tracking-tight">
                  MOBILE APP
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#ECF7FF] flex items-center justify-center hover:bg-[#D9EFFF] transition-colors cursor-pointer border border-[#005BFF]/10">
                  <Image src={apple} alt="App Store" width={32} height={32} className="object-contain" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#ECF7FF] flex items-center justify-center hover:bg-[#D9EFFF] transition-colors cursor-pointer border border-[#005BFF]/10">
                  <Image src={play} alt="Google Play" width={32} height={32} className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Columns + Payments/Socials */}
          <div className="flex-grow flex flex-col gap-12">
            {/* Top row: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Customer Information */}
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg text-[#0F0F0F] mb-6 uppercase tracking-wider">
                  Customer Information
                </h3>
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <Link href="/terms-conditions" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/delivery-policy" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      Delivery Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/return-refund-policy" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      Return & Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: About Gemelli */}
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg text-[#0F0F0F] mb-6 uppercase tracking-wider">
                  About Gemelli
                </h3>
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <Link href="/about-us" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/become-seller" className="hover:text-[#005BFF] flex items-center justify-center md:justify-start gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#005BFF] rounded-full"></span>
                      Become a Seller
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Contact & Support */}
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg text-[#0F0F0F] mb-6 uppercase tracking-wider">
                  Contact & Support
                </h3>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Mail className="w-4 h-4 text-[#005BFF]" />
                    </div>
                    <a href="mailto:gemelli920@gmail.com" className="hover:text-[#005BFF]">gemelli920@gmail.com</a>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Phone className="w-4 h-4 text-[#005BFF]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#515557] font-normal">Support</p>
                      <a href="tel:060008857" className="hover:text-[#005BFF]">060008857</a>
                    </div>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Phone className="w-4 h-4 text-[#005BFF]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#515557] font-normal">Partner</p>
                      <a href="tel:060008856" className="hover:text-[#005BFF]">060008856</a>
                    </div>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <MapPin className="w-4 h-4 text-[#005BFF]" />
                    </div>
                    <span>Ialoveni, Republic of Moldova</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom row: Payments & Socials */}
            <div className="border-t border-[#005BFF]/10 pt-10 flex flex-col xl:flex-row justify-between items-center gap-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-11 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100">
                    <FaCcVisa className="text-[#1A1F71] text-3xl" />
                  </div>
                  <div className="w-14 h-11 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100">
                    <FaCcMastercard className="text-[#EB001B] text-3xl" />
                  </div>
                  <div className="w-14 h-11 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100">
                    <span className="font-extrabold text-[#005BFF] italic text-lg tracking-tighter">maib</span>
                  </div>
                </div>

                <div className="h-6 w-[1px] bg-gray-300 hidden md:block"></div>

                <Link
                  href="https://consumator.gov.md/ro"
                  target="_blank"
                  className="text-xs font-bold hover:text-[#005BFF] flex items-center gap-2 transition-colors uppercase tracking-tight"
                >
                  Consumer Protection: ISSPNPC <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md hover:scale-110 transition-all border border-gray-50"
                >
                  <FaInstagram className="text-[#005BFF] text-xl" />
                </Link>
                <Link
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md hover:scale-110 transition-all border border-gray-100"
                >
                  <FaFacebook className="text-[#005BFF] text-xl" />
                </Link>
                <Link
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md hover:scale-110 transition-all border border-gray-50"
                >
                  <FaTiktok className="text-[#005BFF] text-xl" />
                </Link>
                <Link
                  href="#top"
                  className="flex items-center justify-center bg-[#005BFF] text-white w-10 h-10 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <ArrowUp className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer Area */}
        <div className="border-t border-[#005BFF]/10 pt-8 mt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="text-sm font-bold text-[#0F0F0F]">
              © 2026 Gemelli Marketplace. All rights reserved.
              <p className="text-xs font-medium text-[#515557] mt-1">Operated by GEMELLI MARKETPLACE S.R.L.</p>
            </div>
            <div className="max-w-xl">
              <p className="text-[10px] leading-relaxed italic text-gray-500">
                <strong>Legal Disclaimer:</strong> Gemelli.store brings together the passion of multiple local partners in one place. As a marketplace, product descriptions and images are provided by each seller to reflect their products as accurately as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
