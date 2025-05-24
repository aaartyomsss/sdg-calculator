import { useState } from "react"
import "./App.css"
import RevenueView from "./views/RevenueIndexesView"
import ImportDataView from "./views/ImportDataView"

enum ActiveView {
  Revenue = "revenue",
  Companies = "companies",
  ImportData = "import-data",
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Revenue)

  return (
    <>
      <nav style={{ display: "flex", gap: "4px" }}>
        <button onClick={() => setActiveView(ActiveView.Revenue)}>
          Revenue
        </button>
        <button onClick={() => setActiveView(ActiveView.Companies)}>
          Companies
        </button>
        <button onClick={() => setActiveView(ActiveView.ImportData)}>
          Import Data
        </button>
      </nav>
      <main style={{ height: "100vh" }}>
        {activeView === ActiveView.Revenue && <RevenueView />}
        {activeView === ActiveView.ImportData && <ImportDataView />}
      </main>
    </>
  )
}

export default App
