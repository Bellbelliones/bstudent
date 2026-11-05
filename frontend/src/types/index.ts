export type Role = "candidato" | "mentor" | "administrador";

export interface User {
  id: string; nome: string; email: string; telefone?: string | null; role: Role;
  perfil?: {
    id: string; nivel_academico?: string | null; instituicao?: string | null;
    area_formacao?: string | null; pais_preferido?: string | null; especialidade?: string | null;
  } | null;
  interesses?: { categoria_id: string; peso: number }[];
}
export interface Categoria { id: string; nome: string; descricao?: string | null }
export interface Bolsa {
  id: string; titulo: string; descricao: string; pais: string | null; nivel_academico: string | null;
  data_limite: string; estado: string; categoria_id: string | null; categoria_nome: string | null;
}
export interface Mentoria {
  id: string; titulo: string; descricao: string; preco: number; modalidade: string; estado: string;
  categoria_id: string | null; categoria_nome: string | null; mentor_nome: string;
}
export interface Candidatura { id: string; bolsa_id: string; bolsa_titulo: string; data_candidatura: string; estado: string }
export interface Contratacao {
  id: string; mentoria_id: string; titulo: string; preco: number; estado: string;
  candidatura_id: string | null; pagamento_estado: string | null; referencia_gateway: string | null;
}
export interface Pagamento { id: string; valor: number; estado: string; referencia_gateway: string }
export interface Recomendacao { tipo: "bolsa" | "mentoria"; pontuacao: number; item: Bolsa & Mentoria }
export interface CandidaturaAdmin { id: string; estado: string; data_candidatura: string; candidato_nome: string; bolsa_titulo: string }
export interface UtilizadorAdmin {
  id: string; nome: string; email: string; telefone: string | null;
  role: Role; estado: "ativo" | "suspenso"; criado_em: string;
}