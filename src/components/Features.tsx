export default function Features(): import("react").JSX.Element {
  return (
    <section id="features" className="w-full py-16">
      <h2 className="text-2xl font-semibold">Why Myscapez</h2>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3">
          <span className="text-green text-2xl">📞</span>
          <div>
            <div className="font-semibold">Generate Leads</div>
            <div className="text-sm muted">Turn visitors into customers with quote forms and booking.</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-green text-2xl">⚡</span>
          <div>
            <div className="font-semibold">Lightning Fast</div>
            <div className="text-sm muted">Optimised performance for mobile and desktop.</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-green text-2xl">📍</span>
          <div>
            <div className="font-semibold">Put Yourself On The Map</div>
            <div className="text-sm muted">Local SEO and service areas to get more local customers.</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-green text-2xl">⚙️</span>
          <div>
            <div className="font-semibold">Fully Integrated Web UI</div>
            <div className="text-sm muted">Dashboards, lead storage and automation ready.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
