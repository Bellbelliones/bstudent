import { Link } from "react-router-dom";
import { Mentoria } from "../../types";
import { formatMoney, modalidadeLabel } from "../../utils/format";
import "./style.css";

export default function MentorshipCard({ mentoria }: { mentoria: Mentoria }) {
  return (
    <article className="m-card">
      <h3><Link to={`/mentorias/${mentoria.id}`}>{mentoria.titulo}</Link></h3>
      <p>{mentoria.descricao.length > 110 ? mentoria.descricao.slice(0, 110) + "…" : mentoria.descricao}</p>
      <div className="m-card__foot">
        <span>
          <strong>{mentoria.mentor_nome}</strong>
          <small>{modalidadeLabel(mentoria.modalidade)}</small>
        </span>
        <span className="m-card__price">{formatMoney(mentoria.preco)}</span>
      </div>
    </article>
  );
}
