import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum | FörderScan",
  description: "Impressum von FörderScan",
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#2E86C1] hover:underline mb-8 block">
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Impressum</h1>
        <p className="text-sm text-slate-400 mb-10">Angaben gemäß § 5 TMG</p>

        <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Betreiber</h2>
            <p>
              Tobias Feuerbach<br />
              Diedesfelderstr. 2b<br />
              67487 Maikammer<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:info@foerderscan.de" className="text-[#2E86C1] hover:underline">info@foerderscan.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h2>
            <p>
              Tobias Feuerbach<br />
              Diedesfelderstr. 2b<br />
              67487 Maikammer
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#2E86C1] hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Haftungsausschluss</h2>
            <h3 className="font-semibold text-slate-800 mb-2">Haftung für Inhalte</h3>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
            <h3 className="font-semibold text-slate-800 mb-2 mt-4">Haftung für Links</h3>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <h3 className="font-semibold text-slate-800 mb-2 mt-4">Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Hinweis zu Förderdaten</h2>
            <p>
              Die auf dieser Plattform bereitgestellten Informationen zu Förderprogrammen basieren auf offiziell verfügbaren Daten von KfW, BAFA und weiteren Behörden. Sie stellen keine Rechts- oder Steuerberatung dar. Maßgeblich sind stets die aktuellen Konditionen der jeweiligen Förderinstitution.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
