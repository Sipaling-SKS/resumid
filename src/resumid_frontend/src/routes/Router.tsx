import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import ProtectedRoute from "./ProtectedRoute";

import Analyzer from "@/pages/Analyzer";
import Result from "@/pages/Analyzer/Result";
import Layout from "@/components/layout";
import HistoryList from "@/pages/History";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* Additional routes nanti ini benerin lagi */}
        <Route element={<ProtectedRoute redirectTo="/" />}>
          <Route path="/resume-analyzer" element={<Analyzer />} />
          <Route path="/history-old" element={<Result />} />
          <Route path="/result" element={<HistoryList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default Router;