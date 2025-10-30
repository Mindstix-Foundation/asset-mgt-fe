-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."AuditChangeType" ADD VALUE 'ASSET_ID_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'SERIAL_NUMBER_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'PURCHASE_DATE_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'PURCHASE_COST_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'WARRANTY_START_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'WARRANTY_END_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'VENDOR_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'BRAND_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'MODEL_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'ASSET_TYPE_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'NOTES_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'QR_CODE_CHANGE';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'IMAGE_UPLOAD';
ALTER TYPE "public"."AuditChangeType" ADD VALUE 'BULK_UPDATE';

-- AlterTable
ALTER TABLE "public"."asset_audit_logs" ADD COLUMN     "notes" TEXT,
ALTER COLUMN "old_value" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "new_value" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "change_reason" SET DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "public"."blacklisted_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blacklisted_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_resets" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisted_tokens_token_key" ON "public"."blacklisted_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "public"."password_resets"("token");

-- AddForeignKey
ALTER TABLE "public"."password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
