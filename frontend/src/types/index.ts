export type RevenueCategory = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  parentCategoryId: string | null
  climateImpactIndex: number | null
  marineLifeImpactIndex: number | null
  economicGrowthIndex: number | null
  infrastructureImpactIndex: number | null
  parentCategory: RevenueCategory | null
}

export type Company = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  climateImpactIndex: number | null
  marineLifeImpactIndex: number | null
  economicGrowthIndex: number | null
  infrastructureImpactIndex: number | null
}
