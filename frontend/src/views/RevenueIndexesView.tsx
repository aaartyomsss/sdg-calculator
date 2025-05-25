import { useState } from "react"
import api from "../api"
import { useEffect } from "react"

type RevenueCategory = {
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

const RevenueView = () => {
  const [revenueCategories, setRevenueCategories] = useState<RevenueCategory[]>(
    []
  )

  useEffect(() => {
    const getAndSetRevenueCategories = async () => {
      const response = await api.getRevenueCategories()
      setRevenueCategories(response.data)
    }

    getAndSetRevenueCategories()
  }, [])

  return (
    <div>
      <h2>Categories and their impact</h2>
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {revenueCategories.map((category) => (
          <div
            key={category.id}
            style={{
              display: "flex",
              gap: "8px",
              textAlign: "start",
              width: "450px",
              border: "1px solid white",
              padding: "8px",
              borderRadius: "5px",
              justifyContent: "space-between",
            }}
          >
            <h3>{category.name}</h3>
            <div>
              <div>
                Climate Impact Index:{" "}
                {category.climateImpactIndex || "Not defined"}
              </div>
              <div>
                Marine Life Impact Index:{" "}
                {category.marineLifeImpactIndex || "Not defined"}
              </div>
              <div>
                Economic Growth Index:{" "}
                {category.economicGrowthIndex || "Not defined"}
              </div>
              <div>
                Infrastructure Impact Index:{" "}
                {category.infrastructureImpactIndex || "Not defined"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RevenueView
