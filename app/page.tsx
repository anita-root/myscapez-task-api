'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  Code2,
  ChevronDown,
  Clock3,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  LayoutTemplate,
  Send,
  Globe2,
} from 'lucide-react'

const logoUrl = '/myscapez-logo-small.png'

const lawnImages = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-2000BA59-3GxF9IKnK281oRJFvh3fGjKqLllgOC.jpeg', alt: 'Freshly mown backyard lawn beside a pool, timber deck and stepping stones', title: 'Lawn mowing', description: 'Freshly mown residential lawn with an even finish.', keywords: 'lawn mowing, residential lawn mowing, backyard mowing, MyScapez' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-61CFC6DF-OG6BddYuTKaiVDoVSucVuy9og4fpUX.jpeg', alt: 'Neatly edged suburban lawn with garden border and green grass', title: 'Whipper snipper edging', description: 'Neat lawn edges define garden beds and paths.', keywords: 'whipper snipper edging, lawn edging, garden edging, MyScapez' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-E9EDB5D0-mu2rPwoyp9xznRVy3JJNxtVhI6VkVo.jpeg', alt: 'Sunny suburban backyard lawn with trimmed garden beds and patio', title: 'Hedge trimming', description: 'Trimmed garden surrounds create a tidy outdoor space.', keywords: 'hedge trimming, garden maintenance, lawn care, MyScapez' },
]

const blogPosts = [
  { href: '/services', title: 'What each lawn service includes', category: 'Service definitions', copy: 'Lawn mowing, lawn care and landscaping, and the jobs a business can switch on.', image: lawnImages[0] },
  { href: '/guides/request', title: 'What to send with a quote request', category: 'Quote preparation', copy: 'The suburb, the job, the property and the lawn size. Photos are not uploaded.', image: lawnImages[1] },
  { href: '/services#weed-treatment', title: 'When weed treatment is not offered', category: 'Licences', copy: 'Chemical weed work stays off until the business holds the Queensland authorisation that job needs.', image: lawnImages[2] },
]

const services = [
  { title: 'Lawn mowing', copy: 'A clean, even finish every time.', icon: '✂' },
  { title: 'Edging & detail', copy: 'Crisp borders that frame your garden.', icon: '⌁' },
  { title: 'Hedge trimming', copy: 'Keep hedges neat, healthy and shaped.', icon: '✦' },
  { title: 'Yard clean-up', copy: 'From green waste to a fresh reset.', icon: '◒' },
]

const websitePackages = [
  { title: 'Landing page', price: 'From $499', copy: 'A sharp one-page home for your services, suburb coverage and enquiries.', icon: LayoutTemplate, points: ['Mobile-first design', 'Service and contact sections', 'Launch-ready setup'] },
  { title: 'Advertising website', price: 'From $999', copy: 'A stronger local presence built to showcase your work and attract new leads.', icon: Globe2, points: ['Up to 5 key pages', 'Local SEO foundations', 'Gallery and enquiry flow'] },
  { title: 'Custom website', price: 'From $1,999', copy: 'A tailored digital experience for ambitious lawn care businesses with bigger plans.', icon: Code2, points: ['Bespoke layouts and features', 'Custom integrations', 'Strategy-led build'] },
]

const bookingSteps = [
  { title: 'Lock in your day', copy: 'Pick a date that suits, then tell us the job: a regular mow, edges and whipper snipping, a hedge trim or a full yard clean-up.', crew: 'Jobs land with the date, block size and frequency already sorted.' },
  { title: 'Matched with a local crew', copy: 'Your job goes to one mowing, gardening or landscaping business that already services your suburb. No ring-around, no bidding war.', crew: 'You only see work in the suburbs and services you have switched on.' },
  { title: 'Confirmed by text and email', copy: 'Once a crew accepts, you get an SMS and an email with who is coming, the day and the callout price.', crew: 'Customer details come through the moment you accept.' },
  { title: 'Pay the callout fee', copy: 'Pay the callout fee to secure your spot on the run sheet. Any extras are quoted and approved before the mower starts.', crew: 'The callout is locked in before you load the trailer.' },
  { title: 'Your local crew gets it done', copy: 'They turn up on the day to mow, edge, trim and blow down the paths, and take the green waste if you asked for it.', crew: 'Turn up, do the job right, move on to the next yard.' },
  { title: 'Finished-job photos, then rate the work', copy: 'The crew sends through photos of the finished lawn. Rating the business is optional, but it helps good local operators get found.', crew: 'Finished-job photos and ratings build your profile.' },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeService, setActiveService] = useState('Lawn mowing')
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const submitWebsiteEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitted) return
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').replace(/[<>]/g, '').trim().slice(0, 80)
    const email = String(form.get('email') || '').trim().slice(0, 254)
    const packageName = String(form.get('package') || selectedPackage || 'Something else').replace(/[<>]/g, '').trim().slice(0, 80)
    const details = String(form.get('details') || '').replace(/[<>]/g, '').trim().slice(0, 1000)
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setSubmitted(true)
    window.location.href = `mailto:admin@myscapez.com?subject=Website enquiry - ${encodeURIComponent(packageName)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPackage: ${packageName}\nDetails: ${details}`)}`
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050605] text-[#f2f6ef]">
      <div className="ambient-background" aria-hidden="true"><span className="ambient-orb ambient-orb-one" /><span className="ambient-orb ambient-orb-two" /><svg className="ambient-lines" viewBox="0 0 800 800" fill="none"><circle cx="400" cy="400" r="290" stroke="rgba(156,255,18,.12)" strokeDasharray="3 18" /><circle cx="400" cy="400" r="210" stroke="rgba(221,70,255,.08)" strokeDasharray="2 22" /><path d="M90 580C210 300 420 250 710 120" stroke="rgba(156,255,18,.1)" strokeDasharray="4 16" /></svg></div>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050605]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#top" aria-label="MyScapez home" className="flex items-center gap-2">
            <img src={logoUrl} alt="MyScapez" className="h-10 w-auto object-contain object-left" />
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#a8b1a7] md:flex">
            <a href="#how-it-works" className="transition hover:text-[#9cff12]">How it works</a>
            <a href="#services" className="transition hover:text-[#9cff12]">Services</a>
            <a href="#book" className="transition hover:text-[#9cff12]">Book a mow</a><a href="/directory" className="transition hover:text-[#9cff12]">List your business</a><a href="/about" className="transition hover:text-[#9cff12]">About us</a><a href="#websites" className="transition hover:text-[#9cff12]">Websites</a><a href="#insights" className="transition hover:text-[#9cff12]">Lawn care tips</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <a href="/login" className="rounded-full px-4 py-2 text-sm text-[#b8c2b7] transition hover:text-white">Log in</a>
            <a href="/request" className="glow-button rounded-full px-5 py-3 text-sm font-semibold text-[#081006]">Request a mower <ArrowRight aria-hidden="true" /></a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/10 p-3 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {menuOpen && <nav className="flex flex-col gap-1 border-t border-white/[0.08] px-5 pb-5 pt-3 md:hidden"><a href="#how-it-works" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[#c3cdc1]">How it works</a><a href="#services" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[#c3cdc1]">Services</a><a href="#book" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[#c3cdc1]">Book a mow</a><a href="/directory" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[#c3cdc1]">List your business</a><a href="/about" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[#c3cdc1]">About us</a><a href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[#c3cdc1]">Log in</a><a href="/request" onClick={() => setMenuOpen(false)} className="glow-button mt-2 rounded-xl px-3 py-3 text-center font-semibold text-[#081006]">Request a mower</a></nav>}
      </header>

      <section id="top" className="hero-section relative mx-auto max-w-7xl overflow-hidden px-5 pb-20 pt-16 lg:px-10 lg:pb-32 lg:pt-28"><img src="/myscapez-logo-small.png" alt="" aria-hidden="true" className="hero-logo-watermark" />
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#7cff00]/10 blur-[120px]" />
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="reveal-up mb-7 inline-flex items-center gap-2 rounded-full border border-[#9cff12]/30 bg-[#9cff12]/[0.07] px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#b6ff62]"><span className="size-1.5 rounded-full bg-[#9cff12] shadow-[0_0_12px_#9cff12]" /> Lawn care, made local</div>
            <h1 className="reveal-up max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-0.065em] text-balance sm:text-7xl lg:text-[86px]">A better lawn starts <span className="text-[#8dff14]">here.</span></h1>
            <p className="reveal-up mt-7 max-w-xl text-lg leading-8 text-[#9ca99a]">Book a trusted local mowing professional, right when you need one. Simple quotes, clear communication, and a lawn you&apos;ll love coming home to.</p>
            <div className="reveal-up mt-9 flex flex-col gap-3 sm:flex-row"><a href="/request" className="glow-button inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-semibold text-[#081006]">Request a mower <ArrowRight aria-hidden="true" /></a><a href="#book" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-base font-medium text-[#d9e3d7] transition hover:border-[#9cff12]/60 hover:text-[#9cff12]">See how booking works</a></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#7f8c7d]"><span className="flex items-center gap-2"><ShieldCheck className="text-[#9cff12]" aria-hidden="true" /> Local professionals</span><span className="flex items-center gap-2"><Clock3 className="text-[#9cff12]" aria-hidden="true" /> Fast responses</span><span className="flex items-center gap-2"><Check className="text-[#9cff12]" aria-hidden="true" /> Quote before work</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="absolute -inset-5 rounded-[38px] bg-[#72ff00]/10 blur-3xl" />
            <div className="hero-photo-strip relative z-10 mb-4 grid grid-cols-3 gap-2 rounded-[24px] border border-[#9cff12]/30 bg-[#0b100b] p-2" aria-label="Lawn care services gallery">{lawnImages.map((image, index) => <figure key={image.title} className="overflow-hidden rounded-[18px]"><img src={image.src} alt={image.alt} width={1200} height={800} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" title={`${image.title} | MyScapez | Authored by Jai Butchers`} className="h-36 w-full object-cover sm:h-44" /></figure>)}</div>
            <div className="hero-card relative overflow-hidden rounded-[30px] border border-[#8eff18]/40 bg-[#0b100b] p-5 shadow-[0_0_60px_rgba(112,255,0,.1)] sm:p-7">
              <div className="mb-8 flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-[#849183]">Your local match</p><h2 className="mt-2 text-2xl font-semibold">Lawn care, sorted.</h2></div><div className="rounded-2xl border border-[#9cff12]/30 bg-[#9cff12]/10 p-3"><Sparkles className="text-[#9cff12]" aria-hidden="true" /></div></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="mb-4 flex items-center justify-between text-xs text-[#889687]"><span>REQUEST PREVIEW</span><span className="text-[#9cff12]">LIVE MATCHING</span></div><div className="flex items-center gap-3 border-b border-white/10 pb-4"><div className="flex size-11 items-center justify-center rounded-full bg-[#9cff12]/15 text-[#a9ff43]"><MapPin aria-hidden="true" /></div><div><p className="text-sm font-medium">North Lakes, QLD</p><p className="mt-1 text-xs text-[#7d897b]">3 local pros available</p></div><ChevronDown className="ml-auto text-[#71806f]" aria-hidden="true" /></div><div className="flex items-center gap-3 pt-4"><div className="flex size-11 items-center justify-center rounded-full bg-[#9cff12]/15 text-[#a9ff43]"><CalendarDays aria-hidden="true" /></div><div><p className="text-sm font-medium">When works for you?</p><p className="mt-1 text-xs text-[#7d897b]">Choose a date and time</p></div><ArrowRight className="ml-auto text-[#9cff12]" aria-hidden="true" /></div></div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#9cff12] p-4 text-[#081006]"><div><p className="text-xs font-semibold uppercase tracking-wider opacity-70">Starting callout</p><p className="mt-1 text-2xl font-bold">$59 <span className="text-sm font-medium">AUD</span></p></div><ArrowRight aria-hidden="true" /></div>
              <p className="mt-4 text-center text-xs text-[#738070]">You&apos;ll see the full quote before any work begins.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-y border-white/[0.07] bg-[#080b08] px-5 py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">One platform. Every outdoor job.</p><h2 className="section-heading mt-3">Fresh lawns. <span>Less fuss.</span></h2></div><p className="max-w-sm text-sm leading-6 text-[#879286]">From a quick mow to a full yard reset, tell us what you need and we&apos;ll connect you with someone who can do it right.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map((service) => <button key={service.title} onClick={() => setActiveService(service.title)} className={`shine-card text-left ${activeService === service.title ? 'active-card' : ''}`}><div className="mb-10 flex items-start justify-between"><span className="text-3xl text-[#9cff12]">{service.icon}</span><ArrowRight className="text-[#61705f] transition group-hover:text-[#9cff12]" aria-hidden="true" /></div><h3 className="text-lg font-semibold">{service.title}</h3><p className="mt-2 text-sm leading-6 text-[#869184]">{service.copy}</p></button>)}</div></div></section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">How it works</p><h2 className="section-heading mt-3">Your yard, <span>your way.</span></h2><p className="mt-6 max-w-md leading-7 text-[#879286]">We take care of the back-and-forth so you can spend more time enjoying the result.</p><a href="/request" className="glow-button mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 font-semibold text-[#081006]">Start a request <ArrowRight aria-hidden="true" /></a></div><div className="grid gap-4 sm:grid-cols-3">{[['01', 'Tell us what you need', 'Share your suburb, service, preferred time and a few photos.'], ['02', 'Meet your local match', 'We send your request to a professional who works in your area.'], ['03', 'Enjoy the result', 'Approve the quote before any work begins.']].map(([number, title, copy]) => <div key={number} className="shine-card"><span className="text-sm font-semibold text-[#9cff12]">{number}</span><h3 className="mt-12 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#869184]">{copy}</p></div>)}</div></div></section>

      <section id="book" className="bg-[#080b08] px-5 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="eyebrow">From booking to fresh cut</p><h2 className="section-heading mt-3">Booked in. <span>Job sorted.</span></h2><p className="mt-5 leading-7 text-[#879286]">Six steps from picking a date to a freshly mown yard. Built for homeowners who want the job done properly, and for the mowing, gardening and landscaping crews who do it.</p></div><a href="/request" className="flex items-center gap-2 text-sm font-semibold text-[#9cff12]">Book a mow <ArrowRight aria-hidden="true" /></a></div><ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{bookingSteps.map((step, index) => <li key={step.title} className="shine-card flex flex-col"><span className="text-sm font-semibold text-[#9cff12]">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-8 text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#869184]">{step.copy}</p><p className="mt-auto border-t border-white/10 pt-4 text-xs leading-5 text-[#9aa995]"><span className="font-semibold text-[#b7ff60]">For crews: </span>{step.crew}</p></li>)}</ol><p className="mt-8 text-center text-sm text-[#869184]">Run a mowing, gardening or landscaping business? <a href="/directory" className="font-semibold text-[#9cff12]">List your business for free</a>. Full contact details stay private until a booking is confirmed.</p></div></section>

      <section id="insights" className="border-y border-white/[0.07] bg-[#080b08] px-5 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="eyebrow">Myscapez lawn care journal</p><h2 className="section-heading mt-3">Practical advice for <span>better lawns.</span></h2><p className="mt-5 leading-7 text-[#879286]">Straightforward notes on how MyScapez describes the work. Each card opens a page of text.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{blogPosts.map((post) => <a key={post.title} href={post.href} className="shine-card block overflow-hidden p-0"><img src={post.image.src} alt={post.image.alt} width={1200} height={800} loading="lazy" decoding="async" title={post.image.title} className="h-52 w-full object-cover" /><div className="p-5"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#9cff12]">{post.category}</p><h3 className="mt-4 text-xl font-semibold leading-tight">{post.title}</h3><p className="mt-3 text-sm leading-6 text-[#869184]">{post.copy}</p><p className="mt-5 text-xs text-[#657162]">Read this page</p></div></a>)}</div></div></section>

      <section id="request" className="px-5 py-20 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-[32px] border border-[#9cff12]/30 bg-[#0d150b] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-16"><div><p className="eyebrow">Ready when you are</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Let&apos;s get your lawn <span className="text-[#9cff12]">sorted.</span></h2><p className="mt-5 max-w-lg leading-7 text-[#9aa995]">Request a local pro in a few quick steps. Add photos, choose a time, and we&apos;ll handle the rest.</p></div><div className="flex flex-col gap-3"><a href="#top" className="glow-button inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 font-semibold text-[#081006]">Request a mower <ArrowRight aria-hidden="true" /></a><button className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 px-7 text-sm text-[#c0cbbd]"><Upload aria-hidden="true" /> Add photos later</button></div></div></section>

      <section id="websites" className="border-y border-white/[0.07] bg-[#080b08] px-5 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="eyebrow">Need a website?</p><h2 className="section-heading mt-3">Look the part. <span>Win more work.</span></h2><p className="mt-5 leading-7 text-[#879286]">Choose a starting point and tell us what your business needs. We&apos;ll review your enquiry and reply with next steps.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{websitePackages.map((item) => { const Icon = item.icon; return <button key={item.title} onClick={() => { setSelectedPackage(item.title); setSubmitted(false) }} className={`shine-card text-left ${selectedPackage === item.title ? 'active-card' : ''}`}><div className="flex items-start justify-between"><div className="flex size-12 items-center justify-center rounded-2xl border border-[#9cff12]/30 bg-[#9cff12]/10"><Icon className="text-[#9cff12]" aria-hidden="true" /></div><span className="text-sm font-semibold text-[#b7ff60]">{item.price}</span></div><h3 className="mt-7 text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#869184]">{item.copy}</p><ul className="mt-6 flex flex-col gap-2 text-xs text-[#a4b0a0]">{item.points.map((point) => <li key={point} className="flex items-center gap-2"><Check className="text-[#9cff12]" aria-hidden="true" />{point}</li>)}</ul><span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#9cff12]">Enquire about this <ArrowRight aria-hidden="true" /></span></button> })}</div><div className="mt-8 rounded-[28px] border border-[#9cff12]/25 bg-[#0d150b] p-6 sm:p-8">{submitted ? <div className="flex flex-col items-start gap-3"><div className="flex size-12 items-center justify-center rounded-full bg-[#9cff12] text-[#081006]"><Check aria-hidden="true" /></div><h3 className="text-2xl font-semibold">Enquiry ready to send.</h3><p className="text-[#9aa995]">Your email app should have opened with the details. We&apos;ll reply from admin@myscapez.com.</p><button type="button" onClick={() => setSubmitted(false)} className="text-sm font-semibold text-[#9cff12]">Send another enquiry</button></div> : <form onSubmit={submitWebsiteEnquiry} className="grid gap-5 lg:grid-cols-2"><div className="lg:col-span-2"><h3 className="text-2xl font-semibold">Tell us about your website</h3><p className="mt-2 text-sm text-[#879286]">{selectedPackage ? `Selected: ${selectedPackage}` : 'Select a package above, or choose something else below.'}</p></div><label className="flex flex-col gap-2 text-sm font-medium">Name<input required name="name" type="text" placeholder="Your name" className="form-input" /></label><label className="flex flex-col gap-2 text-sm font-medium">Email<input required name="email" type="email" placeholder="you@business.com" className="form-input" /></label><label className="flex flex-col gap-2 text-sm font-medium lg:col-span-2">What are you interested in?<select required name="package" defaultValue={selectedPackage ?? ''} className="form-input"><option value="" disabled>Select an option</option>{websitePackages.map((item) => <option key={item.title}>{item.title}</option>)}<option>Something else</option></select></label><label className="flex flex-col gap-2 text-sm font-medium lg:col-span-2">Details <span className="font-normal text-[#657162]">(optional)</span><textarea name="details" rows={4} placeholder="Tell us what you&apos;re wanting to build..." className="form-input resize-y" /></label><button type="submit" className="glow-button inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 font-semibold text-[#081006] lg:w-fit">Send enquiry <Send aria-hidden="true" /></button><p className="self-center text-xs leading-5 text-[#657162]">We&apos;ll respond manually by email. Automatic Resend confirmations can be connected when email integration is enabled.</p></form>}</div></div></section>

      <footer className="border-t border-white/[0.08] px-5 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-[#6f7c6d]"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold tracking-[0.08em] text-[#dfe8dc]">Myscapez</p><p className="mt-2 text-xs text-[#657162]">Better lawns, locally.</p></div><div className="flex flex-col gap-2 sm:items-end"><a href="tel:0480733936" className="transition hover:text-[#9cff12]">0480 733 936</a><a href="mailto:admin@myscapez.com" className="transition hover:text-[#9cff12]">admin@myscapez.com</a><span className="text-xs text-[#657162]">ABN 79 501 664 159</span></div></div><div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5"><div className="flex flex-wrap gap-5"><a href="#top" className="transition hover:text-[#9cff12]">Privacy</a><a href="#top" className="transition hover:text-[#9cff12]">Terms</a><a href="/request" className="transition hover:text-[#9cff12]">Contact</a></div><span className="text-[#4f594d]">Built by <a href="https://thehoneypot.com.au" target="_blank" rel="noreferrer" className="honeypot-link">Honeypot</a></span></div><p className="text-xs text-[#4f594d]">© 2026 Myscapez. All rights reserved.</p></div></footer>
    </main>
  )
}
