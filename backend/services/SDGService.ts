import { Company, PrismaClient } from "@prisma/client"
import Papa from "papaparse"
import { RevenueCategory as NativeRevenueCategory } from "@prisma/client"
import { slugify } from "../helpers/string"

type RevenueCategory = Pick<
  NativeRevenueCategory,
  | "name"
  | "climateImpactIndex"
  | "marineLifeImpactIndex"
  | "economicGrowthIndex"
  | "infrastructureImpactIndex"
>

type CompanyRevenue = {
  Product: string
  "Closest relative": string
  Share: number
}

type CompanyRevenueWithIndexes = CompanyRevenue & {
  climateImpactIndex: number | null
  marineLifeImpactIndex: number | null
  economicGrowthIndex: number | null
  infrastructureImpactIndex: number | null
}

type ParsedCSV<T = CompanyRevenue | CompanyRevenueWithIndexes> = {
  [companyName: string]: T[]
}

class SDGService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getResultsBasedOnCSVString(csvString: string) {
    const records = this.parseCSVString(csvString)
    const recordsWithIndexes = await this.attachRevenueCategoryToRecords(
      records
    )
    const sdgScores = await this.calculateSDGScore(recordsWithIndexes)
    await this.storeSDGResults(sdgScores)
    return sdgScores
  }

  parseCSVString(csvString: string): ParsedCSV<CompanyRevenue> {
    const parseResult = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
    })

    const companyGroupedResult = parseResult.data.reduce(
      (acc: ParsedCSV, curr: any): ParsedCSV => {
        if (!acc[curr["Company name"]]) {
          acc[curr["Company name"]] = []
        }

        const { "Company name": companyName, ...rest } = curr
        acc[companyName].push({
          ...rest,
          Product: slugify(rest["Product"]),
          "Closest relative": slugify(rest["Closest relative"]),
          Share: parseFloat(rest["Share"]),
        })
        return acc
      },
      {}
    )
    return companyGroupedResult
  }

  async getRevenueCategory(
    category: string,
    closestRelative: string
  ): Promise<RevenueCategory> {
    const revenueCategory = await this.prisma.revenueCategory.findFirst({
      where: {
        name: category,
      },
    })

    if (revenueCategory) {
      return {
        name: revenueCategory.name,
        climateImpactIndex: revenueCategory.climateImpactIndex,
        marineLifeImpactIndex: revenueCategory.marineLifeImpactIndex,
        economicGrowthIndex: revenueCategory.economicGrowthIndex,
        infrastructureImpactIndex: revenueCategory.infrastructureImpactIndex,
      }
    }

    const closestRelativeRevenueCategory =
      await this.prisma.revenueCategory.findFirst({
        where: {
          name: closestRelative,
        },
      })

    if (closestRelativeRevenueCategory) {
      return {
        name: closestRelativeRevenueCategory.name,
        climateImpactIndex: closestRelativeRevenueCategory.climateImpactIndex,
        marineLifeImpactIndex:
          closestRelativeRevenueCategory.marineLifeImpactIndex,
        economicGrowthIndex: closestRelativeRevenueCategory.economicGrowthIndex,
        infrastructureImpactIndex:
          closestRelativeRevenueCategory.infrastructureImpactIndex,
      }
    }

    const averagePerActiveDatabaseParentCategory =
      await this.prisma.revenueCategory.aggregate({
        where: {
          parentCategoryId: null,
        },
        _avg: {
          climateImpactIndex: true,
          marineLifeImpactIndex: true,
          economicGrowthIndex: true,
          infrastructureImpactIndex: true,
        },
      })

    await this.addMissingRevenueCategories(category)

    return {
      name: "No revenue category found",
      climateImpactIndex:
        averagePerActiveDatabaseParentCategory._avg.climateImpactIndex,
      marineLifeImpactIndex:
        averagePerActiveDatabaseParentCategory._avg.marineLifeImpactIndex,
      economicGrowthIndex:
        averagePerActiveDatabaseParentCategory._avg.economicGrowthIndex,
      infrastructureImpactIndex:
        averagePerActiveDatabaseParentCategory._avg.infrastructureImpactIndex,
    }
  }

  async attachRevenueCategoryToRecords(
    records: ParsedCSV<CompanyRevenue>
  ): Promise<ParsedCSV<CompanyRevenueWithIndexes>> {
    const recordsWithIndexes: ParsedCSV<CompanyRevenueWithIndexes> = {}

    const companies = Object.keys(records)
    for (const company of companies) {
      recordsWithIndexes[company] = []
      const companyRevenues = records[company]

      for (const revenue of companyRevenues) {
        const revenueCategory = await this.getRevenueCategory(
          revenue["Product"],
          revenue["Closest relative"]
        )

        recordsWithIndexes[company].push({
          ...revenue,
          climateImpactIndex: revenueCategory.climateImpactIndex,
          marineLifeImpactIndex: revenueCategory.marineLifeImpactIndex,
          economicGrowthIndex: revenueCategory.economicGrowthIndex,
          infrastructureImpactIndex: revenueCategory.infrastructureImpactIndex,
        })
      }
    }

    return recordsWithIndexes
  }
  /**
   * Some simple calculation logic. Most likely unrealistic.
   * Performance: I think given this calculation in particular,
   * Use of something relatively simple as MapReduce would be a good fit.
   * But that is concern perhaps only if calculation is much bigger and there are more rows to be processed.
   * */
  async calculateSDGScore(
    records: ParsedCSV<CompanyRevenueWithIndexes>
  ): Promise<
    Pick<
      Company,
      | "name"
      | "climateImpactIndex"
      | "marineLifeImpactIndex"
      | "economicGrowthIndex"
      | "infrastructureImpactIndex"
    >[]
  > {
    const scores = []
    for (const company of Object.keys(records)) {
      const companyRevenues = records[company]

      const score = companyRevenues.reduce(
        (acc, revenue) => {
          return {
            climateImpactIndex:
              acc.climateImpactIndex +
              (revenue.climateImpactIndex || 0) * revenue.Share,
            marineLifeImpactIndex:
              acc.marineLifeImpactIndex +
              (revenue.marineLifeImpactIndex || 0) * revenue.Share,
            economicGrowthIndex:
              acc.economicGrowthIndex +
              (revenue.economicGrowthIndex || 0) * revenue.Share,
            infrastructureImpactIndex:
              acc.infrastructureImpactIndex +
              (revenue.infrastructureImpactIndex || 0) * revenue.Share,
          }
        },
        {
          climateImpactIndex: 0,
          marineLifeImpactIndex: 0,
          economicGrowthIndex: 0,
          infrastructureImpactIndex: 0,
        }
      )

      scores.push({
        name: company,
        climateImpactIndex: Math.round(score.climateImpactIndex * 100) / 100,
        marineLifeImpactIndex:
          Math.round(score.marineLifeImpactIndex * 100) / 100,
        economicGrowthIndex: Math.round(score.economicGrowthIndex * 100) / 100,
        infrastructureImpactIndex:
          Math.round(score.infrastructureImpactIndex * 100) / 100,
      })
    }

    return scores
  }

  async addMissingRevenueCategories(category: string) {
    await this.prisma.revenueCategory.create({
      data: {
        name: category,
        climateImpactIndex: null,
        marineLifeImpactIndex: null,
        economicGrowthIndex: null,
        infrastructureImpactIndex: null,
      },
    })
  }

  async storeSDGResults(
    results: Pick<
      Company,
      | "name"
      | "climateImpactIndex"
      | "marineLifeImpactIndex"
      | "economicGrowthIndex"
      | "infrastructureImpactIndex"
    >[]
  ): Promise<void> {
    console.log(results)
    await this.prisma.company.createMany({
      data: results,
      skipDuplicates: true,
    })
    console.log("Results stored")
  }
}

export default new SDGService()
