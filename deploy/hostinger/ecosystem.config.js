// PM2 Ecosystem – FörderScan auf Hostinger VPS
// Speichern unter: /var/www/foerderscan/foerderscan/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "foerderscan",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/foerderscan/foerderscan",

      // Cluster-Mode: nutzt alle CPU-Kerne (KVM 2 = 2 vCPU)
      instances: "max",
      exec_mode: "cluster",

      // Automatisch neu starten bei hohem Speicherverbrauch
      max_memory_restart: "400M",

      // Umgebungsvariablen aus Datei laden
      env_file: "/var/www/foerderscan/foerderscan/.env.production",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Graceful reload (kein Downtime bei Deployment)
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 15000,

      // Logs
      error_file: "/var/log/pm2/foerderscan-error.log",
      out_file:   "/var/log/pm2/foerderscan-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Automatischer Neustart
      autorestart: true,
      restart_delay: 1000,
      max_restarts: 10,

      watch: false,
    },
  ],
};
