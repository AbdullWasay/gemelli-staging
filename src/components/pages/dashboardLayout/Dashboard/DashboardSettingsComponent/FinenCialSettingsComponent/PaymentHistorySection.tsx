"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, MoreVertical } from "lucide-react";

export default function PaymentHistorySection({
  paymentHistory: initialPaymentHistory,
  onDownload,
  setActionMessage,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentHistory: any[];
  onDownload: () => void;
  setActionMessage: (message: string | null) => void;
}) {
  const [paymentHistory, setPaymentHistory] = useState(initialPaymentHistory);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const handleSortChange = (sortOption: string) => {
    if (sortBy === sortOption) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortOption);
      setSortOrder("desc");
    }

    setShowSortDropdown(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Changed to page:", page);
  };

  const toggleActionDropdown = (paymentId: string) => {
    setActiveActionId(activeActionId === paymentId ? null : paymentId);
  };

  const toggleRowSelection = (paymentId: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(paymentId)) {
        return prev.filter((id) => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
    console.log("Selected payment row:", paymentId);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    console.log("Select all toggled:", !selectAll);
  };

  const completePayment = (paymentId: string) => {
    const updatedHistory = paymentHistory.map((payment) => {
      if (payment.id === paymentId) {
        const updatedPayment = { ...payment, status: "Completed" };
        console.log("Payment completed:", updatedPayment);
        return updatedPayment;
      }
      return payment;
    });

    setPaymentHistory(updatedHistory);
    setActionMessage(`Payment ${paymentId} marked as completed`);
    setActiveActionId(null);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const cancelPayment = (paymentId: string) => {
    const updatedHistory = paymentHistory.map((payment) => {
      if (payment.id === paymentId) {
        const updatedPayment = { ...payment, status: "Cancelled" };
        console.log("Payment cancelled:", updatedPayment);
        return updatedPayment;
      }
      return payment;
    });

    setPaymentHistory(updatedHistory);
    setActionMessage(`Payment ${paymentId} has been cancelled`);
    setActiveActionId(null);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const bulkCompletePayments = () => {
    if (selectedRows.length === 0) return;

    const updatedHistory = paymentHistory.map((payment) => {
      if (selectedRows.includes(payment.id) && payment.status !== "Completed") {
        return { ...payment, status: "Completed" };
      }
      return payment;
    });

    setPaymentHistory(updatedHistory);
    console.log("Bulk completed payments:", selectedRows);
    setActionMessage(`${selectedRows.length} payments marked as completed`);
    setSelectedRows([]);
    setSelectAll(false);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const bulkCancelPayments = () => {
    if (selectedRows.length === 0) return;

    const updatedHistory = paymentHistory.map((payment) => {
      if (selectedRows.includes(payment.id) && payment.status !== "Cancelled") {
        return { ...payment, status: "Cancelled" };
      }
      return payment;
    });

    setPaymentHistory(updatedHistory);
    console.log("Bulk cancelled payments:", selectedRows);
    setActionMessage(`${selectedRows.length} payments have been cancelled`);
    setSelectedRows([]);
    setSelectAll(false);
    setTimeout(() => setActionMessage(null), 3000);
  };

  //     const getStatusColor = (status: string) => {
  //     switch (status.toLowerCase()) {
  //       case "completed":
  //         return "text-green-600 bg-green-50";
  //       case "pending":
  //         return "text-yellow-600 bg-yellow-50";
  //       case "cancelled":
  //         return "text-red-600 bg-red-50";
  //       default:
  //         return "text-gray-600 bg-gray-50";
  //     }
  //   };

  useEffect(() => {
    const sortedHistory = [...paymentHistory].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = a.date.localeCompare(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "recipient":
          comparison = a.recipient.localeCompare(b.recipient);
          break;
        case "location":
          comparison = a.location.localeCompare(b.location);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setPaymentHistory(sortedHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);
  

  useEffect(() => {
    if (selectAll) {
      setSelectedRows(paymentHistory.map((payment) => payment.id));
    } else if (selectedRows.length === paymentHistory.length) {
      setSelectedRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll]);

  useEffect(() => {
    if (
      selectedRows.length === paymentHistory.length &&
      paymentHistory.length > 0
    ) {
      setSelectAll(true);
    } else if (selectAll) {
      setSelectAll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows]);

  return (
    <div className="bg-[#F9F9F9] rounded-lg p-6 shadow-sm payment-history-section   border ">
      <div className="flex md:flex-row flex-col justify-between md:items-center mb-4 md:gap-0 gap-2">
        <h2 className="text-lg font-medium">Payment History</h2>

        <div className="flex md:items-center  md:space-x-2 max-w-[250px] md:max-w-full flex-wrap md:gap-0 gap-1">
          {selectedRows.length > 0 && (
            <div className="flex md:items-center  md:space-x-2 max-w-[250px] md:max-w-full flex-wrap md:gap-0 gap-1">
              <button
                onClick={bulkCompletePayments}
                className="text-sm text-green-600 hover:bg-gray-100 w-[142px] h-[48px] border  rounded-md  font-medium flex items-center justify-center text-center "
              >
                Complete Selected
              </button>
              <button
                onClick={bulkCancelPayments}
                className="w-[142px] h-[48px] bg-red-500 text-white rounded-md text-sm font-medium flex justify-center items-center"
              >
                Cancel Selected
              </button>
            </div>
          )}

          <button
            onClick={onDownload}
            className="w-[132px] h-[48px] bg-[#005BFF] text-white rounded-md text-sm font-medium flex items-center justify-center text-center"
          >
            <Download size={16} className="mr-1" />
            Download
          </button>

          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-[152px] h-[48px]  text-text-secondary border border-gray-300 rounded-md text-sm font-medium flex items-center justify-center"
            >
              Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}{" "}
              {sortOrder === "asc" ? "↑" : "↓"}
              <ChevronDown size={16} className="ml-1" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleSortChange("date")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Date{" "}
                    {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("amount")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Amount{" "}
                    {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("status")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Status{" "}
                    {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("recipient")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Recipient{" "}
                    {sortBy === "recipient" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("location")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Location{" "}
                    {sortBy === "location" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto xl:mr-0 -mr-28" style={{ maxWidth: "100vw" }} >
        <div className="min-w-[1100px] xl:min-w-0 grid grid-cols-8 gap-y-4 ">
          {/* Table Header */}
          <div className="font-bold bg-[#FFF] p-4 rounded-tl-md rounded-bl-md ">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
          </div>
          <div className=" bg-[#FFF] p-4  text-[13px] font-poppins text-[#212121] font-medium ">
            Profile ID
          </div>
          <div className=" bg-[#FFF] p-4  text-[13px] font-poppins text-[#212121] font-medium">
            Recipient Name
          </div>
          <div className="text-[13px] font-poppins text-[#212121] font-medium bg-[#FFF] p-4 ">
            Date
          </div>
          <div className="text-[13px] font-poppins text-[#212121] font-medium bg-[#FFF] p-4 ">
            Location
          </div>
          <div className="text-[13px] font-poppins text-[#212121] font-medium bg-[#FFF] p-4 ">
            Amount
          </div>
          <div className="text-[13px] font-poppins text-[#212121] font-medium bg-[#FFF] p-4 ">
            Status
          </div>
          <div className="text-[13px] font-poppins text-[#212121] font-medium bg-[#FFF] p-4 rounded-tr-md rounded-br-md min-w-[120px]">
            Actions
          </div>

          {/* Table Rows */}
          {paymentHistory.map((payment, index) => (
            <>
              <div
                className="bg-white font-poppins text-text-secondary text-[13px] font-medium p-4 rounded-tl-md rounded-bl-md  pt-2"
                key={`name-${index}`}
              >
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(payment.id)}
                    onChange={() => toggleRowSelection(payment.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded opacity-70"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div
                className="bg-white font-poppins text-text-secondary text-[13px] font-medium p-4  opacity-70"
                key={`price-${index}`}
              >
                {payment.id}
              </div>
              <div
                className="bg-white font-poppins text-text-secondary text-[13px] font-medium p-4  opacity-70"
                key={`stock-${index}`}
              >
                {payment.recipient}
              </div>
              <div
                className="bg-white font-poppins text-text-secondary text-[13px] font-medium p-4  opacity-70"
                key={`stock-${index}`}
              >
                {payment.date}
              </div>
              <div
                className="bg-white font-poppins text-text-secondary text-[13px] font-medium p-4  opacity-70"
                key={`stock-${index}`}
              >
                {payment.location}
              </div>
              <div
                className="bg-white font-poppins text-text-secondary text-[13px] font-medium p-4  opacity-70"
                key={`stock-${index}`}
              >
                {payment.amount}
              </div>
              <div
                className={`bg-white font-poppins text-text-secondary text-[13px] font-medium p-4  opacity-70 `}
                key={`stock-${index}`}
              >
                <div
                  className={`h-[29px] w-[79px] rounded-lg flex justify-center items-center bg-opacity-15 ${
                    payment.status === "Completed"
                      ? "text-[#00BB67] bg-[#00BB67] "
                      : payment.status === "Cancelled"
                      ? "text-[#FF3A44] bg-[#FF3A44]"
                      : "text-[#00A1F7] bg-[#00A1F7]"
                  }`}
                >
                  {payment.status}
                </div>
              </div>
              <div
                className="py-4 bg-white p-4  border-gray-200 relative rounded-tr-lg rounded-br-lg "
                key={`action-${index}`}
              >
                <div
                  ref={activeActionId === payment.id ? actionDropdownRef : null}
                >
                  <button
                    onClick={() => toggleActionDropdown(payment.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeActionId === payment.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <div className="py-1">
                        {payment.status !== "Completed" && (
                          <button
                            onClick={() => completePayment(payment.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                          >
                            Complete
                          </button>
                        )}
                        {payment.status !== "Cancelled" && (
                          <button
                            onClick={() => cancelPayment(payment.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      {/* </div> */}

      {/* Pagination */}
      <div className="flex md:flex-row flex-col md:items-center justify-between mt-6 md:gap-0 gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className=" border border-gray-300 rounded-md text-sm font-medium bg-[#646464] w-[106px] h-[46px] bg-opacity-15"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-md text-sm ${
                currentPage === page
                  ? "bg-blue-500 text-white "
                  : "text-gray-700 hover:bg-gray-100 border-[#646464] border"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(Math.min(5, currentPage + 1))}
          className="px-4 py-2 border border-gray-300 bg-[#005BFF] text-[#005BFF] rounded-md text-sm font-medium bg-opacity-[0.12] w-[106px] h-[46px]"
          disabled={currentPage === 5}
        >
          Next
        </button>
      </div>
    </div>
  );
}
