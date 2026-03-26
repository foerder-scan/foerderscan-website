export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: number;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "beg-em-heizung-2025",
    title: "KfW 458: Heizungsförderung 2025 – Alles was Energieberater wissen müssen",
    excerpt: "Der Heizungsbonus (BEG EM Heizung, KfW 458) bietet 2025 bis zu 70% Förderung. Wir erklären Basisfördersatz, Einkommensbonus und Effizienzbonus im Detail.",
    date: "2025-03-15",
    category: "Förderupdate",
    readingTime: 8,
    content: `
## Was hat sich bei KfW 458 geändert?

Die Bundesförderung für effiziente Gebäude – Einzelmaßnahmen (BEG EM) für Heizungsanlagen läuft seit dem 1. Januar 2024 über die KfW unter der Programmnummer 458. Der Zuschuss wird direkt ausgezahlt und muss nicht zurückgezahlt werden.

### Fördersätze im Überblick

| Bonus | Fördersatz | Voraussetzung |
|-------|-----------|---------------|
| Basis | 30% | Heizungsanlage wird durch Wärmepumpe, Pelletheizung o.ä. ersetzt |
| Einkommensbonus | +30% | Zu versteuerndes Haushaltseinkommen ≤ 40.000 €/Jahr |
| Effizienzbonus | +5% | Wärmepumpe nutzt natürliche Kältemittel oder Wasser/Erde als Wärmequelle |
| **Maximal** | **70%** | Kombination aller Boni |

### Förderfähige Investitionskosten

Die förderfähigen Kosten sind gedeckelt:
- **1. Wohneinheit:** max. 30.000 €
- **2. bis 6. Wohneinheit:** je 15.000 €
- **Ab 7. Wohneinheit:** je 8.000 €

Bei einem Einfamilienhaus mit Investitionskosten von 25.000 € und Einkommensbonus ergibt sich:
- Förderfähige Kosten: 25.000 € (unter Deckel)
- Fördersatz: 30% + 30% = 60%
- **Förderbetrag: 15.000 €**

### Wichtige Voraussetzungen

1. **Antrag vor Auftragserteilung:** Der Antrag bei der KfW muss gestellt werden, bevor Sie einen Auftrag erteilen. Ausnahme: Vorläufiger Liefer-/Leistungsvertrag mit auflösender Bedingung.
2. **Kein § 35c EStG kombinierbar:** BEG-Förderung und der Steuerbonus nach § 35c EStG können nicht für dieselbe Maßnahme kombiniert werden.
3. **Fachbetrieb erforderlich:** Einbau durch einen zugelassenen Fachbetrieb.

### Praxistipp für Energieberater

Nutzen Sie den FörderScan-Rechner, um für Ihre Kunden schnell zu prüfen, ob der Einkommensbonus anwendbar ist. Gerade bei Eigentümern mit geringerem Einkommen kann die Kombination aus Basis- und Einkommensbonus die Förderung von 30% auf 60% verdoppeln.
    `.trim(),
  },
  {
    slug: "isfp-bonus-erklaert",
    title: "iSFP-Bonus: 5% mehr Förderung durch individuellen Sanierungsfahrplan",
    excerpt: "Der individuelle Sanierungsfahrplan (iSFP) ermöglicht 5% Zusatzförderung bei BEG-Einzelmaßnahmen und verdoppelt den förderfähigen Kostendeckel. Was Berater wissen müssen.",
    date: "2025-02-28",
    category: "Fachbeitrag",
    readingTime: 6,
    content: `
## Was ist der iSFP-Bonus?

Der individuelle Sanierungsfahrplan (iSFP) ist ein auf das jeweilige Gebäude zugeschnittener Sanierungsplan, der von einem Energieeffizienz-Experten (EEE) erstellt wird. Für Sanierungsmaßnahmen, die dem iSFP entsprechen, gewährt das BAFA einen Zusatzbonus von 5%.

### Voraussetzungen für den iSFP-Bonus

- Der iSFP muss **vor Antragstellung** erstellt worden sein
- Die beantragte Maßnahme muss dem iSFP entsprechen
- Der iSFP muss von einem auf der Expertenliste gelisteten EEE erstellt worden sein

### Auswirkung auf den Kostendeckel

Der iSFP-Bonus hat eine besondere Wirkung auf die förderfähigen Kosten bei BEG-Einzelmaßnahmen (Gebäudehülle, Anlagentechnik):

| Situation | Max. förderfähige Kosten pro WE/Jahr |
|-----------|--------------------------------------|
| Ohne iSFP | 30.000 € |
| Mit iSFP | **60.000 €** |

### Wirtschaftlichkeitsberechnung

Bei einer Dachsanierung mit 55.000 € Investitionskosten:
- **Ohne iSFP:** 30.000 € × 15% = 4.500 € Förderung
- **Mit iSFP:** 55.000 € × 20% = 11.000 € Förderung

Der iSFP lohnt sich besonders bei größeren Investitionen, wo der verdoppelte Kostendeckel voll ausgenutzt werden kann.

### EBW-Förderung für die iSFP-Erstellung

Die Kosten für die iSFP-Erstellung sind selbst förderungsfähig über das EBW-Programm (Energieberatung für Wohngebäude):
- **EFH/ZFH:** 50% Zuschuss, max. 650 €
- **MFH:** 50% Zuschuss, max. 850 €
    `.trim(),
  },
  {
    slug: "kumulierung-beg-regeln",
    title: "Kumulierungsregeln BEG 2025: Was darf kombiniert werden?",
    excerpt: "Die 60%-Kumulierungsgrenze, Ausschluss von § 35c EStG, BEG WG vs. BEG EM – ein strukturierter Überblick der Kombinationsregeln für die Praxis.",
    date: "2025-01-20",
    category: "Praxiswissen",
    readingTime: 10,
    content: `
## Grundregel: Max. 60% Förderquote aus öffentlichen Mitteln

Werden mehrere Förderprogramme für dieselbe Maßnahme kombiniert, darf die Gesamtförderquote aus öffentlichen Mitteln **60% der förderfähigen Kosten** nicht überschreiten. Diese Regel gilt für alle BEG-Segmente.

### Erlaubte Kombinationen

**BEG EM Heizung (KfW 458) + BEG EM Gebäudehülle (BAFA):**
✅ Kombinierbar, wenn es sich um **verschiedene Maßnahmen** handelt.

**BEG WG (KfW 261) + Fachplanung/Baubegleitung:**
✅ Tilgungszuschuss + Fachplanungsförderung kombinierbar.

**BEG EM + EBW (Energieberatung):**
✅ Die Energieberatungskosten sind separat förderungsfähig.

### Nicht erlaubte Kombinationen

**BEG + § 35c EStG für dieselbe Maßnahme:**
❌ Wer BEG-Förderung für eine Maßnahme erhält, kann für **exakt diese Maßnahme** keinen Steuerbonus nach § 35c EStG beantragen. Für andere Maßnahmen am selben Gebäude ist eine Kombination möglich.

**BEG WG mit EE-Klasse + BEG EM Heizung:**
❌ Wer das Gebäude zum Effizienzhaus mit EE-Klasse saniert (KfW 261), kann nicht zusätzlich BEG EM Heizung beantragen.

### Praxisbeispiel: Optimale Förderstrategie

Gebäude: EFH, Baujahr 1975, Vollsanierung geplant
Investition: 180.000 € gesamt

**Option A: BEG WG Komplettsanierung (KfW 261)**
- EH 55: 15% Tilgungszuschuss auf 120.000 € = 18.000 €
- + SerSan-Bonus: +15% = 30.000 € weitere
- **Gesamt: 48.000 € Tilgungszuschuss**

**Option B: Schrittweise BEG EM**
- Heizung 25.000 €: 30% = 7.500 €
- Gebäudehülle 60.000 € (mit iSFP): 20% = 12.000 €
- Anlagentechnik 15.000 €: 15% = 2.250 €
- **Gesamt: ~21.750 € Zuschuss (nicht zurückzuzahlen)**

In diesem Fall ist Option A trotz Kredit deutlich attraktiver — genau für solche Vergleiche gibt es das FörderScan Vergleichstool.
    `.trim(),
  },
  {
    slug: "serielle-sanierung-sersan-bonus",
    title: "Seriell Sanieren: SerSan-Bonus von 15% und was er bedeutet",
    excerpt: "Serielle Sanierung durch vorgefertigte Fassaden- und Dachelemente ermöglicht den SerSan-Bonus von 15% bei KfW 261. Voraussetzungen und Praxishinweise.",
    date: "2025-01-05",
    category: "Förderupdate",
    readingTime: 5,
    content: `
## Was ist Serielle Sanierung?

Serielle Sanierung bedeutet die energetische Sanierung eines Gebäudes unter Verwendung vorgefertigter Fassaden- und/oder Dachelemente. Diese werden in der Fabrik maßgefertigt und auf der Baustelle montiert – ähnlich wie bei einem Fertighaus.

### SerSan-Bonus: +15% Tilgungszuschuss

Beim KfW-Programm 261 (BEG WG) erhalten Gebäude, die seriell saniert werden, einen Tilgungszuschusskzuschlag von 15 Prozentpunkten.

Beispiel: EH 55 + SerSan-Bonus
- Basis EH 55: 15% Tilgungszuschuss
- SerSan-Bonus: +15%
- **Gesamt: 30% Tilgungszuschuss** auf bis zu 120.000 € = 36.000 €

### Voraussetzungen für den SerSan-Bonus

1. Einsatz vorgefertigter Gebäudehüllsysteme (Fassaden oder Dach)
2. Umsetzung durch einen Fachbetrieb mit Erfahrung in serieller Sanierung
3. Erreichung mindestens EH 55 nach Sanierung

### Kombination mit anderen Boni

Der SerSan-Bonus kann mit dem WPB-Bonus und dem EE-/NH-Klassen-Bonus kombiniert werden:
- EH 40 + WPB + SerSan + EE-Klasse: 20% + 10% + 15% + 5% = **50%** (gedeckelt bei 45%)

Hinweis: Der maximale Tilgungszuschuss bei KfW 261 ist auf 45% begrenzt.
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
