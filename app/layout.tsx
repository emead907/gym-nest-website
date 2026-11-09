import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LocationProvider } from "./components/LocationProvider";
import { JsonLd } from "./components/JsonLd";
import { SITE_NAME, SITE_URL } from "./lib/site";
import { graph, locationSchema, organizationSchema } from "./lib/seo";

// Self-hosted (no Google Fonts request), which is faster and better for page speed scores.
const fredoka = localFont({ src: "./fonts/fredoka-latin-wght-normal.woff2", variable: "--font-fredoka", weight: "300 700", display: "swap" });
const nunito = localFont({ src: "./fonts/nunito-sans-latin-wght-normal.woff2", variable: "--font-nunito", weight: "200 1000", display: "swap" });

const DESCRIPTION =
  "Kids gymnastics, ninja, tumbling and cheer classes, preschool, open play and birthday parties in Nampa and Eagle, Idaho. Ages 18 months and up. First class free.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "The Gym Nest | Kids Gymnastics, Ninja & Cheer in Nampa and Eagle, ID", template: "%s | The Gym Nest" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "kids gymnastics Nampa", "kids gymnastics Eagle Idaho", "ninja classes Nampa", "ninja classes Eagle", "toddler gymnastics Meridian",
    "tumbling classes Nampa", "cheer classes Eagle ID", "birthday party places Nampa", "kids birthday party Eagle", "open play Nampa",
    "preschool Eagle Idaho", "preschool Nampa", "summer camp Nampa", "kids night out Eagle", "homeschool PE Treasure Valley",
  ],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME, title: "The Gym Nest | Kids Gymnastics, Ninja & Cheer in Nampa and Eagle", description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: "The Gym Nest | Kids Gymnastics, Ninja & Cheer", description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#2c3070" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={graph(organizationSchema(), locationSchema("nampa"), locationSchema("eagle"))} />
        <LocationProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </LocationProvider>
      </body>
    </html>
  );
}
