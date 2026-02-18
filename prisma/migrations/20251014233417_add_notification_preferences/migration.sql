-- AlterTable
ALTER TABLE "public"."NotificationSettings" ADD COLUMN     "lowStockAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "orderStatusUpdates" BOOLEAN NOT NULL DEFAULT true;
