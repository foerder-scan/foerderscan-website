# Domain + E-Mail zu OVHcloud umziehen

## Übersicht: Was wohin geht

```
VORHER                          NACHHER
──────────────────────          ──────────────────────
Domain:    All-Inkl         →   OVHcloud (Registrar)
DNS:       All-Inkl         →   OVHcloud DNS-Zone
E-Mail:    All-Inkl         →   OVHcloud Email Pro
App:       Vercel           →   OVHcloud VPS-2
Datenbank: Neon (bleibt)    →   Neon (bleibt)
Resend:    (bleibt)         →   (bleibt, nur DNS-Eintrag neu)
```

---

## Phase 1 – Domain zu OVHcloud transferieren

### 1.1 – Vorbereitung bei All-Inkl

Im **All-Inkl KAS** (kas.all-inkl.com):

1. **Domain entsperren:**
   Domains → foerderscan.de → Domainverwaltung → **Transfer-Lock deaktivieren**

2. **Auth-Code (EPP-Code) anfordern:**
   Domains → foerderscan.de → **Auth-Code anfordern**
   → Per E-Mail innerhalb weniger Minuten

3. **WHOIS-E-Mail prüfen:**
   Muss erreichbar sein — Sie bekommen eine Bestätigungs-E-Mail

### 1.2 – Transfer bei OVHcloud starten

1. [order.eu.ovhcloud.com](https://order.eu.ovhcloud.com/) → **Domains** → **Domain transferieren**
2. `foerderscan.de` eingeben → Auth-Code eintragen
3. Zahlung (~8–12 €/Jahr für .de)
4. Bestätigungs-E-Mail von DENIC annehmen

**Dauer:** 5–7 Werktage

> **Alternative (schneller):** Domain bleibt bei All-Inkl, Sie verwalten
> nur den DNS bei OVHcloud. Dann Nameserver bei All-Inkl auf OVH ändern:
> ```
> ns1.ovh.net
> ns2.ovh.net
> ```
> Dauer: 24–48h Propagation, kein Transfer-Warten.

---

## Phase 2 – E-Mail-Paket bei OVHcloud buchen

### 2.1 – Das richtige Paket

Auf [order.eu.ovhcloud.com](https://order.eu.ovhcloud.com/) → **E-Mails**:

| Paket | Preis | Postfächer | Empfehlung |
|-------|-------|------------|------------|
| **MX Plan** | ~1 €/Mo | 5 Konten, je 5 GB | ⭐ Für den Start |
| **Email Pro** | ~1 €/Konto/Mo | Unbegrenzt, je 10 GB | Wenn Sie Kalender brauchen |
| **Microsoft 365** | ~5 €/Mo | Outlook, Teams | Übertrieben für jetzt |

→ **MX Plan** reicht für FörderScan vollkommen.

### 2.2 – Domain zum E-Mail-Paket hinzufügen

OVHcloud Manager → E-Mails → Ihr MX Plan → **Domains** → **Domain hinzufügen**:
- `foerderscan.de` eingeben
- OVHcloud schlägt die DNS-Einträge automatisch vor

---

## Phase 3 – DNS-Zone bei OVHcloud einrichten

OVHcloud Manager → **Domains** → foerderscan.de → **DNS-Zone**

### Alle benötigten Einträge:

```
# ── App (VPS) ──────────────────────────────────────────
@       A       IHRE-OVH-VPS-IP       300
www     A       IHRE-OVH-VPS-IP       300

# ── E-Mail (OVHcloud MX Plan) ──────────────────────────
@       MX  1   mx1.mail.ovh.net.     3600
@       MX  5   mx2.mail.ovh.net.     3600
@       MX  10  mx3.mail.ovh.net.     3600

# SPF
@       TXT     "v=spf1 include:mx.ovh.com ~all"

# DKIM (nach MX-Plan-Aktivierung aus OVH-Manager kopieren)
default._domainkey  TXT  "v=DKIM1; k=rsa; p=MIGf..."

# DMARC
_dmarc  TXT     "v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@foerderscan.de"

# ── Resend (Transaktionsmails) ──────────────────────────
# Diese Einträge kommen aus dem Resend Dashboard → Domains
resend._domainkey   TXT  "v=DKIM1; k=rsa; p=..."   (aus Resend kopieren)

# ── Subdomain für API-Docs (optional) ──────────────────
api     CNAME   foerderscan.de.       300
```

> **Wichtig:** DKIM-Schlüssel **nach** MX-Plan-Aktivierung aus dem
> OVHcloud Manager kopieren, nicht selbst erfinden.

---

## Phase 4 – Postfächer anlegen

OVHcloud Manager → E-Mails → MX Plan → **E-Mail-Adressen** → **Adresse erstellen**:

```
tobias@foerderscan.de        Tobias Feuerbach
info@foerderscan.de          Allgemein
kontakt@foerderscan.de       Kontaktformular-Weiterleitung
support@foerderscan.de       Kunden-Support
noreply@foerderscan.de       Für Resend (nur Absender-Adresse, kein echtes Postfach nötig)
```

### E-Mail-Client einrichten (Thunderbird / Outlook / Apple Mail)

```
IMAP:  ssl0.ovh.net    Port 993  SSL/TLS
SMTP:  ssl0.ovh.net    Port 587  STARTTLS
       oder Port 465   SSL/TLS

Benutzername: volle E-Mail-Adresse (tobias@foerderscan.de)
Passwort:     aus OVHcloud Manager
```

---

## Phase 5 – Bestehende E-Mails von All-Inkl migrieren

### Option A: Thunderbird (einfach, keine Installation nötig)

1. Thunderbird öffnen → **Beide Konten hinzufügen** (All-Inkl + OVHcloud)
2. All-Inkl-Ordner auswählen → **Alle Nachrichten kopieren** → in OVHcloud-Ordner einfügen
3. Dauert je nach Menge 10–60 Minuten

### Option B: imapsync (technisch, alles auf einmal)

```bash
# Auf dem Mac installieren
brew install imapsync

# Alle Ordner von All-Inkl → OVHcloud kopieren
imapsync \
  --host1 mail.all-inkl.com \
  --user1 tobias@foerderscan.de \
  --password1 "ALT-PASSWORT" \
  --host2 ssl0.ovh.net \
  --user2 tobias@foerderscan.de \
  --password2 "NEU-PASSWORT" \
  --ssl1 --ssl2 \
  --automap \
  --syncinternaldates
```

> Führen Sie imapsync **vor** dem DNS-Wechsel aus, solange All-Inkl noch aktiv ist.

---

## Phase 6 – Resend auf neue Domain anpassen

Im **Resend Dashboard** (resend.com):

1. **Domains** → `foerderscan.de` → DNS-Status prüfen
2. DKIM-Record aus Resend in OVHcloud DNS-Zone eintragen (falls noch nicht done)
3. **Verify** klicken → grüner Status

In der `.env.production` auf dem VPS prüfen:
```env
RESEND_FROM_EMAIL="noreply@foerderscan.de"
```

---

## Phase 7 – Go-Live Checkliste

Reihenfolge einhalten!

```
VORBEREITUNG (vor DNS-Wechsel)
[ ] imapsync oder Thunderbird: Alle Mails von All-Inkl → OVHcloud kopiert
[ ] OVHcloud VPS läuft, App ist online (per IP erreichbar)
[ ] Postfächer bei OVHcloud angelegt und getestet
[ ] Resend DNS-Record vorbereitet

DNS-WECHSEL (Abend/Wochenende empfohlen)
[ ] DNS-Zone bei OVHcloud vollständig eingerichtet
[ ] Bei All-Inkl: Nameserver auf ns1.ovh.net / ns2.ovh.net ändern
    ODER A-Records auf OVH-VPS-IP ändern + MX auf OVHcloud
[ ] TTL vorher auf 300 reduzieren (5 Min Propagation statt 24h)

NACH DEM WECHSEL (24–48h danach)
[ ] https://foerderscan.de lädt die App
[ ] SSL-Zertifikat gültig
[ ] E-Mail-Empfang testen: Testmail an info@foerderscan.de senden
[ ] E-Mail-Versand testen: Passwort-Reset im Dashboard auslösen
[ ] Resend-Status: grün im Dashboard
[ ] DMARC-Report-Adresse erreichbar
[ ] Stripe Webhook-URL unverändert (foerderscan.de/api/stripe/webhook)
[ ] All-Inkl kündigen (erst nach 2 Wochen Stabilität!)
```

---

## Kosten nach Umzug (komplett OVHcloud)

| Service | Kosten |
|---------|--------|
| VPS-2 | ~5 €/Mo |
| Domain .de | ~0,80 €/Mo (~10 €/Jahr) |
| MX Plan (5 Postfächer) | ~1 €/Mo |
| Neon DB (Free) | 0 € |
| Resend (Free bis 3k/Mo) | 0 € |
| **Gesamt** | **~7 €/Mo** |
