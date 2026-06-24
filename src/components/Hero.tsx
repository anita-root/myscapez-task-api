import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-black/60 to-transparent text-white">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1">
          <div className="mb-6">
            <div className="mx-auto w-40 md:w-56 lg:w-72 h-40 md:h-56 lg:h-72 relative">
              <Image
                src="/logo.webp"
                alt="Myscapez Ladscaper Websites"
                fill
                sizes="(min-width: 1024px) 288px, (min-width: 768px) 224px, 160px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-3 bg-black/60 px-3 py-1 rounded-full text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M2 12h4l2-4 4 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold">10% OFF TAX TIME</span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            WHAT ARE YOU WAITING FOR
            <br />
            <span className="text-3xl sm:text-4xl block">THE GRASS TO GROW?</span>
          </h1>

          <p className="mt-6 text-2xl font-bold">
            <span className="text-white">Quality Made Websites</span>
            <span className="silver"> That Grow The</span>
            <span className="green"> More You Mow</span>
          </p>

          <p className="mt-6 text-sm muted max-w-xl">
            Myscapez started off mowing lawns just like you. We understand how stressful some jobs
            get — that&apos;s why we&apos;re offering top-notch, fully integrated webpages and landing pages.
            For Tax Time, get a website that grows while you mow and mark your spot on the map today.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a href="#quote" className="btn-quote">GET MY 10% OFF QUOTE</a>
            <a href="#pricing" className="text-sm muted">See Pricing</a>
          </div>

          <p className="mt-4 text-xs muted">*Tax Time Promotion. Terms &amp; Conditions apply.</p>
        </div>

        <div className="w-full lg:w-[520px]">
          <div className="mockup-laptop w-full h-[320px] flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-green-400/10 to-black/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-white/90">[Desktop mockup preview]</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
