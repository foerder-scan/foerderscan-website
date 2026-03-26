# FörderScan – All-Inkl Hosting Setup

## Strategie-Überblick

All-Inkl **Shared-Hosting** unterstützt kein Node.js → zwei Optionen:

| Option | Aufwand | Kosten | Empfehlung |
|--------|---------|--------|------------|
| **A) Vercel + All-Inkl Domain** | 15 Min | 0 € extra | ⭐ Empfohlen für den Start |
| **B) All-Inkl Root-Server (AS-Tarif)** | 2–3h | ~15–20 €/Monat | Für mehr Kontrolle |

---

## Option A: Vercel (App) + All-Inkl (Domain + E-Mail)

> **Empfohlen.** Next.js läuft auf Vercel, All-Inkl verwaltet nur Domain und E-Mail.

### Schritt 1 – Vercel-Deployment (bereits aktiv)
- App läuft auf `*.vercel.app`

### Schritt 2 – Domain bei All-Inkl auf Vercel zeigen lassen

Im **All-Inkl Admin-Panel (KAS)** unter **Domain → DNS-Verwaltung**:

```
# A-Record für Root-Domain
@    A      76.76.21.21

# CNAME für www
www  CNAME  cname.vercel-dns.com
```

### Schritt 3 – Custom Domain in Vercel hinzufügen

1. Vercel Dashboard → Ihr Projekt → Settings → Domains
2. `foerderscan.de` und `www.foerderscan.de` hinzufügen
3. Vercel stellt automatisch Let's-Encrypt-SSL aus

### Schritt 4 – E-Mail bleibt bei All-Inkl

MX-Records bei All-Inkl bleiben unverändert — E-Mail läuft weiterhin über All-Inkl.

```
# MX-Record (All-Inkl verwaltet, nicht ändern!)
@    MX    10    mail.all-inkl.com
```

### Ergebnis
- `foerderscan.de` → Vercel Next.js App
- `mail@foerderscan.de` → All-Inkl Postfach
- SSL → Let's Encrypt via Vercel (kostenlos, automatisch)
- CI/CD → Git push → Vercel deploy (automatisch)

---

## Option B: All-Inkl Root-Server (AS-Tarif)

> Nutzen Sie dies, wenn Sie maximale Kontrolle oder DSGVO-only-Germany-Hosting möchten.

### Voraussetzungen
- All-Inkl AS-Tarif (Root-Server) mit Ubuntu 22.04
- SSH-Zugang
- Domain zeigt auf Server-IP

### Server-Setup (einmalig)

```bash
# 1. Node.js 20 installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. PM2 global installieren
sudo npm install -g pm2

# 3. Nginx installieren
sudo apt-get install -y nginx

# 4. Certbot für SSL
sudo apt-get install -y certbot python3-certbot-nginx

# 5. PostgreSQL (oder Neon Cloud weiternutzen)
# Empfehlung: Neon PostgreSQL weiternutzen (serverless, schnell)
# Alternativ: sudo apt-get install -y postgresql postgresql-contrib

# 6. Projektordner anlegen
sudo mkdir -p /var/www/foerderscan
sudo chown $USER:$USER /var/www/foerderscan

# 7. Repo klonen
cd /var/www/foerderscan
git clone https://github.com/foerder-scan/foerderscan-website.git .

# 8. .env.production anlegen
cp foerderscan/.env.example foerderscan/.env.production
nano foerderscan/.env.production  # Alle Secrets eintragen

# 9. Dependencies + Build
cd foerderscan
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

# 10. PM2 starten
cp ../deploy/ecosystem.config.js .
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Befehl kopieren und ausführen

# 11. Nginx konfigurieren
sudo cp /var/www/foerderscan/deploy/nginx.conf /etc/nginx/sites-available/foerderscan
sudo ln -s /etc/nginx/sites-available/foerderscan /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 12. SSL-Zertifikat ausstellen
sudo certbot --nginx -d foerderscan.de -d www.foerderscan.de
```

### .env.production (Vorlage)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://foerderscan.de"
NEXT_PUBLIC_APP_URL="https://foerderscan.de"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
```

### GitHub Actions für automatisches Deployment

1. **GitHub Secrets** eintragen (Settings → Secrets → Actions):

   | Secret | Wert |
   |--------|------|
   | `SSH_HOST` | Server-IP |
   | `SSH_USER` | Ihr SSH-Username |
   | `SSH_PRIVATE_KEY` | Privater SSH-Schlüssel |
   | `SSH_PORT` | 22 (oder custom) |
   | `DATABASE_URL` | Neon/PostgreSQL URL |
   | `NEXTAUTH_SECRET` | Auth-Secret |
   | `NEXTAUTH_URL` | `https://foerderscan.de` |
   | `STRIPE_SECRET_KEY` | Stripe Live Key |
   | `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret |
   | `RESEND_API_KEY` | Resend API Key |

2. **SSH-Schlüssel generieren** (lokal):
   ```bash
   ssh-keygen -t ed25519 -C "foerderscan-deploy" -f ~/.ssh/foerderscan_deploy
   # Public key auf Server eintragen:
   ssh-copy-id -i ~/.ssh/foerderscan_deploy.pub user@server-ip
   # Privaten Key als GitHub Secret SSH_PRIVATE_KEY hinterlegen
   ```

3. Bei jedem `git push origin main` → GitHub Actions baut und deployt automatisch.

### Stripe Webhook-URL anpassen

Nach Domain-Wechsel im Stripe Dashboard:
```
https://foerderscan.de/api/stripe/webhook
```

---

## Wartung

```bash
# App-Status prüfen
pm2 status
pm2 logs foerderscan

# Nginx-Status
sudo systemctl status nginx

# SSL erneuern (automatisch via Certbot-Timer)
sudo certbot renew --dry-run

# DB-Migrations manuell
cd /var/www/foerderscan/foerderscan
npx prisma migrate deploy
```
