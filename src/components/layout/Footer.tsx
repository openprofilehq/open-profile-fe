import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden rounded-t-3xl bg-slate-900 px-4 pt-16 pb-10 md:px-8">
      <div className="pointer-events-none absolute -bottom-6 -left-10 z-0 hidden h-20 w-28 select-none md:block md:h-28 md:w-36">
        <Image
          src="/footer/footer.svg"
          className="object-contain pt-5"
          alt=""
          fill
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-12 pb-16 md:flex-row md:gap-8">
          <div className="flex-1 md:pt-7">
            <div className="flex items-center">
              <div className="relative h-10 w-48 md:h-12 md:w-64">
                <Image
                  src="/footer/logo.svg"
                  className="h-full w-full object-contain object-bottom"
                  alt="OpenProfile logo"
                  fill
                />
              </div>
            </div>

            <p className="mt-3 max-w-md text-base leading-relaxed font-semibold text-slate-200 md:text-base">
              Your verified identity, discoverable everywhere.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-3 md:gap-16">
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-white">Products</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/coming-soon"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/coming-soon"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/coming-soon"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm font-normal text-slate-200 transition-colors hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-gray-500 pt-8">
          <p className="text-center text-sm font-light text-white">
            © {new Date().getFullYear()} Open Profile. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
