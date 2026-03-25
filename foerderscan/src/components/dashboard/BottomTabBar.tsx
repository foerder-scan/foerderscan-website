"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Calculator, Database, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projekte", label: "Projekte", icon: FolderKanban },
  { href: "/dashboard/foerderrechner", label: "Rechner", icon: Calculator },
  { href: "/dashboard/datenbank", label: "Datenbank", icon: Database },
  { href: "/dashboard/profil", label: "Profil", icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 safe-area-pb">
      <div className="flex items-center">
        {tabs.map((tab) => {
          const active = isActive(tab.href, tab.exact);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                active ? "text-[#1B4F72]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className={`text-[10px] font-semibold ${active ? "text-[#1B4F72]" : "text-slate-400"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
