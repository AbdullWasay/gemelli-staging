"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Heading from "@/components/ui/Heading/Heading";
import {
  useDeleteProductMutation,
  useGetProductByIdMutation,
} from "@/redux/features/products/productsApi";
import { toast } from "sonner";

export default function DeleteProductComponent() {
  const router = useRouter();
  const { productId } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // API mutations
  const [getProductById] = useGetProductByIdMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (productId) {
          const response = await getProductById(productId.toString());
          if ("data" in response && response.data?.success) {
            setProduct(response.data.data?.product);
          } else {
            // Product not found or error fetching
            toast.error("Product not found");
            router.push("/dashboard/product-management");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getProductById, router]);

  const handleCancel = () => {
    router.push("/dashboard/product-management");
  };

  const handleDelete = async () => {
    if (productId) {
      try {
        const response = await deleteProduct(productId.toString());
        if ("data" in response && response.data?.success) {
          toast.success("Product deleted successfully");
          router.push("/dashboard/product-management");
        } else {
          toast.error(
            "data" in response && response.error
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (response.error as any).data?.error ||
                  "Failed to delete product"
              : "Failed to delete product"
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading || !product) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4">
      <div className="mb-6">
        <Link
          href={"/dashboard/product-management"}
          className="flex items-center gap-2 mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
          >
            <path
              d="M23 9C23.5523 9 24 8.55228 24 8C24 7.44772 23.5523 7 23 7V9ZM0.292892 7.29289C-0.0976315 7.68342 -0.0976315 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM23 7L1 7V9L23 9V7Z"
              fill="#646464"
            />
          </svg>
          <Heading className="!mt-0 text-[#0F0F0F]">Add Product</Heading>
        </Link>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <div className="flex flex-col items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="81"
            viewBox="0 0 80 81"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M47.3228 64.2263H41.7897C41.5295 64.2263 41.2691 64.0962 41.139 63.966C41.0087 63.8357 40.8786 63.5103 40.8786 63.2499L41.7897 37.0823C41.7897 36.5615 42.2456 36.171 42.701 36.171H49.6662C49.9266 36.171 50.187 36.3012 50.3823 36.4964C50.5777 36.6918 50.6427 36.9522 50.6427 37.2126L48.2995 63.3802C48.2342 63.8358 47.8436 64.2263 47.3228 64.2263ZM71.147 80.4997H8.78763C3.90559 80.4997 0 76.5292 0 71.647V9.28763C0 4.40559 3.90558 0.5 8.78763 0.5H71.2122C76.0942 0.5 79.9998 4.40558 79.9998 9.28763V71.7126C79.9998 76.5295 76.0292 80.4997 71.147 80.4997ZM8.78763 2.38752C4.94701 2.38752 1.88776 5.44677 1.88776 9.2874V71.7124C1.88776 75.5528 4.947 78.6774 8.78763 78.6774L71.2122 78.6772C75.0528 78.6772 78.1772 75.5529 78.1772 71.7122V9.28768C78.1772 5.51221 75.0528 2.3878 71.2122 2.3878L8.78763 2.38752ZM52.9211 72.0378H23.4335C22.9779 72.0378 22.5224 71.6474 22.5224 71.1917L18.7469 29.4016C18.7469 29.1412 18.8119 28.8808 19.0072 28.6856C19.2026 28.4901 19.463 28.36 19.7234 28.36L51.671 28.3598L19.6582 16.1874C19.2026 15.992 18.9422 15.4712 19.1374 14.9506L20.3743 11.6959C20.7648 10.5894 21.6109 9.74321 22.6525 9.28738C23.7591 8.83173 24.9308 8.76659 26.0373 9.22242L35.7161 12.8885L36.5176 10.7197C36.5825 10.4594 36.778 10.3292 37.0384 10.199C37.2336 10.0688 37.494 10.0688 37.7544 10.199L48.9505 14.43C49.2109 14.4951 49.341 14.6904 49.4711 14.9508C49.6014 15.2112 49.6014 15.4064 49.4711 15.6668L48.6578 17.7902L58.5189 21.5251C59.5605 21.9156 60.4718 22.7618 60.9275 23.8683C61.3833 24.9749 61.4483 26.1465 60.9926 27.2533L59.7558 30.443C59.6908 30.7034 59.4956 30.8335 59.2352 30.9638C59.1051 31.0288 58.9748 31.0288 58.8447 31.0288C58.7144 31.0288 58.6492 31.0288 58.5191 30.9638L57.6274 30.6248L53.9625 71.1915C53.8324 71.7123 53.4417 72.0378 52.9211 72.0378ZM24.2799 70.1501H52.0748L55.655 30.2478H20.6998L24.2799 70.1501ZM37.5007 13.5643L46.8855 17.1189L47.3882 15.862L37.9497 12.2819L37.5007 13.5643ZM21.1553 14.7554L58.3239 28.8807L59.2352 26.5375C59.4956 25.8866 59.4956 25.2355 59.17 24.6498C58.9096 24.0638 58.3888 23.543 57.8031 23.3478L25.3214 10.9801C24.6705 10.7197 24.0194 10.7197 23.3685 11.0451C22.7828 11.3055 22.3269 11.8263 22.0665 12.412L21.1553 14.7554ZM42.7665 62.3388H46.4767L48.6248 37.9937H43.6127L42.7665 62.3388ZM34.5647 64.2264H29.0318C28.5761 64.2264 28.1205 63.8359 28.1205 63.3802L25.7773 37.2127C25.7773 36.9523 25.8422 36.6919 26.0375 36.4964C26.2329 36.3012 26.4933 36.1711 26.7537 36.1711H33.7184C34.2392 36.1711 34.6297 36.5616 34.6297 37.0824L35.541 63.2499C35.541 63.5103 35.4758 63.7707 35.2806 63.966C35.0853 64.1614 34.8249 64.2264 34.5647 64.2264ZM29.8779 62.3388H33.5882L32.7421 37.9937H27.7298L29.8779 62.3388Z"
              fill="#F9F9F9"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M37.5 13.5637L46.8849 17.1182L47.3874 15.8613L37.9491 12.2812L37.5 13.5637Z"
              fill="#6A7174"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M57.8041 23.3475L25.3224 10.9798C24.6715 10.7195 24.0204 10.7194 23.3695 11.0448C22.7838 11.3052 22.3279 11.826 22.0675 12.4118L21.1562 14.7551L58.3249 28.8804L59.2362 26.5372C59.4966 25.8863 59.4966 25.2352 59.171 24.6495C58.9106 24.0636 58.3899 23.5428 57.8041 23.3475Z"
              fill="#474F54"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M48.6241 37.9941H43.6117L42.7656 62.3392H46.4758L48.6241 37.9941Z"
              fill="#474F54"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M33.5889 62.3392L32.7428 37.9941H27.7305L29.8783 62.3392H33.5889Z"
              fill="#474F54"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M34.6291 37.0828L35.5403 63.2503C35.5403 63.5107 35.4752 63.7711 35.2799 63.9664C35.0847 64.1618 34.8243 64.2268 34.5641 64.2268H29.0312C28.5755 64.2268 28.1199 63.8363 28.1199 63.3806L25.7767 37.2131C25.7767 36.9527 25.8416 36.6923 26.0369 36.4968C26.2323 36.3016 26.4927 36.1715 26.7531 36.1715H33.7178C34.2386 36.1715 34.6291 36.562 34.6291 37.0828ZM40.8782 63.2503L41.7893 37.0828C41.7893 36.562 42.2452 36.1715 42.7006 36.1715H49.6658C49.9262 36.1715 50.1866 36.3016 50.3819 36.4968C50.5773 36.6923 50.6423 36.9527 50.6423 37.2131L48.2991 63.3806C48.2337 63.8363 47.8432 64.2268 47.3224 64.2268H41.7894C41.5291 64.2268 41.2688 64.0967 41.1386 63.9664C41.0084 63.8361 40.8782 63.5107 40.8782 63.2503ZM24.2793 70.1504H52.0742L55.6544 30.248H20.6992L24.2793 70.1504Z"
              fill="#FE646F"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.7223 28.3597L51.6699 28.3595L19.6572 16.1871C19.2015 15.9917 18.9411 15.4709 19.1364 14.9503L20.3732 11.6956C20.7637 10.589 21.6099 9.7429 22.6515 9.28706C23.758 8.83142 24.9297 8.76627 26.0362 9.2221L35.715 12.8881L36.5165 10.7193C36.5815 10.4591 36.7769 10.3288 37.0373 10.1987C37.2326 10.0684 37.493 10.0684 37.7533 10.1987L48.9495 14.4297C49.2099 14.4948 49.34 14.6901 49.4701 14.9505C49.6004 15.2109 49.6004 15.4061 49.4701 15.6665L48.6568 17.7899L58.5179 21.5248C59.5595 21.9153 60.4708 22.7614 60.9264 23.868C61.3823 24.9745 61.4472 26.1462 60.9916 27.253L59.7547 30.4427C59.6898 30.7031 59.4945 30.8332 59.2341 30.9635C59.104 31.0284 58.9737 31.0284 58.8436 31.0284C58.7133 31.0284 58.6482 31.0284 58.5181 30.9635L57.6264 30.6245L53.9614 71.1912C53.8313 71.712 53.4406 72.0375 52.92 72.0375H23.4324C22.9768 72.0375 22.5213 71.647 22.5213 71.1914L18.7458 29.4013C18.7458 29.1409 18.8108 28.8805 19.0061 28.6852C19.2015 28.4898 19.4619 28.3597 19.7223 28.3597ZM8.7866 78.6773L71.2111 78.6771C75.0517 78.6771 78.1761 75.5527 78.1761 71.7121V9.28757C78.1761 5.51209 75.0518 2.3877 71.2111 2.3877H8.7866C4.94597 2.3877 1.88672 5.44694 1.88672 9.28757V71.7126C1.88672 75.553 4.94597 78.6773 8.7866 78.6773Z"
              fill="#F9F9F9"
            />
          </svg>

          {/* <h2 className="text-xl font-medium mb-3">
           
          </h2> */}
          <Heading className="!mt-2 !text-[18px] mb-2">
            Are You Sure You Want To Delete &quot;{product.name}&quot;?
          </Heading>
          <p className="text-gray-500 text-sm mb-8 max-w-md">
            Deleting this product will remove it permanently from your inventory
            and sales records. This action cannot be undone.
          </p>

          <div className="flex md:flex-row flex-col gap-3 w-full max-w-md justify-center items-center">
            <button
              onClick={handleCancel}
              className=" h-[50px] w-[190px] bg-text-secondary/30 text-[#4C4C4C] rounded-xl hover:bg-gray-300 transition-colors uppercase text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className=" h-[50px] w-[190px] bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors uppercase text-sm font-medium flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
