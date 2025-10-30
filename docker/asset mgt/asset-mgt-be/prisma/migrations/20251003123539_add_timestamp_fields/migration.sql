/*
  Warnings:

  - You are about to drop the `asset_audit_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."AssetEventType" AS ENUM ('ASSET_CREATED', 'ASSET_UPDATED', 'ASSET_RETIRED', 'ASSET_REACTIVATED', 'ASSET_ISSUED', 'ASSET_COLLECTED', 'MAINTENANCE_SCHEDULED', 'MAINTENANCE_UPDATED', 'MAINTENANCE_COMPLETED', 'MAINTENANCE_CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."asset_audit_logs" DROP CONSTRAINT "asset_audit_logs_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_audit_logs" DROP CONSTRAINT "asset_audit_logs_changed_by_fkey";

-- AlterTable
ALTER TABLE "public"."asset_issues" ADD COLUMN     "issue_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "return_timestamp" TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "public"."asset_audit_logs";

-- DropEnum
DROP TYPE "public"."AuditChangeType";

-- CreateTable
CREATE TABLE "public"."asset_events" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "event_type" "public"."AssetEventType" NOT NULL,
    "event_date" TIMESTAMPTZ(6) NOT NULL,
    "performed_by" INTEGER NOT NULL,
    "field_name" VARCHAR(50),
    "old_value" VARCHAR(500),
    "new_value" VARCHAR(500),
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_status_history" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "status" "public"."AssetStatus" NOT NULL,
    "effective_from" TIMESTAMPTZ(6) NOT NULL,
    "effective_to" TIMESTAMPTZ(6),
    "set_by" INTEGER NOT NULL,
    "reason" VARCHAR(500),
    "notes" TEXT,

    CONSTRAINT "asset_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_condition_history" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "condition" "public"."AssetCondition" NOT NULL,
    "effective_from" TIMESTAMPTZ(6) NOT NULL,
    "effective_to" TIMESTAMPTZ(6),
    "set_by" INTEGER NOT NULL,
    "reason" VARCHAR(500),
    "notes" TEXT,

    CONSTRAINT "asset_condition_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_events_asset_id_idx" ON "public"."asset_events"("asset_id");

-- CreateIndex
CREATE INDEX "asset_events_event_type_idx" ON "public"."asset_events"("event_type");

-- CreateIndex
CREATE INDEX "asset_events_event_date_idx" ON "public"."asset_events"("event_date");

-- CreateIndex
CREATE INDEX "asset_events_performed_by_idx" ON "public"."asset_events"("performed_by");

-- CreateIndex
CREATE INDEX "asset_events_field_name_idx" ON "public"."asset_events"("field_name");

-- CreateIndex
CREATE INDEX "asset_status_history_asset_id_idx" ON "public"."asset_status_history"("asset_id");

-- CreateIndex
CREATE INDEX "asset_status_history_status_idx" ON "public"."asset_status_history"("status");

-- CreateIndex
CREATE INDEX "asset_status_history_effective_from_idx" ON "public"."asset_status_history"("effective_from");

-- CreateIndex
CREATE INDEX "asset_condition_history_asset_id_idx" ON "public"."asset_condition_history"("asset_id");

-- CreateIndex
CREATE INDEX "asset_condition_history_condition_idx" ON "public"."asset_condition_history"("condition");

-- CreateIndex
CREATE INDEX "asset_condition_history_effective_from_idx" ON "public"."asset_condition_history"("effective_from");

-- CreateIndex
CREATE INDEX "asset_issues_issue_timestamp_idx" ON "public"."asset_issues"("issue_timestamp");

-- CreateIndex
CREATE INDEX "asset_issues_return_date_idx" ON "public"."asset_issues"("return_date");

-- CreateIndex
CREATE INDEX "asset_issues_return_timestamp_idx" ON "public"."asset_issues"("return_timestamp");

-- AddForeignKey
ALTER TABLE "public"."asset_events" ADD CONSTRAINT "asset_events_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_events" ADD CONSTRAINT "asset_events_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_status_history" ADD CONSTRAINT "asset_status_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_status_history" ADD CONSTRAINT "asset_status_history_set_by_fkey" FOREIGN KEY ("set_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_condition_history" ADD CONSTRAINT "asset_condition_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_condition_history" ADD CONSTRAINT "asset_condition_history_set_by_fkey" FOREIGN KEY ("set_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
