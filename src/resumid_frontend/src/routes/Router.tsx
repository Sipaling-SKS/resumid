import { Routes, Route, Navigate } from "react-router";

import Home from "@/pages/Home";
import ProtectedRoute from "./ProtectedRoute";

import Analyzer from "@/pages/Analyzer";
import Layout from "@/components/layout";
import HistoryDetail from "@/pages/History/Detail/HistoryDetail";
import HistoryList from "@/pages/History";
import ProfileDetail from "@/pages/Profile/Detail/ProfileDetail";
import SearchResults from "@/pages/SearchResults";
import Wallet from "@/pages/Wallet/Wallet";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<ProtectedRoute redirectTo="/" />}>
          <Route path="/resume-analyzer" element={<Analyzer />} />
          <Route path="/history-detail/:id" element={<HistoryDetail />} />
          <Route path="/result" element={<HistoryList />} />
          <Route path="/profile/:id" element={<ProfileDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default Router;