import Achievement from "@/components/parts/Achievement";
import Hero from "@/components/parts/Hero";
import Pricing from "@/components/parts/Pricing";

function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Achievement />
      <Pricing />
    </main>
  )
}

export default Home;