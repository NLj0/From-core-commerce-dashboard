/*
  Warnings:

  - You are about to drop the column `monthlyStats` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "monthlyStats";

-- CreateTable
CREATE TABLE "MonthlyStats" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyStats_productId_idx" ON "MonthlyStats"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyStats_productId_month_year_key" ON "MonthlyStats"("productId", "month", "year");

-- AddForeignKey
ALTER TABLE "MonthlyStats" ADD CONSTRAINT "MonthlyStats_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
