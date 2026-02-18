import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ProductImage {
  id: string;
  file: File | null;
  previewUrl: string;
  isPrimary: boolean;
  isUploaded?: boolean; // Flag to track if image is already uploaded (for edit mode)
}

interface ProductFormState {
  formData: {
    productTitle: string;
    category: string;
    price: string;
    onSale: boolean;
    taxRate: string;
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
  };
  productImages: ProductImage[];
}

const initialState: ProductFormState = {
  formData: {
    productTitle: "",
    category: "",
    price: "",
    onSale: false,
    taxRate: "",
    discountPrice: "",
    sku: "",
    stockQuantity: "",
    trackInventory: "Yes",
    lowStockAlert: "5",
    productDescription: "",
    size: "",
    color: "",
    material: "",
    length: "",
    height: "",
    width: "",
    weight: "",
    seoTitle: "",
    metaDescription: "",
    productTags: "",
    visibility: "Public",
    status: "Published",
  },
  productImages: [],
};

export const productFormSlice = createSlice({
  name: "productForm",
  initialState,
  reducers: {
    updateFormData: (
      state,
      action: PayloadAction<Partial<ProductFormState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setProductImages: (state, action: PayloadAction<ProductImage[]>) => {
      state.productImages = action.payload;
    },
    addProductImage: (state, action: PayloadAction<ProductImage>) => {
      state.productImages.push(action.payload);
    },
    removeProductImage: (state, action: PayloadAction<string>) => {
      const imageId = action.payload;
      const removedImage = state.productImages.find(
        (img) => img.id === imageId
      );
      state.productImages = state.productImages.filter(
        (img) => img.id !== imageId
      );

      // If we removed the primary image, set the first remaining image as primary
      if (removedImage?.isPrimary && state.productImages.length > 0) {
        state.productImages[0].isPrimary = true;
      }
    },
    setPrimaryImage: (state, action: PayloadAction<string>) => {
      const primaryId = action.payload;
      state.productImages = state.productImages.map((img) => ({
        ...img,
        isPrimary: img.id === primaryId,
      }));
    },
    reorderImages: (
      state,
      action: PayloadAction<{ draggedId: string; targetId: string }>
    ) => {
      const { draggedId, targetId } = action.payload;
      if (draggedId === targetId) return;

      const draggedIndex = state.productImages.findIndex(
        (img) => img.id === draggedId
      );
      const targetIndex = state.productImages.findIndex(
        (img) => img.id === targetId
      );

      const draggedImage = state.productImages[draggedIndex];

      // Remove the dragged item
      state.productImages.splice(draggedIndex, 1);
      // Insert it at the target position
      state.productImages.splice(targetIndex, 0, draggedImage);
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.productImages = initialState.productImages;
    },
  },
});

export const {
  updateFormData,
  setProductImages,
  addProductImage,
  removeProductImage,
  setPrimaryImage,
  reorderImages,
  resetForm,
} = productFormSlice.actions;

export default productFormSlice.reducer;
