import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import Logout from "@/pages/Logout"; 
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";


import Analyzer from "@/pages/Analyzer";
import Result from "@/pages/Analyzer/Result";
import Layout from "@/components/layout";

function Router() {
  return (
    
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Additional routes */}
        <Route element={<ProtectedRoute redirectTo="/logout" />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="/resume-analyzer" element={<Analyzer />} />
        <Route path="/history" element={<Result />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default Router;