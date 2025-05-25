import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import multer from "multer"
import SDGService from "./services/SDGService"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const prisma = new PrismaClient()
const upload = multer({ storage: multer.memoryStorage() })

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
  next()
})

// Some of the test endpoints just to check DB data is here.
app.get("/api/revenue-categories", async (req, res) => {
  const revenueCategories = await prisma.revenueCategory.findMany({
    include: {
      parentCategory: true,
      children: true,
    },
  })
  res.json(revenueCategories)
})

app.get("/api/companies", async (req, res) => {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      climateImpactIndex: true,
      marineLifeImpactIndex: true,
      economicGrowthIndex: true,
      infrastructureImpactIndex: true,
    },
  })
  res.json(companies)
})

app.post(
  "/api/companies-sdg-calculation",
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" })
      return
    }

    try {
      const fileBuffer = req.file.buffer
      const csvString = fileBuffer.toString("utf-8")

      const result = await SDGService.getResultsBasedOnCSVString(csvString)

      res.json({
        message: "File processed successfully",
        results: result,
      })
    } catch (error) {
      console.error("Error processing CSV:", error)
      res.status(500).json({ error: "Error processing CSV file" })
    }
  }
)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
