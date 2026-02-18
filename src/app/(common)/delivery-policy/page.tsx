"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DeliveryPolicy() {
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
                    DELIVERY POLICY
                </h1>

                <div className="text-gray-700 space-y-8 mx-auto">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#0F0F0F] border-b pb-2">
                            1. Logistics Partners & Delivery Methods
                        </h2>
                        <p className="mb-4">To provide the best services, we integrate directly with <strong>Nova Post</strong> and <strong>FAN Courier</strong>.</p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <h3 className="font-bold mb-2">Locker Delivery</h3>
                                <p className="text-sm">Available 24/7 (small & medium parcels only)</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <h3 className="font-bold mb-2">Courier Office Pickup</h3>
                                <p className="text-sm">Collect from partner branches during working hours</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <h3 className="font-bold mb-2">Door Delivery</h3>
                                <p className="text-sm">Delivered directly to your address anywhere in Moldova</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#0F0F0F] border-b pb-2">
                            2. Shipping Costs (Full Transparency)
                        </h2>
                        <div className="space-y-4">
                            <p>Shipping fees are fixed per package:</p>
                            <ul className="space-y-3">
                                <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Office/Locker delivery</span>
                                    <span className="font-bold text-[#005BFF]">30 MDL</span>
                                </li>
                                <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Door delivery</span>
                                    <span className="font-bold text-[#005BFF]">49 MDL</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            3. Free Delivery & 499 MDL Threshold
                        </h2>
                        <p>If you add products totaling over <strong>499 MDL</strong> from the same Seller, you receive <strong>FREE DELIVERY</strong>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            4. Mixed Orders (Multi-Seller Rule)
                        </h2>
                        <div className="space-y-4">
                            <p>Orders containing products from different sellers will be split into separate parcels.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Delivery fee applies per parcel.</li>
                                <li>The 499 MDL free shipping threshold is calculated per seller, not per cart total.</li>
                            </ul>
                            <p className="font-medium text-[#0F0F0F]">All costs are clearly displayed before pressing “Buy”.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            5. Processing & Delivery Time
                        </h2>
                        <p>
                            The Seller must hand the parcel to the courier within <strong>24 hours</strong> of order confirmation. Delivery takes <strong>24–48 hours</strong> (business days).
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
