/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `RevenueCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RevenueCategory_name_key" ON "RevenueCategory"("name");
