import axios from "axios"
import type { RevenueCategory, Company } from "../types"

const API_URL = "http://localhost:3000/api"

const _api = axios.create({
  baseURL: API_URL,
})

const api = {
  getCompanies: () => _api.get<Company[]>("/companies"),
  getRevenueCategories: () =>
    _api.get<RevenueCategory[]>("/revenue-categories"),
  uploadCompaniesData: (formData: FormData) =>
    _api.post("/companies-sdg-calculation", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
}

export default api
