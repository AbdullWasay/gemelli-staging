import React from "react";
import EditProductForm from "@/components/pages/dashboardLayout/Dashboard/ProductManagement/EditProducts/EditProductForm";

export default function EditProductPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="bg-white p-6 rounded-xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit Product
        </h1>
        <EditProductForm />
      </div>
    </div>
  );
}
