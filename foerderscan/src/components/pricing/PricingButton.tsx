"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  tier: "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  label: string;
  highlight: boolean;
}

export default function PricingButton({ tier, label, highlight }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (tier === "FREE") {
      router.push("/register");
      return;
    }
    if (tier === "ENTERPRISE") {
      router.push("/ueber-uns#kontakt");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (res.status === 401) {
        router.push("/login?redirect=/preise");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 ${
        highlight
          ? "bg-[#1B4F72] text-white hover:bg-[#154360]"
          : "bg-[#F8FAFC] text-[#1B4F72] border border-[#AED6F1] hover:bg-[#EBF5FB]"
      }`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <>
          {label} <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}
