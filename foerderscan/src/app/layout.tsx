import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/SessionProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://foerderscan.de";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FörderScan – Energie-Förderprogramme auf einen Blick",
    template: "%s | FörderScan",
  },
  description:
    "KI-gestützte SaaS-Plattform für Energieberater und Eigentümer. Alle BEG-, KfW- und BAFA-Förderprogramme zentral, aktuell und intelligent gematcht.",
  keywords: [
    "Förderprogramme", "BEG", "KfW", "BAFA", "Energieberater", "Sanierung",
    "Förderung", "Effizienzhaus", "ISFP", "Gebäudeenergiegesetz", "Wärmepumpe",
  ],
  authors: [{ name: "FörderScan", url: BASE_URL }],
  creator: "FörderScan",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "FörderScan – Energie-Förderprogramme auf einen Blick",
    description:
      "Alle KfW- und BAFA-Förderprogramme, intelligent gematcht für Energieberater und Eigentümer.",
    url: BASE_URL,
    siteName: "FörderScan",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FörderScan – Energie-Förderprogramme auf einen Blick",
    description: "Alle KfW- und BAFA-Förderprogramme zentral und intelligent gematcht.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-slate-900">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
