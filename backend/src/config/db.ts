import { Pool, PoolClient, QueryResultRow, types } from "pg";
import { env } from "./env";

types.setTypeParser(1082, (v) => v); // DATE como texto AAAA-MM-DD
types.setTypeParser(1700, (v) => parseFloat(v)); // NUMERIC como número

export const pool = new Pool({ connectionString: env.databaseUrl });

export const query = <T extends QueryResultRow = any>(text: string, params: unknown[] = []) =>
  pool.query<T>(text, params);

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
