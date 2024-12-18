import { Routes, Route } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import Logout from "@/pages/Logout"; 
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";



function Router() {
  return (
    
    <Routes>
      {/* Default route */}
      <Route index element={<Home />} />
      
      {/* Additional routes */}
      <Route element={<ProtectedRoute redirectTo="/logout" />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/logout" element={<Logout />} />
    </Routes>
  )
}

export default Router;