import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Rubik } from "next/font/google";
import "./globals.css";
import SessionProviderForNextAuth from "@/nextAuth/SessionProviderForNextAuth";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import { Toaster } from "sonner";
import MyContextProvider from "@/lib/MyContextProvider";
import { ToastContainer } from "react-toastify";
import GoogleTranslateProvider from "@/lib/GoogleTranslatorProvider";
import GoogleOAuthProvider from "@/components/providers/GoogleOAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Home - Page Title",
  description: "Demo description",
  icons: "/demo.png",
  openGraph: {
    title: "Home - Page Title",
    description: "Demo Description",
    url: "https://demo.com",
    siteName: "Page Name",
    images: [
      {
        url: "https://demo.com/demo.png",
        width: 1200,
        height: 630,
        alt: "Demo Logo",
      },
      {
        url: "https://demo.com/demo.png",
        width: 1200,
        height: 1200,
        alt: "Demo Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home - Page Title",
    description: "Demo Description",
    images: [
      {
        url: "https://demo.com/demo.png",
        width: 1200,
        height: 630,
        alt: "Demo Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${poppins.variable} antialiased`}
      >
        <MyContextProvider>
          <GoogleOAuthProvider>
            <SessionProviderForNextAuth>
              <ReduxStoreProvider>
                <GoogleTranslateProvider>
                <Toaster />
                <ToastContainer />
                  {children}
                </GoogleTranslateProvider>
              </ReduxStoreProvider>
            </SessionProviderForNextAuth>
          </GoogleOAuthProvider>
        </MyContextProvider>
      </body>
    </html>
  );
}