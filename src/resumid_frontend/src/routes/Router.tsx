import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import Analyzer from "@/pages/Analyzer";
import Result from "@/pages/Analyzer/Result";

function Router() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/resume-analyzer" element={<Analyzer />} />
      <Route path="/result/:id" element={<Result />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default Router;