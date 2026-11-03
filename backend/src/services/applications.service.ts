import { query } from "../config/db";
import { HttpError } from "../middlewares/error";
import { getCandidatoId } from "./candidates.service";
import { logInteraction } from "./history.service";

export async function submit(userId: string, bolsaId: string, documentos: unknown) {
  const cid = await getCandidatoId(userId);
  const b = (
    await query(
      "SELECT id, titulo FROM bolsa WHERE id=$1 AND estado='aberta' AND data_limite >= CURRENT_DATE",
      [bolsaId]
    )
  ).rows[0];
  if (!b) throw new HttpError(400, "Esta bolsa não existe ou já não está aberta a candidaturas.");
  try {
    const r = await query(
      "INSERT INTO candidatura (candidato_id, bolsa_id, estado, documentos) VALUES ($1,$2,'submetida',$3) RETURNING *",
      [cid, bolsaId, JSON.stringify(documentos)]
    );
    await logInteraction(cid, "candidatura", `Candidatura a ${b.titulo}`, bolsaId);
    return r.rows[0];
  } catch (e: any) {
    if (e.code === "23505") throw new HttpError(409, "Já se candidatou a esta bolsa.");
    throw e;
  }
}

export async function listMine(userId: string) {
  const cid = await getCandidatoId(userId);
  return (
    await query(
      `SELECT a.id, a.estado, a.data_candidatura, a.bolsa_id, b.titulo AS bolsa_titulo
       FROM candidatura a JOIN bolsa b ON b.id = a.bolsa_id
       WHERE a.candidato_id=$1 ORDER BY a.data_candidatura DESC`,
      [cid]
    )
  ).rows;
}

export async function adminList() {
  return (
    await query(
      `SELECT a.id, a.estado, a.data_candidatura, u.nome AS candidato_nome, b.titulo AS bolsa_titulo
       FROM candidatura a
       JOIN candidato c ON c.id = a.candidato_id
       JOIN utilizador u ON u.id = c.utilizador_id
       JOIN bolsa b ON b.id = a.bolsa_id
       ORDER BY a.data_candidatura DESC`
    )
  ).rows;
}

export async function adminSetEstado(id: string, estado: string) {
  const r = await query("UPDATE candidatura SET estado=$2 WHERE id=$1 RETURNING id, estado", [id, estado]);
  if (!r.rowCount) throw new HttpError(404, "Candidatura não encontrada.");
  return r.rows[0];
}
