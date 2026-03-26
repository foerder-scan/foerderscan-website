# FörderScan → OVHcloud VPS Migration

## Warum OVHcloud VPS-2?

| Merkmal | Wert |
|---------|------|
| vCores | 2 |
| RAM | 4 GB |
| SSD | 80 GB NVMe |
| Bandbreite | 250 Mbit/s |
| Preis | ~4–6 €/Mo |
| Standort | Frankfurt / Straßburg (DSGVO ✅) |
| Root-Zugriff | Ja |
| OS | Ubuntu 22.04 LTS |

> Das Setup ist **identisch** mit dem Hostinger-VPS-Setup.
> Alle Skripte, Nginx- und PM2-Configs aus `deploy/hostinger/` funktionieren 1:1.

---

## Phase 1 – VPS bei OVHcloud bestellen

1. [order.eu.ovhcloud.com](https://order.eu.ovhcloud.com/) → **VPS** → **VPS-2**
2. OS: **Ubuntu 22.04** auswählen
3. Rechenzentrum: **Frankfurt (DE)** (beste Latenz + DSGVO)
4. SSH-Key bei Bestellung hinterlegen (empfohlen) oder Root-Passwort per E-Mail

Nach ~2–5 Minuten: VPS-IP im OVHcloud Manager unter **VPS → Überblick**.

---

## Phase 2 – Server einrichten (ein Befehl)

```bash
# SSH-Verbindung
ssh root@IHRE-OVH-VPS-IP

# Setup-Skript ausführen (identisch mit Hostinger)
curl -fsSL https://raw.githubusercontent.com/foerder-scan/foerderscan-website/main/deploy/hostinger/setup-server.sh | bash
```

Das Skript installiert: Node.js 20, PM2, Nginx, Certbot, UFW Firewall, deploy-User.

---

## Phase 3 – SSH-Key für GitHub Actions

```bash
# Lokal auf dem Mac
ssh-keygen -t ed25519 -C "foerderscan-ovh" -f ~/.ssh/foerderscan_ovh

# Public Key auf Server eintragen
ssh-copy-id -i ~/.ssh/foerderscan_ovh.pub deploy@IHRE-OVH-VPS-IP

# Privaten Key anzeigen → als GitHub Secret SSH_PRIVATE_KEY hinterlegen
cat ~/.ssh/foerderscan_ovh
```

### GitHub Secrets eintragen

GitHub → Repository → Settings → Secrets → Actions:

| Secret | Wert |
|--------|------|
| `SSH_HOST` | OVHcloud VPS IP |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | Inhalt von `~/.ssh/foerderscan_ovh` |
| `SSH_PORT` | `22` |
| `DATABASE_URL` | Neon URL (unverändert) |
| `NEXTAUTH_SECRET` | (unverändert) |
| `NEXTAUTH_URL` | `https://foerderscan.de` |
| `STRIPE_SECRET_KEY` | (unverändert) |
| `STRIPE_WEBHOOK_SECRET` | (unverändert) |
| `RESEND_API_KEY` | (unverändert) |

---

## Phase 4 – App deployen

```bash
su - deploy
cd /var/www/foerderscan

# Repo klonen
git clone https://github.com/foerder-scan/foerderscan-website.git .

# Env-Datei anlegen (Vorlage: deploy/hostinger/env.production.example)
nano foerderscan/.env.production

# Build + Start
cd foerderscan
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
cp /var/www/foerderscan/deploy/hostinger/ecosystem.config.js .
pm2 start ecosystem.config.js
pm2 save

# PM2 beim Neustart starten (als root ausführen!)
pm2 startup
# → ausgegebenen Befehl als root kopieren + ausführen
```

---

## Phase 5 – Nginx + SSL

```bash
# Nginx-Config deployen (als root)
cp /var/www/foerderscan/deploy/hostinger/nginx.conf \
   /etc/nginx/sites-available/foerderscan
ln -sf /etc/nginx/sites-available/foerderscan /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL-Zertifikat (nach DNS-Propagation!)
certbot --nginx -d foerderscan.de -d www.foerderscan.de \
  --email tobias@foerderscan.de --agree-tos --non-interactive
```

---

## Phase 6 – Domain auf OVH-VPS zeigen

Im **All-Inkl KAS** → Domain → DNS-Verwaltung:

```
# App
@     A    IHRE-OVH-VPS-IP   TTL 300
www   A    IHRE-OVH-VPS-IP   TTL 300

# E-Mail bleibt bei All-Inkl (oder Hostinger Business Email)
@     MX   10  mail.all-inkl.com
```

> **E-Mail-Optionen:**
> - **All-Inkl behalten**: MX-Records unverändert lassen — funktioniert
> - **Zu Hostinger Business Email**: MX auf `mx1.hostinger.com` umstellen

---

## OVHcloud-spezifische Hinweise

### Firewall (OVHcloud Network Firewall)

Im OVHcloud Manager → VPS → Netzwerk → **OVHcloud Firewall** aktivieren:

```
Regel 1: TCP Port 22   → erlauben (SSH)
Regel 2: TCP Port 80   → erlauben (HTTP)
Regel 3: TCP Port 443  → erlauben (HTTPS)
Rest:                  → verweigern
```

> UFW auf dem Server läuft zusätzlich als zweite Schutzschicht.

### Snapshots (Backup)

OVHcloud Manager → VPS → **Backup** → **Snapshot aktivieren** (~1 €/Mo):
- Manuellen Snapshot vor jedem größeren Deployment erstellen
- Automatische Snapshots: täglich, 7 Tage Aufbewahrung

### Monitoring

OVHcloud Manager → VPS → **Monitoring**: CPU, RAM, Netzwerk-Graphen eingebaut.

---

## Go-Live Checkliste

```
[ ] VPS läuft (OVHcloud Manager → online)
[ ] SSH-Verbindung funktioniert: ssh deploy@IHRE-IP
[ ] pm2 status → foerderscan online
[ ] HTTP erreichbar: curl http://IHRE-IP → Next.js antwortet
[ ] DNS gesetzt (5–60 Min warten bei TTL 300)
[ ] HTTPS: https://foerderscan.de lädt korrekt
[ ] SSL-Zertifikat gültig (grünes Schloss)
[ ] Login + Dashboard funktioniert
[ ] Stripe Webhook auf neue URL aktualisiert
[ ] Test-E-Mail via Passwort-Reset senden
[ ] git push → GitHub Actions Deploy läuft durch
[ ] OVHcloud Snapshot erstellen
```

---

## Kostenübersicht

| Service | Anbieter | Kosten |
|---------|----------|--------|
| VPS-2 | OVHcloud | ~5 €/Mo |
| Datenbank | Neon (unverändert) | 0 € |
| Domain | All-Inkl | ~1,25 €/Mo |
| E-Mail | All-Inkl (bleibt) | inklusive |
| SSL | Let's Encrypt | 0 € |
| **Gesamt** | | **~6–7 €/Mo** |
