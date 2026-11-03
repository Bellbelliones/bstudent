import { query } from "../config/db";
import { getCandidatoId } from "./candidates.service";

// Pesos iniciais (ajustáveis). A pontuação só ordena: requisitos formais filtram antes.
const W = { categoria: 40, nivel: 25, pais: 15, historico: 20 };

export async function forCandidate(userId: string) {
  const cid = await getCandidatoId(userId);
  const cand = (await query("SELECT * FROM candidato WHERE id=$1", [cid])).rows[0];
  const perfil = (
    await query(
      `INSERT INTO perfil_interesse (candidato_id) VALUES ($1)
       ON CONFLICT (candidato_id) DO UPDATE SET candidato_id = EXCLUDED.candidato_id RETURNING *`,
      [cid]
    )
  ).rows[0];

  const nivel = String(perfil.nivel_academico || cand.nivel_academico || "").toLowerCase();
  const pais = String(perfil.pais_preferido || "").toLowerCase();
  const area = String(cand.area_formacao || "").toLowerCase();
  const cats = new Set(
    (await query("SELECT categoria_id FROM interesse_categoria WHERE candidato_id=$1", [cid])).rows.map((r) => r.categoria_id)
  );
  const hist = new Set(
    (
      await query(
        `SELECT b.categoria_id FROM historico_interesse h JOIN bolsa b ON b.id = h.referencia_id WHERE h.candidato_id=$1
         UNION
         SELECT m.categoria_id FROM historico_interesse h JOIN mentoria m ON m.id = h.referencia_id WHERE h.candidato_id=$1`,
        [cid]
      )
    ).rows.map((r) => r.categoria_id)
  );

  const bolsas = (
    await query(
      `SELECT b.*, c.nome AS categoria_nome FROM bolsa b LEFT JOIN categoria c ON c.id = b.categoria_id
       WHERE b.estado='aberta' AND b.data_limite >= CURRENT_DATE
         AND NOT EXISTS (SELECT 1 FROM candidatura x WHERE x.bolsa_id = b.id AND x.candidato_id = $1)`,
      [cid]
    )
  ).rows;
  const mentorias = (
    await query(
      `SELECT m.*, c.nome AS categoria_nome, u.nome AS mentor_nome FROM mentoria m
       JOIN mentor mt ON mt.id = m.mentor_id JOIN utilizador u ON u.id = mt.utilizador_id
       LEFT JOIN categoria c ON c.id = m.categoria_id WHERE m.estado='ativa'`
    )
  ).rows;

  const scored: { tipo: "bolsa" | "mentoria"; pontuacao: number; item: any }[] = [];
  for (const b of bolsas) {
    const lvl = String(b.nivel_academico || "").toLowerCase();
    if (nivel && lvl && nivel !== lvl) continue; // requisito formal não cumprido: não recomendar
    let s = 0;
    if (cats.has(b.categoria_id)) s += W.categoria;
    if (nivel && lvl === nivel) s += W.nivel;
    if (pais && String(b.pais || "").toLowerCase() === pais) s += W.pais;
    if (hist.has(b.categoria_id)) s += W.historico;
    if (s > 0) scored.push({ tipo: "bolsa", pontuacao: s, item: b });
  }
  for (const m of mentorias) {
    let s = 0;
    if (cats.has(m.categoria_id)) s += W.categoria;
    if (area && `${m.titulo} ${m.descricao} ${m.categoria_nome ?? ""}`.toLowerCase().includes(area)) s += W.nivel;
    if (hist.has(m.categoria_id)) s += W.historico;
    if (s > 0) scored.push({ tipo: "mentoria", pontuacao: Math.round((s * 100) / 85), item: m });
  }

  const top = scored.sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 8);
  await query("DELETE FROM recomendacao WHERE perfil_id=$1 AND estado='sugerida'", [perfil.id]);
  for (const r of top) {
    await query(
      "INSERT INTO recomendacao (perfil_id, bolsa_id, mentoria_id, pontuacao, tipo) VALUES ($1,$2,$3,$4,$5)",
      [perfil.id, r.tipo === "bolsa" ? r.item.id : null, r.tipo === "mentoria" ? r.item.id : null, r.pontuacao, r.tipo]
    );
  }
  return top;
}
