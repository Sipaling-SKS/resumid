import Achievement from "@/parts/HomePage/Achievement";
import CTA from "@/parts/HomePage/CTA";
import FAQ from "@/parts/HomePage/FAQ";
import Features from "@/parts/HomePage/Features";
import Hero from "@/parts/HomePage/Hero";
import Pricing from "@/parts/HomePage/Pricing";

function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Achievement />
      <Features/>
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  )
}

export default Home;