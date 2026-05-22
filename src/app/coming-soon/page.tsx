import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="mx-auto max-w-[520px] text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#087583] uppercase">
          Coming Soon
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#050505] md:text-5xl">
          This feature is coming soon
        </h1>

        <p className="mt-4 text-lg leading-8 text-[#454545]">
          We are still working on this plan experience. Please check back later.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[8px] bg-[#087583] px-6 font-semibold text-white transition-colors hover:bg-[#065E69]"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
