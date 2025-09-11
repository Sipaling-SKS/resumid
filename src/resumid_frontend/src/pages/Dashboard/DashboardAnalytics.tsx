import { useHeader } from "@/contexts/HeaderContext"
import { useEffect } from "react"

function DashboardAnalytics() {
  const { setTitle } = useHeader()

  useEffect(() => {
    setTitle("Analytics")
  }, [setTitle])

  return (
    <div>Dashboard Analytics Content</div>
  )
}

export default DashboardAnalytics;