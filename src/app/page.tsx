"use client";

import { useState } from "react";

const services = [
  {
    title: "Garden Design",
    description:
      "Custom garden designs tailored to your space, lifestyle, and budget.",
    icon: "🌿",
  },
  {
    title: "Lawn Care",
    description:
      "Regular mowing, edging, fertilising, and lawn health programs.",
    icon: "🌱",
  },
  {
    title: "Irrigation Systems",
    description:
      "Smart watering solutions that save water and keep your garden thriving.",
    icon: "💧",
  },
  {
    title: "Landscaping & Construction",
    description:
      "Retaining walls, paving, decking, and full outdoor transformations.",
    icon: "🏡",
  },
  {
    title: "Tree & Hedge Trimming",
    description:
      "Professional pruning, hedging, and tree maintenance services.",
    icon: "✂️",
  },
  {
    title: "Seasonal Clean-Ups",
    description:
      "Spring and autumn tidy-ups to keep your property looking its best.",
    icon: "🍂",
  },
];

const SERVICE_OPTIONS = [
  "Garden Design",
  "Lawn Care",
  "Irrigation Systems",
  "Landscaping & Construction",
  "Tree & Hedge Trimming",
  "Seasonal Clean-Up",
  "Other",
];

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ??
            "Something went wrong. Please try again."
        );
      }

      setFormState("success");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setFormState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  return (
    <main className="flex flex-col min-h-screen font-sans">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-700 tracking-tight">
            Myscapez
          </span>
          <a
            href="#contact"
            className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-700 transition-colors"
          >
            Get a Free Quote
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-green-800 to-green-600 text-white py-24 px-4 text-center overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <p className="text-green-200 uppercase tracking-widest text-sm font-semibold mb-4">
            Australia&apos;s Landscaping Experts
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Bring Your Outdoor Space to Life
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-10 max-w-xl mx-auto">
            From lush garden designs to full outdoor transformations — Myscapez
            delivers premium landscaping services across Australia.
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-green-700 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-green-50 transition-all"
          >
            Get Your Free Quote →
          </a>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Everything your outdoor space needs — handled by professionals who
            care.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              stat: "500+",
              label: "Projects Completed",
              detail: "Across residential and commercial properties.",
            },
            {
              stat: "10+",
              label: "Years of Experience",
              detail: "Trusted by homeowners and businesses Australia-wide.",
            },
            {
              stat: "100%",
              label: "Satisfaction Guarantee",
              detail: "We don't stop until you love your outdoor space.",
            },
          ].map((item) => (
            <div key={item.stat}>
              <p className="text-5xl font-extrabold text-green-600 mb-2">
                {item.stat}
              </p>
              <p className="text-xl font-bold text-gray-800 mb-1">
                {item.label}
              </p>
              <p className="text-gray-500 text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact / Lead Form ── */}
      <section id="contact" className="py-20 px-4 bg-green-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3">
            Get a Free Quote
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Fill in your details and one of our landscaping specialists will be
            in touch within 24 hours.
          </p>

          {formState === "success" ? (
            <div className="bg-green-100 border border-green-300 text-green-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🎉</p>
              <h3 className="text-xl font-bold mb-2">
                Thanks, we&apos;ll be in touch!
              </h3>
              <p className="text-sm text-green-700">
                We&apos;ve received your enquiry and will reach out within 24
                hours. Check your inbox for a confirmation email.
              </p>
              <button
                onClick={() => setFormState("idle")}
                className="mt-6 text-green-700 underline text-sm hover:text-green-900"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-md p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="04xx xxx xxx"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select a service…</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your outdoor space and what you'd like done…"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </div>

              {formState === "error" && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-full transition-colors text-sm"
              >
                {formState === "submitting"
                  ? "Sending…"
                  : "Send My Free Quote Request"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                No spam. We respect your privacy and will only use your details
                to respond to your enquiry.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-green-900 text-green-200 py-8 px-4 text-center text-sm mt-auto">
        <p className="font-semibold text-white mb-1">Myscapez</p>
        <p>Premium Landscaping Services · Australia-wide</p>
        <p className="mt-2 text-green-400 text-xs">
          © {new Date().getFullYear()} Myscapez. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
