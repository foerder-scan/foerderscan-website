"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#1B4F72] hover:bg-[#154360] text-white rounded-xl transition-colors cursor-pointer"
    >
      <Printer size={15} /> Als PDF speichern
    </button>
  );
}
