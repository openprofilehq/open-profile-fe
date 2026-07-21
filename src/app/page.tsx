import { Navbar } from "@/components/layout/Navbar";
import { WaitlistBanner } from "@/components/home/WaitlistBanner";
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
    <div className="font-afacad bg-background text-primary-text min-h-screen overflow-hidden selection:bg-[#065E69] selection:text-white">
      <Navbar />

      <div className="pt-19">
        <WaitlistBanner />
        <div className="bg-primary-bg w-full">
          <main className="relative mx-auto w-full">
            <Hero />
          </main>
        </div>

        <section className="bg-primary-bg w-full">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 lg:px-0">
            <Impression />
          </div>
        </section>

        <section className="bg-background w-full">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 lg:px-0">
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
