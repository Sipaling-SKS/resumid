import Layout from "@/components/layout";

import Achievement from "@/components/parts/Achievement";
import Hero from "@/components/parts/Hero";
import Pricing from "@/components/parts/Pricing";

function Home() {
  const description = "Decentralized, Insightful, and Ready to Elevate Your Career."

  return (
    <Layout description={description}>
      <Hero />
      <Achievement />
      <Pricing />
    </Layout>
  )
}

export default Home;