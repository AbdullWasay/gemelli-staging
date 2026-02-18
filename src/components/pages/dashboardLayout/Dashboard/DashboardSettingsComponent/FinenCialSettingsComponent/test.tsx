// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Download, ChevronDown, MoreVertical } from "lucide-react"
// import Heading from "@/components/ui/Heading/Heading"
// import React from "react"

// import fcard from "@/assets/images/dashboard/financial.png"
// import Image from "next/image"

// export default function FinenCialSettingsComponent() {
//   const [paymentMethods, setPaymentMethods] = useState([
//     {
//       id: 1,
//       type: "mastercard",
//       name: "MASTERCARD",
//       last4: "7658",
//       isSelected: true,
//     },
//     { id: 2, type: "paypal", name: "PAYPAL", last4: "7345", isSelected: false },
//   ])

//   const [incomeSource] = useState({
//     name: "Coffee Shop",
//     accountNo: "8459",
//     balance: {
//       usdt: 2820,
//       usd: 3384.0,
//     },
//   })

//   const [paymentHistory, setPaymentHistory] = useState([
//     {
//       id: "ID-38456",
//       recipient: "Knight Williams",
//       date: "17 Dec, 2023",
//       location: "Taiwan",
//       amount: 45.0,
//       status: "Pending",
//       currency: "USD",
//     },
//     {
//       id: "ID-38455",
//       recipient: "Knight Williams",
//       date: "17 Dec, 2023",
//       location: "Taiwan",
//       amount: 45.0,
//       status: "Completed",
//       currency: "USD",
//     },
//     {
//       id: "ID-38454",
//       recipient: "Knight Williams",
//       date: "17 Dec, 2023",
//       location: "London",
//       amount: 45.0,
//       status: "Cancelled",
//       currency: "USD",
//     },
//     {
//       id: "ID-38453",
//       recipient: "Knight Williams",
//       date: "17 Dec, 2023",
//       location: "Taiwan",
//       amount: 45.0,
//       status: "Pending",
//       currency: "USD",
//     },
//     {
//       id: "ID-38452",
//       recipient: "Knight Williams",
//       date: "17 Dec, 2023",
//       location: "London",
//       amount: 45.0,
//       status: "Completed",
//       currency: "USD",
//     },
//     {
//       id: "ID-38451",
//       recipient: "Knight Williams",
//       date: "17 Dec, 2023",
//       location: "London",
//       amount: 45.0,
//       status: "Cancelled",
//       currency: "USD",
//     },
//   ])

//   const [selectedRows, setSelectedRows] = useState<string[]>([])
//   const [selectAll, setSelectAll] = useState(false)

//   const [currentPage, setCurrentPage] = useState(1)
//   const [sortBy, setSortBy] = useState("date")
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
//   const [showSortDropdown, setShowSortDropdown] = useState(false)
//   const [actionMessage, setActionMessage] = useState<string | null>(null)

//   const [activeActionId, setActiveActionId] = useState<string | null>(null)

//   const actionDropdownRef = useRef<HTMLDivElement>(null)
//   const sortDropdownRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
//         setActiveActionId(null)
//       }
//       if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
//         setShowSortDropdown(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   useEffect(() => {
//     const sortedHistory = [...paymentHistory].sort((a, b) => {
//       let comparison = 0

//       switch (sortBy) {
//         case "date":
//           comparison = a.date.localeCompare(b.date)
//           break
//         case "amount":
//           comparison = a.amount - b.amount
//           break
//         case "status":
//           comparison = a.status.localeCompare(b.status)
//           break
//         case "recipient":
//           comparison = a.recipient.localeCompare(b.recipient)
//           break
//         case "location":
//           comparison = a.location.localeCompare(b.location)
//           break
//         default:
//           comparison = 0
//       }

//       return sortOrder === "asc" ? comparison : -comparison
//     })

//     setPaymentHistory(sortedHistory)
//     console.log(Sorted payment history by: ${sortBy} (${sortOrder}), sortedHistory)
//   }, [sortBy, sortOrder])

//   useEffect(() => {
//     if (selectAll) {
//       setSelectedRows(paymentHistory.map((payment) => payment.id))
//     } else if (selectedRows.length === paymentHistory.length) {
//       setSelectedRows([])
//     }
//   }, [selectAll])

//   useEffect(() => {
//     if (selectedRows.length === paymentHistory.length && paymentHistory.length > 0) {
//       setSelectAll(true)
//     } else if (selectAll) {
//       setSelectAll(false)
//     }
//   }, [selectedRows])

//   const selectPaymentMethod = (id: number) => {
//     const updatedMethods = paymentMethods.map((method) => ({
//       ...method,
//       isSelected: method.id === id,
//     }))

//     setPaymentMethods(updatedMethods)
//     console.log(
//       "Selected payment method:",
//       updatedMethods.find((m) => m.id === id),
//     )
//   }

//   const addNewPaymentMethod = () => {
//     console.log("Add new payment method clicked")

//     alert("Add new payment method functionality would open a form here")
//   }

//   const managePaymentMethods = () => {
//     console.log("Manage payment methods clicked")

//     alert("Manage payment methods functionality would navigate to a management page")
//   }

//   const viewIncomeDetails = () => {
//     console.log("View income details clicked", incomeSource)

//     alert(
//       Income Details for ${incomeSource.name}\nBalance: ${incomeSource.balance.usdt} USDT (${incomeSource.balance.usd} USD),
//     )
//   }

//   const configureBankAccount = () => {
//     console.log("Configure bank account clicked")

//     alert("Configure bank account functionality would navigate to a setup page")
//   }

//   const downloadPaymentHistory = () => {
//     console.log("Download payment history clicked", paymentHistory)

//     alert("Payment history would be downloaded as a CSV or PDF file")
//   }

//   const handleSortChange = (sortOption: string) => {
//     if (sortBy === sortOption) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc")
//     } else {
//       setSortBy(sortOption)
//       setSortOrder("desc")
//     }

//     setShowSortDropdown(false)
//   }

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page)
//     console.log("Changed to page:", page)
//   }

//   const toggleActionDropdown = (paymentId: string) => {
//     setActiveActionId(activeActionId === paymentId ? null : paymentId)
//   }

//   const toggleRowSelection = (paymentId: string) => {
//     setSelectedRows((prev) => {
//       if (prev.includes(paymentId)) {
//         return prev.filter((id) => id !== paymentId)
//       } else {
//         return [...prev, paymentId]
//       }
//     })

//     console.log("Selected payment row:", paymentId)
//   }

//   // Toggle select all
//   const toggleSelectAll = () => {
//     setSelectAll(!selectAll)
//     console.log("Select all toggled:", !selectAll)
//   }

//   // Complete Payment
//   const completePayment = (paymentId: string) => {
//     const updatedHistory = paymentHistory.map((payment) => {
//       if (payment.id === paymentId) {
//         const updatedPayment = { ...payment, status: "Completed" }
//         console.log("Payment completed:", updatedPayment)
//         return updatedPayment
//       }
//       return payment
//     })

//     setPaymentHistory(updatedHistory)
//     setActionMessage(Payment ${paymentId} marked as completed)
//     setActiveActionId(null)

//     setTimeout(() => setActionMessage(null), 3000)
//   }

//   const cancelPayment = (paymentId: string) => {
//     const updatedHistory = paymentHistory.map((payment) => {
//       if (payment.id === paymentId) {
//         const updatedPayment = { ...payment, status: "Cancelled" }
//         console.log("Payment cancelled:", updatedPayment)
//         return updatedPayment
//       }
//       return payment
//     })

//     setPaymentHistory(updatedHistory)
//     setActionMessage(Payment ${paymentId} has been cancelled)
//     setActiveActionId(null)

//     setTimeout(() => setActionMessage(null), 3000)
//   }

//   const bulkCompletePayments = () => {
//     if (selectedRows.length === 0) return

//     const updatedHistory = paymentHistory.map((payment) => {
//       if (selectedRows.includes(payment.id) && payment.status !== "Completed") {
//         return { ...payment, status: "Completed" }
//       }
//       return payment
//     })

//     setPaymentHistory(updatedHistory)
//     console.log("Bulk completed payments:", selectedRows)
//     setActionMessage(${selectedRows.length} payments marked as completed)
//     setSelectedRows([])
//     setSelectAll(false)

//     setTimeout(() => setActionMessage(null), 3000)
//   }

//   const bulkCancelPayments = () => {
//     if (selectedRows.length === 0) return

//     const updatedHistory = paymentHistory.map((payment) => {
//       if (selectedRows.includes(payment.id) && payment.status !== "Cancelled") {
//         return { ...payment, status: "Cancelled" }
//       }
//       return payment
//     })

//     setPaymentHistory(updatedHistory)
//     console.log("Bulk cancelled payments:", selectedRows)
//     setActionMessage(${selectedRows.length} payments have been cancelled)
//     setSelectedRows([])
//     setSelectAll(false)

//     setTimeout(() => setActionMessage(null), 3000)
//   }

//   // const getStatusColor = (status: string) => {
//   //   switch (status.toLowerCase()) {
//   //     case "completed":
//   //       return "text-green-600 bg-green-50";
//   //     case "pending":
//   //       return "text-yellow-600 bg-yellow-50";
//   //     case "cancelled":
//   //       return "text-red-600 bg-red-50";
//   //     default:
//   //       return "text-gray-600 bg-gray-50";
//   //   }
//   // };

//   useEffect(() => {
//     console.log("Financial Page Loaded")
//     console.log("Payment Methods:", paymentMethods)
//     console.log("Income Source:", incomeSource)
//     console.log("Payment History:", paymentHistory)
//   }, [])

//   return (
//     <div className=" mx-auto sm:p-6  ">
//       <Heading className="!text-[16px] mb-6 !mt-0">Financial</Heading>

//       {actionMessage && (
//         <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">{actionMessage}</div>
//       )}

//       <div className="bg-white rounded-lg p-6 mb-6 shadow-sm max-w-full overflow-hidden">
//         <h2 className="text-lg font-medium mb-1">Saved Payment Methods</h2>
//         <p className="text-sm text-gray-500 mb-4">
//           Manage and update your payment methods for subscriptions and transactions.
//         </p>

//         <div className="space-y-4 mb-6">
//           {paymentMethods.map((method) => (
//             <div
//               key={method.id}
//               className="flex sm:flex-row flex-col sm:items-center justify-between p-3 border border-gray-200 rounded-lg"
//               onClick={() => selectPaymentMethod(method.id)}
//             >
//               <div className="flex items-center">
//                 <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mr-3">
//                   {method.isSelected && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
//                 </div>

//                 {method.type === "mastercard" ? (
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-2">
//                       <span className="text-white text-xs">MC</span>
//                     </div>
//                     <span className="font-medium">{method.name}</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
//                       <span className="text-white text-xs">PP</span>
//                     </div>
//                     <span className="font-medium">{method.name}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="text-gray-500 sm:ml-0 ml-9">•••••••• {method.last4}</div>
//             </div>
//           ))}
//         </div>

//         <div className="space-y-3">
//           <button
//             onClick={addNewPaymentMethod}
//             className="w-full py-3 bg-red-500 text-white rounded-full font-medium flex items-center justify-center"
//           >
//             Remove
//           </button>

//           <button
//             onClick={managePaymentMethods}
//             className="w-full py-3 text-purple-600 border border-purple-600 rounded-full font-medium"
//           >
//             Manage payment methods
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg p-6 mb-6 shadow-sm max-w-full overflow-hidden">
//         <h2 className="text-lg font-medium mb-4">Income & Transfers</h2>

//         <div className="flex flex-col md:flex-row  md:justify-between">
//           <div className="mb-4 md:mb-0">
//             <p className="text-[15px] font-poppins text-gray-500 mb-4">
//               Set as your main source to collect earnings (withdrawal)
//             </p>

//             <div className="mb-2">
//               <p className="text-sm text-gray-500">Bank Name</p>
//               <p className="font-medium">{incomeSource.name}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">Account No.</p>
//               <p className="font-medium">
//                 <span className="mt-3">**** **** ****</span> {incomeSource.accountNo}
//               </p>
//             </div>
//           </div>

//           <div className=" max-w-[400px] md:w-auto relative">
//             <Image alt="" src={fcard || "/placeholder.svg"} className="sm:h-auto h-[160px]" />
//             <div className="flex flex-col  justify-between absolute top-1/2 left-[22px] -translate-y-1/2">
//               <div>
//                 <p className="sm:text-[12px] text-[10px] opacity-90 text-white font-poppins ">Available Balance</p>
//                 <p className="sm:text-[26px] tex-[12px] font-semibold text-white ">{incomeSource.balance.usdt} USDT</p>
//                 <p className="sm:text-[20px] text-[10px]  text-white font-poppins sm:mt-4 mt-1">
//                   <span className="text-[16px] opacity-80">Pendings: </span>${incomeSource.balance.usd.toFixed(2)}
//                 </p>
//               </div>

//               <button
//                 onClick={viewIncomeDetails}
//                 className="sm:mt-3 mt-2 sm:w-[147px] w-[110px] h-[38px] bg-white text-green-600 rounded-md text-sm font-medium "
//               >
//                 View Details
//               </button>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={configureBankAccount}
//           className="w-full mt-4 py-3 text-purple-600 border border-purple-600 rounded-full font-medium"
//         >
//           Configure Bank Account
//         </button>
//       </div>

//       <div className="bg-white rounded-lg p-6 shadow-sm  max-w-full overflow-x-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-medium">Payment History</h2>

//           <div className="flex items-center space-x-2">
//             {selectedRows.length > 0 && (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={bulkCompletePayments}
//                   className="py-2 px-3 bg-green-500 text-white rounded-md text-sm font-medium"
//                 >
//                   Complete Selected
//                 </button>
//                 <button
//                   onClick={bulkCancelPayments}
//                   className="py-2 px-3 bg-red-500 text-white rounded-md text-sm font-medium"
//                 >
//                   Cancel Selected
//                 </button>
//               </div>
//             )}

//             <button
//               onClick={downloadPaymentHistory}
//               className="py-2 px-3 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center"
//             >
//               <Download size={16} className="mr-1" />
//               Download
//             </button>

//             <div className="relative" ref={sortDropdownRef}>
//               <button
//                 onClick={() => setShowSortDropdown(!showSortDropdown)}
//                 className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium flex items-center"
//               >
//                 Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} {sortOrder === "asc" ? "↑" : "↓"}
//                 <ChevronDown size={16} className="ml-1" />
//               </button>

//               {showSortDropdown && (
//                 <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                   <div className="py-1">
//                     <button
//                       onClick={() => handleSortChange("date")}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
//                     </button>
//                     <button
//                       onClick={() => handleSortChange("amount")}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
//                     </button>
//                     <button
//                       onClick={() => handleSortChange("status")}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
//                     </button>
//                     <button
//                       onClick={() => handleSortChange("recipient")}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Recipient {sortBy === "recipient" && (sortOrder === "asc" ? "↑" : "↓")}
//                     </button>
//                     <button
//                       onClick={() => handleSortChange("location")}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Location {sortBy === "location" && (sortOrder === "asc" ? "↑" : "↓")}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="w-full overflow-x-auto">
//           <div className="lg:min-w-0 min-w-[920px]">
//             <div className="grid grid-cols-8 gap-y-4">
//               {/* Table Header */}
//               <div className="font-bold bg-[#EDF4FF] p-4 rounded-tl-md rounded-bl-md">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={toggleSelectAll}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   />
//                 </div>
//               </div>
//               <div className="font-bold bg-[#EDF4FF] p-4">Profile ID</div>
//               <div className="font-bold bg-[#EDF4FF] p-4">Recipient Name</div>
//               <div className="font-bold bg-[#EDF4FF] p-4">Date</div>
//               <div className="font-bold bg-[#EDF4FF] p-4">Location</div>
//               <div className="font-bold bg-[#EDF4FF] p-4">Amount</div>
//               <div className="font-bold bg-[#EDF4FF] p-4">Status</div>
//               <div className="font-bold bg-[#EDF4FF] p-4 rounded-tr-md rounded-br-md">Actions</div>

//               {/* Table Rows */}
//               {paymentHistory.map((payment, index) => (
//                 <React.Fragment key={row-${payment.id}}>
//                   <div className="py-4 bg-[#F9F9F9] px-4 rounded-tl-md rounded-bl-md">
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.includes(payment.id)}
//                         onChange={() => toggleRowSelection(payment.id)}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </div>
//                   </div>
//                   <div className="py-4 bg-[#F9F9F9] px-4 truncate">{payment.id}</div>
//                   <div className="py-4 bg-[#F9F9F9] px-4 truncate">{payment.recipient}</div>
//                   <div className="py-4 bg-[#F9F9F9] px-4 truncate">{payment.date}</div>
//                   <div className="py-4 bg-[#F9F9F9] px-4 truncate">{payment.location}</div>
//                   <div className="py-4 bg-[#F9F9F9] px-4 truncate">{payment.amount}</div>
//                   <div className="py-4 bg-[#F9F9F9] px-4 truncate">{payment.status}</div>
//                   <div className="py-4 rounded-tr-md rounded-br-md bg-[#F9F9F9] px-4">
//                     <div ref={activeActionId === payment.id ? actionDropdownRef : null}>
//                       <button
//                         onClick={() => toggleActionDropdown(payment.id)}
//                         className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
//                       >
//                         <MoreVertical size={16} />
//                       </button>

//                       {activeActionId === payment.id && (
//                         <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
//                           <div className="py-1">
//                             {payment.status !== "Completed" && (
//                               <button
//                                 onClick={() => completePayment(payment.id)}
//                                 className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
//                               >
//                                 Complete
//                               </button>
//                             )}
//                             {payment.status !== "Cancelled" && (
//                               <button
//                                 onClick={() => cancelPayment(payment.id)}
//                                 className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* 
//         <div className="">
//           <table className="">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="py-3 pl-4 pr-3 text-left">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={toggleSelectAll}
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     />
//                   </div>
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Profile ID
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Recipient Name
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {paymentHistory.map((payment, index) => (
//                 <tr
//                   key={payment.id}
//                   className={
//                     index !== paymentHistory.length - 1
//                       ? "border-b border-gray-200"
//                       : ""
//                   }
//                 >
//                   <td className="py-4 pl-4 pr-3">
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.includes(payment.id)}
//                         onChange={() => toggleRowSelection(payment.id)}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </div>
//                   </td>
//                   <td className="py-4 text-sm text-gray-500">{payment.id}</td>
//                   <td className="py-4 text-sm font-medium">
//                     {payment.recipient}
//                   </td>
//                   <td className="py-4 text-sm text-gray-500">{payment.date}</td>
//                   <td className="py-4 text-sm text-gray-500">
//                     {payment.location}
//                   </td>
//                   <td className="py-4 text-sm font-medium">
//                     ${payment.amount.toFixed(2)} {payment.currency}
//                   </td>
//                   <td className="py-4">
//                     <span
//                       className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
//                         payment.status
//                       )}`}
//                     >
//                       {payment.status}
//                     </span>
//                   </td>
//                   <td className="py-4 relative">
//                     <div
//                       ref={
//                         activeActionId === payment.id ? actionDropdownRef : null
//                       }
//                     >
//                       <button
//                         onClick={() => toggleActionDropdown(payment.id)}
//                         className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
//                       >
//                         <MoreVertical size={16} />
//                       </button>

//                       {activeActionId === payment.id && (
//                         <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
//                           <div className="py-1">
//                             {payment.status !== "Completed" && (
//                               <button
//                                 onClick={() => completePayment(payment.id)}
//                                 className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
//                               >
//                                 Complete
//                               </button>
//                             )}
//                             {payment.status !== "Cancelled" && (
//                               <button
//                                 onClick={() => cancelPayment(payment.id)}
//                                 className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div> */}

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-6">
//         <button
//           onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//           className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>

//         <div className="flex items-center space-x-1">
//           {[1, 2, 3, 4, 5].map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
//                 currentPage === page ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => handlePageChange(Math.min(5, currentPage + 1))}
//           className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
//           disabled={currentPage === 5}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   )
// }