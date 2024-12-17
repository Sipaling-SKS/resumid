import Layout from "@/components/layout";

import Achievement from "@/components/parts/Achievement";
import CTA from "@/components/parts/CTA";
import FAQ from "@/components/parts/FAQ";
import Features from "@/components/parts/Features";
import Hero from "@/components/parts/Hero";
import Pricing from "@/components/parts/Pricing";
import ResultCard from "@/components/parts/ResultCard";

function Home() {
  const description = "Decentralized, Insightful, and Ready to Elevate Your Career."

  return (
    <Layout description={description}>
      <Hero />
      <Achievement />
      <Features/>
      <Pricing />
      <FAQ />
      <CTA />
      <ResultCard />
      
    </Layout>
  )
}

export default Home;