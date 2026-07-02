const path = require("path");
const { Pool } = require("pg");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const isSupabaseHost = (host = "") =>
  host.includes("supabase.com") || host.includes("pooler.supabase.com");

const shouldUseSsl = () => {
  if (process.env.DB_SSL) {
    return process.env.DB_SSL.toLowerCase() === "true";
  }

  if (process.env.PGSSLMODE) {
    return process.env.PGSSLMODE.toLowerCase() !== "disable";
  }

  return isSupabaseHost(process.env.db_host) || isSupabaseHost(process.env.DATABASE_URL);
};

const databaseUrl = process.env.DATABASE_URL;
const hasUsableDatabaseUrl =
  databaseUrl && !databaseUrl.includes("YOUR_SUPABASE_DB_PASSWORD");

const config = hasUsableDatabaseUrl
  ? { connectionString: databaseUrl }
  : {
      user: process.env.db_user,
      host: process.env.db_host,
      database: process.env.db_database,
      password: process.env.db_password,
      port: Number(process.env.db_port || 5432),
    };

if (shouldUseSsl()) {
  config.ssl = { rejectUnauthorized: false };
}

module.exports = new Pool(config);
