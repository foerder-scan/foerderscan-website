"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Zap,
  LayoutDashboard,
  FolderKanban,
  Calculator,
  User,
  LogOut,
  Bell,
  Database,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projekte", label: "Projekte", icon: FolderKanban },
  { href: "/dashboard/foerderrechner", label: "Förderrechner", icon: Calculator },
  { href: "/dashboard/datenbank", label: "Förderdatenbank", icon: Database },
  { href: "/dashboard/profil", label: "Profil & Abo", icon: User },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-100 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#1B4F72]">
          <span className="w-8 h-8 rounded-lg bg-[#1B4F72] text-white flex items-center justify-center">
            <Zap size={15} strokeWidth={2.5} />
          </span>
          FörderScan
        </Link>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#EBF5FB] text-[#1B4F72]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon
                size={17}
                strokeWidth={active ? 2.5 : 1.75}
                className={active ? "text-[#1B4F72]" : "text-slate-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Bell size={17} strokeWidth={1.75} className="text-slate-400" />
          Benachrichtigungen
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={17} strokeWidth={1.75} className="text-slate-400" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
