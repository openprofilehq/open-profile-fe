"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="mx-auto max-w-130 text-center">
        <p className="text-link-hover-text text-sm font-semibold tracking-[0.2em] uppercase">
          Coming Soon
        </p>

        <h1 className="text-primary-text mt-4 text-4xl font-bold md:text-5xl">
          This feature is coming soon
        </h1>

        <p className="text-secondary-text mt-4 text-lg leading-8">
          We are still working on this plan experience. Please check back later.
        </p>

        <Button
          onClick={() => router.back()}
          className="bg-brand-hover-bg hover:bg-brand-active-bg mt-8 inline-flex h-12 items-center justify-center rounded-[8px] px-6 font-semibold text-white transition-colors"
        >
          Back to home
        </Button>
      </section>
    </main>
  );
}
