import { validateApiKey } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/v1/rechner
 * Förderhöhenberechnung laut BEG-Systematik (Stand 2025).
 *
 * Body:
 *   programmTyp      — "BEG_EM_HEIZUNG" | "BEG_EM_GEBAEUDEHUELLE" | "BEG_WG" | "STEUER_35C"
 *   investitionskosten — Brutto-Investitionskosten in €
 *   wohneinheiten    — Anzahl Wohneinheiten (default 1)
 *   hatISFP          — boolean
 *   hatWPB           — boolean
 *   hatSerSan        — boolean
 *   hatEEKlasse      — boolean
 *   hatNHKlasse      — boolean
 *   istSelbstgenutzt — boolean (für Einkommensbonus)
 *   haushaltseinkommen — zu versteuerndes Einkommen in €
 *   ehStufe          — "40" | "55" | "70" | "85" | "DENKMAL" (nur für BEG_WG)
 */
export async function POST(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    programmTyp,
    investitionskosten: rawInvest,
    wohneinheiten: rawWE = 1,
    hatISFP = false,
    hatWPB = false,
    hatSerSan = false,
    hatEEKlasse = false,
    hatNHKlasse = false,
    altHeizung = false,
    istSelbstgenutzt = true,
    haushaltseinkommen = 999999,
    ehStufe = "55",
  } = body as {
    programmTyp?: string;
    investitionskosten?: number;
    wohneinheiten?: number;
    hatISFP?: boolean;
    hatWPB?: boolean;
    hatSerSan?: boolean;
    hatEEKlasse?: boolean;
    hatNHKlasse?: boolean;
    altHeizung?: boolean;
    istSelbstgenutzt?: boolean;
    haushaltseinkommen?: number;
    ehStufe?: string;
  };

  if (!programmTyp || rawInvest === undefined) {
    return NextResponse.json({ error: "programmTyp und investitionskosten sind erforderlich" }, { status: 400 });
  }

  const investitionskosten = Number(rawInvest);
  const wohneinheiten = Number(rawWE) || 1;

  let result: {
    foerderfaehigeKosten: number;
    foerdersatz: number;
    foerderbetrag: number;
    aufschlaege: Record<string, number>;
    hinweise: string[];
  };

  switch (programmTyp) {
    case "BEG_EM_HEIZUNG": {
      // KfW 458: Basis 30%, Geschwindigkeit +20%, Einkommen +30%, Effizienz +5%
      // Max förderfähige Kosten: 30.000 € / 1. WE, 15.000 € 2–6. WE, 8.000 € ab 7. WE
      const maxKosten = computeMaxKostenHeizung(wohneinheiten);
      const foerderfaehigeKosten = Math.min(investitionskosten, maxKosten);

      let foerdersatz = 0.30;
      const aufschlaege: Record<string, number> = { basis: 0.30 };

      // Einkommensbonus: bis 40.000 € zu versteuerndes Einkommen + 30%
      if (istSelbstgenutzt && (haushaltseinkommen as number) <= 40000) {
        aufschlaege.einkommensbonus = 0.30;
        foerdersatz += 0.30;
      }

      // Geschwindigkeitsbonus (alte Ölheizung): +20%
      if (altHeizung) {
        aufschlaege.geschwindigkeitsbonus = 0.20;
        foerdersatz += 0.20;
      }

      // Effizienzbonus (EE/NH-Klasse): +5%
      if (hatEEKlasse || hatNHKlasse) {
        aufschlaege.effizienzbonus = 0.05;
        foerdersatz += 0.05;
      }

      // Max 70%
      foerdersatz = Math.min(foerdersatz, 0.70);
      const foerderbetrag = Math.round(foerderfaehigeKosten * foerdersatz);

      result = {
        foerderfaehigeKosten,
        foerdersatz,
        foerderbetrag,
        aufschlaege,
        hinweise: [
          "Kumulierung mit § 35c EStG für identische Maßnahme nicht möglich.",
          "Antrag muss vor Auftragserteilung gestellt werden.",
          hatEEKlasse && (haushaltseinkommen as number) <= 40000
            ? "Hinweis: EE-Klasse und Einkommensbonus kombinierbar (max 70%)."
            : "",
        ].filter(Boolean),
      };
      break;
    }

    case "BEG_EM_GEBAEUDEHUELLE": {
      // BAFA: 15% Basis + 5% iSFP. Max 30.000 €/WE/Jahr (mit iSFP: 60.000 €)
      const maxKosten = (hatISFP ? 60000 : 30000) * wohneinheiten;
      const foerderfaehigeKosten = Math.min(investitionskosten, maxKosten);

      let foerdersatz = 0.15;
      const aufschlaege: Record<string, number> = { basis: 0.15 };

      if (hatISFP) {
        aufschlaege.isfp = 0.05;
        foerdersatz += 0.05;
      }

      result = {
        foerderfaehigeKosten,
        foerdersatz,
        foerderbetrag: Math.round(foerderfaehigeKosten * foerdersatz),
        aufschlaege,
        hinweise: [
          "Förderung durch BAFA (BEG Einzelmaßnahmen).",
          hatISFP ? "iSFP-Bonus +5% und verdoppelter Kostendeckel angewendet." : "Mit iSFP-Bonus wären 20% Förderung möglich.",
        ],
      };
      break;
    }

    case "BEG_WG": {
      // KfW 261: Tilgungszuschuss 5% (Denkmal) bis 20% (EH40) + WPB +10% + SerSan +15% + EE/NH +5%
      // Max Kreditbetrag: 120.000 €/WE (150.000 € bei EE/NH-Klasse)
      const maxKredit = (hatEEKlasse || hatNHKlasse ? 150000 : 120000) * wohneinheiten;
      const foerderfaehigeKosten = Math.min(investitionskosten, maxKredit);

      const EH_TILGUNGSZUSCHUSS: Record<string, number> = {
        "40": 0.20,
        "55": 0.15,
        "70": 0.10,
        "85": 0.05,
        "DENKMAL": 0.05,
      };

      let foerdersatz = EH_TILGUNGSZUSCHUSS[ehStufe as string] ?? 0.10;
      const aufschlaege: Record<string, number> = { [`eh${ehStufe}`]: foerdersatz };

      if (hatWPB) { aufschlaege.wpb = 0.10; foerdersatz += 0.10; }
      if (hatSerSan) { aufschlaege.sersan = 0.15; foerdersatz += 0.15; }
      if (hatEEKlasse || hatNHKlasse) { aufschlaege.eeKlasse = 0.05; foerdersatz += 0.05; }

      foerdersatz = Math.min(foerdersatz, 0.45); // Max 45% Tilgungszuschuss bei WG

      result = {
        foerderfaehigeKosten,
        foerdersatz,
        foerderbetrag: Math.round(foerderfaehigeKosten * foerdersatz),
        aufschlaege,
        hinweise: [
          `Effizienzhaus-Stufe ${ehStufe} — Tilgungszuschuss: ${Math.round(foerdersatz * 100)}%.`,
          "Kreditbetrag über KfW 261 beantragen. Antrag vor Auftragserteilung.",
          (hatEEKlasse || hatNHKlasse) ? "Erhöhter Kreditbetrag (150.000 €/WE) durch EE-/NH-Klasse." : "",
        ].filter(Boolean),
      };
      break;
    }

    case "STEUER_35C": {
      // § 35c EStG: 20% über 3 Jahre, max Invest 200.000 €, selbstgenutztes Wohneigentum
      if (!istSelbstgenutzt) {
        return NextResponse.json({
          error: "§ 35c EStG gilt nur für selbstgenutztes Wohneigentum.",
        }, { status: 400 });
      }
      const maxInvest = 200000;
      const foerderfaehigeKosten = Math.min(investitionskosten, maxInvest);
      const foerderbetragGesamt = Math.round(foerderfaehigeKosten * 0.20);

      result = {
        foerderfaehigeKosten,
        foerdersatz: 0.20,
        foerderbetrag: foerderbetragGesamt,
        aufschlaege: {
          jahr1: Math.round(foerderfaehigeKosten * 0.07),
          jahr2: Math.round(foerderfaehigeKosten * 0.07),
          jahr3: Math.round(foerderfaehigeKosten * 0.06),
        },
        hinweise: [
          "20% Steuerbonus verteilt auf 3 Jahre (7% / 7% / 6%).",
          "Nicht kombinierbar mit BEG-Förderung für identische Maßnahme.",
          "Nur für selbstgenutztes Wohneigentum.",
        ],
      };
      break;
    }

    default:
      return NextResponse.json({
        error: `Unbekannter programmTyp: ${programmTyp}. Erlaubt: BEG_EM_HEIZUNG, BEG_EM_GEBAEUDEHUELLE, BEG_WG, STEUER_35C`,
      }, { status: 400 });
  }

  return NextResponse.json({
    programmTyp,
    eingabe: { investitionskosten, wohneinheiten, hatISFP, hatWPB, hatSerSan, hatEEKlasse, hatNHKlasse, altHeizung, ehStufe },
    ergebnis: result,
  });
}

function computeMaxKostenHeizung(wohneinheiten: number): number {
  // 30.000 € für 1. WE, 15.000 € für WE 2-6, 8.000 € ab WE 7
  let total = 0;
  for (let i = 1; i <= wohneinheiten; i++) {
    if (i === 1) total += 30000;
    else if (i <= 6) total += 15000;
    else total += 8000;
  }
  return total;
}
