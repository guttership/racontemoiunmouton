-- CreateTable
CREATE TABLE "anonymous_generations" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anonymous_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_anonymous_ip_date" ON "anonymous_generations"("ipAddress", "createdAt");
