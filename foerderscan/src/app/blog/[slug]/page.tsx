import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getAllSlugs, BLOG_POSTS } from "@/lib/blog";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} – FörderScan`,
    description: post.excerpt,
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Förderupdate: "bg-blue-100 text-blue-700",
  Fachbeitrag: "bg-violet-100 text-violet-700",
  Praxiswissen: "bg-emerald-100 text-emerald-700",
};

function renderMarkdown(content: string): string {
  return content
    // Tables
    .replace(/^\|(.+)\|$/gm, (line) => {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .replace(/^---+$/gm, "")
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-900 mt-8 mb-3">$1</h3>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[0.85em] font-mono">$1</code>')
    // Checkmarks / X marks
    .replace(/^✅ (.+)$/gm, '<p class="flex gap-2 text-emerald-700"><span>✅</span><span>$1</span></p>')
    .replace(/^❌ (.+)$/gm, '<p class="flex gap-2 text-red-700"><span>❌</span><span>$1</span></p>')
    // List items
    .replace(/^- (.+)$/gm, '<li class="text-slate-700">$1</li>')
    // Numbered list
    .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-700">$1</li>')
    // Wrap consecutive <tr> in table
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (m) => `<div class="overflow-x-auto my-6"><table class="w-full text-sm border-collapse">${m}</table></div>`)
    // Wrap consecutive <li> in ul
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (m) => `<ul class="list-disc list-inside space-y-1.5 my-4 text-slate-700">${m}</ul>`)
    // Paragraphs — lines that aren't already wrapped
    .replace(/^(?!<[a-z])(.+)$/gm, (line) =>
      line.trim() ? `<p class="text-slate-700 leading-relaxed">${line}</p>` : ""
    )
    .replace(/\n{3,}/g, "\n\n");
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prev = BLOG_POSTS[currentIndex + 1] ?? null;
  const next = BLOG_POSTS[currentIndex - 1] ?? null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B4F72] mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Alle Artikel
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} />
              {post.readingTime} Min. Lesezeit
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">{post.excerpt}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <article
          className="prose-custom space-y-2"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Navigation */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid sm:grid-cols-2 gap-4">
          {prev && (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow"
            >
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowLeft size={12} />
                Älterer Artikel
              </span>
              <span className="text-sm font-medium text-slate-800 group-hover:text-[#1B4F72] transition-colors line-clamp-2">
                {prev.title}
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow sm:text-right sm:items-end"
            >
              <span className="text-xs text-slate-400 flex items-center gap-1">
                Neuerer Artikel
                <ArrowRight size={12} />
              </span>
              <span className="text-sm font-medium text-slate-800 group-hover:text-[#1B4F72] transition-colors line-clamp-2">
                {next.title}
              </span>
            </Link>
          )}
        </div>

        {/* CTA box */}
        <div className="mt-10 bg-[#1B4F72] rounded-2xl p-8 text-white text-center">
          <h3 className="text-lg font-bold mb-2">
            Förderung direkt berechnen
          </h3>
          <p className="text-blue-200 text-sm mb-5">
            Nutzen Sie den FörderScan-Rechner für Ihre Projekte.
          </p>
          <Link
            href="/preise"
            className="inline-flex items-center gap-2 bg-white text-[#1B4F72] font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Kostenlos starten
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
