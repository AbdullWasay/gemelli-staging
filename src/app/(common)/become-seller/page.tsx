"use client";

import React from "react";
import { ArrowLeft, Rocket, CheckCircle, BarChart, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BecomeSeller() {
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
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#0F0F0F]">
                    BECOME A SELLER
                </h1>

                <div className="text-gray-700 space-y-10 mx-auto">
                    <section className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-[#005BFF]">Sell on Gemelli Marketplace and grow your business!</h2>
                        <p className="text-lg">
                            If you have a legally registered business in Moldova and want access to thousands of customers without technical hassle, Gemelli is your partner.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#0F0F0F]">Why sell on Gemelli?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { icon: <Rocket />, title: "Ready infrastructure", desc: "Website, hosting, and marketing are already set up for you." },
                                { icon: <Truck />, title: "Integrated logistics", desc: "Automatic AWB generation for easy shipping." },
                                { icon: <BarChart />, title: "Centralized payments", desc: "Payments via maib transferred weekly to your account." },
                                { icon: <ShieldCheck />, title: "Control dashboard", desc: "Powerful tools for managing your stock & orders." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-5 bg-blue-50 rounded-2xl">
                                    <div className="text-[#005BFF] flex-shrink-0">{item.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-[#0F0F0F]">{item.title}</h3>
                                        <p className="text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-[#0F0F0F] flex items-center gap-2">
                            <CheckCircle className="text-[#005BFF]" /> What we expect from you:
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-1">1</div>
                                <p>Deliver orders to courier within <strong>24 hours</strong>.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-1">2</div>
                                <p>Follow high packaging standards (<strong>3-layer rule</strong>).</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-1">3</div>
                                <p>Declare accurate product weight & dimensions.</p>
                            </li>
                        </ul>
                    </section>

                    <div className="text-center pt-4">
                        <Link
                            href="/signup?role=seller"
                            className="inline-block bg-[#005BFF] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Apply to Register as a Seller
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
