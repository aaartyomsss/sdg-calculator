import { useState } from "react"
import api from "../api"

const ImportDataView = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid CSV file")
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await api.uploadCompaniesData(formData)
      console.log("Upload successful:", response.data)
      setFile(null)
      // Reset the file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err) {
      setError("Failed to upload file. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h2>Import data</h2>
      <p>
        This view should be used for data import. Data is expected to be in a
        structured way, already parsed by a parsing script.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ padding: "0.5rem" }}
        />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            opacity: !file || uploading ? 0.7 : 1,
            cursor: !file || uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  )
}

export default ImportDataView
