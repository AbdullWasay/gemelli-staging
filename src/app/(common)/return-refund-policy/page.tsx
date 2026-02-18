"use client";

import React from "react";
import { ArrowLeft, RotateCcw, ShieldCheck, CreditCard, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ReturnRefundPolicy() {
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
                    RETURN & REFUND POLICY
                </h1>

                <div className="text-gray-700 space-y-8 mx-auto">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            1. Legal Right of Return
                        </h2>
                        <p>
                            According to <strong>Law No. 105/2003</strong> on consumer protection, you may return a product within <strong>14 calendar days</strong> without justification.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            2. Return Acceptance Conditions
                        </h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>Product must be <strong>unused, unworn, without damage or scratches</strong>.</li>
                            <li>Must be returned in <strong>original undamaged packaging</strong> with tags and accessories.</li>
                            <li>
                                <strong>Certain items</strong> (e.g., underwear or unsealed hygiene products) cannot be returned for health reasons.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            3. Who Pays Return Shipping?
                        </h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Personal reasons:</strong> Buyer pays return shipping.</li>
                            <li><strong>Seller fault:</strong> Defective/damaged/wrong item: Seller covers full return shipping.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#0F0F0F] border-b pb-2">
                            4. Refund Procedure
                        </h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>After inspection, refunds are processed within <strong>14 calendar days</strong>.</li>
                            <li>Card payments are refunded automatically to the <strong>same card</strong> via the secure <strong>maib</strong> banking system.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
