import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AGB | FörderScan",
  description: "Allgemeine Geschäftsbedingungen von FörderScan",
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#2E86C1] hover:underline mb-8 block">
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-sm text-slate-400 mb-10">Stand: März 2026</p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen FörderScan (nachfolgend „Anbieter") und den Nutzern der Plattform förderscan.de (nachfolgend „Nutzer"). Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 2 Leistungsbeschreibung</h2>
            <p>
              FörderScan bietet eine SaaS-Plattform zur Recherche, Verwaltung und Berechnung von staatlichen Energieförderprogrammen. Der Anbieter stellt die Plattform auf Basis der gewählten Abostufe (Free, Starter, Professional, Enterprise) zur Verfügung.
            </p>
            <p className="mt-2">
              Die Inhalte zu Förderprogrammen werden nach bestem Wissen gepflegt, stellen jedoch keine Rechts- oder Steuerberatung dar und ersetzen nicht die Beratung durch einen zugelassenen Fachmann.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 3 Vertragsschluss und Registrierung</h2>
            <p>
              Mit der Registrierung auf der Plattform gibt der Nutzer ein verbindliches Angebot zum Abschluss eines Nutzungsvertrags ab. Der Vertrag kommt durch die Bestätigung der Registrierung per E-Mail zustande. Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und diese aktuell zu halten.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 4 Abonnements und Preise</h2>
            <p>
              Die Plattform wird in verschiedenen Abostufen angeboten. Die aktuellen Preise und Leistungsumfänge sind auf der <Link href="/preise" className="text-[#2E86C1] hover:underline">Preisseite</Link> einsehbar. Kostenpflichtige Abonnements werden monatlich oder jährlich im Voraus in Rechnung gestellt.
            </p>
            <p className="mt-2">
              Alle Preise verstehen sich als Nettopreise zzgl. der gesetzlichen Mehrwertsteuer. Die Abrechnung erfolgt über den Zahlungsdienstleister Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 5 Kündigung</h2>
            <p>
              Kostenpflichtige Abonnements können jederzeit zum Ende des laufenden Abrechnungszeitraums gekündigt werden. Nach Kündigung wird das Konto auf die kostenlose Stufe (Free) zurückgesetzt. Eine Erstattung bereits bezahlter Zeiträume erfolgt nicht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 6 Nutzungsrechte und Pflichten</h2>
            <p>
              Der Nutzer erhält ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der Plattform. Es ist untersagt, die Plattform zu kopieren, zu reverse-engineeren oder die Daten automatisiert massenhaft abzurufen. Der Nutzer ist für alle unter seinem Account vorgenommenen Handlungen verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 7 Haftungsbeschränkung</h2>
            <p>
              Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Im Übrigen ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Die Haftung für mittelbare Schäden und entgangenen Gewinn ist ausgeschlossen, soweit gesetzlich zulässig.
            </p>
            <p className="mt-2">
              Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Förderdaten übernimmt der Anbieter keine Gewähr.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 8 Datenschutz</h2>
            <p>
              Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der <Link href="/datenschutz" className="text-[#2E86C1] hover:underline">Datenschutzerklärung</Link>, die Bestandteil dieser AGB ist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 9 Änderungen der AGB</h2>
            <p>
              Der Anbieter behält sich vor, diese AGB mit einer Ankündigungsfrist von 30 Tagen zu ändern. Änderungen werden dem Nutzer per E-Mail mitgeteilt. Widerspricht der Nutzer nicht innerhalb von 30 Tagen, gelten die neuen AGB als akzeptiert.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">§ 10 Anwendbares Recht und Gerichtsstand</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist der Sitz des Anbieters, sofern der Nutzer Kaufmann ist oder keinen allgemeinen Gerichtsstand in Deutschland hat.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
