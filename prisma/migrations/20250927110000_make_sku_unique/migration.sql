-- Make the SKU field unique for products
ALTER TABLE "Product"
ADD CONSTRAINT "Product_sku_key" UNIQUE ("sku");
