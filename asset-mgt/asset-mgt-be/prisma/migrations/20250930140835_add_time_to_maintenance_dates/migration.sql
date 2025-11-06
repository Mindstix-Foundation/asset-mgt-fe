-- AlterTable
ALTER TABLE "public"."maintenance_schedules" ALTER COLUMN "scheduled_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "actual_start_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "actual_completion_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "cancellation_date" SET DATA TYPE TIMESTAMPTZ(6);
