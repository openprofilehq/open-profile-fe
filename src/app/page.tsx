import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Proof } from "@/components/home/Proof";
import { FAQ } from "@/components/home/FAQ";
import { Pricing } from "@/components/home/Pricing";
import { CTA } from "@/components/home/CTA";
import { Journey } from "@/components/home/Journey";
import { Features } from "@/components/home/Features";
import Footer from "@/components/layout/Footer";
import Impression from "@/components/home/Impression";
import Target from "@/components/home/Target";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans text-primary-text selection:bg-button-brand-bg selection:text-white">
      <Navbar />
      <div className="pt-[76px]">
        <div className="w-full bg-primary-bg">
          <main className="relative mx-auto w-full">
            <Hero />
          </main>
        </div>

        {/* impression */}
        <section className="w-full bg-primary-bg">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            <Impression />
          </div>
        </section>

        {/* target */}
        <section className="w-full bg-span-text">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            <Target />
          </div>
        </section>
      </div>
      <Journey />

      <Features />
      <Proof />

      <FAQ />

      <Pricing />

      <CTA />
      <Footer />
    </div>
  );
}
