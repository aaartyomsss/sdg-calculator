import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Population script for some of the categories that might contribute to revenue,
// Indexes are somewhat arbitrary. 0 being "strongly misaligned", 4 being "strongly aligned"

async function main() {
  // Food data

  const foodCategory = await prisma.revenueCategory.create({
    data: {
      name: "food",
      climateImpactIndex: 3.2,
      marineLifeImpactIndex: 4.0,
      economicGrowthIndex: 3.4,
      infrastructureImpactIndex: 3.1,
    },
  })

  const fruitCategory = await prisma.revenueCategory.create({
    data: {
      name: "fruit",
      parentCategoryId: foodCategory.id,
      climateImpactIndex: 3.8,
      marineLifeImpactIndex: 4.0,
      economicGrowthIndex: 3.3,
      infrastructureImpactIndex: 2.4,
    },
  })

  const appleCategory = await prisma.revenueCategory.create({
    data: {
      name: "apple",
      parentCategoryId: fruitCategory.id,
      climateImpactIndex: 3.9,
      marineLifeImpactIndex: 4.0,
      economicGrowthIndex: 3.2,
      infrastructureImpactIndex: 2.8,
    },
  })

  const orangeCategory = await prisma.revenueCategory.create({
    data: {
      name: "orange",
      parentCategoryId: fruitCategory.id,
      climateImpactIndex: 3.7,
      marineLifeImpactIndex: 4.0,
      economicGrowthIndex: 3.1,
      infrastructureImpactIndex: 2.5,
    },
  })

  const bananaCategory = await prisma.revenueCategory.create({
    data: {
      name: "banana",
      parentCategoryId: fruitCategory.id,
      climateImpactIndex: 2.8,
      marineLifeImpactIndex: 3.9,
      economicGrowthIndex: 2.4,
      infrastructureImpactIndex: 3.2,
    },
  })

  const meatCategory = await prisma.revenueCategory.create({
    data: {
      name: "meat",
      parentCategoryId: foodCategory.id,
      climateImpactIndex: 1.2,
      marineLifeImpactIndex: 2.4,
      economicGrowthIndex: 2.3,
      infrastructureImpactIndex: 3.4,
    },
  })

  const beefCategory = await prisma.revenueCategory.create({
    data: {
      name: "beef",
      parentCategoryId: meatCategory.id,
      climateImpactIndex: 0.8,
      marineLifeImpactIndex: 2.1,
      economicGrowthIndex: 2.2,
      infrastructureImpactIndex: 3.3,
    },
  })

  const chickenCategory = await prisma.revenueCategory.create({
    data: {
      name: "chicken",
      parentCategoryId: meatCategory.id,
      climateImpactIndex: 1.9,
      marineLifeImpactIndex: 3.2,
      economicGrowthIndex: 2.4,
      infrastructureImpactIndex: 3.8,
    },
  })

  // Tech data

  const techCategory = await prisma.revenueCategory.create({
    data: {
      name: "tech",
      climateImpactIndex: 2.3,
      marineLifeImpactIndex: 3.1,
      economicGrowthIndex: 3.4,
      infrastructureImpactIndex: 4.0,
    },
  })

  const softwareCategory = await prisma.revenueCategory.create({
    data: {
      name: "software",
      parentCategoryId: techCategory.id,
      climateImpactIndex: 3.8,
      marineLifeImpactIndex: 3.2,
      economicGrowthIndex: 3.5,
      infrastructureImpactIndex: 4.0,
    },
  })

  const hardwareCategory = await prisma.revenueCategory.create({
    data: {
      name: "hardware",
      parentCategoryId: techCategory.id,
      climateImpactIndex: 1.8,
      marineLifeImpactIndex: 2.9,
      economicGrowthIndex: 3.1,
      infrastructureImpactIndex: 3.9,
    },
  })

  const batteriesCategory = await prisma.revenueCategory.create({
    data: {
      name: "batteries",
      parentCategoryId: hardwareCategory.id,
      climateImpactIndex: 1.2,
      marineLifeImpactIndex: 2.4,
      economicGrowthIndex: 2.6,
      infrastructureImpactIndex: 3.4,
    },
  })

  const gpuCategory = await prisma.revenueCategory.create({
    data: {
      name: "gpu",
      parentCategoryId: hardwareCategory.id,
      climateImpactIndex: 1.4,
      marineLifeImpactIndex: 3.1,
      economicGrowthIndex: 3.2,
      infrastructureImpactIndex: 3.9,
    },
  })

  const smartphoneCategory = await prisma.revenueCategory.create({
    data: {
      name: "smartphone",
      parentCategoryId: hardwareCategory.id,
      climateImpactIndex: 1.7,
      marineLifeImpactIndex: 2.3,
      economicGrowthIndex: 2.8,
      infrastructureImpactIndex: 3.8,
    },
  })

  const cloudProviderCategory = await prisma.revenueCategory.create({
    data: {
      name: "cloud-provider",
      parentCategoryId: techCategory.id,
      climateImpactIndex: 2.8,
      marineLifeImpactIndex: 3.3,
      economicGrowthIndex: 3.4,
      infrastructureImpactIndex: 4.0,
    },
  })
}

main()
