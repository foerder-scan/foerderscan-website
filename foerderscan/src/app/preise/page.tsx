import Link from "next/link";
import { CheckCircle2, Minus, ArrowRight } from "lucide-react";
import PricingButton from "@/components/pricing/PricingButton";

const tiers = [
  {
    name: "Free",
    stripeTier: "FREE" as const,
    price: "0",
    period: "",
    desc: "Zum Kennenlernen der Plattform",
    cta: "Kostenlos starten",
    highlight: false,
    features: [
      { label: "Fördersuchen / Monat", value: "5" },
      { label: "Projekte", value: "1" },
      { label: "Förderhöhenrechner", value: "Basis" },
      { label: "Kumulierungsprüfung", value: false },
      { label: "PDF-Reports", value: false },
      { label: "API-Zugang", value: false },
      { label: "Förder-Alerts", value: false },
      { label: "Support", value: "FAQ" },
      { label: "Team-Mitglieder", value: "1" },
      { label: "White-Label", value: false },
    ],
  },
  {
    name: "Starter",
    stripeTier: "STARTER" as const,
    price: "29",
    period: "/ Monat",
    desc: "Für Einsteiger und Gelegenheitsnutzer",
    cta: "Starter wählen",
    highlight: false,
    features: [
      { label: "Fördersuchen / Monat", value: "50" },
      { label: "Projekte", value: "10" },
      { label: "Förderhöhenrechner", value: "Vollständig" },
      { label: "Kumulierungsprüfung", value: true },
      { label: "PDF-Reports", value: "5 / Monat" },
      { label: "API-Zugang", value: false },
      { label: "Förder-Alerts", value: "E-Mail" },
      { label: "Support", value: "E-Mail" },
      { label: "Team-Mitglieder", value: "1" },
      { label: "White-Label", value: false },
    ],
  },
  {
    name: "Professional",
    stripeTier: "PROFESSIONAL" as const,
    price: "79",
    period: "/ Monat",
    desc: "Für aktive Energieberater – der Haupttarif",
    cta: "Professional wählen",
    highlight: true,
    badge: "Beliebteste Wahl",
    features: [
      { label: "Fördersuchen / Monat", value: "Unbegrenzt" },
      { label: "Projekte", value: "Unbegrenzt" },
      { label: "Förderhöhenrechner", value: "Vollständig" },
      { label: "Kumulierungsprüfung", value: true },
      { label: "PDF-Reports", value: "Unbegrenzt" },
      { label: "API-Zugang", value: true },
      { label: "Förder-Alerts", value: "E-Mail + Push" },
      { label: "Support", value: "E-Mail + Chat" },
      { label: "Team-Mitglieder", value: "5" },
      { label: "White-Label", value: false },
    ],
  },
  {
    name: "Enterprise",
    stripeTier: "ENTERPRISE" as const,
    price: "Individuell",
    period: "",
    desc: "Für Planungsbüros & Wohnungsbaugesellschaften",
    cta: "Kontakt aufnehmen",
    highlight: false,
    features: [
      { label: "Fördersuchen / Monat", value: "Unbegrenzt" },
      { label: "Projekte", value: "Unbegrenzt" },
      { label: "Förderhöhenrechner", value: "Vollständig" },
      { label: "Kumulierungsprüfung", value: true },
      { label: "PDF-Reports", value: "Unbegrenzt" },
      { label: "API-Zugang", value: true },
      { label: "Förder-Alerts", value: "Priorisiert" },
      { label: "Support", value: "Persönlich" },
      { label: "Team-Mitglieder", value: "Unbegrenzt" },
      { label: "White-Label", value: true },
    ],
  },
];

const faqs = [
  {
    q: "Kann ich den Plan jederzeit wechseln?",
    a: "Ja, Upgrades werden sofort wirksam. Downgrades werden am Ende des Abrechnungszeitraums aktiv. Die Verwaltung erfolgt über das Stripe Customer Portal.",
  },
  {
    q: "Wie werden die Förderdaten aktuell gehalten?",
    a: "Unser KI-Agent überwacht täglich KfW, BAFA, alle 16 Landesförderbanken und kommunale Förderstellen. Kritische Änderungen durchlaufen zusätzlich eine redaktionelle Prüfung.",
  },
  {
    q: "Ist FörderScan DSGVO-konform?",
    a: "Ja, vollständig. Alle Daten werden auf deutschen Servern gespeichert. Es bestehen AVVs mit allen Sub-Prozessoren (Stripe, Cloudflare). Details in unserer Datenschutzerklärung.",
  },
  {
    q: "Welche Förderprogramme sind enthalten?",
    a: "Alle KfW-Programme (261, 358/359, 458, 308, 124, 270), alle BAFA-BEG-Programme, steuerliche Förderung (§ 35c/35a EStG), Landesförderungen und ausgewählte Kommunalprogramme.",
  },
  {
    q: "Gibt es eine API für die Integration in meine Software?",
    a: "Ja, ab dem Professional-Tier. Die RESTful API bietet Zugang zur Matching-Engine, dem Förderrechner und der Förderdatenbank. Dokumentation auf Anfrage.",
  },
];

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true)
    return <CheckCircle2 size={16} className="text-[#27AE60] mx-auto" strokeWidth={2.5} />;
  if (value === false)
    return <Minus size={16} className="text-slate-300 mx-auto" />;
  return <span className="text-sm text-slate-700 font-medium">{value}</span>;
}

export default function PreisePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-100">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-6 border border-[#AED6F1]">
            Transparente Preise
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Der richtige Plan für jeden Bedarf
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Starten Sie kostenlos und skalieren Sie mit Ihrem Wachstum.
            Alle Pläne inkl. Mehrwertsteuer. Monatlich kündbar.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? "border-[#1B4F72] shadow-[0_0_0_2px_#1B4F72] bg-white"
                    : "border-slate-200 bg-white hover:shadow-md transition-shadow"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B4F72] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {tier.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    {tier.price === "Individuell" ? (
                      <span className="text-2xl font-extrabold text-slate-900">
                        Individuell
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-extrabold text-slate-900">
                          {tier.price} €
                        </span>
                        <span className="text-sm text-slate-500">{tier.period}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{tier.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="text-slate-600">{f.label}</span>
                      <FeatureValue value={f.value} />
                    </li>
                  ))}
                </ul>

                <PricingButton
                  tier={tier.stripeTier}
                  label={tier.cta}
                  highlight={tier.highlight}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC] border-t border-slate-100">
        <div className="section-container max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm text-slate-500 mb-3">
              Weitere Fragen? Wir helfen gerne.
            </p>
            <Link
              href="/ueber-uns#kontakt"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4F72] hover:text-[#154360] transition-colors"
            >
              Kontakt aufnehmen <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
