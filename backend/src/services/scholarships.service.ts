import { query } from "../config/db";
import { HttpError } from "../middlewares/error";

const SELECT = `SELECT b.*, c.nome AS categoria_nome FROM bolsa b LEFT JOIN categoria c ON c.id = b.categoria_id`;

export async function list(f: { q?: string; categoria?: string; pais?: string; nivel?: string; limite?: number }) {
  const where = ["b.estado='aberta'", "b.data_limite >= CURRENT_DATE"];
  const p: unknown[] = [];
  if (f.q) { p.push(`%${f.q}%`); where.push(`(b.titulo ILIKE $${p.length} OR b.descricao ILIKE $${p.length})`); }
  if (f.categoria) { p.push(f.categoria); where.push(`b.categoria_id = $${p.length}`); }
  if (f.pais) { p.push(`%${f.pais}%`); where.push(`b.pais ILIKE $${p.length}`); }
  if (f.nivel) { p.push(f.nivel); where.push(`b.nivel_academico = $${p.length}`); }
  p.push(Math.min(f.limite ?? 50, 100));
  const r = await query(`${SELECT} WHERE ${where.join(" AND ")} ORDER BY b.data_limite ASC LIMIT $${p.length}`, p);
  return r.rows;
}

export async function getById(id: string) {
  const r = await query(`${SELECT} WHERE b.id=$1`, [id]);
  if (!r.rowCount) throw new HttpError(404, "Bolsa não encontrada.");
  return r.rows[0];
}

export async function create(userId: string, d: {
  titulo: string; descricao: string; pais?: string; nivel_academico?: string; categoria_id?: string; data_limite: string;
}) {
  const r = await query(
    `INSERT INTO bolsa (titulo,descricao,pais,nivel_academico,categoria_id,data_limite,criado_por)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [d.titulo, d.descricao, d.pais ?? null, d.nivel_academico ?? null, d.categoria_id ?? null, d.data_limite, userId]
  );
  return r.rows[0];
}

export async function categories() {
  return (await query("SELECT id, nome, descricao FROM categoria ORDER BY nome")).rows;
}
