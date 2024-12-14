import { Routes, Route } from "react-router";

// Page Imports
import Home from "@/pages/Home";

function Router() {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  )
}

export default Router;