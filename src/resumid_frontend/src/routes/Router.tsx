import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import Analyzer from "@/pages/Analyzer";
import Result from "@/pages/Analyzer/Result";
import Layout from "@/components/layout";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/resume-analyzer" element={<Analyzer />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default Router;