"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Zap,
  LayoutDashboard,
  FolderKanban,
  Calculator,
  Database,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projekte", label: "Projekte", icon: FolderKanban },
  { href: "/dashboard/foerderrechner", label: "Förderrechner", icon: Calculator },
  { href: "/dashboard/datenbank", label: "Förderdatenbank", icon: Database },
  { href: "/dashboard/profil", label: "Profil & Abo", icon: User },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Menü öffnen"
      >
        <Menu size={18} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#1B4F72]">
            <span className="w-8 h-8 rounded-lg bg-[#1B4F72] text-white flex items-center justify-center">
              <Zap size={15} strokeWidth={2.5} />
            </span>
            FörderScan
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Menü schließen"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 pb-2 pt-1">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#EBF5FB] text-[#1B4F72]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  size={18}
                  strokeWidth={active ? 2.5 : 1.75}
                  className={active ? "text-[#1B4F72]" : "text-slate-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut size={18} strokeWidth={1.75} className="text-slate-400" />
            Abmelden
          </button>
        </div>
      </div>
    </>
  );
}
