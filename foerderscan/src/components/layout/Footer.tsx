import Link from "next/link";
import { Zap, Mail, Share2, X } from "lucide-react";

const footerLinks = {
  Produkt: [
    { label: "Features – Energieberater", href: "/features/energieberater" },
    { label: "Features – Eigentümer", href: "/features/endkunden" },
    { label: "Preise", href: "/preise" },
    { label: "API-Dokumentation", href: "#" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Kontakt", href: "/ueber-uns#kontakt" },
    { label: "Blog", href: "#" },
    { label: "Karriere", href: "#" },
  ],
  Rechtliches: [
    { label: "Datenschutzerklärung", href: "/datenschutz" },
    { label: "Impressum", href: "/impressum" },
    { label: "AGB", href: "/agb" },
    { label: "Cookie-Einstellungen", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-white mb-4"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2E86C1] text-white">
                <Zap size={16} strokeWidth={2.5} />
              </span>
              FörderScan
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Die KI-gestützte SaaS-Plattform für alle Energie-Förderprogramme –
              für Energieberater und private Eigentümer.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                aria-label="LinkedIn (Share)"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Share2 size={16} />
              </a>
              <a
                href="#"
                aria-label="Twitter/X"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </a>
              <a
                href="mailto:info@foerderscan.de"
                aria-label="E-Mail"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} FörderScan. Alle Rechte
            vorbehalten.
          </p>
          <p className="text-xs text-slate-500">
            Förderdaten basieren auf offiziellen KfW- und BAFA-Quellen. Keine
            Rechtsberatung.
          </p>
        </div>
      </div>
    </footer>
  );
}
