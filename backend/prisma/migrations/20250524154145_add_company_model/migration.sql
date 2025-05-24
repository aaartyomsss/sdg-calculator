-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "climate_impact_index" DOUBLE PRECISION,
    "marine_life_impact_index" DOUBLE PRECISION,
    "economic_growth_index" DOUBLE PRECISION,
    "infrastructure_impact_index" DOUBLE PRECISION,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
