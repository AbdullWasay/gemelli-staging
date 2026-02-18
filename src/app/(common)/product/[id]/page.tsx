import CustomerItem from "@/components/pages/ProductDetailPage/CustomerItem";
import ProductPage from "@/components/pages/ProductDetailPage/ProductSize/ProductPage";
import ReviewVideoDetails from "@/components/pages/ProductDetailPage/ReviewVideoDetails";
import SalesHistory from "@/components/pages/ProductDetailPage/SaleHistory";

import React from "react";

const ProductDetail = () => {
    return (
        <div>
            <ProductPage />
            <CustomerItem />
            <ReviewVideoDetails />
            <SalesHistory />
        </div>
    );
};

export default ProductDetail;
