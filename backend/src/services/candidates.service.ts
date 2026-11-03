import { query, withTransaction } from "../config/db";
import { HttpError } from "../middlewares/error";
import { logInteraction } from "./history.service";

export async function getCandidatoId(userId: string) {
  const r = await query("SELECT id FROM candidato WHERE utilizador_id=$1", [userId]);
  if (!r.rowCount) throw new HttpError(403, "Apenas candidatos podem realizar esta ação.");
  return r.rows[0].id as string;
}

export async function getMe(userId: string, role: string) {
  const u = (await query("SELECT id,nome,email,telefone,role FROM utilizador WHERE id=$1", [userId])).rows[0];
  if (!u) throw new HttpError(404, "Utilizador não encontrado.");
  let perfil = null;
  let interesses: unknown[] = [];
  if (role === "candidato") {
    perfil = (
      await query(
        `SELECT c.*, p.pais_preferido FROM candidato c
         LEFT JOIN perfil_interesse p ON p.candidato_id = c.id WHERE c.utilizador_id=$1`,
        [userId]
      )
    ).rows[0];
    interesses = (await query("SELECT categoria_id, peso FROM interesse_categoria WHERE candidato_id=$1", [perfil.id])).rows;
  } else if (role === "mentor") {
    perfil = (await query("SELECT * FROM mentor WHERE utilizador_id=$1", [userId])).rows[0];
  }
  return { ...u, perfil, interesses };
}

export async function updateProfile(
  userId: string,
  d: { nivel_academico?: string; instituicao?: string; area_formacao?: string }
) {
  const r = await query(
    `UPDATE candidato SET
       nivel_academico = COALESCE($2, nivel_academico),
       instituicao = COALESCE($3, instituicao),
       area_formacao = COALESCE($4, area_formacao)
     WHERE utilizador_id=$1 RETURNING *`,
    [userId, d.nivel_academico ?? null, d.instituicao ?? null, d.area_formacao ?? null]
  );
  return r.rows[0];
}

export async function updateInterests(
  userId: string,
  d: { nivel_academico?: string; pais_preferido?: string; categorias: { categoria_id: string; peso: number }[] }
) {
  const cid = await getCandidatoId(userId);
  await withTransaction(async (c) => {
    await c.query(
      `INSERT INTO perfil_interesse (candidato_id, nivel_academico, pais_preferido) VALUES ($1,$2,$3)
       ON CONFLICT (candidato_id) DO UPDATE SET nivel_academico=EXCLUDED.nivel_academico, pais_preferido=EXCLUDED.pais_preferido`,
      [cid, d.nivel_academico ?? null, d.pais_preferido ?? null]
    );
    await c.query("DELETE FROM interesse_categoria WHERE candidato_id=$1", [cid]);
    for (const cat of d.categorias) {
      await c.query("INSERT INTO interesse_categoria (candidato_id, categoria_id, peso) VALUES ($1,$2,$3)", [
        cid, cat.categoria_id, cat.peso,
      ]);
    }
  });
}

export async function recordInteraction(userId: string, tipo: string, descricao: string, referenciaId?: string) {
  const cid = await getCandidatoId(userId);
  await logInteraction(cid, tipo, descricao, referenciaId ?? null);
}
