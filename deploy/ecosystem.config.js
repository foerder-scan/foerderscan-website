// PM2 ecosystem config for All-Inkl root server
// Place at: /var/www/foerderscan/foerderscan/ecosystem.config.js
// Start with: pm2 start ecosystem.config.js
// Save process list: pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: "foerderscan",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/foerderscan/foerderscan",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: "/var/www/foerderscan/.env.production",
      error_file: "/var/log/pm2/foerderscan-error.log",
      out_file: "/var/log/pm2/foerderscan-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Graceful reload
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
