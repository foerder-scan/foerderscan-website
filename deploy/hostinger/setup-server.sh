#!/bin/bash
# FörderScan – Hostinger VPS Setup-Skript
# Ausführen als root auf Ubuntu 22.04
# curl -fsSL https://raw.githubusercontent.com/foerder-scan/foerderscan-website/main/deploy/hostinger/setup-server.sh | bash

set -e

echo "================================================"
echo "  FörderScan – Server Setup (Ubuntu 22.04)"
echo "================================================"

# ── System Update ──────────────────────────────────────
echo "[1/8] System-Update..."
apt-get update -q && apt-get upgrade -y -q

# ── Node.js 20 ─────────────────────────────────────────
echo "[2/8] Node.js 20 installieren..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"

# ── PM2 ────────────────────────────────────────────────
echo "[3/8] PM2 installieren..."
npm install -g pm2
echo "  PM2: $(pm2 -v)"

# ── Nginx ──────────────────────────────────────────────
echo "[4/8] Nginx installieren..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
echo "  Nginx: $(nginx -v 2>&1)"

# ── Certbot ────────────────────────────────────────────
echo "[5/8] Certbot (Let's Encrypt) installieren..."
apt-get install -y certbot python3-certbot-nginx
echo "  Certbot: $(certbot --version)"

# ── Git ────────────────────────────────────────────────
echo "[6/8] Git installieren..."
apt-get install -y git
echo "  Git: $(git --version)"

# ── Firewall ───────────────────────────────────────────
echo "[7/8] UFW Firewall einrichten..."
apt-get install -y ufw
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
echo "  Firewall aktiv"

# ── Deploy-User ────────────────────────────────────────
echo "[8/8] Deploy-User einrichten..."
if ! id "deploy" &>/dev/null; then
  adduser --disabled-password --gecos "" deploy
  usermod -aG sudo deploy
  echo "  User 'deploy' erstellt"
else
  echo "  User 'deploy' existiert bereits"
fi

# SSH-Ordner für deploy-User
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# Verzeichnis vorbereiten
mkdir -p /var/www/foerderscan
chown deploy:deploy /var/www/foerderscan

# Log-Verzeichnis für PM2
mkdir -p /var/log/pm2
chown deploy:deploy /var/log/pm2

# ── Nginx Konfiguration ────────────────────────────────
echo "Nginx Konfiguration einrichten..."
cat > /etc/nginx/sites-available/foerderscan << 'NGINX'
# Temporär HTTP — wird nach certbot auf HTTPS umgestellt
server {
    listen 80;
    listen [::]:80;
    server_name foerderscan.de www.foerderscan.de;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Default-Seite deaktivieren
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/foerderscan /etc/nginx/sites-enabled/

nginx -t && systemctl reload nginx

# ── Fertig ─────────────────────────────────────────────
echo ""
echo "================================================"
echo "  Setup abgeschlossen!"
echo "================================================"
echo ""
echo "Nächste Schritte:"
echo "  1. SSH-Key für GitHub Actions in authorized_keys eintragen:"
echo "     nano /home/deploy/.ssh/authorized_keys"
echo ""
echo "  2. Als deploy-User Repo klonen:"
echo "     su - deploy"
echo "     cd /var/www/foerderscan"
echo "     git clone https://github.com/foerder-scan/foerderscan-website.git ."
echo ""
echo "  3. .env.production erstellen:"
echo "     nano /var/www/foerderscan/foerderscan/.env.production"
echo ""
echo "  4. App deployen:"
echo "     cd /var/www/foerderscan/foerderscan"
echo "     npm ci && npx prisma generate && npx prisma migrate deploy && npm run build"
echo "     pm2 start ecosystem.config.js && pm2 save"
echo ""
echo "  5. SSL einrichten (nach DNS-Propagation):"
echo "     certbot --nginx -d foerderscan.de -d www.foerderscan.de"
echo ""
