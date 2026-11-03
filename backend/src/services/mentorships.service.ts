import { query } from "../config/db";
import { HttpError } from "../middlewares/error";

const SELECT = `
  SELECT m.*, c.nome AS categoria_nome, u.nome AS mentor_nome
  FROM mentoria m
  JOIN mentor mt ON mt.id = m.mentor_id
  JOIN utilizador u ON u.id = mt.utilizador_id
  LEFT JOIN categoria c ON c.id = m.categoria_id`;

export async function list(f: { q?: string; categoria?: string }) {
  const where = ["m.estado='ativa'"];
  const p: unknown[] = [];
  if (f.q) { p.push(`%${f.q}%`); where.push(`(m.titulo ILIKE $${p.length} OR m.descricao ILIKE $${p.length})`); }
  if (f.categoria) { p.push(f.categoria); where.push(`m.categoria_id = $${p.length}`); }
  return (await query(`${SELECT} WHERE ${where.join(" AND ")} ORDER BY m.criado_em DESC`, p)).rows;
}

export async function getById(id: string) {
  const r = await query(`${SELECT} WHERE m.id=$1`, [id]);
  if (!r.rowCount) throw new HttpError(404, "Mentoria não encontrada.");
  return r.rows[0];
}

export async function suggestedForScholarship(bolsaId: string) {
  const r = await query(
    `${SELECT} WHERE m.estado='ativa' AND m.categoria_id = (SELECT categoria_id FROM bolsa WHERE id=$1)
     ORDER BY m.preco ASC LIMIT 1`,
    [bolsaId]
  );
  return r.rows[0] ?? null;
}

async function mentorId(userId: string) {
  const r = await query("SELECT id FROM mentor WHERE utilizador_id=$1", [userId]);
  if (!r.rowCount) throw new HttpError(403, "Apenas mentores podem gerir mentorias.");
  return r.rows[0].id as string;
}

export async function create(userId: string, d: {
  titulo: string; descricao: string; preco: number; modalidade: string; categoria_id?: string;
}) {
  const mid = await mentorId(userId);
  const r = await query(
    `INSERT INTO mentoria (mentor_id,categoria_id,titulo,descricao,preco,modalidade)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [mid, d.categoria_id ?? null, d.titulo, d.descricao, d.preco, d.modalidade]
  );
  return r.rows[0];
}

export async function listMine(userId: string) {
  const mid = await mentorId(userId);
  return (await query(`${SELECT} WHERE m.mentor_id=$1 ORDER BY m.criado_em DESC`, [mid])).rows;
}
