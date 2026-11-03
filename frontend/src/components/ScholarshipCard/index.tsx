import { Link } from "react-router-dom";
import { Bolsa } from "../../types";
import { formatDate } from "../../utils/format";
import DeadlineTag from "../DeadlineTag";
import "./style.css";

export default function ScholarshipCard({ bolsa }: { bolsa: Bolsa }) {
  return (
    <article className="s-card">
      <div className="s-card__top">
        {bolsa.categoria_nome && <span className="s-card__cat">{bolsa.categoria_nome}</span>}
        <DeadlineTag date={bolsa.data_limite} />
      </div>
      <h3><Link to={`/bolsas/${bolsa.id}`}>{bolsa.titulo}</Link></h3>
      <p>{bolsa.descricao.length > 120 ? bolsa.descricao.slice(0, 120) + "…" : bolsa.descricao}</p>
      <dl className="s-card__meta">
        {bolsa.pais && <div><dt>País</dt><dd>{bolsa.pais}</dd></div>}
        {bolsa.nivel_academico && <div><dt>Nível</dt><dd>{bolsa.nivel_academico}</dd></div>}
        <div><dt>Prazo</dt><dd>{formatDate(bolsa.data_limite)}</dd></div>
      </dl>
    </article>
  );
}
