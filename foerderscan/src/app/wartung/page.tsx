import { Zap, Wrench } from "lucide-react";

export default function WartungPage() {
  return (
    <div className="min-h-screen bg-[#0F2233] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="w-10 h-10 rounded-xl bg-[#2E86C1] flex items-center justify-center">
            <Zap size={18} strokeWidth={2.5} className="text-white" />
          </span>
          <span className="text-xl font-extrabold text-white">FörderScan</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Wrench size={24} className="text-[#2E86C1]" strokeWidth={1.75} />
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-3">
          Wir bauen gerade
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          FörderScan wird gerade für euch optimiert. Wir sind bald wieder da — schau später nochmal vorbei.
        </p>

        <a
          href="mailto:info@foerderscan.de"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E86C1] hover:text-[#5DADE2] transition-colors"
        >
          info@foerderscan.de
        </a>
      </div>
    </div>
  );
}
