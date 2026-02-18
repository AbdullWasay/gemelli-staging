import { baseApi } from "../../api/baseApi";

// Define types for our API responses
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  primaryImageUrl?: string;
  category?: string;
  taxRate?: string;
  discountPrice?: number;
  onSale: boolean;
  sku?: string;
  trackInventory?: string;
  lowStockAlert?: number;
  size?: string;
  color?: string;
  material?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  seoTitle?: string;
  metaDescription?: string;
  productTags?: string;
  visibility?: string;
  status?: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  productImages?: ProductImage[];
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

// For frontend image selection and upload
export interface ProductImageUpload {
  id: string;
  file: File;
  previewUrl: string;
  isPrimary: boolean;
}

export interface ProductFormData {
  productTitle: string;
  category: string;
  price: string;
  onSale: boolean;
  discountPrice: string;
  sku: string;
  stockQuantity: string;
  trackInventory: string;
  lowStockAlert: string;
  productDescription: string;
  size: string;
  color: string;
  material: string;
  length: string;
  height: string;
  width: string;
  weight: string;
  seoTitle: string;
  metaDescription: string;
  productTags: string;
  visibility: string;
  status: string;
}

// API response types
interface ProductResponse {
  success: boolean;
  data?: {
    product: Product;
    message?: string;
  };
  error?: string;
}

interface ProductsResponse {
  success: boolean;
  data?: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
}

interface ProductImageResponse {
  success: boolean;
  data?: {
    productImage: ProductImage;
    url?: string;
    message?: string;
  };
  error?: string;
}

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with pagination, filtering
    getProducts: builder.query<
      ProductsResponse,
      {
        sellerId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ sellerId, page = 1, limit = 10 }) => {
        let url = `api/products?page=${page}&limit=${limit}`;
        if (sellerId) {
          url += `&sellerId=${sellerId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),

    // Get a single product by ID (as mutation for more control)
    getProductById: builder.mutation<ProductResponse, string>({
      query: (id) => ({
        url: `api/products?id=${id}`,
        method: "GET",
      }),
      invalidatesTags: (result, error, id) => [{ type: "products", id }],
    }),

    // Create a new product
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createProduct: builder.mutation<ProductResponse, any>({
      query: (productData) => {
        return {
          url: "api/products",
          method: "POST",
          body: productData,
          // Add headers to improve error handling and debugging
          responseHandler: "json", // Ensure JSON parsing even for error responses
        };
      },
      // Transforming the error response for better debugging
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transformErrorResponse: (response, meta, arg) => {
        console.log("Create product error response:", response);
        // If we have a custom error format, extract it
        if (response.data) {
          return response;
        }
        return {
          data: { error: "Network or server error" },
          status: response.status,
        };
      },
      invalidatesTags: ["products"],
    }),

    // Update an existing product
    updateProduct: builder.mutation<
      ProductResponse,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id: string; productData: any }
    >({
      query: ({ id, productData }) => {
        return {
          url: "api/products",
          method: "PUT",
          body: { id, ...productData },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "products", id },
        "products",
      ],
    }),

    // Delete a product
    deleteProduct: builder.mutation<ProductResponse, string>({
      query: (id) => {
        return {
          url: `api/products?id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["products"],
    }),

    // Upload a product image
    uploadProductImage: builder.mutation<
      ProductImageResponse,
      { file: File; productId: string; isPrimary: boolean; order?: number }
    >({
      query: ({ file, productId, isPrimary, order = 0 }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", productId);
        formData.append("isPrimary", isPrimary ? "true" : "false");
        formData.append("order", order.toString());

        console.log(
          `Preparing to upload image for product ${productId}, isPrimary: ${isPrimary}, order: ${order}`
        );

        return {
          url: "api/products/images",
          method: "POST",
          body: formData,
          // Important: Don't set Content-Type, it will be set automatically with boundary
          formData: true,
          responseHandler: "json",
        };
      },
      // Improved error handling
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transformErrorResponse: (response, meta, arg) => {
        console.log("Upload image error response:", response);
        // If we have a custom error format, extract it
        if (response.data) {
          return response;
        }
        return {
          data: { error: "Network or server error with image upload" },
          status: response.status,
        };
      },
      invalidatesTags: (result, error, { productId }) => [
        { type: "products", id: productId },
        "products",
      ],
    }),

    // Update a product image
    updateProductImage: builder.mutation<
      ProductImageResponse,
      { id: string; isPrimary?: boolean; order?: number }
    >({
      query: ({ id, isPrimary, order }) => {
        return {
          url: "api/products/images",
          method: "PUT",
          body: { id, isPrimary, order },
        };
      },
      invalidatesTags: (result) => [
        { type: "products", id: result?.data?.productImage.productId || "" },
        "products",
      ],
    }),

    // Delete a product image
    deleteProductImage: builder.mutation<ProductImageResponse, string>({
      query: (id) => {
        return {
          url: `api/products/images?id=${id}`,
          method: "DELETE",
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (result, error, id) => ["products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
} = productsApi;

export default productsApi;
