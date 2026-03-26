# FörderScan → Hostinger Migration

## Übersicht

| Was | Von | Nach | Zeit |
|-----|-----|------|------|
| Domain | All-Inkl | Hostinger | ~7 Tage (Transfer) oder sofort (DNS) |
| E-Mail | All-Inkl | Hostinger Business Email | 1–2h |
| App (Next.js) | Vercel | Hostinger VPS (KVM 2) | 2–3h |
| Datenbank | Neon Cloud | Neon Cloud (bleibt!) | 0 Min |

> **Datenbank bleibt auf Neon** — serverless PostgreSQL in der Cloud,
> das ist einfacher und günstiger als selbst hosten.

---

## Phase 1 – Hostinger-Account einrichten

### 1.1 – Pakete buchen

Auf [hostinger.de](https://hostinger.de) folgendes buchen:

| Paket | Preis | Wofür |
|-------|-------|-------|
| **KVM 2** VPS | ~8 €/Mo | Next.js App + Nginx |
| **Business Email** Starter | ~1 €/Mo | E-Mail-Postfächer |

> **KVM 2 Specs:** 2 vCPU, 8 GB RAM, 100 GB SSD — mehr als genug.

### 1.2 – VPS: Ubuntu 22.04 auswählen

Bei der VPS-Einrichtung im hPanel:
- OS: **Ubuntu 22.04 LTS**
- Region: **Europe (Frankfurt)** oder Amsterdam
- Hostname: `vps.foerderscan.de`

---

## Phase 2 – Server einrichten

### 2.1 – Einmaliges Setup per SSH

```bash
# Mit Server verbinden (IP aus hPanel)
ssh root@IHRE-SERVER-IP
```

Dann das Setup-Skript ausführen:

```bash
curl -fsSL https://raw.githubusercontent.com/foerder-scan/foerderscan-website/main/deploy/hostinger/setup-server.sh | bash
```

Das Skript installiert automatisch: Node.js 20, PM2, Nginx, Certbot, Git.

### 2.2 – Deploy-User anlegen (sicherer als root)

```bash
adduser deploy
usermod -aG sudo deploy

# SSH-Key für GitHub Actions
su - deploy
mkdir -p ~/.ssh
# Schlüssel eintragen (siehe Phase 5)
```

---

## Phase 3 – Domain einrichten

### Option A: Nur DNS zeigen (Domain bleibt bei All-Inkl)
**Empfohlen wenn Domainlaufzeit noch lang ist.**

Im **All-Inkl KAS** → Domain → DNS-Verwaltung → Alle Records löschen, dann:

```
# A-Record auf Hostinger VPS
@       A     IHRE-VPS-IP      TTL 300
www     A     IHRE-VPS-IP      TTL 300

# E-Mail (Hostinger Business Email)
@       MX    10  mx1.hostinger.com   TTL 3600
@       MX    20  mx2.hostinger.com   TTL 3600

# SPF
@       TXT   "v=spf1 include:_spf.hostinger.com ~all"

# DKIM (Wert aus hPanel → Email → DNS Records kopieren)
default._domainkey  TXT  "v=DKIM1; k=rsa; p=..."

# DMARC
_dmarc  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@foerderscan.de"
```

### Option B: Domain zu Hostinger transferieren
1. Bei All-Inkl: Domain entsperren → Auth-Code anfordern
2. Bei Hostinger: Domain Transfer → Auth-Code eingeben
3. Bestätigungs-E-Mail annehmen
4. Dauer: ~5–7 Werktage

---

## Phase 4 – E-Mail einrichten

### 4.1 – Postfächer in hPanel anlegen

hPanel → **Email** → **Email Accounts** → Create:

```
info@foerderscan.de        (allgemein)
tobias@foerderscan.de      (Tobias Feuerbach)
kontakt@foerderscan.de     (Kontaktformular)
noreply@foerderscan.de     (Transaktionsmails via Resend)
support@foerderscan.de     (Kunden-Support)
```

> **Transaktionsmails** (Willkommen, Passwort-Reset, Stripe-Receipts)
> laufen weiterhin über **Resend** — das ändert sich nicht.

### 4.2 – Bestehende All-Inkl E-Mails exportieren

**Vor dem DNS-Wechsel!**

```bash
# Mit Thunderbird oder Outlook:
# 1. Alle Ordner per IMAP mit All-Inkl verbinden
# 2. Alle E-Mails in lokale Ordner kopieren
# 3. Nach Hostinger-Einrichtung: rückkopieren

# Alternativ: imapsync (technisch)
imapsync \
  --host1 mail.all-inkl.com --user1 ihre@email.de --password1 ALT_PW \
  --host2 imap.hostinger.com --user2 ihre@email.de --password2 NEU_PW
```

### 4.3 – E-Mail-Clients konfigurieren

```
IMAP:  imap.hostinger.com   Port 993  SSL
SMTP:  smtp.hostinger.com   Port 465  SSL
```

---

## Phase 5 – GitHub Actions für Hostinger

### 5.1 – SSH-Schlüssel generieren (lokal auf Mac)

```bash
ssh-keygen -t ed25519 -C "foerderscan-hostinger" -f ~/.ssh/foerderscan_hostinger
# Kein Passphrase (Enter, Enter)

# Public key auf Server eintragen
ssh-copy-id -i ~/.ssh/foerderscan_hostinger.pub deploy@IHRE-VPS-IP

# Private key anzeigen (für GitHub Secret)
cat ~/.ssh/foerderscan_hostinger
```

### 5.2 – GitHub Secrets eintragen

GitHub → Repository → Settings → Secrets → Actions → New secret:

| Secret | Wert |
|--------|------|
| `SSH_HOST` | Hostinger VPS IP-Adresse |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | Inhalt von `~/.ssh/foerderscan_hostinger` |
| `SSH_PORT` | `22` |
| `DATABASE_URL` | Neon PostgreSQL URL (unverändert) |
| `NEXTAUTH_SECRET` | (unverändert) |
| `NEXTAUTH_URL` | `https://foerderscan.de` |
| `STRIPE_SECRET_KEY` | (unverändert) |
| `STRIPE_WEBHOOK_SECRET` | (unverändert) |
| `RESEND_API_KEY` | (unverändert) |

### 5.3 – Erster manueller Deploy

```bash
# Als deploy-User auf dem Server
cd /var/www/foerderscan
git clone https://github.com/foerder-scan/foerderscan-website.git .

# .env.production anlegen
nano foerderscan/.env.production
# (Alle Werte aus .env.example eintragen)

cd foerderscan
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
cp /var/www/foerderscan/deploy/hostinger/ecosystem.config.js .
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Ausgegebenen Befehl kopieren + als root ausführen
```

### 5.4 – SSL-Zertifikat

```bash
# Als root
certbot --nginx -d foerderscan.de -d www.foerderscan.de \
  --email tobias@foerderscan.de --agree-tos --non-interactive
```

---

## Phase 6 – Stripe Webhook anpassen

Im Stripe Dashboard → Developers → Webhooks:

1. Alten Webhook-Endpoint (Vercel-URL) **deaktivieren**
2. Neuen Endpoint hinzufügen:
   ```
   https://foerderscan.de/api/stripe/webhook
   ```
3. Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
4. **Neues Webhook-Secret** kopieren → `STRIPE_WEBHOOK_SECRET` in GitHub Secrets aktualisieren

---

## Phase 7 – Go-Live Checkliste

Führen Sie diese Checks in dieser Reihenfolge durch:

```
[ ] VPS läuft, SSH-Zugang funktioniert
[ ] Node.js App startet (pm2 status → online)
[ ] Nginx antwortet auf HTTP (curl http://IHRE-VPS-IP)
[ ] DNS-Records gesetzt (TTL abwarten: 5–60 Min bei TTL 300)
[ ] HTTPS funktioniert: https://foerderscan.de
[ ] Login funktioniert
[ ] Datenbank verbunden (Dashboard lädt Projekte)
[ ] E-Mail-Versand: Passwort-Reset testen
[ ] Stripe-Webhook: Test-Event über Dashboard schicken
[ ] GitHub Actions: git push → automatisches Deployment testen
[ ] E-Mail-Empfang: Test-Mail an info@foerderscan.de senden
[ ] Alte Vercel-Domain deaktivieren (nach 48h Stabilität)
```

---

## Kosten-Vergleich

| | Vorher | Nachher |
|-|--------|---------|
| App-Hosting | Vercel Free | Hostinger KVM 2: ~8 €/Mo |
| Datenbank | Neon Free | Neon Free (unverändert) |
| Domain | All-Inkl: ~15 €/Jahr | All-Inkl oder Hostinger ~10 €/Jahr |
| E-Mail | All-Inkl inklusive | Hostinger Business: ~1 €/Mo |
| SSL | Vercel (kostenlos) | Let's Encrypt (kostenlos) |
| **Gesamt** | **~0–5 €/Mo** | **~9–10 €/Mo** |

> **Wann lohnt sich der Umzug?** Sobald Vercel kostenpflichtig wird
> (bei Pro: ~20 $/Mo) ist Hostinger VPS günstiger und flexibler.
