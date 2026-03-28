// Internal calculator endpoint (session-based, for dashboard use)
// Shares the same computation logic as /api/v1/rechner but uses NextAuth session
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json();
  const { programmTyp, investitionskosten: rawInvest, wohneinheiten: rawWE = 1,
    hatISFP = false, hatWPB = false, hatSerSan = false, hatEEKlasse = false,
    altHeizung = false,
    istSelbstgenutzt = true, haushaltseinkommen = 999999, ehStufe = "55" } = body;

  if (!programmTyp || rawInvest === undefined) {
    return NextResponse.json({ error: "programmTyp und investitionskosten sind erforderlich" }, { status: 400 });
  }

  const invest = Number(rawInvest);
  const we = Number(rawWE) || 1;

  let result: Record<string, unknown>;

  switch (programmTyp) {
    case "BEG_EM_HEIZUNG": {
      const maxKosten = computeMaxKostenHeizung(we);
      const foerderfaehigeKosten = Math.min(invest, maxKosten);
      let foerdersatz = 0.30;
      const aufschlaege: Record<string, number> = { basis: 0.30 };
      if (istSelbstgenutzt && haushaltseinkommen <= 40000) { aufschlaege.einkommensbonus = 0.30; foerdersatz += 0.30; }
      if (altHeizung) { aufschlaege.geschwindigkeitsbonus = 0.20; foerdersatz += 0.20; }
      if (hatEEKlasse) { aufschlaege.effizienzbonus = 0.05; foerdersatz += 0.05; }
      foerdersatz = Math.min(foerdersatz, 0.70);
      result = { foerderfaehigeKosten, foerdersatz, foerderbetrag: Math.round(foerderfaehigeKosten * foerdersatz), aufschlaege,
        hinweise: ["Antrag vor Auftragserteilung stellen.", "Nicht kombinierbar mit § 35c EStG."] };
      break;
    }
    case "BEG_EM_GEBAEUDEHUELLE": {
      const maxKosten = (hatISFP ? 60000 : 30000) * we;
      const foerderfaehigeKosten = Math.min(invest, maxKosten);
      let foerdersatz = 0.15;
      const aufschlaege: Record<string, number> = { basis: 0.15 };
      if (hatISFP) { aufschlaege.isfp = 0.05; foerdersatz += 0.05; }
      result = { foerderfaehigeKosten, foerdersatz, foerderbetrag: Math.round(foerderfaehigeKosten * foerdersatz), aufschlaege,
        hinweise: [hatISFP ? "iSFP-Bonus: Kostendeckel verdoppelt." : "Mit iSFP: 20% + doppelter Deckel möglich."] };
      break;
    }
    case "BEG_WG": {
      const maxKredit = (hatEEKlasse ? 150000 : 120000) * we;
      const foerderfaehigeKosten = Math.min(invest, maxKredit);
      const satzMap: Record<string, number> = { "40": 0.20, "55": 0.15, "70": 0.10, "85": 0.05, "DENKMAL": 0.05 };
      let foerdersatz = satzMap[ehStufe] ?? 0.10;
      const aufschlaege: Record<string, number> = { [`eh${ehStufe}`]: foerdersatz };
      if (hatWPB) { aufschlaege.wpb = 0.10; foerdersatz += 0.10; }
      if (hatSerSan) { aufschlaege.sersan = 0.15; foerdersatz += 0.15; }
      if (hatEEKlasse) { aufschlaege.eeKlasse = 0.05; foerdersatz += 0.05; }
      foerdersatz = Math.min(foerdersatz, 0.45);
      result = { foerderfaehigeKosten, foerdersatz, foerderbetrag: Math.round(foerderfaehigeKosten * foerdersatz), aufschlaege,
        hinweise: [`EH ${ehStufe} — Tilgungszuschuss ${Math.round(foerdersatz * 100)}%.`, "Antrag vor Auftragserteilung (KfW 261)."] };
      break;
    }
    case "STEUER_35C": {
      const foerderfaehigeKosten = Math.min(invest, 200000);
      result = { foerderfaehigeKosten, foerdersatz: 0.20, foerderbetrag: Math.round(foerderfaehigeKosten * 0.20),
        aufschlaege: { jahr1: Math.round(foerderfaehigeKosten * 0.07), jahr2: Math.round(foerderfaehigeKosten * 0.07), jahr3: Math.round(foerderfaehigeKosten * 0.06) },
        hinweise: ["20% über 3 Jahre verteilt.", "Nicht kombinierbar mit BEG."] };
      break;
    }
    default:
      return NextResponse.json({ error: "Unbekannter programmTyp" }, { status: 400 });
  }

  return NextResponse.json({ programmTyp, ergebnis: result });
}

function computeMaxKostenHeizung(we: number): number {
  let total = 0;
  for (let i = 1; i <= we; i++) {
    if (i === 1) total += 30000;
    else if (i <= 6) total += 15000;
    else total += 8000;
  }
  return total;
}
