import { describe, it, expect, vi, beforeEach } from "vitest"
import SDGService from "../services/SDGService"

const csvHeaders = ["Company name", "Product", "Closest relative", "Share"]

describe("SDGService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should parse CSV string", () => {
    const rows = [
      ["Farm", "Apple", "Fruit", "0.6"],
      ["Farm", "Banana", "Fruit", "0.4"],
      ["Cloud tech", "Cloud provider", "Software", "0.3"],
      ["Cloud tech", "AI", "Software", "0.7"],
    ]

    const csvString = [csvHeaders, ...rows]
      .map((row) => row.join(","))
      .join("\n")

    const result = SDGService.parseCSVString(csvString)

    expect(result).toStrictEqual({
      Farm: [
        { Product: "apple", "Closest relative": "fruit", Share: 0.6 },
        { Product: "banana", "Closest relative": "fruit", Share: 0.4 },
      ],
      "Cloud tech": [
        {
          Product: "cloud-provider",
          "Closest relative": "software",
          Share: 0.3,
        },
        { Product: "ai", "Closest relative": "software", Share: 0.7 },
      ],
    })
  })

  it("Mocking template for revenue category return", async () => {
    const mockCategory = {
      name: "Farm",
      climateImpactIndex: 0.5,
      marineLifeImpactIndex: 0.3,
      economicGrowthIndex: 0.7,
      infrastructureImpactIndex: 0.4,
    }

    const spy = vi
      .spyOn(SDGService, "getRevenueCategory")
      .mockImplementation(async () => mockCategory)

    const result = await SDGService.getRevenueCategory("Farm", "Apple")
    expect(result).toStrictEqual(mockCategory)
    expect(SDGService.getRevenueCategory).toHaveBeenCalledWith("Farm", "Apple")

    spy.mockRestore()
  })

  it("Attaches revenue category to parsed records", async () => {
    const mockCategoryApple = {
      name: "apple",
      climateImpactIndex: 3.6,
      marineLifeImpactIndex: 3.3,
      economicGrowthIndex: 2.7,
      infrastructureImpactIndex: 1.4,
    }

    const mockCategoryBanana = {
      name: "banana",
      climateImpactIndex: 2.6,
      marineLifeImpactIndex: 2.3,
      economicGrowthIndex: 2.1,
      infrastructureImpactIndex: 1.4,
    }

    const parsedRecords = {
      Farm: [
        { Product: "apple", "Closest relative": "fruit", Share: 0.6 },
        { Product: "banana", "Closest relative": "fruit", Share: 0.4 },
      ],
    }

    const spy = vi
      .spyOn(SDGService, "getRevenueCategory")
      .mockImplementationOnce(async () => mockCategoryApple)
      .mockImplementationOnce(async () => mockCategoryBanana)

    const result = await SDGService.attachRevenueCategoryToRecords(
      parsedRecords
    )

    expect(result).toStrictEqual({
      Farm: [
        {
          Product: "apple",
          "Closest relative": "fruit",
          Share: 0.6,
          climateImpactIndex: 3.6,
          marineLifeImpactIndex: 3.3,
          economicGrowthIndex: 2.7,
          infrastructureImpactIndex: 1.4,
        },
        {
          Product: "banana",
          "Closest relative": "fruit",
          Share: 0.4,
          climateImpactIndex: 2.6,
          marineLifeImpactIndex: 2.3,
          economicGrowthIndex: 2.1,
          infrastructureImpactIndex: 1.4,
        },
      ],
    })
  })

  it("Calculates SDG score", async () => {
    const records = {
      Farm: [
        {
          Product: "apple",
          "Closest relative": "fruit",
          Share: 0.6,
          climateImpactIndex: 3.6,
          marineLifeImpactIndex: 3.3,
          economicGrowthIndex: 2.7,
          infrastructureImpactIndex: 1.4,
        },
        {
          Product: "banana",
          "Closest relative": "fruit",
          Share: 0.4,
          climateImpactIndex: 2.6,
          marineLifeImpactIndex: 2.3,
          economicGrowthIndex: 2.1,
          infrastructureImpactIndex: 1.4,
        },
      ],
    }

    const result = await SDGService.calculateSDGScore(records)
    expect(result).toStrictEqual([
      {
        name: "Farm",
        climateImpactIndex: 3.2,
        marineLifeImpactIndex: 2.9,
        economicGrowthIndex: 2.46,
        infrastructureImpactIndex: 1.4,
      },
    ])
  })
})
