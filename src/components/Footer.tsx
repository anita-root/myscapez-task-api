export default function Footer() {
  return (
    <footer className="w-full py-8 text-sm text-gray-300 bg-black/80">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="Myscapez" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain rounded-md drop-shadow-lg" />
          <div>
            <div className="font-semibold">Myscapez</div>
            <div className="text-xs muted">Websites That Grow While You Mow</div>
          </div>
        </div>

        <div className="text-xs muted">
          <div>Email: <a href="mailto:hello@myscapez.com.au" className="underline">hello@myscapez.com.au</a></div>
          <div>Phone: (Your business number)</div>
        </div>

        <div className="text-xs muted">
          <a href="#" className="block">Home</a>
          <a href="#features" className="block">Services</a>
          <a href="#pricing" className="block">Pricing</a>
          <a href="#contact" className="block">Contact</a>
        </div>
      </div>

      <div className="mt-6 text-center text-xs muted">© {new Date().getFullYear()} Myscapez — All rights reserved. ABN: (your ABN). <a href="/privacy" className="underline">Privacy Policy</a> • <a href="/terms" className="underline">Terms &amp; Conditions</a></div>
    </footer>
  );
}
