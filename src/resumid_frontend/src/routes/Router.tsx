import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import Logout from "@/pages/Logout"; 
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";


import Analyzer from "@/pages/Analyzer";
import Result from "@/pages/Analyzer/Result";
import Layout from "@/components/layout";
import HistoryDetail from "@/pages/History/Detail/HistoryDetail";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/history-detail/:id" element={<HistoryDetail />} />
        {/* Additional routes nanti ini benerin lagi */}
        <Route element={<ProtectedRoute redirectTo="/" />}>
          <Route path="/resume-analyzer" element={<Analyzer />} />
          <Route path="/history" element={<Result />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default Router;