import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AGB | FörderScan",
  description: "Allgemeine Geschäftsbedingungen der FörderScan-Plattform – Version 1.0, Stand März 2026",
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-[#2E86C1] hover:underline mb-8 block">
          ← Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        <p className="text-sm text-slate-400 mb-8">Version 1.0 | Stand: 28. März 2026</p>

        {/* Anbieter-Info-Box */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 mb-10 text-sm text-slate-700 leading-relaxed space-y-1">
          <p><strong>Anbieter:</strong> FörderScan GmbH (in Gründung)</p>
          <p><strong>Sitz:</strong> Diedesfelderstr. 2b, 67487 Maikammer, Deutschland</p>
          <p><strong>Vertreten durch:</strong> Tobias Feuerbach</p>
          <p><strong>E-Mail:</strong> info@foerderscan.de &nbsp;|&nbsp; <strong>Datenschutz:</strong> datenschutz@foerderscan.de</p>
          <p><strong>USt-IdNr.:</strong> wird nach Registrierung eingetragen</p>
          <p><strong>Handelsregister:</strong> wird nach Eintragung ergänzt</p>
        </div>

        <div className="space-y-10 text-sm text-slate-700 leading-relaxed">

          {/* § 1 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 1 Geltungsbereich und Vertragsparteien</h2>
            <ol className="list-none space-y-2">
              <li>(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") regeln die Nutzung der SaaS-Plattform FörderScan (nachfolgend „Plattform" oder „Dienst"), die von der FörderScan GmbH (i.Gr.) (nachfolgend „Anbieter") betrieben wird.</li>
              <li>(2) Die AGB gelten gegenüber:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>gewerblichen Nutzern, insbesondere Energieeffizienz-Experten (EEE), Energieberatern und Unternehmen, die den Dienst im Rahmen ihrer beruflichen oder unternehmerischen Tätigkeit nutzen (nachfolgend „B2B-Kunden");</li>
                  <li>Verbrauchern im Sinne des § 13 BGB (privaten Endkunden), die den Dienst für private Zwecke nutzen (nachfolgend „B2C-Kunden").</li>
                </ul>
                <p className="mt-1 italic">(gemeinsam „Nutzer" oder „Kunde" genannt)</p>
              </li>
              <li>(3) Entgegenstehende oder abweichende Allgemeine Geschäftsbedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</li>
              <li>(4) Diese AGB gelten auch für alle zukünftigen Geschäftsbeziehungen zwischen dem Anbieter und dem Kunden, soweit es sich um Rechtsgeschäfte verwandter Art handelt.</li>
            </ol>
          </section>

          {/* § 2 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 2 Leistungsbeschreibung</h2>
            <h3 className="font-semibold text-slate-800 mb-2">2.1 Gegenstand des Dienstes</h3>
            <p className="mb-2">FörderScan ist eine webbasierte SaaS-Plattform, die Energieberater und Endkunden bei der Recherche, Identifikation und Kalkulation von Förderprogrammen für energetische Maßnahmen im deutschen Gebäudesektor unterstützt. Der Dienst umfasst insbesondere:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Förderdatenbank:</strong> Strukturierte, laufend aktualisierte Datenbank bundesweiter Förderprogramme (KfW, BAFA) sowie regionaler und kommunaler Förderprogramme.</li>
              <li><strong>Intelligente Matching-Engine:</strong> Algorithmische Zuordnung von Förderprogrammen anhand nutzerseitig eingegebener Projektparameter (Gebäudetyp, Maßnahme, Standort, EH-Stufe, Boni).</li>
              <li><strong>Förderrechner:</strong> Berechnung von Förderhöhen, Tilgungszuschüssen, Bonusstapelungen und Kumulierungsprüfungen gemäß den aktuellen BEG-Richtlinien.</li>
              <li><strong>Projektverwaltung (Mandantenverwaltung):</strong> Verwaltung von Kundenprojekten mit Statustracking, Fristenverwaltung und Dokumenten-Upload (ab Starter-Tarif).</li>
              <li><strong>Export-Funktionen:</strong> Erstellung von Kunden-Reports in den Formaten PDF und DOCX (ab Starter-Tarif).</li>
              <li><strong>API-Zugang:</strong> Programmschnittstellenzugang zur Integration in eigene Softwaresysteme (ab Professional-Tarif).</li>
              <li><strong>KI-gestützte Aktualisierung:</strong> Automatisierte Überwachung der Förderlandschaft mit Human-in-the-Loop-Freigabeprozess.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">2.2 Verfügbarkeit</h3>
            <p className="mb-2">(1) Der Anbieter strebt eine Plattformverfügbarkeit von 99,0 % pro Kalendermonat an (exklusive geplanter Wartungsfenster). Eine rechtsverbindliche Verfügbarkeitsgarantie wird für Free- und Starter-Tarife nicht übernommen; für Professional- und Enterprise-Tarife kann eine SLA gesondert vereinbart werden.</p>
            <p>(2) Der Anbieter behält sich das Recht vor, den Dienst für Wartungsarbeiten, Updates oder dringende Sicherheitsmaßnahmen vorübergehend einzuschränken. Geplante Wartungsfenster werden, soweit möglich, mindestens 24 Stunden im Voraus angekündigt.</p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">2.3 Korrektheit der Förderdaten</h3>
            <p className="mb-2">(1) Die auf der Plattform bereitgestellten Förderdaten werden mit größtmöglicher Sorgfalt gepflegt und regelmäßig aktualisiert. Sie stellen jedoch keine rechtsverbindliche Rechts- oder Steuerberatung dar. Maßgeblich sind stets die offiziellen Programmunterlagen der jeweiligen Fördergeber (KfW, BAFA, BMF).</p>
            <p>(2) Der Anbieter übernimmt keine Haftung für die Vollständigkeit, Aktualität oder Richtigkeit der dargestellten Förderdaten. Die Nutzung der Plattformfunktionen entbindet den Nutzer nicht von der eigenverantwortlichen Prüfung der Antragsvoraussetzungen.</p>
          </section>

          {/* § 3 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 3 Registrierung, Nutzerkonto und Zugangsdaten</h2>
            <ol className="list-none space-y-2">
              <li>(1) Die Nutzung des Dienstes setzt die Registrierung eines Nutzerkontos voraus. Bei der Registrierung sind wahrheitsgemäße und vollständige Angaben zu machen. B2B-Kunden sind verpflichtet, ihre Unternehmensbezeichnung, USt-IdNr. (soweit vorhanden) sowie ihre Berater-Lizenznummer (EB-XXXXXX) anzugeben.</li>
              <li>(2) Der Kunde ist verpflichtet, seine Zugangsdaten (E-Mail-Adresse und Passwort) vertraulich zu behandeln und vor dem Zugriff Dritter zu schützen. Jede Nutzung des Dienstes unter den Zugangsdaten des Kunden gilt als von ihm autorisiert.</li>
              <li>(3) Der Kunde hat den Anbieter unverzüglich zu informieren, wenn er Anhaltspunkte dafür hat, dass Dritte seine Zugangsdaten unbefugt nutzen oder genutzt haben.</li>
              <li>(4) Pro natürlicher Person oder Unternehmen darf nur ein Nutzerkonto geführt werden. Das Nutzerkonto ist nicht auf Dritte übertragbar.</li>
              <li>(5) Mindestalter für eine Registrierung ist das vollendete 18. Lebensjahr.</li>
            </ol>
          </section>

          {/* § 4 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 4 Abonnement-Tarife und Leistungsumfang</h2>
            <p className="mb-3">Die Plattform wird in folgenden Tarifstufen angeboten. Alle Preise verstehen sich zuzüglich der gesetzlichen Umsatzsteuer:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EBF5FB]">
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold text-slate-800">Merkmal</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-bold text-slate-800">Free</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-bold text-slate-800">Starter</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-bold text-slate-800">Professional</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-bold text-slate-800">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Preis/Monat (netto)", "0 €", "29 €", "79 €", "Individuell"],
                    ["Fördersuchen/Monat", "5", "50", "Unbegrenzt", "Unbegrenzt"],
                    ["Projekte / Mandate", "1", "10", "Unbegrenzt", "Unbegrenzt"],
                    ["Förderrechner inkl. Boni", "Basis", "Vollständig", "Vollständig", "Vollständig"],
                    ["Export (PDF/DOCX)", "–", "✓", "✓", "✓"],
                    ["API-Zugang", "–", "–", "✓", "✓"],
                    ["SLA / Support", "Community", "E-Mail", "Priority", "Dediziert"],
                  ].map(([label, ...vals], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                      <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700">{label}</td>
                      {vals.map((v, j) => (
                        <td key={j} className="border border-slate-200 px-3 py-2 text-center text-slate-600">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">Der konkrete Leistungsumfang jedes Tarifs wird auf der <Link href="/preise" className="text-[#2E86C1] hover:underline">Preisseite</Link> der Plattform aktuell beschrieben und ist Bestandteil des Vertrages.</p>
          </section>

          {/* § 5 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 5 Vertragsschluss und Laufzeit</h2>
            <ol className="list-none space-y-2">
              <li>(1) Ein Vertrag kommt durch die Registrierung und die Auswahl eines Tarifs (Angebot) sowie die Freischaltung des Zugangs durch den Anbieter (Annahme) zustande. Der Vertragstext wird gespeichert und ist im Nutzerportal abrufbar.</li>
              <li>(2) Der Free-Tarif wird auf unbestimmte Zeit bereitgestellt und kann vom Anbieter mit einer Frist von 30 Tagen eingestellt werden.</li>
              <li>(3) Kostenpflichtige Tarife werden als monatliche Abonnements mit automatischer Verlängerung abgeschlossen. Die Mindestlaufzeit beträgt einen (1) Kalendermonat.</li>
              <li>(4) Der Vertrag kann von beiden Parteien mit einer Frist von 14 Tagen zum Ende des jeweiligen Abrechnungszeitraums gekündigt werden. Die Kündigung kann über das Nutzerportal (Stripe Customer Portal) oder per E-Mail an kuendigung@foerderscan.de erfolgen.</li>
              <li>(5) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund für den Anbieter liegt insbesondere vor, wenn der Kunde gegen §§ 8 oder 9 dieser AGB verstößt oder Zahlungsrückstände von mehr als 30 Tagen bestehen.</li>
            </ol>
          </section>

          {/* § 6 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 6 Preise, Zahlungsbedingungen und Abrechnung</h2>
            <h3 className="font-semibold text-slate-800 mb-2">6.1 Vergütung</h3>
            <p className="mb-2">(1) Die jeweils gültigen Preise sind auf www.foerderscan.de/preise veröffentlicht. Alle Preise verstehen sich als Nettopreise zuzüglich der zum Zeitpunkt der Rechnungsstellung geltenden gesetzlichen Umsatzsteuer.</p>
            <p>(2) Der Anbieter ist berechtigt, die Preise mit einer Ankündigungsfrist von mindestens 30 Tagen vor Wirksamwerden zu ändern. Widerspricht der Kunde nicht innerhalb von 14 Tagen nach Zugang der Änderungsmitteilung, gilt die Zustimmung als erteilt.</p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.2 Zahlungsabwicklung</h3>
            <ol className="list-none space-y-2">
              <li>(1) Die Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe Payments Europe Ltd. (Irland, EU). Durch die Buchung eines kostenpflichtigen Tarifs stimmt der Kunde den Nutzungsbedingungen von Stripe zu.</li>
              <li>(2) Akzeptierte Zahlungsmittel: Kreditkarte (VISA, Mastercard, American Express), SEPA-Lastschrift und sonstige von Stripe freigeschaltete Verfahren.</li>
              <li>(3) Die Abrechnung erfolgt monatlich im Voraus. Das Abonnementsentgelt wird am ersten Tag jedes Abrechnungszeitraums fällig und automatisch eingezogen.</li>
              <li>(4) Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zum Dienst zu sperren, bis der ausstehende Betrag vollständig beglichen ist. Gesetzliche Verzugszinsen bleiben vorbehalten.</li>
              <li>(5) Rechnungen werden per E-Mail und über das Stripe Customer Portal bereitgestellt.</li>
            </ol>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.3 Widerrufsrecht (B2C-Kunden)</h3>
            <p>Verbrauchern steht grundsätzlich ein Widerrufsrecht von 14 Tagen ab Vertragsschluss zu. Das Widerrufsrecht erlischt bei digitalen Inhalten mit Beginn der Vertragsausführung, sobald der Verbraucher ausdrücklich zugestimmt hat und bestätigt hat, dass er vom Erlöschen des Widerrufsrechts Kenntnis genommen hat.</p>
          </section>

          {/* § 7 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 7 Nutzungsrechte</h2>
            <ol className="list-none space-y-2">
              <li>(1) Der Anbieter räumt dem Kunden für die Dauer des Vertrages ein einfaches, nicht übertragbares, nicht unterlizenzierbares Recht ein, den Dienst im Rahmen der gewählten Tarifstufe zu nutzen.</li>
              <li>(2) Alle Rechte an der Plattform, einschließlich Software, Datenbank, Algorithmen, Benutzeroberfläche und Inhalten, verbleiben ausschließlich beim Anbieter oder seinen Lizenzgebern.</li>
              <li>(3) Dem Kunden ist insbesondere untersagt:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Dekompilieren, Disassemblieren oder sonstiges Reverse Engineering der Plattform;</li>
                  <li>Zugänglichmachung der Plattform für Dritte ohne ausdrückliche schriftliche Zustimmung des Anbieters (Weiterverkauf, White-Labeling);</li>
                  <li>Nutzung der Plattform zur Erstellung konkurrierender Produkte oder Dienstleistungen.</li>
                </ul>
              </li>
              <li>(4) Sofern der Kunde im Rahmen des API-Zugangs eigene Anwendungen entwickelt, ist er für die Einhaltung der API-Nutzungsbedingungen und die Sicherheit seiner Implementierung verantwortlich.</li>
            </ol>
          </section>

          {/* § 8 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 8 Pflichten und Obliegenheiten des Kunden</h2>
            <ol className="list-none space-y-2">
              <li>(1) Der Kunde ist verpflichtet, die Plattform ausschließlich für rechtmäßige Zwecke zu nutzen.</li>
              <li>(2) Insbesondere ist dem Kunden untersagt:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Automatisierte Massenanfragen (Scraping, Crawling, Bots) ohne vorherige schriftliche Genehmigung durchzuführen;</li>
                  <li>Sicherheitsmechanismen der Plattform zu umgehen oder zu testen ohne schriftliche Erlaubnis;</li>
                  <li>Die Infrastruktur des Anbieters mit übermäßigem Datenverkehr zu belasten (DoS/DDoS);</li>
                  <li>Unrichtige oder fremde Angaben bei der Registrierung oder im Nutzerprofil zu machen;</li>
                  <li>Inhalte hochzuladen, die Rechte Dritter (insbesondere Urheberrechte, Datenschutzrechte) verletzen.</li>
                </ul>
              </li>
              <li>(3) B2B-Kunden, die auf der Plattform Kundendaten (Mandantendaten) verarbeiten, sind selbst für die Einhaltung des anwendbaren Datenschutzrechts gegenüber ihren Mandanten verantwortlich. Mit Abschluss des kostenpflichtigen Abonnements wird ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO bereitgestellt und gilt als akzeptiert.</li>
              <li>(4) Verstößt der Kunde gegen die Pflichten aus diesem Paragraphen, ist der Anbieter berechtigt, den Zugang vorübergehend zu sperren oder den Vertrag fristlos zu kündigen.</li>
            </ol>
          </section>

          {/* § 9 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 9 Datenschutz und Datensicherheit</h2>
            <ol className="list-none space-y-2">
              <li>(1) Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt in Übereinstimmung mit der DSGVO, dem BDSG sowie der <Link href="/datenschutz" className="text-[#2E86C1] hover:underline">Datenschutzerklärung</Link> des Anbieters, die Bestandteil dieser AGB ist.</li>
              <li>(2) Zahlungsdaten werden an Stripe Payments Europe Ltd. (Irland, EU) übertragen. Soweit Daten in Drittländer außerhalb der EU/EWR übertragen werden, erfolgt dies nur auf Grundlage geeigneter Garantien (Standardvertragsklauseln oder Angemessenheitsbeschluss).</li>
              <li>(3) Der Anbieter setzt technische und organisatorische Maßnahmen (TOM) gemäß Art. 32 DSGVO ein:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>SSL/TLS-Verschlüsselung der gesamten Datenübertragung (HTTPS, Cloudflare Full Strict Mode);</li>
                  <li>Verschlüsselte Datenbankverbindungen;</li>
                  <li>Zugangsbeschränkungen nach dem Least-Privilege-Prinzip;</li>
                  <li>Regelmäßige Datensicherungen mit definierten Wiederherstellungszielen;</li>
                  <li>Web Application Firewall (WAF) und DDoS-Schutz über Cloudflare.</li>
                </ul>
              </li>
              <li>(4) Datenpannen (Art. 33 DSGVO) werden unverzüglich, spätestens innerhalb von 72 Stunden nach Bekanntwerden, der zuständigen Aufsichtsbehörde gemeldet.</li>
            </ol>
          </section>

          {/* § 10 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 10 Haftung und Haftungsbeschränkung</h2>
            <h3 className="font-semibold text-slate-800 mb-2">10.1 Haftung des Anbieters</h3>
            <ol className="list-none space-y-2">
              <li>(1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung des Anbieters oder seiner Erfüllungsgehilfen beruhen.</li>
              <li>(2) Bei einfach fahrlässiger Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht) haftet der Anbieter der Höhe nach begrenzt auf den bei Vertragsschluss vorhersehbaren und vertragstypischen Schaden. Bei kostenpflichtigen Tarifen ist die Haftung zusätzlich auf das in den letzten 12 Monaten vom Kunden gezahlte Netto-Entgelt begrenzt.</li>
              <li>(3) Eine weitergehende Haftung, insbesondere für entgangenen Gewinn, mittelbare Schäden, Folgeschäden oder Datenverlust, ist – soweit gesetzlich zulässig – ausgeschlossen.</li>
              <li>(4) Der Anbieter haftet nicht für:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Inhaltliche Fehler oder veraltete Angaben in der Förderdatenbank, sofern die Aktualisierungspflicht nicht grob fahrlässig verletzt wurde;</li>
                  <li>Förderbescheide oder -ablehnungen behördlicher Stellen, die auf Basis der Plattformnutzung gestellt wurden;</li>
                  <li>Ausfälle, die auf Störungen bei Drittanbietern (Cloudflare, Stripe, Hosting) beruhen und vom Anbieter nicht zu vertreten sind.</li>
                </ul>
              </li>
            </ol>
            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.2 Haftung des Kunden</h3>
            <p>Der Kunde haftet dem Anbieter gegenüber für alle Schäden, die aus einer vertrags- oder rechtswidrigen Nutzung der Plattform durch ihn oder durch Personen entstehen, denen er Zugang gewährt hat.</p>
          </section>

          {/* § 11 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 11 Geistiges Eigentum und Inhalte des Kunden</h2>
            <ol className="list-none space-y-2">
              <li>(1) Inhalte, die der Kunde auf die Plattform hochlädt (z. B. Projektdaten, Dokumente), verbleiben im Eigentum des Kunden. Der Kunde räumt dem Anbieter ein einfaches Recht ein, diese Daten zur Erbringung des Dienstes zu verarbeiten, zu speichern und zu sichern.</li>
              <li>(2) Nach Beendigung des Vertrages stellt der Anbieter dem Kunden auf Anfrage einen Export seiner Projektdaten in einem gängigen Format (JSON oder CSV) zur Verfügung. Der Anbieter ist berechtigt, die Kundendaten 30 Tage nach Vertragsbeendigung zu löschen.</li>
              <li>(3) Der Anbieter ist berechtigt, anonymisierte und aggregierte Nutzungsdaten (ohne Personenbezug) für die Weiterentwicklung des Dienstes und statistische Auswertungen zu verwenden.</li>
            </ol>
          </section>

          {/* § 12 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 12 Änderungen der Plattform und der AGB</h2>
            <ol className="list-none space-y-2">
              <li>(1) Der Anbieter ist berechtigt, den Funktionsumfang der Plattform jederzeit anzupassen, zu erweitern oder zu reduzieren, soweit dies für den Kunden zumutbar ist. Wesentliche Einschränkungen des vertraglich vereinbarten Leistungsumfangs werden mindestens 30 Tage im Voraus mitgeteilt.</li>
              <li>(2) Änderungen dieser AGB werden dem Kunden per E-Mail oder über eine Benachrichtigung in der Plattform bekanntgegeben. Sie gelten als genehmigt, wenn der Kunde nicht innerhalb von 14 Tagen nach Zugang der Änderungsmitteilung widerspricht. Auf dieses Widerspruchsrecht wird der Anbieter in der Änderungsmitteilung gesondert hinweisen.</li>
              <li>(3) Im Falle eines berechtigten Widerspruchs gegen AGB-Änderungen sind beide Parteien berechtigt, den Vertrag zum Ende des laufenden Abrechnungszeitraums zu kündigen.</li>
            </ol>
          </section>

          {/* § 13 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 13 Sperrung und Beendigung des Dienstes</h2>
            <ol className="list-none space-y-2">
              <li>(1) Der Anbieter ist berechtigt, den Zugang des Kunden vorübergehend zu sperren, wenn:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>der Kunde mit der Zahlung fälliger Entgelte mehr als 7 Tage im Rückstand ist;</li>
                  <li>konkrete Anhaltspunkte für eine missbräuchliche Nutzung oder Sicherheitsgefährdung vorliegen;</li>
                  <li>behördliche Anordnungen dies erfordern.</li>
                </ul>
              </li>
              <li>(2) Der Anbieter informiert den Kunden über die Sperrung und deren Grund unverzüglich per E-Mail.</li>
              <li>(3) Nach Beendigung des Vertrages werden die Zugangsdaten deaktiviert. Die hochgeladenen Daten werden nach einer Übergangsfrist von 30 Tagen gelöscht.</li>
            </ol>
          </section>

          {/* § 14 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 14 Geheimhaltung</h2>
            <ol className="list-none space-y-2">
              <li>(1) Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei nicht an Dritte weiterzugeben und nur für Zwecke der Vertragserfüllung zu verwenden. Diese Pflicht gilt auch nach Beendigung des Vertragsverhältnisses für einen Zeitraum von zwei (2) Jahren.</li>
              <li>(2) Als vertraulich gelten insbesondere: Geschäftsgeheimnisse, technische Spezifikationen, Preisgestaltungen, Kundenlisten und Details der Plattformarchitektur.</li>
            </ol>
          </section>

          {/* § 15 */}
          <section>
            <h2 className="text-base font-bold text-[#1B4F72] mb-3">§ 15 Schlussbestimmungen</h2>
            <h3 className="font-semibold text-slate-800 mb-2">15.1 Anwendbares Recht und Gerichtsstand</h3>
            <ol className="list-none space-y-2">
              <li>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).</li>
              <li>(2) Für Streitigkeiten mit B2B-Kunden ist – soweit gesetzlich zulässig – der Sitz des Anbieters ausschließlicher Gerichtsstand.</li>
              <li>(3) Für Streitigkeiten mit Verbrauchern gilt der allgemeine Gerichtsstand des Wohnsitzes des Verbrauchers. Der Anbieter ist nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Hinweis gemäß Art. 14 Abs. 1 ODR-VO: Die EU-Kommission stellt eine Online-Streitbeilegungsplattform bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#2E86C1] hover:underline">https://ec.europa.eu/consumers/odr/</a></li>
            </ol>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">15.2 Salvatorische Klausel</h3>
            <p>Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht. Anstelle der unwirksamen Bestimmung gilt eine wirksame Regelung als vereinbart, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">15.3 Schriftformklausel</h3>
            <p>Nebenabreden zu diesen AGB bedürfen der Textform (E-Mail). Dies gilt auch für die Aufhebung dieser Schriftformklausel.</p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">15.4 Aufrechnung und Zurückbehaltungsrecht</h3>
            <p>Der Kunde ist zur Aufrechnung nur mit unbestrittenen oder rechtskräftig festgestellten Gegenforderungen berechtigt. Ein Zurückbehaltungsrecht steht dem Kunden nur zu, wenn es auf demselben Vertragsverhältnis beruht.</p>
          </section>

          {/* Anlagen */}
          <section className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-slate-800 mb-3">Anlagen (bei Vertragsschluss gesondert zur Verfügung gestellt)</h2>
            <ul className="space-y-1 text-slate-700">
              <li><strong>Anlage 1:</strong> <Link href="/datenschutz" className="text-[#2E86C1] hover:underline">Datenschutzerklärung (DSGVO)</Link></li>
              <li><strong>Anlage 2:</strong> Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO (für B2B-Kunden)</li>
              <li><strong>Anlage 3:</strong> Widerrufsbelehrung und Widerrufsformular (für B2C-Kunden)</li>
              <li><strong>Anlage 4:</strong> Service Level Agreement (SLA) – auf Anfrage für Professional/Enterprise</li>
              <li><strong>Anlage 5:</strong> API-Nutzungsbedingungen (für Professional/Enterprise-Kunden)</li>
            </ul>
          </section>

          <p className="text-xs text-slate-400 text-center pt-4 border-t border-slate-100">
            Stand: 28. März 2026 | Version 1.0 | FörderScan GmbH (i.Gr.)
          </p>
        </div>
      </div>
    </div>
  );
}
