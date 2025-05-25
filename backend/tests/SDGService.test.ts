import { describe, it, expect } from "vitest"
import SDGService from "../services/SDGService"

const csvHeaders = ["Company name", "Product", "Closest relative", "Share"]

describe("SDGService", () => {
  it("should parse CSV string", () => {
    const rows = [
      ["Farm", "Apple", "Fruit", "0.6"],
      ["Farm", "Banana", "Fruit", "0.4"],
      ["Cloud tech", "Cloud", "Software", "0.3"],
      ["Cloud tech", "AI", "Software", "0.7"],
    ]

    const csvString = [csvHeaders, ...rows]
      .map((row) => row.join(","))
      .join("\n")

    const result = SDGService.parseCSVString(csvString)

    expect(result).toStrictEqual({
      Farm: [
        { Product: "Apple", "Closest relative": "Fruit", Share: "0.6" },
        { Product: "Banana", "Closest relative": "Fruit", Share: "0.4" },
      ],
      "Cloud tech": [
        { Product: "Cloud", "Closest relative": "Software", Share: "0.3" },
        { Product: "AI", "Closest relative": "Software", Share: "0.7" },
      ],
    })
  })
})
