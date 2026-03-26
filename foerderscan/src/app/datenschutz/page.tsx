import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | FörderScan",
  description: "Datenschutzerklärung von FörderScan gemäß DSGVO",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#2E86C1] hover:underline mb-8 block">
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-slate-400 mb-10">Stand: März 2026 · Gemäß DSGVO, BDSG und TTDSG</p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der DSGVO ist:<br /><br />
              Tobias Feuerbach<br />
              Diedesfelderstr. 2b<br />
              67487 Maikammer<br />
              E-Mail: <a href="mailto:datenschutz@foerderscan.de" className="text-[#2E86C1] hover:underline">datenschutz@foerderscan.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Erhobene Daten und Verarbeitungszwecke</h2>

            <h3 className="font-semibold text-slate-800 mb-2">2.1 Registrierung und Nutzerkonto</h3>
            <p>
              Bei der Registrierung erheben wir: E-Mail-Adresse, Name (optional), Passwort (verschlüsselt gespeichert). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Die Daten werden für die Dauer des Vertragsverhältnisses sowie den gesetzlichen Aufbewahrungsfristen gespeichert.
            </p>

            <h3 className="font-semibold text-slate-800 mb-2 mt-4">2.2 Projektdaten</h3>
            <p>
              Daten zu Sanierungsprojekten (Gebäude, Maßnahmen, Förderberechnungen), die Sie eingeben, werden ausschließlich zur Erbringung der vertraglich vereinbarten Leistungen verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </p>

            <h3 className="font-semibold text-slate-800 mb-2 mt-4">2.3 Zahlungsdaten</h3>
            <p>
              Zahlungen werden über Stripe Inc. abgewickelt. Wir erhalten keine vollständigen Zahlungsdaten. Stripe verarbeitet Ihre Daten gemäß der{" "}
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2E86C1] hover:underline">
                Stripe-Datenschutzrichtlinie
              </a>. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </p>

            <h3 className="font-semibold text-slate-800 mb-2 mt-4">2.4 Server-Logs</h3>
            <p>
              Beim Aufruf unserer Website werden automatisch technische Zugriffsdaten (IP-Adresse, Browser, Uhrzeit) protokolliert. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit). Speicherdauer: 7 Tage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Hosting und Infrastruktur</h2>
            <p>
              Die Plattform wird auf Servern von <strong>Vercel Inc.</strong> (USA) und der Datenbank <strong>Neon Inc.</strong> (EU-Frankfurt) betrieben. Mit beiden Anbietern bestehen Auftragsverarbeitungsverträge (AVV). Die Übertragung in die USA erfolgt auf Basis der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. E-Mail-Kommunikation</h2>
            <p>
              Transaktions-E-Mails (Registrierung, Passwort-Reset) werden über <strong>Resend Inc.</strong> versendet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Wir versenden keine Werbe-E-Mails ohne ausdrückliche Einwilligung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Cookies und Tracking</h2>
            <p>
              Wir setzen ausschließlich technisch notwendige Cookies ein (Session-Cookie für die Authentifizierung). Es werden keine Tracking- oder Werbe-Cookies verwendet. Eine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO ist daher nicht erforderlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Ihre Rechte (Art. 15–22 DSGVO)</h2>
            <p>Sie haben das Recht auf:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-3">
              Zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
              <a href="mailto:datenschutz@foerderscan.de" className="text-[#2E86C1] hover:underline">
                datenschutz@foerderscan.de
              </a>
            </p>
            <p className="mt-2">
              Sie haben außerdem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Datenlöschung</h2>
            <p>
              Sie können Ihr Konto jederzeit löschen. Dabei werden alle personenbezogenen Daten und Projektdaten unwiderruflich entfernt. Gesetzliche Aufbewahrungspflichten (z. B. Buchhaltungsunterlagen nach § 147 AO: 10 Jahre) bleiben davon unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, um sie an veränderte rechtliche oder technische Gegebenheiten anzupassen. Die aktuelle Version ist stets unter <Link href="/datenschutz" className="text-[#2E86C1] hover:underline">förderscan.de/datenschutz</Link> abrufbar.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
