"use client";

import React from "react";
import { ArrowLeft, Users, Globe, Rocket, Heart, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
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
                    ABOUT US
                </h1>

                <div className="text-gray-700 space-y-10 mx-auto">
                    <section className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#005BFF]">Welcome to Gemelli.store!</h2>
                        <p className="text-lg leading-relaxed max-w-4xl mx-auto">
                            Gemelli Marketplace was created to connect local entrepreneurs in Moldova with buyers seeking a modern, safe, and transparent online shopping experience.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-[#005BFF] p-4 rounded-full">
                            <Globe className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg">
                                We are not just a store — we are a <strong>technology platform</strong> connecting dozens of warehouses and businesses directly to your door.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#0F0F0F]">Our Three Pillars</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl text-center hover:shadow-md transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Users className="text-[#005BFF]" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Transparency</h3>
                                <p className="text-sm">No hidden costs. Everything is clear from the start.</p>
                            </div>
                            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl text-center hover:shadow-md transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Shield className="text-[#005BFF]" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Security</h3>
                                <p className="text-sm">Partnership with maib ensures protected transactions.</p>
                            </div>
                            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl text-center hover:shadow-md transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Heart className="text-[#005BFF]" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Local Support</h3>
                                <p className="text-sm">Tools for local businesses to sell quickly and efficiently.</p>
                            </div>
                        </div>
                    </section>

                    <section className="text-center pt-6 border-t font-bold text-xl text-[#005BFF]">
                        Gemelli – Diversity in one cart, delivered safely!
                    </section>
                </div>
            </div>
        </div>
    );
}
