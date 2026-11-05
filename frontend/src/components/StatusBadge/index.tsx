import "./style.css";

const MAP: Record<string, [string, "ok" | "warn" | "bad" | "neutral"]> = {
  rascunho: ["Rascunho", "neutral"], submetida: ["Submetida", "warn"], em_analise: ["Em análise", "warn"],
  aprovada: ["Aprovada", "ok"], rejeitada: ["Rejeitada", "bad"],
  pendente: ["Pagamento pendente", "warn"], aprovado: ["Pago", "ok"], falhado: ["Pagamento falhou", "bad"],
  cancelado: ["Cancelado", "bad"], reembolsado: ["Reembolsado", "neutral"], ativa: ["Ativa", "ok"], cancelada: ["Cancelada", "bad"],
  ativo: ["Ativo", "ok"], suspenso: ["Suspenso", "bad"],
};

export default function StatusBadge({ estado }: { estado: string }) {
  const [label, tone] = MAP[estado] ?? [estado, "neutral"];
  return <span className={`status status--${tone}`}>{label}</span>;
}
