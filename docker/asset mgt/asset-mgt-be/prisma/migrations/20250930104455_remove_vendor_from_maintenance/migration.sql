/*
  Warnings:

  - You are about to drop the column `vendor_id` on the `maintenance_schedules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."maintenance_schedules" DROP CONSTRAINT "maintenance_schedules_vendor_id_fkey";

-- DropIndex
DROP INDEX "public"."maintenance_schedules_vendor_id_idx";

-- AlterTable
ALTER TABLE "public"."maintenance_schedules" DROP COLUMN "vendor_id";
