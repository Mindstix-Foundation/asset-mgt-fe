/*
  Warnings:

  - The `vendor_type` column on the `vendors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."VendorType" AS ENUM ('SUPPLIER', 'SERVICE', 'MANUFACTURER', 'DISTRIBUTOR', 'CONTRACTOR', 'BOTH');

-- AlterTable
ALTER TABLE "public"."vendors" DROP COLUMN "vendor_type",
ADD COLUMN     "vendor_type" "public"."VendorType" NOT NULL DEFAULT 'SUPPLIER';

-- CreateIndex
CREATE INDEX "vendors_vendor_type_idx" ON "public"."vendors"("vendor_type");
