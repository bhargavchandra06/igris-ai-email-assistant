import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Installation } from "@/components/landing/Installation";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#4F46E5] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <BackgroundFX />
      <Navbar />
      <main id="main">
        <Hero />
        <Features />
        <Installation />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
