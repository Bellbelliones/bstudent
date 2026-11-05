import { query } from "../config/db";
import { HttpError } from "../middlewares/error";

export async function adminList(f: { q?: string; role?: string }) {
  const where: string[] = [];
  const p: unknown[] = [];
  if (f.q) { p.push(`%${f.q}%`); where.push(`(nome ILIKE $${p.length} OR email ILIKE $${p.length})`); }
  if (f.role) { p.push(f.role); where.push(`role = $${p.length}`); }
  const sql = `SELECT id, nome, email, telefone, role, estado, criado_em
               FROM utilizador
               ${where.length ? "WHERE " + where.join(" AND ") : ""}
               ORDER BY criado_em DESC LIMIT 200`;
  return (await query(sql, p)).rows;
}

export async function adminSetEstado(adminId: string, id: string, estado: "ativo" | "suspenso") {
  if (adminId === id) throw new HttpError(400, "Não pode alterar o seu próprio estado.");
  const r = await query("UPDATE utilizador SET estado=$2 WHERE id=$1 RETURNING id, estado", [id, estado]);
  if (!r.rowCount) throw new HttpError(404, "Utilizador não encontrado.");
  return r.rows[0];
}