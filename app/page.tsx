"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { FluidBackground } from "@/components/fluid-background"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { StoreSection } from "@/components/store-section"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <main className="relative min-h-screen overflow-x-hidden">
        {/* Interactive fluid background */}
        <FluidBackground />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Page sections */}
        <HeroSection />
        <AboutSection />
        <ShowcaseSection />
        <StoreSection />
        <Footer />
      </main>
    </>
  )
}
