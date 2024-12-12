import Achievement from "@/parts/HomePage/Achievement";
import Hero from "@/parts/HomePage/Hero";
import Pricing from "@/parts/HomePage/Pricing";

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