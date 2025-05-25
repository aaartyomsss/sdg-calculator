import { useEffect, useState } from "react"
import api from "../api"
import type { Company } from "../types"

const CompaniesView = () => {
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await api.getCompanies()
      console.log(response.data, " ? ?? ?")
      setCompanies(response.data)
    }

    fetchCompanies()
  }, [])

  const getCompanyAlignmentBasedOnIndex = (index: number | null) => {
    if (index === null) return "Unknown"
    if (index < 1) return "Strongly misaligned"
    if (index < 2) return "Misaligned"
    if (index < 3) return "Aligned"
    if (index <= 4) return "Strongly aligned"
    return "Unknown"
  }

  return (
    <div>
      <h2>Companies and their impact</h2>
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {companies.map((company) => (
          <div
            key={company.id}
            style={{
              display: "flex",
              gap: "8px",
              textAlign: "start",
              width: "600px",
              border: "1px solid white",
              padding: "8px",
              borderRadius: "5px",
              justifyContent: "space-between",
            }}
          >
            <h3>{company.name}</h3>
            <div style={{ textAlign: "right" }}>
              <div>
                Climate Impact Index: {company.climateImpactIndex}
                &nbsp; (
                <strong>
                  {getCompanyAlignmentBasedOnIndex(company.climateImpactIndex)}
                </strong>
                )
              </div>
              <div>
                Marine Life Impact Index: {company.marineLifeImpactIndex}
                &nbsp; (
                <strong>
                  {getCompanyAlignmentBasedOnIndex(
                    company.marineLifeImpactIndex
                  )}
                </strong>
                )
              </div>
              <div>
                Economic Growth Index: {company.economicGrowthIndex}
                &nbsp; (
                <strong>
                  {getCompanyAlignmentBasedOnIndex(company.economicGrowthIndex)}
                </strong>
                )
              </div>
              <div>
                Infrastructure Impact Index: {company.infrastructureImpactIndex}
                &nbsp; (
                <strong>
                  {getCompanyAlignmentBasedOnIndex(
                    company.infrastructureImpactIndex
                  )}
                </strong>
                )
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompaniesView
