import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full nav-bg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 flex-shrink-0">
            <Image
              src="/logo.webp"
              alt="MyScapez"
              fill
              sizes="(min-width: 1024px) 128px, (min-width: 768px) 96px, 64px"
              className="object-contain rounded-md drop-shadow-2xl ring-2 ring-green-400/30"
              priority
            />
          </div>
          <span className="font-extrabold text-lg md:text-2xl lg:text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 drop-shadow-md">
            MyScapez
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 nav-gap-left">
          <a href="#features" className="nav-card">Features</a>
          <a href="#pricing" className="nav-card">Pricing</a>
          <a href="#contact" className="nav-card">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#quote" className="nav-card nav-cta">Get Your Quote</a>
        </div>
      </div>
    </nav>
  );
}
