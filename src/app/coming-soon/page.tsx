import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="mx-auto max-w-[520px] text-center">
        <p className="text-link-hover-text text-sm font-semibold tracking-[0.2em] uppercase">
          Coming Soon
        </p>

        <h1 className="text-primary-text mt-4 text-4xl font-bold md:text-5xl">
          This feature is coming soon
        </h1>

        <p className="text-secondary-text mt-4 text-lg leading-8">
          We are still working on this plan experience. Please check back later.
        </p>

        <Link
          href="/"
          className="bg-brand-hover-bg hover:bg-brand-active-bg mt-8 inline-flex h-12 items-center justify-center rounded-[8px] px-6 font-semibold text-white transition-colors"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
