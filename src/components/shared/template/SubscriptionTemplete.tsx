"use client";



import { Subscription } from "@/data/Subscriptions";
import type { JSX } from "react";

interface InvoiceTemplateProps {
  subscription: Subscription;
}

export default function SubscriptionTemplete({ subscription }: InvoiceTemplateProps): JSX.Element {
  // Format dates
  const invoiceDate = new Date(subscription.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-sans text-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SUBSCRIPTION INVOICE</h1>
          <p className="text-gray-600 mt-1">#{subscription.reference}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl">Your Company Name</div>
          <div className="text-gray-600 text-sm mt-1">
            <p>123 Business Street</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
            <p className="mt-1">contact@yourcompany.com</p>
          </div>
        </div>
      </div>

      {/* Bill To & Invoice Details */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="font-bold text-gray-700 mb-2">BILL TO</h2>
          <div className="text-gray-600">
            <p className="font-semibold">Customer Name</p>
            <p>123 Customer Street</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
            <p className="mt-1">customer@example.com</p>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold text-gray-700">Invoice Date:</span>
            <span className="ml-2 text-gray-600">{invoiceDate}</span>
          </div>
          <div className="mb-2">
            <span className="font-bold text-gray-700">Plan:</span>
            <span className="ml-2 text-gray-600">{subscription.plan}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700">Status:</span>
            <span className={`ml-2 ${
              subscription.status === 'Active' ? 'text-green-600' : 
              subscription.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {subscription.status}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-bold text-gray-700">Plan</th>
              <th className="py-2 px-4 font-bold text-gray-700">Billing Cycle</th>
              <th className="py-2 px-4 font-bold text-gray-700 text-right">Amount</th>
              <th className="py-2 px-4 font-bold text-gray-700 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 px-4 font-medium">{subscription.plan}</td>
              <td className="py-4 px-4 text-gray-600">Monthly</td>
              <td className="py-4 px-4 text-right">{subscription.amount} USDT</td>
              <td className="py-4 px-4 text-right">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  subscription.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  subscription.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscription.status}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>{subscription.amount} USDT</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Tax:</span>
            <span>0.00 USDT</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
            <span>Total:</span>
            <span>{subscription.amount} USDT</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-bold text-gray-700 mb-2">Subscription Terms</h3>
        <p className="text-gray-600 text-sm">
          This subscription will automatically renew each month until cancelled. 
          You can manage your subscription anytime in your account settings. 
          For any questions about your subscription, please contact support@yourcompany.com.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
        <p>Thank you for your subscription!</p>
      </div>
    </div>
  );
}