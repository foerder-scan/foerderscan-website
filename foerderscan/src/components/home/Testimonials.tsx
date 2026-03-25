import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Markus Berger",
    role: "Energieeffizienz-Experte, München",
    quote:
      "Früher habe ich pro Projekt 2–3 Stunden mit der Förderrecherche verbracht. Mit FörderScan sind es noch 20 Minuten. Das Matching mit den BEG-Boni ist präzise und zuverlässig.",
    stars: 5,
    initials: "MB",
    color: "bg-[#1B4F72]",
  },
  {
    name: "Sandra Koch",
    role: "Energieberaterin, Hamburg",
    quote:
      "Der KI-Agent, der Programmänderungen automatisch erkennt, ist Gold wert. Ich werde immer sofort benachrichtigt – keine bösen Überraschungen mehr bei Antragsstellung.",
    stars: 5,
    initials: "SK",
    color: "bg-[#2E86C1]",
  },
  {
    name: "Thomas Wagner",
    role: "Eigentümer, Einfamilienhaus, Frankfurt",
    quote:
      "Ich hatte keine Ahnung, welche Förderungen mir zustehen. Der Schnellcheck hat in wenigen Klicks gezeigt, dass ich über 18.000 € Förderung für meine Heizung bekommen kann.",
    stars: 5,
    initials: "TW",
    color: "bg-[#27AE60]",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="section-container">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-4 border border-[#AED6F1]">
            Stimmen unserer Nutzer
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Was Profis und Eigentümer sagen
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Energieberater und Eigentümer aus ganz Deutschland vertrauen auf
            FörderScan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
