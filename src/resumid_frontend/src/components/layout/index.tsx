import { ReactNode } from "react"
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet"
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

function Layout({ children, className, title, description }: LayoutProps) {
  const headTitle: string = title ? `${title} - Resumid` : "Resumid - Unleash Your Resume’s Potential with AI-Powered Analysis"

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{headTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Navbar />
      <main className={cn("min-h-screen", className)}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Layout;