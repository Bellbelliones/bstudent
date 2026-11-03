import fs from "fs";
import path from "path";
import { pool } from "../config/db";

async function main() {
  const dir = path.resolve(__dirname, "../../../database/migrations");
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (nome TEXT PRIMARY KEY, aplicada_em TIMESTAMPTZ DEFAULT now())");
  const done = new Set((await pool.query("SELECT nome FROM schema_migrations")).rows.map((r) => r.nome));
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(file)) continue;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(fs.readFileSync(path.join(dir, file), "utf8"));
      await client.query("INSERT INTO schema_migrations (nome) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log("Aplicada:", file);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
