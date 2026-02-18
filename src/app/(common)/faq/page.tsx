"use client";

import React from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Collapse } from "antd";

const { Panel } = Collapse;

export default function FAQ() {
    const faqData = [
        {
            question: "1. How do I place an order?",
            answer: "Add products → Checkout → enter delivery details → choose delivery (30 MDL office/locker or 49 MDL door) → choose payment → place order."
        },
        {
            question: "2. Why are there two delivery fees?",
            answer: "Because Gemelli is a marketplace. Different sellers ship from different warehouses → separate parcels → separate delivery fees. Orders over 499 MDL from one seller qualify for free delivery."
        },
        {
            question: "3. How can I pay?",
            answer: (
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Online card payment (recommended)</strong> – fast & fee-free via maib.</li>
                    <li><strong>Cash on delivery</strong> – pay courier upon receipt.</li>
                </ul>
            )
        },
        {
            question: "4. What if the product is defective?",
            answer: (
                <p>
                    You have <strong>14 days</strong> to request a return. Contact <strong>gemelli920@gmail.com</strong>. If defective, return shipping is free.
                </p>
            )
        }
    ];

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
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#0F0F0F] flex items-center justify-center gap-3">
                    <HelpCircle className="text-[#005BFF] w-10 h-10" /> FAQ
                </h1>

                <div className="mx-auto">
                    <Collapse
                        accordion
                        bordered={false}
                        className="bg-transparent"
                        expandIconPosition="end"
                        defaultActiveKey={['0']}
                    >
                        {faqData.map((item, index) => (
                            <Panel
                                header={<span className="font-bold text-lg text-[#0F0F0F]">{item.question}</span>}
                                key={index}
                                className="mb-4 bg-gray-50 rounded-xl overflow-hidden border-none"
                            >
                                <div className="text-gray-700 leading-relaxed py-2">
                                    {item.answer}
                                </div>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </div>
        </div>
    );
}
