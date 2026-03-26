import type { Metadata } from "next";
import Link from "next/link";
import { Key, ArrowRight, CheckCircle, AlertCircle, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "API-Dokumentation – FörderScan",
  description:
    "REST API v1 für Energieberater und Entwickler. Förderprogramme, Matching-Engine und Förderrechner per API abrufbar.",
};

const BASE = "https://api.foerderscan.de/api/v1";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  desc: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; desc: string }[];
  example?: string;
  response?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/foerderungen",
    desc: "Alle aktiven Förderprogramme abrufen",
    auth: true,
    params: [
      { name: "foerdergeber", type: "string", required: false, desc: "KFW | BAFA | LAND | KOMMUNE | EU" },
      { name: "status", type: "string", required: false, desc: "AKTIV | AUSLAUFEND | BEENDET" },
      { name: "limit", type: "number", required: false, desc: "Max. 200, Standard: 50" },
      { name: "offset", type: "number", required: false, desc: "Pagination-Offset" },
    ],
    example: `curl -X GET "${BASE}/foerderungen?foerdergeber=KFW&limit=10" \\
  -H "X-API-Key: fs_live_..."`,
    response: `{
  "meta": { "total": 12, "limit": 10, "offset": 0, "count": 10 },
  "data": [
    {
      "id": "clx...",
      "name": "BEG EM Heizung",
      "programmNummer": "458",
      "foerdergeber": "KFW",
      "basisfördersatz": 0.3,
      "maxFoerdersatz": 0.7,
      "status": "AKTIV"
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/foerderungen/:id",
    desc: "Ein Förderprogramm mit allen Details abrufen",
    auth: true,
    example: `curl -X GET "${BASE}/foerderungen/clx123abc" \\
  -H "X-API-Key: fs_live_..."`,
    response: `{
  "id": "clx123abc",
  "name": "BEG EM Heizung",
  "boni": [
    { "bezeichnung": "Einkommensbonus", "bonusSatz": 0.3 },
    { "bezeichnung": "Effizienzbonus", "bonusSatz": 0.05 }
  ],
  "kumulierungsregeln": [...],
  "gebaeudetypen": ["EFH", "ZFH", "MFH"]
}`,
  },
  {
    method: "POST",
    path: "/matching",
    desc: "Passende Förderprogramme für ein Gebäude ermitteln",
    auth: true,
    params: [
      { name: "gebaeudetyp", type: "string", required: true, desc: "EFH | ZFH | MFH | NWG | DENKMAL" },
      { name: "massnahmenarten", type: "string[]", required: true, desc: "HEIZUNG | GEBAEUDEHUELLE | ANLAGENTECHNIK | ..." },
      { name: "hatISFP", type: "boolean", required: false, desc: "Individueller Sanierungsfahrplan vorhanden" },
      { name: "hatEEKlasse", type: "boolean", required: false, desc: "EE-Klasse angestrebt" },
    ],
    example: `curl -X POST "${BASE}/matching" \\
  -H "X-API-Key: fs_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"gebaeudetyp":"EFH","massnahmenarten":["HEIZUNG"],"hatISFP":false}'`,
    response: `{
  "eingabe": { "gebaeudetyp": "EFH", "massnahmenarten": ["HEIZUNG"] },
  "treffer": 3,
  "programme": [
    { "id": "...", "name": "BEG EM Heizung (KfW 458)", "maxFoerdersatz": 0.7 }
  ]
}`,
  },
  {
    method: "POST",
    path: "/rechner",
    desc: "Förderhöhe für eine konkrete Maßnahme berechnen",
    auth: true,
    params: [
      { name: "programmTyp", type: "string", required: true, desc: "BEG_EM_HEIZUNG | BEG_EM_GEBAEUDEHUELLE | BEG_WG | STEUER_35C" },
      { name: "investitionskosten", type: "number", required: true, desc: "In Euro (Brutto)" },
      { name: "gebaeudetyp", type: "string", required: true, desc: "EFH | ZFH | MFH | NWG" },
      { name: "wohneinheiten", type: "number", required: false, desc: "Anzahl Wohneinheiten (Standard: 1)" },
      { name: "hatISFP", type: "boolean", required: false, desc: "iSFP-Bonus anwenden" },
      { name: "haushaltseinkommen", type: "number", required: false, desc: "Für Einkommensbonus (KfW 458)" },
      { name: "istSelbstgenutzt", type: "boolean", required: false, desc: "Selbst genutztes Eigentum" },
      { name: "ehStufe", type: "string", required: false, desc: "Für BEG_WG: EH40 | EH55 | EH70 | EH85" },
    ],
    example: `curl -X POST "${BASE}/rechner" \\
  -H "X-API-Key: fs_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "programmTyp": "BEG_EM_HEIZUNG",
    "investitionskosten": 25000,
    "gebaeudetyp": "EFH",
    "haushaltseinkommen": 38000,
    "istSelbstgenutzt": true
  }'`,
    response: `{
  "programmTyp": "BEG_EM_HEIZUNG",
  "ergebnis": {
    "foerderfaehigeKosten": 25000,
    "foerdersatz": 0.60,
    "foerderbetrag": 15000,
    "aufschlaege": [
      { "name": "Basis", "satz": 0.30 },
      { "name": "Einkommensbonus", "satz": 0.30 }
    ],
    "hinweise": ["Einkommensbonus angewendet (HHE ≤ 40.000 €)"]
  }
}`,
  },
  {
    method: "GET",
    path: "/regionen/:plz",
    desc: "Förderprogramme für eine PLZ (bundesweit + regional) abrufen",
    auth: true,
    example: `curl -X GET "${BASE}/regionen/67487" \\
  -H "X-API-Key: fs_live_..."`,
    response: `{
  "plz": "67487",
  "bundesland": "Rheinland-Pfalz",
  "summary": { "bundesweit": 8, "regional": 2, "gesamt": 10 },
  "data": {
    "bundesweit": [...],
    "regional": [...]
  }
}`,
  },
  {
    method: "GET",
    path: "/aenderungen",
    desc: "Geänderte Förderprogramme seit einem Datum abrufen (für Sync)",
    auth: true,
    params: [
      { name: "since", type: "string", required: false, desc: "ISO-Datum, Standard: letzte 30 Tage" },
      { name: "limit", type: "number", required: false, desc: "Max. 200" },
    ],
    example: `curl -X GET "${BASE}/aenderungen?since=2025-01-01" \\
  -H "X-API-Key: fs_live_..."`,
    response: `{
  "since": "2025-01-01",
  "count": 3,
  "programme": [...]
}`,
  },
];

const METHOD_STYLE: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-blue-100 text-blue-700",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#1B4F72]">FörderScan</Link>
            <span>/</span>
            <span>API-Dokumentation</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">REST API v1</h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Integrieren Sie FörderScan-Daten direkt in Ihre Anwendung. Förderprogramme,
                Matching-Engine und Förderrechner per API.
              </p>
            </div>
            <Link
              href="/preise"
              className="flex items-center gap-2 text-sm font-semibold bg-[#1B4F72] text-white px-5 py-2.5 rounded-lg hover:bg-[#154360] transition-colors shrink-0"
            >
              <Key size={15} />
              API-Key beantragen
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Auth */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Key size={16} />
              Authentifizierung
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600">
              Alle API-Endpunkte erfordern einen API-Key im Header{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">X-API-Key</code>.
              API-Keys erhalten Sie ab dem{" "}
              <Link href="/preise" className="text-[#1B4F72] hover:underline font-medium">
                Professional-Tarif
              </Link>.
            </p>
            <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto">
{`# Alle Anfragen benötigen diesen Header:
X-API-Key: fs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base URL:
https://foerderscan.de/api/v1`}
            </pre>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: CheckCircle, color: "text-emerald-600", label: "HTTPS only", desc: "TLS 1.2+" },
                { icon: CheckCircle, color: "text-emerald-600", label: "Rate Limit", desc: "200 Req/Min" },
                { icon: AlertCircle, color: "text-amber-500", label: "API-Key geheim", desc: "Niemals im Frontend" },
              ].map(({ icon: Icon, color, label, desc }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm bg-slate-50 rounded-lg px-4 py-3">
                  <Icon size={15} className={color} />
                  <span>
                    <span className="font-medium text-slate-800">{label}</span>
                    <span className="text-slate-500"> — {desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5">Endpunkte</h2>
          <div className="space-y-4">
            {ENDPOINTS.map((ep) => (
              <details
                key={ep.path}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden group"
              >
                <summary className="px-6 py-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded font-mono shrink-0 ${METHOD_STYLE[ep.method]}`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-slate-800 font-semibold">/api/v1{ep.path}</code>
                  <span className="text-sm text-slate-500 hidden sm:block ml-2">{ep.desc}</span>
                  {ep.auth && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-slate-400 shrink-0">
                      <Key size={11} />
                      Auth
                    </span>
                  )}
                </summary>

                <div className="border-t border-slate-100 p-6 space-y-5">
                  <p className="text-sm text-slate-600">{ep.desc}</p>

                  {ep.params && ep.params.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Parameter
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500">Name</th>
                              <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500">Typ</th>
                              <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500">Pflicht</th>
                              <th className="text-left py-2 text-xs font-semibold text-slate-500">Beschreibung</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ep.params.map((p) => (
                              <tr key={p.name} className="border-b border-slate-50">
                                <td className="py-2 pr-4">
                                  <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                    {p.name}
                                  </code>
                                </td>
                                <td className="py-2 pr-4 text-xs text-slate-500 font-mono">{p.type}</td>
                                <td className="py-2 pr-4">
                                  {p.required ? (
                                    <span className="text-xs text-red-500 font-medium">Ja</span>
                                  ) : (
                                    <span className="text-xs text-slate-400">Nein</span>
                                  )}
                                </td>
                                <td className="py-2 text-xs text-slate-600">{p.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {ep.example && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Beispiel-Anfrage
                      </h4>
                      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto">
                        {ep.example}
                      </pre>
                    </div>
                  )}

                  {ep.response && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Antwort (200 OK)
                      </h4>
                      <pre className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-4 text-xs overflow-x-auto">
                        {ep.response}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Error codes */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Fehlercodes</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 pr-6 text-xs font-semibold text-slate-500">Code</th>
                  <th className="text-left py-2 pr-6 text-xs font-semibold text-slate-500">Bedeutung</th>
                  <th className="text-left py-2 text-xs font-semibold text-slate-500">Lösung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["401", "Nicht autorisiert", "X-API-Key Header fehlt oder ungültig"],
                  ["403", "Zugriff verweigert", "API-Key abgelaufen oder deaktiviert"],
                  ["404", "Nicht gefunden", "Ressource existiert nicht"],
                  ["422", "Validierungsfehler", "Pflichtfelder fehlen oder haben falschen Typ"],
                  ["429", "Rate Limit überschritten", "Max. 200 Anfragen/Minute — kurz warten"],
                  ["500", "Serverfehler", "Bitte support@foerderscan.de kontaktieren"],
                ].map(([code, meaning, solution]) => (
                  <tr key={code}>
                    <td className="py-2.5 pr-6">
                      <code className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">
                        {code}
                      </code>
                    </td>
                    <td className="py-2.5 pr-6 text-slate-700 text-sm">{meaning}</td>
                    <td className="py-2.5 text-slate-500 text-sm">{solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1B4F72] rounded-2xl p-8 text-white text-center">
          <Zap size={32} className="text-white/20 mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="text-xl font-bold mb-2">API-Zugang beantragen</h3>
          <p className="text-blue-200 text-sm mb-6 max-w-lg mx-auto">
            API-Keys sind ab dem Professional-Tarif verfügbar.
            Nach der Registrierung erstellen Sie Keys direkt im Dashboard unter Profil → API-Keys.
          </p>
          <Link
            href="/preise"
            className="inline-flex items-center gap-2 bg-white text-[#1B4F72] font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Professional starten
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
