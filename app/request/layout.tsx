import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a mow",
  description: "Book lawn mowing, edging or garden work in South East Queensland. Pick a day and time window, and the job goes to a local crew that services your suburb.",
  alternates: { canonical: "/request" },
}

export default function RequestLayout({ children }: { children: React.ReactNode }) {
  return children
}
