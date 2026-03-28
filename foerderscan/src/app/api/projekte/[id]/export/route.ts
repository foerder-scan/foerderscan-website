import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from "docx";

const GEBAEUDETYP_LABEL: Record<string, string> = {
  EFH: "Einfamilienhaus",
  ZFH: "Zweifamilienhaus",
  MFH: "Mehrfamilienhaus",
  NWG: "Nichtwohngebäude",
  DENKMAL: "Denkmalgeschütztes Gebäude",
};

const MASSNAHME_LABEL: Record<string, string> = {
  GEBAEUDEHUELLE: "Gebäudehülle",
  ANLAGENTECHNIK: "Anlagentechnik",
  HEIZUNG: "Heizungsanlage",
  EH_KOMPLETTSANIERUNG: "EH-Komplettsanierung",
  FACHPLANUNG: "Fachplanung & Baubegleitung",
  ENERGIEBERATUNG: "Energieberatung",
};

const STATUS_LABEL: Record<string, string> = {
  RECHERCHE: "Recherche",
  ANTRAG_GESTELLT: "Antrag gestellt",
  ZUGESAGT: "Zugesagt",
  ABGERECHNET: "Abgerechnet",
  ABGEBROCHEN: "Abgebrochen",
};

function headerPara(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 300, after: 120 } });
}

function bodyPara(text: string) {
  return new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 80 } });
}

function labelValue(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 }),
    ],
    spacing: { after: 60 },
  });
}

function tableRow(label: string, value: string, shaded = false) {
  const shading = shaded
    ? { type: ShadingType.SOLID, color: "F0F4F8", fill: "F0F4F8" }
    : undefined;
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })],
        width: { size: 65, type: WidthType.PERCENTAGE },
        shading,
      }),
    ],
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await params;
  const projekt = await prisma.projekt.findFirst({
    where: { id, userId },
    include: {
      massnahmen: true,
      foerderungen: { include: { programm: true } },
      user: true,
    },
  });

  if (!projekt) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  const heute = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const adresse = [projekt.strasse, `${projekt.plz} ${projekt.ort || ""}`.trim()].filter(Boolean).join(", ");

  const gesamtInvest = projekt.massnahmen.reduce((s, m) => s + (m.investitionskosten ?? 0), 0);
  const gesamtFoerderung = projekt.foerderungen.reduce(
    (s, f) => s + (f.bewilligterBetrag ?? f.beantragterBetrag ?? 0),
    0
  );

  // ─── Dokument aufbauen ────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, right: 1200, bottom: 1200, left: 1440 },
          },
        },
        children: [
          // ── Titelblock ──────────────────────────────────────────────────
          new Paragraph({
            children: [new TextRun({ text: "FörderScan", bold: true, size: 28, color: "1B4F72" })],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Technische Projektbeschreibung (TPB)", size: 36, bold: true })],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Erstellt am: ${heute}`, size: 20, color: "666666" })],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Berater: ${projekt.user.name ?? projekt.user.email}`, size: 20, color: "666666" })],
            spacing: { after: 300 },
          }),

          // ── 1. Projektübersicht ─────────────────────────────────────────
          headerPara("1. Projektübersicht"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            rows: [
              tableRow("Projekttitel", projekt.titel, false),
              tableRow("Projektstatus", STATUS_LABEL[projekt.status] ?? projekt.status, true),
              tableRow("Kunde", projekt.kundeName, false),
              tableRow("E-Mail Kunde", projekt.kundeEmail ?? "—", true),
              tableRow("Objektadresse", adresse || "—", false),
            ],
          }),

          // ── 2. Gebäudedaten ─────────────────────────────────────────────
          headerPara("2. Gebäudedaten"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            rows: [
              tableRow("Gebäudetyp", GEBAEUDETYP_LABEL[projekt.gebaeudetyp] ?? projekt.gebaeudetyp, false),
              tableRow("Baujahr", projekt.baujahr ? String(projekt.baujahr) : "—", true),
              tableRow("Wohneinheiten", String(projekt.wohneinheiten), false),
              tableRow("Denkmalschutz", projekt.istDenkmal ? "Ja" : "Nein", true),
              tableRow("Effizienzhaus-Stufe (Ziel)", projekt.ehStufe ? `EH ${projekt.ehStufe}` : "—", false),
              tableRow("Selbstgenutzt", projekt.istSelbstgenutzt ? "Ja" : "Nein", true),
            ],
          }),

          // ── 3. Fördervoraussetzungen ────────────────────────────────────
          headerPara("3. Fördervoraussetzungen"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            rows: [
              tableRow("iSFP vorhanden", projekt.hatISFP ? "Ja" : "Nein", false),
              tableRow("Worst Performing Building", projekt.istWPB ? "Ja" : "Nein", true),
              tableRow("Serielles Sanieren", projekt.istSerSan ? "Ja" : "Nein", false),
              tableRow("EE-Klasse", projekt.hatEEKlasse ? "Ja" : "Nein", true),
              tableRow("NH-Klasse", projekt.hatNHKlasse ? "Ja" : "Nein", false),
              tableRow(
                "Haushaltseinkommen",
                projekt.haushaltseinkommen ? `${projekt.haushaltseinkommen.toLocaleString("de-DE")} €` : "Nicht angegeben",
                true
              ),
            ],
          }),

          // ── 4. Geplante Maßnahmen ───────────────────────────────────────
          headerPara("4. Geplante Maßnahmen"),
          ...(projekt.massnahmen.length === 0
            ? [bodyPara("Keine Maßnahmen erfasst.")]
            : [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                  },
                  rows: [
                    // Header
                    new TableRow({
                      tableHeader: true,
                      children: [
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: "Maßnahme", bold: true, size: 20 })] })],
                          width: { size: 40, type: WidthType.PERCENTAGE },
                          shading: { type: ShadingType.SOLID, color: "1B4F72", fill: "1B4F72" },
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: "Beschreibung", bold: true, size: 20, color: "FFFFFF" })] })],
                          width: { size: 40, type: WidthType.PERCENTAGE },
                          shading: { type: ShadingType.SOLID, color: "1B4F72", fill: "1B4F72" },
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: "Investition", bold: true, size: 20, color: "FFFFFF" }), new TextRun({ text: "", size: 20, color: "FFFFFF" })], alignment: AlignmentType.RIGHT })],
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          shading: { type: ShadingType.SOLID, color: "1B4F72", fill: "1B4F72" },
                        }),
                      ],
                    }),
                    ...projekt.massnahmen.map((m, i) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: MASSNAHME_LABEL[m.massnahmenart] ?? m.massnahmenart, size: 20 })] })],
                            shading: i % 2 === 1 ? { type: ShadingType.SOLID, color: "F0F4F8", fill: "F0F4F8" } : undefined,
                          }),
                          new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: m.beschreibung ?? "—", size: 20 })] })],
                            shading: i % 2 === 1 ? { type: ShadingType.SOLID, color: "F0F4F8", fill: "F0F4F8" } : undefined,
                          }),
                          new TableCell({
                            children: [new Paragraph({
                              children: [new TextRun({ text: m.investitionskosten ? `${m.investitionskosten.toLocaleString("de-DE")} €` : "—", size: 20 })],
                              alignment: AlignmentType.RIGHT,
                            })],
                            shading: i % 2 === 1 ? { type: ShadingType.SOLID, color: "F0F4F8", fill: "F0F4F8" } : undefined,
                          }),
                        ],
                      })
                    ),
                    // Summenzeile
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: "Gesamt", bold: true, size: 20 })] })],
                          columnSpan: 2,
                          shading: { type: ShadingType.SOLID, color: "E8F0F7", fill: "E8F0F7" },
                        }),
                        new TableCell({
                          children: [new Paragraph({
                            children: [new TextRun({ text: `${gesamtInvest.toLocaleString("de-DE")} €`, bold: true, size: 20 })],
                            alignment: AlignmentType.RIGHT,
                          })],
                          shading: { type: ShadingType.SOLID, color: "E8F0F7", fill: "E8F0F7" },
                        }),
                      ],
                    }),
                  ],
                }),
              ]),

          // ── 5. Zugeordnete Förderprogramme ─────────────────────────────
          headerPara("5. Zugeordnete Förderprogramme"),
          ...(projekt.foerderungen.length === 0
            ? [bodyPara("Keine Förderprogramme zugeordnet.")]
            : projekt.foerderungen.flatMap((f, i) => [
                headerPara(`5.${i + 1} ${f.programm.name}`, HeadingLevel.HEADING_2),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                  },
                  rows: [
                    tableRow("Fördergeber", f.programm.foerdergeber, false),
                    tableRow("Förderart", f.programm.foerderart, true),
                    tableRow("Beantragter Betrag", f.beantragterBetrag ? `${f.beantragterBetrag.toLocaleString("de-DE")} €` : "—", false),
                    tableRow("Bewilligter Betrag", f.bewilligterBetrag ? `${f.bewilligterBetrag.toLocaleString("de-DE")} €` : "—", true),
                    tableRow("Antragsdatum", f.antragsDatum ? new Date(f.antragsDatum).toLocaleDateString("de-DE") : "—", false),
                    tableRow("Bewilligungsdatum", f.bewilligungsDatum ? new Date(f.bewilligungsDatum).toLocaleDateString("de-DE") : "—", true),
                    tableRow("Ablaufdatum", f.ablaufDatum ? new Date(f.ablaufDatum).toLocaleDateString("de-DE") : "—", false),
                    tableRow("Aktive Boni", f.aktiveBonus.length > 0 ? f.aktiveBonus.join(", ") : "Keine", true),
                  ],
                }),
              ])),

          // ── 6. Zusammenfassung ──────────────────────────────────────────
          headerPara("6. Zusammenfassung"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            rows: [
              tableRow("Gesamtinvestition", `${gesamtInvest.toLocaleString("de-DE")} €`, false),
              tableRow("Gesamtförderung (beantragt/bewilligt)", `${gesamtFoerderung.toLocaleString("de-DE")} €`, true),
              tableRow(
                "Eigenanteil (geschätzt)",
                `${Math.max(0, gesamtInvest - gesamtFoerderung).toLocaleString("de-DE")} €`,
                false
              ),
              tableRow(
                "Förderquote",
                gesamtInvest > 0 ? `${Math.round((gesamtFoerderung / gesamtInvest) * 100)} %` : "—",
                true
              ),
            ],
          }),

          // ── 7. Notizen ──────────────────────────────────────────────────
          ...(projekt.notizen
            ? [
                headerPara("7. Notizen"),
                bodyPara(projekt.notizen),
              ]
            : []),

          // ── Footer ──────────────────────────────────────────────────────
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Dieses Dokument wurde automatisch von FörderScan generiert. Stand: ${heute}`,
                size: 18,
                color: "999999",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const filename = `TPB_${projekt.titel.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, "_")}_${heute.replace(/\./g, "-")}.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
