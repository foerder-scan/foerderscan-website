import Link from "next/link";
import { Zap, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-[#1B4F72] mb-10">
          <span className="w-9 h-9 rounded-xl bg-[#1B4F72] text-white flex items-center justify-center">
            <Zap size={18} strokeWidth={2.5} />
          </span>
          FörderScan
        </Link>

        <div className="mb-6">
          <div className="text-8xl font-extrabold text-slate-200 leading-none select-none">404</div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Seite nicht gefunden</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
          Vielleicht hilft ein Blick auf unsere Förderdatenbank?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft size={14} /> Zur Startseite
          </Link>
          <Link
            href="/dashboard/datenbank"
            className="inline-flex items-center justify-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
          >
            <Search size={14} /> Förderdatenbank
          </Link>
        </div>
      </div>
    </div>
  );
}
