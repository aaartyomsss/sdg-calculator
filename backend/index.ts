import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const prisma = new PrismaClient()

app.use(bodyParser.json())

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
  const companies = await prisma.company.findMany()
  res.json(companies)
})

app.post("/api/companies-sdg-calculation", async (req, res) => {
  // TODO: Implement this.
  res.json({})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
