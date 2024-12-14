import Layout from "@/components/layout";

import Achievement from "@/components/parts/Achievement";
import CTA from "@/parts/HomePage/CTA";
import FAQ from "@/parts/HomePage/FAQ";
import Features from "@/parts/HomePage/Features";
import Hero from "@/components/parts/Hero";
import Pricing from "@/components/parts/Pricing";

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
    </Layout>
  )
}

export default Home;