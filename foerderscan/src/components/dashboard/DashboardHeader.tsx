"use client";

import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import MobileNav from "./MobileNav";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? session?.user?.email ?? "Nutzer";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const tier = (session?.user as { tier?: string })?.tier ?? "FREE";

  const tierColor: Record<string, string> = {
    FREE: "bg-slate-100 text-slate-600",
    STARTER: "bg-blue-50 text-blue-700",
    PROFESSIONAL: "bg-[#EBF5FB] text-[#1B4F72]",
    ENTERPRISE: "bg-purple-50 text-purple-700",
  };

  return (
    <header className="bg-white border-b border-slate-100 px-4 lg:px-8 h-14 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <MobileNav />
        <span className="text-sm text-slate-500">
          Willkommen zurück,{" "}
          <span className="font-semibold text-slate-800">{name.split(" ")[0]}</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full ${tierColor[tier] ?? tierColor.FREE}`}>
          {tier}
        </span>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Benachrichtigungen"
        >
          <Bell size={16} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1B4F72] text-white text-xs font-bold flex items-center justify-center">
          {initials}
        </div>
      </div>
    </header>
  );
}
