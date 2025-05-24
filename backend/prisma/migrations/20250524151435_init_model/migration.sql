-- CreateTable
CREATE TABLE "RevenueCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parent_category_id" TEXT,

    CONSTRAINT "RevenueCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RevenueCategory" ADD CONSTRAINT "RevenueCategory_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "RevenueCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
