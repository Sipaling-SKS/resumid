import Layout from "@/components/layout";

import Achievement from "@/components/parts/Achievement";
import CTA from "@/components/parts/CTA";
import FAQ from "@/components/parts/FAQ";
import Features from "@/components/parts/Features";
import Hero from "@/components/parts/Hero";
import Pricing from "@/components/parts/Pricing";
import { Helmet } from "react-helmet";

function Home() {
  const title = "Resumid - Unleash Your Resume’s Potential with AI-Powered Analysis"
  const description = "Decentralized, Insightful, and Ready to Elevate Your Career."

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <main className="min-h-screen">
        <Hero />
        <Achievement />
        <Features />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
    </>
  )
}

export default Home;