import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="flex flex-1 flex-col items-center w-full">
        <Hero />
        <div className="w-full max-w-4xl px-6">
          <Features />
          <Pricing />
          <section className="py-12">
            <ContactForm />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
