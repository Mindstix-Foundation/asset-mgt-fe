/*
  Warnings:

  - You are about to drop the column `createdAt` on the `blacklisted_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `blacklisted_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `blacklisted_tokens` table. All the data in the column will be lost.
  - You are about to alter the column `token` on the `blacklisted_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `createdAt` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `password_resets` table. All the data in the column will be lost.
  - You are about to alter the column `token` on the `password_resets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Added the required column `expires_at` to the `blacklisted_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `password_resets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `password_resets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."password_resets" DROP CONSTRAINT "password_resets_userId_fkey";

-- AlterTable
ALTER TABLE "public"."blacklisted_tokens" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."password_resets" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "locked_until" TIMESTAMPTZ(6),
ADD COLUMN     "refresh_token" VARCHAR(500),
ADD COLUMN     "refresh_token_expires" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "blacklisted_tokens_token_expires_at_idx" ON "public"."blacklisted_tokens"("token", "expires_at");

-- CreateIndex
CREATE INDEX "password_resets_token_used_expires_at_idx" ON "public"."password_resets"("token", "used", "expires_at");

-- AddForeignKey
ALTER TABLE "public"."password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
