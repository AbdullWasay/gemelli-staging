"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsConditions() {
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
                    TERMS & CONDITIONS
                </h1>

                <div className="text-gray-700 space-y-8 mx-auto">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            1. General Information and Service Definition
                        </h2>
                        <div className="space-y-4">
                            <p>
                                The online platform <strong>gemelli.store</strong> is owned and operated by <strong>GEMELLI MARKETPLACE S.R.L.</strong> (IDNO: 1026600003929), headquartered in Ialoveni, Republic of Moldova.
                            </p>
                            <p>
                                Gemelli.store operates exclusively as a <strong>Marketplace (intermediary)</strong>. This means Gemelli provides the technological infrastructure (website, payment processing via maib, courier system integrations), while the displayed products are sold and shipped directly by our Partners (independent Sellers). Gemelli does not hold physical inventory.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            2. Responsibilities and Obligations
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-lg text-[#0F0F0F] mb-2">Gemelli Responsibilities:</h3>
                                <p>
                                    We ensure the technical operation of the platform, security of online payments, accurate delivery fee calculation, and support in mediating possible disputes between the Customer and Seller.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-[#0F0F0F] mb-2">Seller Responsibilities:</h3>
                                <p className="mb-2">Each Seller is directly and exclusively responsible for:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>product quality</li>
                                    <li>accuracy of descriptions and declared weight</li>
                                    <li>proper packaging according to standards (3-layer rule)</li>
                                    <li>honoring the legal warranty</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-[#0F0F0F] mb-2">Customer Responsibilities:</h3>
                                <p>
                                    By placing an order, the Customer agrees to provide accurate contact details, pay the order value and delivery fees, and collect the package within the agreed timeframe.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            3. Intellectual Property & Force Majeure
                        </h2>
                        <div className="space-y-4">
                            <p>
                                All site content (logos, design, structure) is the property of Gemelli Marketplace S.R.L. Neither party is liable for failure to fulfill obligations caused by force majeure events (natural disasters, government decisions, national banking system disruptions).
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
