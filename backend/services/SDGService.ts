import { PrismaClient } from "@prisma/client"
import Papa from "papaparse"
class SDGService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  parseCSVString(csvString: string) {
    const parseResult = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
    })

    const companyGroupedResult = parseResult.data.reduce(
      (acc: any, curr: any) => {
        if (!acc[curr["Company name"]]) {
          acc[curr["Company name"]] = []
        }

        const { "Company name": companyName, ...rest } = curr
        acc[companyName].push(rest)
        return acc
      },
      {}
    )
    return companyGroupedResult
  }

  async calculateSDGScore(records: any) {
    // TODO: Add calculation logic. Nothing complex.
  }

  async addMissingRevenueCategories(records: any) {
    // TODO: Add logic to add missing revenue categories.
  }

  async storeSDGResults(records: any) {
    // TODO: Add logic to store SDG results.
  }
}

export default new SDGService()
