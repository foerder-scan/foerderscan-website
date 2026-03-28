import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PLZ-Prefix (2-stellig) → Bundesland-Kürzel
// Quellen: Bundesnetzagentur / Deutsche Post
const PLZ_TO_BUNDESLAND: Record<string, string> = {
  "01": "SN", "02": "SN", "03": "BB", "04": "SN",
  "06": "ST", "07": "TH", "08": "SN", "09": "SN",
  "10": "BE", "11": "BE", "12": "BE", "13": "BE", "14": "BE",
  "15": "BB", "16": "BB", "17": "MV", "18": "MV", "19": "MV",
  "20": "HH", "21": "HH", "22": "HH",
  "23": "SH", "24": "SH", "25": "SH",
  "26": "NI", "27": "NI", "28": "HB", "29": "NI",
  "30": "NI", "31": "NI", "32": "NI", "33": "NI", "34": "HE",
  "35": "HE", "36": "HE", "37": "NI", "38": "NI", "39": "ST",
  "40": "NW", "41": "NW", "42": "NW", "44": "NW", "45": "NW",
  "46": "NW", "47": "NW", "48": "NW", "49": "NW",
  "50": "NW", "51": "NW", "52": "NW", "53": "NW", "54": "RP",
  "55": "RP", "56": "RP", "57": "NW", "58": "NW", "59": "NW",
  "60": "HE", "61": "HE", "63": "HE", "64": "HE", "65": "HE",
  "66": "SL", "67": "RP", "68": "BW", "69": "BW",
  "70": "BW", "71": "BW", "72": "BW", "73": "BW", "74": "BW",
  "75": "BW", "76": "BW", "77": "BW", "78": "BW", "79": "BW",
  "80": "BY", "81": "BY", "82": "BY", "83": "BY", "84": "BY",
  "85": "BY", "86": "BY", "87": "BY", "88": "BW", "89": "BW",
  "90": "BY", "91": "BY", "92": "BY", "93": "BY", "94": "BY",
  "95": "BY", "96": "BY", "97": "BY", "98": "TH", "99": "TH",
};

function plzToBundesland(plz: string): string | null {
  if (!plz || plz.length < 2) return null;
  return PLZ_TO_BUNDESLAND[plz.slice(0, 2)] ?? null;
}

const BUNDESLAND_LABEL: Record<string, string> = {
  BW: "Baden-Württemberg", BY: "Bayern", BE: "Berlin", BB: "Brandenburg",
  HB: "Bremen", HH: "Hamburg", HE: "Hessen", MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen", NW: "Nordrhein-Westfalen", RP: "Rheinland-Pfalz",
  SL: "Saarland", SN: "Sachsen", ST: "Sachsen-Anhalt", SH: "Schleswig-Holstein",
  TH: "Thüringen",
};

/**
 * GET /api/v1/regionen/{plz}
 * Returns Förderprogramme available for a specific PLZ (Landesförderungen + bundesweit).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ plz: string }> }) {
  const auth = await validateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  const { plz } = await params;

  if (!/^\d{5}$/.test(plz)) {
    return NextResponse.json({ error: "Ungültige PLZ (5 Ziffern erwartet)" }, { status: 400 });
  }

  const bundesland = plzToBundesland(plz);

  // Bundesweite Programme + Landesförderungen für dieses Bundesland
  const where = bundesland
    ? { status: "AKTIV" as const, OR: [{ bundesweit: true }, { bundesland }] }
    : { status: "AKTIV" as const, bundesweit: true };

  const programme = await prisma.foerderProgramm.findMany({
    where,
    orderBy: [{ bundesweit: "desc" }, { maxFoerdersatz: "desc" }],
    select: {
      id: true,
      name: true,
      kurzname: true,
      foerdergeber: true,
      foerdersegment: true,
      foerderart: true,
      basisfördersatz: true,
      maxFoerdersatz: true,
      status: true,
      bundesweit: true,
      bundesland: true,
      gueltigBis: true,
    },
  });

  const bundesweit = programme.filter((p) => p.bundesweit);
  const regional = programme.filter((p) => !p.bundesweit);

  return NextResponse.json({
    plz,
    bundeslandKuerzel: bundesland ?? null,
    bundesland: bundesland ? (BUNDESLAND_LABEL[bundesland] ?? bundesland) : "Unbekannt",
    summary: { bundesweit: bundesweit.length, regional: regional.length, gesamt: programme.length },
    data: { bundesweit, regional },
  });
}
