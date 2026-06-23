import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myscapez – Premium Landscaping in Australia",
  description:
    "Transform your outdoor space with Myscapez. Professional landscaping, garden design, and lawn care services across Australia. Get a free quote today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
