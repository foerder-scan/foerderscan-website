"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Zap } from "lucide-react";

const navLinks = [
  {
    label: "Features",
    href: "#",
    children: [
      {
        label: "Für Energieberater",
        href: "/features/energieberater",
        desc: "Matching-Engine, Projekte, Berichte",
      },
      {
        label: "Für Eigentümer",
        href: "/features/endkunden",
        desc: "Schnellcheck & Förderübersicht",
      },
    ],
  },
  { label: "Preise", href: "/preise" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.08)]"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-[#1B4F72] shrink-0"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B4F72] text-white">
              <Zap size={16} strokeWidth={2.5} />
            </span>
            FörderScan
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1B4F72] rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                    onMouseEnter={() => setFeaturesOpen(true)}
                    onMouseLeave={() => setFeaturesOpen(false)}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        featuresOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {featuresOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50"
                      onMouseEnter={() => setFeaturesOpen(true)}
                      onMouseLeave={() => setFeaturesOpen(false)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="text-sm font-semibold text-slate-800">
                            {child.label}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {child.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1B4F72] rounded-md hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/ueber-uns#kontakt"
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F72] transition-colors px-3 py-2"
            >
              Anmelden
            </Link>
            <Link
              href="/preise"
              className="text-sm font-semibold bg-[#1B4F72] text-white px-4 py-2 rounded-lg hover:bg-[#154360] transition-colors shadow-sm cursor-pointer"
            >
              Kostenlos starten
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1">
            <Link
              href="/features/energieberater"
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Features – Energieberater
            </Link>
            <Link
              href="/features/endkunden"
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Features – Eigentümer
            </Link>
            <Link
              href="/preise"
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Preise
            </Link>
            <Link
              href="/ueber-uns"
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Über uns
            </Link>
            <div className="pt-3 space-y-2">
              <Link
                href="/preise"
                className="block text-center text-sm font-semibold bg-[#1B4F72] text-white px-4 py-2.5 rounded-lg hover:bg-[#154360] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Kostenlos starten
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
