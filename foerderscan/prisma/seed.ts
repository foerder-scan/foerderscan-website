import { PrismaClient, Foerdergeber, Foerdersegment, Foerderart, ProgrammStatus, Gebaeudetyp, Massnahmenart, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starte Seed-Prozess...");

  // ─── Demo-User ────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin1234!", 12);
  const beraterHash = await bcrypt.hash("Berater1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@foerderscan.de" },
    update: {},
    create: {
      email: "admin@foerderscan.de",
      name: "FörderScan Admin",
      passwordHash: adminHash,
      role: UserRole.SUPER_ADMIN,
      subscription: { create: { tier: "ENTERPRISE", status: "active" } },
    },
  });

  const berater = await prisma.user.upsert({
    where: { email: "berater@example.de" },
    update: {},
    create: {
      email: "berater@example.de",
      name: "Max Mustermann",
      passwordHash: beraterHash,
      role: UserRole.BERATER_PRO,
      beraternummer: "EB-000042",
      company: "Energieberatung Mustermann GmbH",
      subscription: { create: { tier: "PROFESSIONAL", status: "active" } },
    },
  });

  console.log(`✅ Users: ${admin.email}, ${berater.email}`);

  // ─── Hilfsfunktion ────────────────────────────────────────────────────────
  async function createProgramm(data: {
    programmNummer?: string;
    name: string;
    kurzname?: string;
    foerdergeber: Foerdergeber;
    foerdersegment: Foerdersegment;
    foerderart: Foerderart;
    basisFoerdersatz: number;
    maxFoerdersatz: number;
    maxFoerderfaehigeKosten?: number;
    maxFoerderfaehigeKostenEE?: number;
    kreditbetragMax?: number;
    bewilligungszeitraum?: number;
    beschreibung?: string;
    hinweise?: string;
    quellUrl?: string;
    gebaeudetypen: Gebaeudetyp[];
    massnahmen: Massnahmenart[];
    boni?: { bezeichnung: string; kuerzel: string; bonusSatz: number; voraussetzung?: string }[];
    kumulierung?: { ausschlussTyp: string; beschreibung: string; maxFoerderquote?: number }[];
  }) {
    return prisma.foerderProgramm.create({
      data: {
        programmNummer: data.programmNummer,
        name: data.name,
        kurzname: data.kurzname,
        foerdergeber: data.foerdergeber,
        foerdersegment: data.foerdersegment,
        foerderart: data.foerderart,
        basisfördersatz: data.basisFoerdersatz,
        maxFoerdersatz: data.maxFoerdersatz,
        maxFoerderfaehigeKosten: data.maxFoerderfaehigeKosten,
        maxFoerderfaehigeKostenEE: data.maxFoerderfaehigeKostenEE,
        kreditbetragMax: data.kreditbetragMax,
        bewilligungszeitraum: data.bewilligungszeitraum,
        beschreibung: data.beschreibung,
        hinweise: data.hinweise,
        quellUrl: data.quellUrl,
        status: ProgrammStatus.AKTIV,
        bundesweit: true,
        letzteModifikation: new Date(),
        gebaeudetypen: {
          create: data.gebaeudetypen.map((g) => ({ gebaeudetyp: g })),
        },
        massnahmenarten: {
          create: data.massnahmen.map((m) => ({ massnahmenart: m })),
        },
        boni: data.boni
          ? { create: data.boni.map((b) => ({ ...b, bonusSatz: b.bonusSatz })) }
          : undefined,
        kumulierungsregeln: data.kumulierung
          ? {
              create: data.kumulierung.map((k) => ({
                ausschlussTyp: k.ausschlussTyp,
                beschreibung: k.beschreibung,
                maxFoerderquote: k.maxFoerderquote,
              })),
            }
          : undefined,
      },
    });
  }

  // Existing programmes löschen (idempotenter Seed)
  await prisma.foerderProgramm.deleteMany();
  console.log("🗑️  Alte Programme gelöscht");

  // ─── KfW 261 – BEG WG Kredit ─────────────────────────────────────────────
  await createProgramm({
    programmNummer: "261",
    name: "Bundesförderung für effiziente Gebäude – Wohngebäude Kredit",
    kurzname: "BEG WG Kredit",
    foerdergeber: Foerdergeber.KFW,
    foerdersegment: Foerdersegment.BEG_WG,
    foerderart: Foerderart.KREDIT,
    basisFoerdersatz: 0.05,
    maxFoerdersatz: 0.45,
    maxFoerderfaehigeKosten: 120000,
    maxFoerderfaehigeKostenEE: 150000,
    kreditbetragMax: 150000,
    bewilligungszeitraum: 36,
    beschreibung:
      "Kredit für die Komplettsanierung eines Wohngebäudes zum Effizienzhaus. Der Tilgungszuschuss richtet sich nach der erreichten Effizienzhaus-Stufe (5% für EH Denkmal bis 20% für EH 40).",
    hinweise:
      "Antragstellung vor Vorhabenbeginn. Liefer-/Leistungsvertrag mit auflösender oder aufschiebender Bedingung erforderlich. EEE muss eingebunden sein.",
    quellUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Energetisch-sanieren/Bundesf%C3%B6rderung-f%C3%BCr-effiziente-Geb%C3%A4ude-%E2%80%93-Wohngeb%C3%A4ude-Kredit-(261)/",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH, Gebaeudetyp.DENKMAL],
    massnahmen: [Massnahmenart.EH_KOMPLETTSANIERUNG],
    boni: [
      { bezeichnung: "WPB-Bonus (Worst Performing Building)", kuerzel: "wpb", bonusSatz: 0.10, voraussetzung: "Gebäude muss Worst Performing Building sein (Energie-Effizienzklasse F, G oder H)" },
      { bezeichnung: "Serielle Sanierung Bonus", kuerzel: "sersan", bonusSatz: 0.15, voraussetzung: "Serielle Sanierung mit vorgefertigten Fassaden- und/oder Dachelementen" },
      { bezeichnung: "EE/NH-Klasse Bonus", kuerzel: "ee_nh", bonusSatz: 0.05, voraussetzung: "Erneuerbare-Energien-Klasse oder Nachhaltigkeitsklasse (QNG-Siegel)" },
    ],
    kumulierung: [
      { ausschlussTyp: "paragraph_35c", beschreibung: "Nicht kombinierbar mit § 35c EStG für dieselbe Maßnahme", maxFoerderquote: 0.60 },
      { ausschlussTyp: "max_60_prozent", beschreibung: "Gesamtförderquote aus öffentlichen Mitteln maximal 60%", maxFoerderquote: 0.60 },
    ],
  });

  // ─── KfW 458 – BEG EM Heizungsförderung ──────────────────────────────────
  await createProgramm({
    programmNummer: "458",
    name: "Bundesförderung für effiziente Gebäude – Heizungsförderung für Privatpersonen",
    kurzname: "BEG EM Heizung",
    foerdergeber: Foerdergeber.KFW,
    foerdersegment: Foerdersegment.BEG_EM,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.30,
    maxFoerdersatz: 0.70,
    maxFoerderfaehigeKosten: 30000,
    bewilligungszeitraum: 36,
    beschreibung:
      "Zuschuss für den Einbau einer neuen Heizungsanlage auf Basis erneuerbarer Energien. Basisförderung 30%, kombinierbar mit Geschwindigkeitsbonus (+20%), Einkommensbonus (+30%) und Effizienzbonus (+5%). Maximaler Zuschuss: 70%.",
    hinweise:
      "Max. förderfähige Kosten: 30.000 € für 1. WE, 15.000 € ab 2. WE, 8.000 € ab 7. WE. Antrag bei der KfW vor Vertragsabschluss stellen.",
    quellUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Energetisch-sanieren/Heizungsf%C3%B6rderung-f%C3%BCr-Privatpersonen-(458)/",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.HEIZUNG],
    boni: [
      { bezeichnung: "Geschwindigkeitsbonus", kuerzel: "geschwindigkeit", bonusSatz: 0.20, voraussetzung: "Austausch einer Gas-, Öl-, Kohle- oder Nachtspeicherheizung bis 31.12.2028. Einkommensgrenze: 40.000 € zu versteuerndes Haushaltseinkommen." },
      { bezeichnung: "Einkommensbonus", kuerzel: "einkommen", bonusSatz: 0.30, voraussetzung: "Zu versteuerndes Haushaltseinkommen ≤ 40.000 €/Jahr. Nur für selbstgenutzte Wohngebäude." },
      { bezeichnung: "Effizienzbonus (Wärmepumpe)", kuerzel: "effizienz", bonusSatz: 0.05, voraussetzung: "Wärmepumpe mit natürlichem Kältemittel oder mit Wasser/Erdreich-Wärmequelle" },
    ],
    kumulierung: [
      { ausschlussTyp: "beg_wg_ee_klasse", beschreibung: "Nicht kombinierbar mit KfW 261 BEG WG mit EE-Klasse für dieselbe Heizungsmaßnahme", maxFoerderquote: 0.70 },
      { ausschlussTyp: "paragraph_35c", beschreibung: "Nicht kombinierbar mit § 35c EStG für dieselbe Maßnahme" },
    ],
  });

  // ─── KfW 358/359 – BEG EM Ergänzungskredit ───────────────────────────────
  await createProgramm({
    programmNummer: "358/359",
    name: "Bundesförderung für effiziente Gebäude – Einzelmaßnahmen Ergänzungskredit",
    kurzname: "BEG EM Ergänzungskredit",
    foerdergeber: Foerdergeber.KFW,
    foerdersegment: Foerdersegment.BEG_EM,
    foerderart: Foerderart.KREDIT,
    basisFoerdersatz: 0.00,
    maxFoerdersatz: 0.00,
    kreditbetragMax: 120000,
    beschreibung:
      "Zinsgünstiger Ergänzungskredit für Einzelmaßnahmen nach BEG EM. Kombinierbar mit dem BAFA-Zuschuss. Max. 120.000 € pro Wohneinheit.",
    quellUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Energetisch-sanieren/",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.GEBAEUDEHUELLE, Massnahmenart.ANLAGENTECHNIK, Massnahmenart.HEIZUNG],
  });

  // ─── KfW 308 – Jung kauft Alt ─────────────────────────────────────────────
  await createProgramm({
    programmNummer: "308",
    name: "Jung kauft Alt – Wohneigentum für Familien mit Altbau",
    kurzname: "Jung kauft Alt",
    foerdergeber: Foerdergeber.KFW,
    foerdersegment: Foerdersegment.SONSTIGE,
    foerderart: Foerderart.KREDIT,
    basisFoerdersatz: 0.00,
    maxFoerdersatz: 0.00,
    kreditbetragMax: 150000,
    beschreibung:
      "Zinsgünstiger Kredit für Familien mit Kindern beim Kauf eines älteren Wohngebäudes. Max. 100.000–150.000 € abhängig von Kinderzahl.",
    quellUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Neubau/Produkte/Jung-kauft-Alt-(308)/",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH],
    massnahmen: [Massnahmenart.EH_KOMPLETTSANIERUNG],
  });

  // ─── KfW 124 – Wohneigentumsprogramm ─────────────────────────────────────
  await createProgramm({
    programmNummer: "124",
    name: "Wohneigentumsprogramm",
    kurzname: "KfW Wohneigentum",
    foerdergeber: Foerdergeber.KFW,
    foerdersegment: Foerdersegment.SONSTIGE,
    foerderart: Foerderart.KREDIT,
    basisFoerdersatz: 0.00,
    maxFoerdersatz: 0.00,
    kreditbetragMax: 100000,
    beschreibung:
      "Zinsgünstiger Kredit zum Kauf oder Bau von selbstgenutztem Wohneigentum. Max. 100.000 €.",
    quellUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Neubau/Produkte/Wohneigentumsprogramm-(124)/",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH],
    massnahmen: [Massnahmenart.EH_KOMPLETTSANIERUNG],
  });

  // ─── BAFA – BEG EM Gebäudehülle ──────────────────────────────────────────
  await createProgramm({
    name: "BEG Einzelmaßnahmen – Gebäudehülle",
    kurzname: "BAFA Gebäudehülle",
    foerdergeber: Foerdergeber.BAFA,
    foerdersegment: Foerdersegment.BEG_EM,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.15,
    maxFoerdersatz: 0.20,
    maxFoerderfaehigeKosten: 30000,
    maxFoerderfaehigeKostenEE: 60000,
    bewilligungszeitraum: 36,
    beschreibung:
      "Zuschuss für Dämmmaßnahmen an Dach, Fassade, Kellerdecke sowie Fenster- und Türtausch. Basisförderung 15%, mit iSFP-Bonus 20%. Max. förderfähige Kosten 30.000 €/WE/Jahr, mit iSFP 60.000 €.",
    quellUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_effiziente_Gebaeude/BEG_EM/beg_em_node.html",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.GEBAEUDEHUELLE],
    boni: [
      { bezeichnung: "iSFP-Bonus", kuerzel: "isfp", bonusSatz: 0.05, voraussetzung: "Gültiger individueller Sanierungsfahrplan (iSFP) liegt vor. Erhöht auch den Kostendeckel auf 60.000 €/WE/Jahr." },
    ],
    kumulierung: [
      { ausschlussTyp: "paragraph_35c", beschreibung: "Nicht kombinierbar mit § 35c EStG für dieselbe Maßnahme" },
      { ausschlussTyp: "max_60_prozent", beschreibung: "Gesamtförderquote aus öffentlichen Mitteln maximal 60%", maxFoerderquote: 0.60 },
    ],
  });

  // ─── BAFA – BEG EM Anlagentechnik ────────────────────────────────────────
  await createProgramm({
    name: "BEG Einzelmaßnahmen – Anlagentechnik (außer Heizung)",
    kurzname: "BAFA Anlagentechnik",
    foerdergeber: Foerdergeber.BAFA,
    foerdersegment: Foerdersegment.BEG_EM,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.15,
    maxFoerdersatz: 0.20,
    maxFoerderfaehigeKosten: 30000,
    maxFoerderfaehigeKostenEE: 60000,
    bewilligungszeitraum: 36,
    beschreibung:
      "Zuschuss für Maßnahmen an der Gebäudetechnik: Lüftungsanlagen, Mess-, Steuer- und Regelungstechnik, Beleuchtung in Nichtwohngebäuden. Basisförderung 15%, mit iSFP 20%.",
    quellUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_effiziente_Gebaeude/BEG_EM/beg_em_node.html",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH, Gebaeudetyp.NWG],
    massnahmen: [Massnahmenart.ANLAGENTECHNIK],
    boni: [
      { bezeichnung: "iSFP-Bonus", kuerzel: "isfp", bonusSatz: 0.05, voraussetzung: "Gültiger individueller Sanierungsfahrplan (iSFP) liegt vor." },
    ],
    kumulierung: [
      { ausschlussTyp: "paragraph_35c", beschreibung: "Nicht kombinierbar mit § 35c EStG für dieselbe Maßnahme" },
      { ausschlussTyp: "max_60_prozent", beschreibung: "Gesamtförderquote aus öffentlichen Mitteln maximal 60%", maxFoerderquote: 0.60 },
    ],
  });

  // ─── BAFA – BEG EM Heizungsoptimierung ───────────────────────────────────
  await createProgramm({
    name: "BEG Einzelmaßnahmen – Heizungsoptimierung",
    kurzname: "BAFA Heizungsoptimierung",
    foerdergeber: Foerdergeber.BAFA,
    foerdersegment: Foerdersegment.BEG_EM,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.15,
    maxFoerdersatz: 0.50,
    maxFoerderfaehigeKosten: 30000,
    bewilligungszeitraum: 36,
    beschreibung:
      "Zuschuss für die Optimierung bestehender Heizungsanlagen. 15% Basisförderung für Effizienzverbesserungen, 50% für Emissionsminderungsmaßnahmen.",
    quellUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_effiziente_Gebaeude/BEG_EM/beg_em_node.html",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.HEIZUNG],
    kumulierung: [
      { ausschlussTyp: "kfw_458", beschreibung: "Nicht kombinierbar mit KfW 458 für dieselbe Heizungsmaßnahme" },
    ],
  });

  // ─── BAFA – BEG EM Gebäudenetz ────────────────────────────────────────────
  await createProgramm({
    name: "BEG Einzelmaßnahmen – Gebäudenetz",
    kurzname: "BAFA Gebäudenetz",
    foerdergeber: Foerdergeber.BAFA,
    foerdersegment: Foerdersegment.BEG_EM,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.30,
    maxFoerdersatz: 0.30,
    maxFoerderfaehigeKosten: 30000,
    beschreibung:
      "30% Zuschuss für Errichtung, Erweiterung oder Anschluss eines Gebäudenetzes (Kälte-/Wärmenetze innerhalb eines Quartiers).",
    quellUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_effiziente_Gebaeude/BEG_EM/beg_em_node.html",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH, Gebaeudetyp.NWG],
    massnahmen: [Massnahmenart.ANLAGENTECHNIK],
  });

  // ─── BAFA – EBW (Energieberatung Wohngebäude) ────────────────────────────
  await createProgramm({
    name: "Energieberatung für Wohngebäude (iSFP)",
    kurzname: "EBW – iSFP Förderung",
    foerdergeber: Foerdergeber.BAFA,
    foerdersegment: Foerdersegment.EBW,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.50,
    maxFoerdersatz: 0.50,
    beschreibung:
      "50% Zuschuss für die Erstellung eines individuellen Sanierungsfahrplans (iSFP) durch einen zugelassenen Energieeffizienz-Experten. Max. 650 € für EFH/ZFH, 850 € für MFH.",
    quellUrl: "https://www.bafa.de/DE/Energie/Energieberatung/Energieberatung_Wohngebaeude/energieberatung_wohngebaeude_node.html",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.ENERGIEBERATUNG],
  });

  // ─── § 35c EStG – Steuerbonus Sanierung ──────────────────────────────────
  await createProgramm({
    name: "Steuerermäßigung für energetische Sanierungsmaßnahmen",
    kurzname: "§ 35c EStG Steuerbonus",
    foerdergeber: Foerdergeber.LAND,
    foerdersegment: Foerdersegment.STEUERLICH,
    foerderart: Foerderart.STEUERBONUS,
    basisFoerdersatz: 0.20,
    maxFoerdersatz: 0.20,
    maxFoerderfaehigeKosten: 200000,
    bewilligungszeitraum: 36,
    beschreibung:
      "20% Steuerbonus auf förderfähige Kosten bis max. 200.000 € – aufgeteilt auf 3 Jahre (7% / 7% / 6%). Nur für selbstgenutztes Wohneigentum. Nicht kombinierbar mit BEG-Förderungen für dieselbe Maßnahme.",
    hinweise:
      "Geltendmachung über die Einkommensteuererklärung. Kein Antrag notwendig, aber Nachweis durch Fachunternehmer und ggf. EEE erforderlich.",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH],
    massnahmen: [Massnahmenart.GEBAEUDEHUELLE, Massnahmenart.HEIZUNG, Massnahmenart.ANLAGENTECHNIK],
    kumulierung: [
      { ausschlussTyp: "beg_em", beschreibung: "Nicht kombinierbar mit BEG EM Förderungen (BAFA-Zuschuss) für dieselbe Maßnahme" },
      { ausschlussTyp: "kfw_458", beschreibung: "Nicht kombinierbar mit KfW 458 Heizungsförderung für dieselbe Maßnahme" },
    ],
  });

  // ─── § 35a Abs. 3 EStG – Handwerkerleistungen ────────────────────────────
  await createProgramm({
    name: "Steuerermäßigung für Handwerkerleistungen",
    kurzname: "§ 35a Handwerkerbonus",
    foerdergeber: Foerdergeber.LAND,
    foerdersegment: Foerdersegment.STEUERLICH,
    foerderart: Foerderart.STEUERBONUS,
    basisFoerdersatz: 0.20,
    maxFoerdersatz: 0.20,
    beschreibung:
      "20% Steuerermäßigung auf Arbeitskosten für Handwerkerleistungen. Max. Steuervorteil: 1.200 €/Jahr (entspricht 6.000 € anrechenbare Kosten). Kombinierbar mit BEG-Förderungen (auf Materialkosten).",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.GEBAEUDEHUELLE, Massnahmenart.HEIZUNG, Massnahmenart.ANLAGENTECHNIK],
  });

  // ─── Fachplanung & Baubegleitung ──────────────────────────────────────────
  await createProgramm({
    name: "Fachplanung und Baubegleitung (BEG)",
    kurzname: "Fachplanung BEG",
    foerdergeber: Foerdergeber.KFW,
    foerdersegment: Foerdersegment.BEG_WG,
    foerderart: Foerderart.ZUSCHUSS,
    basisFoerdersatz: 0.50,
    maxFoerdersatz: 0.50,
    beschreibung:
      "50% Zuschuss für Fachplanung und Baubegleitung durch EEE. Max. 5.000 € für EFH/ZFH (EM) bzw. 10.000 € (WG). Bei MFH max. 2.000 €/WE (EM) oder 4.000 €/WE (WG, max. 40.000 €).",
    quellUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_effiziente_Gebaeude/BEG_EM/beg_em_node.html",
    gebaeudetypen: [Gebaeudetyp.EFH, Gebaeudetyp.ZFH, Gebaeudetyp.MFH],
    massnahmen: [Massnahmenart.FACHPLANUNG],
  });

  const count = await prisma.foerderProgramm.count();
  console.log(`✅ ${count} Förderprogramme erstellt`);

  // ─── Demo-Projekte für den Berater ───────────────────────────────────────
  const programmes = await prisma.foerderProgramm.findMany({ take: 3 });

  await prisma.projekt.upsert({
    where: { id: "demo-projekt-1" },
    update: {},
    create: {
      id: "demo-projekt-1",
      userId: berater.id,
      titel: "Einfamilienhaus Sanierung – Familie Wagner",
      kundeName: "Thomas Wagner",
      kundeEmail: "t.wagner@beispiel.de",
      plz: "80539",
      ort: "München",
      gebaeudetyp: Gebaeudetyp.EFH,
      baujahr: 1978,
      wohneinheiten: 1,
      ehStufe: "EH55",
      status: "ANTRAG_GESTELLT",
      hatISFP: true,
      istSelbstgenutzt: true,
      haushaltseinkommen: 55000,
      massnahmen: {
        create: [
          { massnahmenart: Massnahmenart.HEIZUNG, beschreibung: "Wärmepumpe Luft/Wasser", investitionskosten: 18000 },
          { massnahmenart: Massnahmenart.GEBAEUDEHUELLE, beschreibung: "Fassadendämmung WDVS", investitionskosten: 22000 },
        ],
      },
      foerderungen: programmes.length > 0 ? {
        create: [{ programmId: programmes[0].id, beantragterBetrag: 12600, antragsDatum: new Date("2025-03-01"), aktiveBonus: ["isfp"] }],
      } : undefined,
    },
  });

  await prisma.projekt.upsert({
    where: { id: "demo-projekt-2" },
    update: {},
    create: {
      id: "demo-projekt-2",
      userId: berater.id,
      titel: "MFH Komplettsanierung – Wohnungsbau GmbH",
      kundeName: "Münchner Wohnungsbau GmbH",
      plz: "80331",
      ort: "München",
      gebaeudetyp: Gebaeudetyp.MFH,
      baujahr: 1965,
      wohneinheiten: 12,
      ehStufe: "EH40",
      status: "RECHERCHE",
      istWPB: true,
      hatEEKlasse: true,
      massnahmen: {
        create: [{ massnahmenart: Massnahmenart.EH_KOMPLETTSANIERUNG, investitionskosten: 980000 }],
      },
    },
  });

  console.log("✅ Demo-Projekte erstellt");
  console.log("\n🎉 Seed abgeschlossen!");
  console.log("📧 Admin:   admin@foerderscan.de  /  Admin1234!");
  console.log("📧 Berater: berater@example.de    /  Berater1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
