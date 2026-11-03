import { randomUUID } from "crypto";
import { query, withTransaction } from "../config/db";
import { HttpError } from "../middlewares/error";
import { getCandidatoId } from "./candidates.service";
import { logInteraction } from "./history.service";

export async function create(userId: string, d: { mentoria_id: string; candidatura_id?: string | null }) {
  const cid = await getCandidatoId(userId);
  const m = (await query("SELECT id, titulo, preco FROM mentoria WHERE id=$1 AND estado='ativa'", [d.mentoria_id])).rows[0];
  if (!m) throw new HttpError(404, "Mentoria não encontrada ou inativa.");
  if (d.candidatura_id) {
    const ok = await query("SELECT 1 FROM candidatura WHERE id=$1 AND candidato_id=$2", [d.candidatura_id, cid]);
    if (!ok.rowCount) throw new HttpError(400, "Candidatura inválida.");
  }
  const ativa = await query(
    "SELECT 1 FROM contratacao_mentoria WHERE candidato_id=$1 AND mentoria_id=$2 AND estado='ativa'",
    [cid, m.id]
  );
  if (ativa.rowCount) throw new HttpError(409, "Já tem esta mentoria ativa.");

  return withTransaction(async (c) => {
    // nova tentativa: reutiliza a contratação pendente e cancela pagamentos pendentes antigos
    let contrato = (
      await c.query(
        "SELECT * FROM contratacao_mentoria WHERE candidato_id=$1 AND mentoria_id=$2 AND estado='pendente'",
        [cid, m.id]
      )
    ).rows[0];
    if (contrato) {
      await c.query("UPDATE pagamento SET estado='cancelado', atualizado_em=now() WHERE contratacao_id=$1 AND estado='pendente'", [contrato.id]);
    } else {
      try {
        contrato = (
          await c.query(
            "INSERT INTO contratacao_mentoria (candidato_id, mentoria_id, candidatura_id, estado) VALUES ($1,$2,$3,'pendente') RETURNING *",
            [cid, m.id, d.candidatura_id ?? null]
          )
        ).rows[0];
      } catch (e: any) {
        if (e.code === "23505") throw new HttpError(409, "Esta candidatura já tem uma mentoria associada.");
        throw e;
      }
    }
    const pagamento = (
      await c.query(
        "INSERT INTO pagamento (contratacao_id, valor, referencia_gateway) VALUES ($1,$2,$3) RETURNING *",
        [contrato.id, m.preco, `BS-${randomUUID()}`]
      )
    ).rows[0];
    return { contrato, pagamento };
  });
}

export async function listMine(userId: string) {
  const cid = await getCandidatoId(userId);
  return (
    await query(
      `SELECT cm.id, cm.estado, cm.mentoria_id, cm.candidatura_id, cm.data_contratacao,
              m.titulo, m.preco, p.estado AS pagamento_estado, p.referencia_gateway
       FROM contratacao_mentoria cm
       JOIN mentoria m ON m.id = cm.mentoria_id
       LEFT JOIN LATERAL (
         SELECT estado, referencia_gateway FROM pagamento WHERE contratacao_id = cm.id ORDER BY criado_em DESC LIMIT 1
       ) p ON true
       WHERE cm.candidato_id=$1 ORDER BY cm.data_contratacao DESC`,
      [cid]
    )
  ).rows;
}

/** Processa uma notificação do gateway. Idempotente: eventos repetidos não alteram um pagamento já resolvido. */
export async function processPaymentEvent(e: { referencia: string; estado: "aprovado" | "falhado" | "cancelado"; valor: number }) {
  return withTransaction(async (c) => {
    const p = (await c.query("SELECT * FROM pagamento WHERE referencia_gateway=$1 FOR UPDATE", [e.referencia])).rows[0];
    if (!p) throw new HttpError(404, "Pagamento desconhecido.");
    if (Number(p.valor) !== Number(e.valor)) throw new HttpError(400, "O valor não corresponde ao pagamento.");
    if (p.estado !== "pendente") return { idempotente: true };
    await c.query(
      `UPDATE pagamento SET estado=$2::varchar,
         data_pagamento = CASE WHEN $2::varchar='aprovado' THEN now() ELSE NULL END, atualizado_em=now()
       WHERE id=$1`,
      [p.id, e.estado]
    );
    if (e.estado === "aprovado") {
      const cm = (
        await c.query(
          `UPDATE contratacao_mentoria SET estado='ativa' WHERE id=$1 RETURNING candidato_id, mentoria_id`,
          [p.contratacao_id]
        )
      ).rows[0];
      await logInteraction(cm.candidato_id, "contratacao", "Contratou uma mentoria", cm.mentoria_id);
    }
    return { idempotente: false };
  });
}

export async function paymentOwnedBy(userId: string, referencia: string) {
  const cid = await getCandidatoId(userId);
  const r = await query(
    `SELECT p.valor FROM pagamento p JOIN contratacao_mentoria cm ON cm.id = p.contratacao_id
     WHERE p.referencia_gateway=$1 AND cm.candidato_id=$2`,
    [referencia, cid]
  );
  if (!r.rowCount) throw new HttpError(404, "Pagamento não encontrado.");
  return r.rows[0].valor as number;
}
