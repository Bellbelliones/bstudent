import { query } from "../config/db";

export const logInteraction = (
  candidatoId: string,
  tipo: string,
  descricao: string,
  referenciaId: string | null = null
) =>
  query(
    "INSERT INTO historico_interesse (candidato_id, tipo_interacao, descricao, referencia_id) VALUES ($1,$2,$3,$4)",
    [candidatoId, tipo, descricao, referenciaId]
  );
