import { Mentoria } from "../../types";
import { formatMoney, modalidadeLabel } from "../../utils/format";
import Button from "../Button";
import "./style.css";

interface Props { mentoria: Mentoria; candidaturaId?: string; onDismiss: () => void }

export default function SuggestedMentorship({ mentoria, candidaturaId, onDismiss }: Props) {
  const to = `/mentorias/${mentoria.id}${candidaturaId ? `?candidatura=${candidaturaId}` : ""}`;
  return (
    <aside className="suggest" aria-label="Mentoria sugerida">
      <p className="suggest__note">Sugestão opcional. Não altera a sua candidatura.</p>
      <h3>{mentoria.titulo}</h3>
      <p>{mentoria.descricao.length > 130 ? mentoria.descricao.slice(0, 130) + "…" : mentoria.descricao}</p>
      <p className="suggest__meta">{mentoria.mentor_nome} — {modalidadeLabel(mentoria.modalidade)} — <strong>{formatMoney(mentoria.preco)}</strong></p>
      <div className="suggest__actions">
        <Button to={to} size="sm">Ver mentoria</Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>Continuar sem mentoria</Button>
      </div>
    </aside>
  );
}
