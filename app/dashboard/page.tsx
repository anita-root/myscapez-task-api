"use client"

import { FormEvent, useEffect, useState } from "react"
import { SuburbFinder } from "@/components/suburb-finder"
import { businessSession, loadStore, saveBusiness, setBusinessSession, type LeadRecord } from "@/lib/match-store"
import { leadsForOwner, ownedBusiness } from "@/lib/owner-access"
import { phoneError } from "@/lib/seq-directory"
import { jobById, workGroups } from "@/lib/work-catalog"


function DashboardPage() {
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [suburbs, setSuburbs] = useState<string[]>([])
  const [saved, setSaved] = useState("")
  const [leads, setLeads] = useState<LeadRecord[]>([])

  useEffect(() => {
    const session = businessSession()
    if (!session) {
      setReady(true)
      return
    }
    setEmail(session.email)
    const store = loadStore()
    const requested = new URLSearchParams(window.location.search).get("businessId") || new URLSearchParams(window.location.search).get("id")
    const existing = ownedBusiness(store.businesses, session)
    if (existing) {
      setName(existing.name)
      setPhone(existing.phone || "")
      setCategories(existing.categories)
      setSuburbs(existing.suburbs)
    }
    setLeads(leadsForOwner(store.leads, existing, requested))
    setReady(true)
  }, [])

  function toggleCategory(id: string) {
    setCategories((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim().length < 2) return setSaved("Enter the business name.")
    const phoneMessage = phoneError(phone)
    if (phoneMessage) return setSaved(phoneMessage)
    if (categories.length === 0) return setSaved("Choose at least one type of work.")
    if (suburbs.length === 0) return setSaved("Add at least one suburb.")
    try {
      const profile = saveBusiness({ id: email.toLowerCase(), name: name.trim(), email, phone: phone.trim(), categories, suburbs })
      setBusinessSession(email)
      const session = businessSession()
      setLeads(leadsForOwner(loadStore().leads, ownedBusiness(loadStore().businesses, session), profile.id))
      setSaved("Saved in this browser. Nothing was emailed.")
    } catch (caught) {
      setSaved(caught instanceof Error ? caught.message : "This profile could not be saved.")
    }
  }

  if (!ready) return null
  if (!email) {
    return (
      <main className="min-h-screen bg-[#050605] px-5 py-24 text-[#f2f6ef]">
        <div className="mx-auto max-w-xl">
          <h1 className="text-4xl font-semibold">Business dashboard</h1>
          <p className="mt-4 leading-7 text-[#9aa995]">Sign in with the business login first. The session stays in this browser only.</p>
          <a href="/login/business" className="mt-6 inline-flex font-semibold text-[#9cff12]">Business log in</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050605] text-[#f2f6ef]">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050605]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-3 px-5 lg:px-10">
          <a href="/" aria-label="MyScapez home"><img src="/myscapez-logo-small.png" alt="MyScapez" className="h-10 w-auto" /></a>
          <nav className="flex gap-5 text-sm text-[#a8b1a7]">
            <a href="/crm" className="hover:text-[#9cff12]">Lead list</a>
            <a href="/request" className="hover:text-[#9cff12]">Request a job</a>
          </nav>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-2 lg:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-[#0d150b] p-6">
          <p className="eyebrow">Signed in</p>
          <h1 className="text-3xl font-semibold">Work you take, and where</h1>
          <p className="text-sm leading-6 text-[#9aa995]">{email}. Jobs are only matched when you have chosen that category and added that suburb.</p>
          <label className="flex flex-col gap-2 text-sm font-medium">Business name
            <input value={name} onChange={(event) => setName(event.target.value)} className="form-input" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">Phone
            <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" className="form-input" placeholder="04xx xxx xxx" autoComplete="tel" />
            <span className="text-xs font-normal text-[#657162]">Required so we can reach you about a job. It is not published on the directory.</span>
          </label>
          <div className="flex flex-col gap-4">
            {workGroups.map((group) => (
              <fieldset key={group.id} className="flex flex-col gap-2">
                <legend className="text-sm font-semibold text-[#9cff12]">{group.title}</legend>
                <p className="text-xs leading-5 text-[#657162]">{group.summary}</p>
                {group.jobs.map((job) => (
                  <label key={job.id} className="flex min-h-11 items-center gap-3 text-sm">
                    <input type="checkbox" checked={categories.includes(job.id)} onChange={() => toggleCategory(job.id)} />
                    <span>{job.title}{"note" in job && job.note ? <span className="mt-1 block text-xs font-normal text-[#657162]">{job.note}</span> : null}</span>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm font-medium">Suburbs you cover
            <SuburbFinder selected={suburbs} onChange={setSuburbs} />
          </div>
          {saved && <p className="text-sm text-[#9cff12]">{saved}</p>}
          <button type="submit" className="glow-button min-h-14 rounded-full px-7 font-semibold text-[#081006]">Save profile</button>
        </form>
        <div className="flex flex-col gap-4">
          <div className="rounded-[28px] border border-white/10 p-6">
            <h2 className="text-2xl font-semibold">Calendar</h2>
            <p className="mt-2 text-sm leading-6 text-[#9aa995]">Matched jobs with a preferred day show here. Slack alerts and Resend emails are not connected, so nothing is sent when a job lands.</p>
            <ul className="mt-5 flex flex-col gap-3">
              {leads.length === 0 && <li className="text-sm text-[#657162]">No matched jobs for this business yet.</li>}
              {leads.map((lead) => (
                <li key={lead.id} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-semibold">{jobById(lead.category)?.title ?? lead.category}</p>
                  <p className="mt-1 text-sm text-[#9aa995]">{lead.suburb} · {lead.preferredDay || "No day chosen"} · {lead.customerName}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] border border-white/10 p-6 text-sm leading-6 text-[#9aa995]">
            <h2 className="text-lg font-semibold text-[#f2f6ef]">Where this will live</h2>
            <p className="mt-2">MongoDB holds the lead and business listing records once MONGODB_URI is set. Resend sends the emails. Slack gets the notification. Vercel hosts the app and Cloudflare serves DNS. Until then, and for the matching shown here, the match is stored in this browser only.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
