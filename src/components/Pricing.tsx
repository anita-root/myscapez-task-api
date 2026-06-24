export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-16">
      <h2 className="text-2xl font-semibold">Pricing</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card-transparent p-6">
          <div className="text-sm muted">Landing Page</div>
          <div className="text-2xl font-bold mt-3">$400</div>
          <ul className="mt-3 text-sm">
            <li>Perfect for Landscapers & Trades</li>
            <li>Lead capture form</li>
            <li>Basic SEO + Map listing</li>
          </ul>
          <div className="mt-4">
            <a href="#enquire" className="inline-block px-4 py-2 bg-white/10 rounded text-white">Enquire Now</a>
          </div>
        </div>

        <div className="card-transparent p-6">
          <div className="text-sm muted">Small Business Website</div>
          <div className="text-2xl font-bold mt-3">$900</div>
          <ul className="mt-3 text-sm">
            <li>Tradies & Professionals</li>
            <li>Multi-page site</li>
            <li>E-commerce options</li>
          </ul>
          <div className="mt-4">
            <a href="#enquire" className="inline-block px-4 py-2 bg-white/10 rounded text-white">Enquire Now</a>
          </div>
        </div>

        <div className="card-transparent p-6">
          <div className="text-sm muted">Custom Web App</div>
          <div className="text-2xl font-bold mt-3">Custom Quote</div>
          <ul className="mt-3 text-sm">
            <li>⚙ Dashboard</li>
            <li>📱 Mobile responsive</li>
            <li>🗄 Lead database & SEO</li>
            <li>🔒 Secure Backend</li>
          </ul>
          <div className="mt-4">
            <a href="#enquire" className="inline-block px-4 py-2 bg-white/10 rounded text-white">Enquire Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}
