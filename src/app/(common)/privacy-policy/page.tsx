"use client";

import React from "react";
import { ArrowLeft, Lock, Database, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-8 font-poppins">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#005BFF] hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back to home page</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#0F0F0F]">
          PRIVACY POLICY
        </h1>

        <div className="text-gray-700 space-y-8 mx-auto">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
              1. Data We Collect
            </h2>
            <p>
              We collect only necessary data: <strong>name, phone, email, delivery address</strong>. Processing complies with <strong>Law No. 133/2011</strong> on personal data protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
              2. How We Use Your Data
            </h2>
            <p className="mb-2">Your data is used exclusively for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>invoices & shipping documents</li>
              <li>courier delivery processing</li>
              <li>order status communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
              3. Online Payment Security (maib)
            </h2>
            <p>
              Gemelli <strong>does NOT</strong> request or store card details. Online payments redirect you to secure <strong>maib</strong> servers. The transaction occurs directly between you and the bank.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
