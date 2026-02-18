"use client";

import { JSX, useState } from "react";
import Image from "next/image";
import { OrderItemCollapsibleProps } from "@/types/Orders";
import CollapsibleHeader from "./CollapsibleHeader";
import shoe from "@/assets/ProductImage/shoe2.png";
import { useDeleteOrderItemMutation } from "@/redux/features/orders/ordersApi";
import Swal from "sweetalert2";

export default function OrderItemCollapsible({
  item,
  canDelete = false,
}: OrderItemCollapsibleProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [deleteOrderItem, { isLoading: isDeleting }] =
    useDeleteOrderItemMutation();

  const handleDelete = async () => {
    if (!canDelete || isDeleting || !item?.id) return;

    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Delete Item",
        text: `Are you sure you want to remove "${item.name}" from this order?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF3A44",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Call the delete mutation
        const response = await deleteOrderItem(item.id).unwrap();

        // Show success message
        if (response.success) {
          Swal.fire({
            title: "Deleted!",
            text: response.data?.message || "Item has been deleted.",
            icon: "success",
            confirmButtonColor: "#7244FF",
          });
        }
      }
    } catch (error) {
      console.error("Error deleting order item:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete the item. Please try again.",
        icon: "error",
        confirmButtonColor: "#7244FF",
      });
    }
  };

  // Determine image URL - ensure we're using the correct product image
  const imageUrl =
    item.image ||
    (item.product?.productImages?.length
      ? item.product.productImages.find(
          (img: { isPrimary: boolean }) => img.isPrimary
        )?.url || item.product.productImages[0]?.url
      : null) ||
    shoe;

  return (
    <div className="bg-bg-primary rounded-[12px] pt-2">
      <CollapsibleHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Order Item"
        className="!text-[17px]"
      />
      <span className={`px-3 py-1 text-[13px] font-medium font-poppins rounded-full text-sm whitespace-nowrap ml-4 ${
        item.fulfillmentStatus === "PROCESSING" 
          ? "bg-[#7244FF14] text-[#7244FF]" 
          : item.fulfillmentStatus === "SHIPPED"
          ? "bg-[#00AC6114] text-[#00AC61]"
          : item.fulfillmentStatus === "DELIVERED"
          ? "bg-[#00AC6114] text-[#00AC61]"
          : "bg-[#FF3A4414] text-[#FF3A44]"
      }`}>
        {item.fulfillmentStatus === "PROCESSING" 
          ? "Processing" 
          : item.fulfillmentStatus === "SHIPPED"
          ? "Shipped"
          : item.fulfillmentStatus === "DELIVERED"
          ? "Delivered"
          : "Unfulfilled"}
      </span>

      {isOpen && (
        <div className="px-4 py-8 flex sm:flex-row flex-col sm:items-center sm:justify-between sm:gap-y-0 gap-y-3">
          <div className="flex items-center">
            <div className="relative h-[130px] w-[132px] mr-4 bg-white flex justify-center items-center rounded-[22px]">
              <Image
                src={imageUrl}
                alt={item.name}
                width={130}
                height={132}
                className="object-contain max-h-[110px] max-w-[110px]"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-black font-poppins text-[18px]">
                {item.name}
              </h3>
              <p className="text-text-secondary font-medium font-poppins text-[18px]">
                {item.size && `SIZE: ${item.size}`}{" "}
                {item.brand && `, ${item.brand}`}
              </p>
              <p className="text-text-secondary font-medium font-poppins text-[18px]">
                QUANTITY: {item.quantity}
              </p>
              <p className="text-primary font-medium font-poppins text-[18px] mt-1">
                {item.price} USDT
              </p>
            </div>
          </div>

          {/* trash icon - only show if canDelete is true */}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex items-center justify-center p-2 rounded-full ${
                isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50"
              }`}
              aria-label="Delete item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 4H17.9C17.6679 2.87141 17.0538 1.85735 16.1613 1.12872C15.2687 0.40009 14.1522 0.00145452 13 0L11 0C9.8478 0.00145452 8.73132 0.40009 7.83875 1.12872C6.94618 1.85735 6.3321 2.87141 6.1 4H3C2.73478 4 2.48043 4.10536 2.29289 4.29289C2.10536 4.48043 2 4.73478 2 5C2 5.26522 2.10536 5.51957 2.29289 5.70711C2.48043 5.89464 2.73478 6 3 6H4V19C4.00159 20.3256 4.52888 21.5964 5.46622 22.5338C6.40356 23.4711 7.67441 23.9984 9 24H15C16.3256 23.9984 17.5964 23.4711 18.5338 22.5338C19.4711 21.5964 19.9984 20.3256 20 19V6H21C21.2652 6 21.5196 5.89464 21.7071 5.70711C21.8946 5.51957 22 5.26522 22 5C22 4.73478 21.8946 4.48043 21.7071 4.29289C21.5196 4.10536 21.2652 4 21 4ZM11 2H13C13.6203 2.00076 14.2251 2.19338 14.7316 2.55144C15.2381 2.90951 15.6214 3.41549 15.829 4H8.171C8.37858 3.41549 8.7619 2.90951 9.26839 2.55144C9.77487 2.19338 10.3797 2.00076 11 2ZM18 19C18 19.7956 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7956 22 15 22H9C8.20435 22 7.44129 21.6839 6.87868 21.1213C6.31607 20.5587 6 19.7956 6 19V6H18V19Z"
                  fill="#FF3A44"
                />
                <path
                  d="M10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V11C11 10.7348 10.8946 10.4804 10.7071 10.2929C10.5196 10.1054 10.2652 10 10 10C9.73478 10 9.48043 10.1054 9.29289 10.2929C9.10536 10.4804 9 10.7348 9 11V17C9 17.2652 9.10536 17.5196 9.29289 17.7071C9.48043 17.8946 9.73478 18 10 18Z"
                  fill="#FF3A44"
                />
                <path
                  d="M14 18C14.2652 18 14.5196 17.8946 14.7071 17.7071C14.8946 17.5196 15 17.2652 15 17V11C15 10.7348 14.8946 10.4804 14.7071 10.2929C14.5196 10.1054 14.2652 10 14 10C13.7348 10 13.4804 10.1054 13.2929 10.2929C13.1054 10.4804 13 10.7348 13 11V17C13 17.2652 13.1054 17.5196 13.2929 17.7071C13.4804 17.8946 13.7348 18 14 18Z"
                  fill="#FF3A44"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
