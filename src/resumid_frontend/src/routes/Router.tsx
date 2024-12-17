import { Routes, Route } from "react-router";

// Page Imports
import Home from "@/pages/Home";
import Logout from "@/pages/Logout"; 
import Login from "@/pages/Login";



function Router() {
  return (
    
    <Routes>
      {/* Default route */}
      <Route index element={<Home />} />
      
      {/* Additional routes */}
      
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  )
}

export default Router;