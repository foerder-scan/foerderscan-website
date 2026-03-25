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

export const metadata: Metadata = {
  title: "FörderScan – Die passende Förderung in Sekunden statt Stunden",
  description:
    "KI-gestützte SaaS-Plattform für Energieberater und Eigentümer. Alle BEG-, KfW- und BAFA-Förderprogramme zentral, aktuell und intelligent gematcht.",
  keywords:
    "Förderprogramme, BEG, KfW, BAFA, Energieberater, Sanierung, Förderung, Effizienzhaus",
  openGraph: {
    title: "FörderScan – Die passende Förderung in Sekunden statt Stunden",
    description:
      "KI-gestützte Plattform für alle Energie-Förderprogramme. Für Energieberater und Eigentümer.",
    locale: "de_DE",
    type: "website",
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
