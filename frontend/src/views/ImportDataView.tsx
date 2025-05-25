import { useState } from "react"
import api from "../api"

type UploadStatus = "success" | "error" | null

const ImportDataView = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<UploadStatus>(null)

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

      await api.uploadCompaniesData(formData)
      setFile(null)
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      if (fileInput) fileInput.value = ""
      setStatus("success")
    } catch (err) {
      setError("Failed to upload file. Please try again.")
      console.error("Upload error:", err)
      setStatus("error")
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
      <p>
        Required fields:
        <ul>
          <li>Company name (string)</li>
          <li>Product (string)</li>
          <li>Closest relative (string)</li>
          <li>Share (float from 0 to 1)</li>
        </ul>
      </p>
      {status === "success" && (
        <p style={{ color: "green" }}>
          Upload successful - navigate to companies tab to see results
        </p>
      )}
      {status === "error" && <p style={{ color: "red" }}>Upload failed</p>}
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
