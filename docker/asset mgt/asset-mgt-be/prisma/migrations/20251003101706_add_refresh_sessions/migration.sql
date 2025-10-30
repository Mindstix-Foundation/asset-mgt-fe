-- CreateTable
CREATE TABLE "public"."refresh_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "device_id" VARCHAR(255),
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_token_key" ON "public"."refresh_sessions"("token");

-- CreateIndex
CREATE INDEX "refresh_sessions_user_id_expires_at_idx" ON "public"."refresh_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "refresh_sessions_token_expires_at_idx" ON "public"."refresh_sessions"("token", "expires_at");

-- AddForeignKey
ALTER TABLE "public"."refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
