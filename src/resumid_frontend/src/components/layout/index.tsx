import { ReactNode } from "react"
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router";

interface LayoutProps {
  className?: string;
}

function Layout({ className }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className={cn("min-h-screen", className)}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout;