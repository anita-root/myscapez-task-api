"use client";

import { Props } from "@/myscapez/next.config";
import React, { JSX, useState } from "react";

type FormElementJSX = JSX.Element;

export default function ContactForm({
  variant = "quote",
}: Props): FormElementJSX {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [marketing, setMarketing] = useState(true);
  const [doNotSell, setDoNotSell] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleService(name: string) {
    setServices((prev) =>
      prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name]
    );
  }

  type HTMLForm = HTMLFormElement;

  async function handleSubmit(e: React.FormEvent<HTMLForm>) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          business,
          email,
          phone,
          services,
          message,
          marketing,
          doNotSell,
          variant,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          "Thanks! We've sent your promo code to " + (email || "your email") + "."
        );

        setName("");
        setBusiness("");
        setEmail("");
        setPhone("");
        setServices([]);
        setMessage("");
      } else {
        setError(data?.message || "Something went wrong.");
      }
    } catch {
      setError("Network error.");
    }

    setLoading(false);
  }

  return (
    <form
      id={variant === "quote" ? "quote" : "enquire"}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl"
    >
      {success && (
        <div className="p-4 mb-4 bg-green-50 text-green-800 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            id="name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="business" className="block mb-2">Business Name</label>
          <input
            id="business"
            className="w-full p-2 border rounded"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block mb-2">Phone</label>
          <input
            id="phone"
            className="w-full p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-2">
          What service are you interested in?
        </label>

        <div className="flex flex-wrap gap-3">
          {[
            ["Landing Page", "landing"],
            ["Small Business Website", "website"],
            ["Web App / Dashboard", "webapp"],
            ["Lead Generation", "leads"],
          ].map(([label, value]) => (
            <label
              key={value}
              className="inline-flex items-center gap-2 bg-black/30 px-3 py-1 rounded"
            >
              <input
                type="checkbox"
                checked={services.includes(value)}
                onChange={() => toggleService(value)}
              />

              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-2">
          Tell us about your project (max 200 words)
        </label>

        <textarea
          rows={6}
          maxLength={1200}
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            id="marketing"
          />

          <span>
            I agree to receive marketing and promotional communications.
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={doNotSell}
            onChange={(e) => setDoNotSell(e.target.checked)}
            id="do-not-sell"
          />

          <span>
            Do not sell or share my personal data with third parties.
          </span>
        </label>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          className="btn-quote"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : variant === "quote"
            ? "Get My Quote"
            : "Enquire Now"}
        </button>

        <span className="text-sm muted">
          Or email us at{" "}
          <a
            href="mailto:myscapezcreations@gmail.com"
            className="underline"
          >
            myscapezcreations@gmail.com
          </a>
        </span>
      </div>
    </form>
  );
}
