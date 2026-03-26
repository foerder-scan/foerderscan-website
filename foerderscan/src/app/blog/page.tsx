import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { Calendar, Clock, ArrowRight, Zap } from "lucide-react";

export const metadata = {
  title: "Wissensportal – FörderScan",
  description:
    "Aktuelle Beiträge zu BEG, KfW, BAFA und Energieförderung. Praxiswissen für Energieberater und Eigentümer.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Förderupdate: "bg-blue-100 text-blue-700",
  Fachbeitrag: "bg-violet-100 text-violet-700",
  Praxiswissen: "bg-emerald-100 text-emerald-700",
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#1B4F72] transition-colors">
              FörderScan
            </Link>
            <span>/</span>
            <span>Wissensportal</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Wissensportal
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Aktuelle Analysen zu BEG, KfW 458, BAFA-Programmen und
            Energieförderung – aufbereitet für Energieberater und Eigentümer.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow mb-10"
        >
          <div className="md:flex">
            <div className="md:flex-1 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    CATEGORY_COLORS[featured.category] ??
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {featured.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(featured.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#1B4F72] transition-colors mb-3 leading-snug">
                {featured.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock size={13} />
                  {featured.readingTime} Min. Lesezeit
                </span>
                <span className="flex items-center gap-1 text-[#1B4F72] font-medium group-hover:gap-2 transition-all">
                  Artikel lesen
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
            <div className="md:w-64 bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] flex items-center justify-center p-12 shrink-0">
              <Zap size={64} className="text-white/20" strokeWidth={1.5} />
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    CATEGORY_COLORS[post.category] ??
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {post.category}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-[#1B4F72] transition-colors mb-2 leading-snug text-sm flex-1">
                {post.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(post.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readingTime} Min.
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-[#1B4F72] rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">
            Förderprüfung direkt im Tool
          </h3>
          <p className="text-blue-200 text-sm mb-6 max-w-lg mx-auto">
            Berechnen Sie in Sekunden, welche Förderung für Ihr Projekt
            erreichbar ist – mit aktuellem Regelwerk.
          </p>
          <Link
            href="/preise"
            className="inline-flex items-center gap-2 bg-white text-[#1B4F72] font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Kostenlos starten
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
