import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { JsonLd } from "./components/JsonLd";
import { SITE_NAME, SITE_URL } from "./lib/site";
import { graph, gymSchema } from "./lib/seo";

// Self-hosted (no Google Fonts request), which is faster and better for page speed scores.
const fredoka = localFont({ src: "./fonts/fredoka-latin-wght-normal.woff2", variable: "--font-fredoka", weight: "300 700", display: "swap" });
const nunito = localFont({ src: "./fonts/nunito-sans-latin-wght-normal.woff2", variable: "--font-nunito", weight: "200 1000", display: "swap" });

const TITLE = "The Gym Nest Nampa | Kids Gymnastics, Ninja & Cheer in Nampa, ID";
const DESCRIPTION =
  "Kids gymnastics, ninja, tumbling and cheer classes, preschool, open play and birthday parties in Nampa, Idaho. Ages 18 months and up. No-risk first day.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | The Gym Nest Nampa" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "kids gymnastics Nampa", "ninja classes Nampa", "toddler gymnastics Nampa", "tumbling classes Nampa", "cheer classes Nampa",
    "birthday party places Nampa", "open play Nampa", "preschool Nampa", "summer camp Nampa", "kids night out Nampa",
    "kids gymnastics Caldwell", "gymnastics Kuna", "homeschool PE Nampa",
  ],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#2c3070" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={graph(gymSchema())} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
