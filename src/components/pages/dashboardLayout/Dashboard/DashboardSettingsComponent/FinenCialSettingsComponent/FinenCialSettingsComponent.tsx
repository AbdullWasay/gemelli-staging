"use client";

import { useState, useEffect } from "react";

import Heading from "@/components/ui/Heading/Heading";
import fcard from "@/assets/images/dashboard/financial.png";
import Image from "next/image";
import PaymentHistorySection from "./PaymentHistorySection";

export default function FinenCialSettingsComponent() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "mastercard",
      name: "MASTERCARD",
      last4: "7658",
      isSelected: true,
    },
    { id: 2, type: "paypal", name: "PAYPAL", last4: "7345", isSelected: false },
  ]);

  const [incomeSource] = useState({
    name: "Coffee Shop",
    accountNo: "8459",
    balance: {
      usdt: 2820,
      usd: 3384.0,
    },
  });

  const [paymentHistory] = useState([
    {
      id: "ID-38456",
      recipient: "Knight Williams",
      date: "17 Dec, 2023",
      location: "Taiwan",
      amount: 45.0,
      status: "Pending",
      currency: "USD",
    },
    {
      id: "ID-38455",
      recipient: "Knight Williams",
      date: "17 Dec, 2023",
      location: "Taiwan",
      amount: 45.0,
      status: "Completed",
      currency: "USD",
    },
    {
      id: "ID-38454",
      recipient: "Knight Williams",
      date: "17 Dec, 2023",
      location: "London",
      amount: 45.0,
      status: "Cancelled",
      currency: "USD",
    },
    {
      id: "ID-38453",
      recipient: "Knight Williams",
      date: "17 Dec, 2023",
      location: "Taiwan",
      amount: 45.0,
      status: "Pending",
      currency: "USD",
    },
    {
      id: "ID-38452",
      recipient: "Knight Williams",
      date: "17 Dec, 2023",
      location: "London",
      amount: 45.0,
      status: "Completed",
      currency: "USD",
    },
    {
      id: "ID-38451",
      recipient: "Knight Williams",
      date: "17 Dec, 2023",
      location: "London",
      amount: 45.0,
      status: "Cancelled",
      currency: "USD",
    },
  ]);

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectPaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isSelected: method.id === id,
    }));

    setPaymentMethods(updatedMethods);
    console.log(
      "Selected payment method:",
      updatedMethods.find((m) => m.id === id)
    );
  };

  const addNewPaymentMethod = () => {
    console.log("Add new payment method clicked");
    alert("Add new payment method functionality would open a form here");
  };

  const managePaymentMethods = () => {
    console.log("Manage payment methods clicked");
    alert(
      "Manage payment methods functionality would navigate to a management page"
    );
  };

  const viewIncomeDetails = () => {
    console.log("View income details clicked", incomeSource);
    alert(
      `Income Details for ${incomeSource.name}\nBalance: ${incomeSource.balance.usdt} USDT (${incomeSource.balance.usd} USD)`
    );
  };

  const configureBankAccount = () => {
    console.log("Configure bank account clicked");
    alert(
      "Configure bank account functionality would navigate to a setup page"
    );
  };

  const downloadPaymentHistory = () => {
    console.log("Download payment history clicked", paymentHistory);
    alert("Payment history would be downloaded as a CSV or PDF file");
  };

  useEffect(() => {
    console.log("Financial Page Loaded");
    console.log("Payment Methods:", paymentMethods);
    console.log("Income Source:", incomeSource);
    console.log("Payment History:", paymentHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto xl:p-6 w-full">
      <Heading className="!text-[16px] mb-6 !mt-0">Financial</Heading>

      {actionMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
          {actionMessage}
        </div>
      )}

      <div className="">
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm peyment-pethod md:max-w-full max-w-[280px]">
          <h2 className="text-lg font-medium mb-1">Saved Payment Methods</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage and update your payment methods for subscriptions and
            transactions.
          </p>

          <div className="space-y-4 mb-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex sm:flex-row flex-col sm:items-center justify-between p-3 border border-gray-200 rounded-lg"
                onClick={() => selectPaymentMethod(method.id)}
              >
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mr-3">
                    {method.isSelected && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>

                  {method.type === "mastercard" ? (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">MC</span>
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">PP</span>
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  )}
                </div>

                <div className="text-gray-500 sm:ml-0 ml-9">
                  •••••••• {method.last4}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={addNewPaymentMethod}
              className="w-full py-3 bg-red-500 text-white rounded-full font-medium flex items-center justify-center"
            >
              Remove
            </button>

            <button
              onClick={managePaymentMethods}
              className="w-full py-3 text-purple-600 border border-purple-600 rounded-full font-medium"
            >
              Manage payment methods
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm transfar  md:max-w-full max-w-[280px]">
        <h2 className="text-lg font-medium mb-4">Income & Transfers</h2>

        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-[15px] font-poppins text-gray-500 mb-4">
              Set as your main source to collect earnings (withdrawal)
            </p>

            <div className="mb-2">
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="font-medium">{incomeSource.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account No.</p>
              <p className="font-medium">
                <span className="mt-3">**** **** ****</span>{" "}
                {incomeSource.accountNo}
              </p>
            </div>
          </div>

          <div className="max-w-[400px] md:w-auto relative">
            <Image alt="" src={fcard} className="sm:h-auto h-[160px]" />
            <div className="flex flex-col justify-between absolute top-1/2 left-[22px] -translate-y-1/2">
              <div>
                <p className="sm:text-[12px] text-[10px] opacity-90 text-white font-poppins">
                  Available Balance
                </p>
                <p className="sm:text-[26px] tex-[12px] font-semibold text-white">
                  {incomeSource.balance.usdt} USDT
                </p>
                <p className="sm:text-[20px] text-[10px] text-white font-poppins sm:mt-4 mt-1">
                  <span className="text-[16px] opacity-80">Pendings: </span>$
                  {incomeSource.balance.usd.toFixed(2)}
                </p>
              </div>

              <button
                onClick={viewIncomeDetails}
                className="sm:mt-3 mt-2 sm:w-[147px] w-[110px] h-[38px] bg-white text-green-600 rounded-md text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={configureBankAccount}
          className="w-full mt-4 py-3 text-purple-600 border border-purple-600 rounded-full font-medium"
        >
          Configure Bank Account
        </button>
      </div>

      <PaymentHistorySection 
        paymentHistory={paymentHistory} 
        onDownload={downloadPaymentHistory}
        setActionMessage={setActionMessage}
      />
    </div>
  );
}