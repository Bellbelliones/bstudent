import { Link } from "react-router-dom";
import { Recomendacao } from "../../types";
import EmptyState from "../EmptyState";
import "./style.css";

export default function RecommendationList({ items }: { items: Recomendacao[] }) {
  if (!items.length) {
    return <EmptyState title="Sem recomendações por agora" text="Indique o seu nível, país e áreas de interesse para receber sugestões." />;
  }
  return (
    <ul className="recs">
      {items.map((r) => (
        <li key={r.tipo + r.item.id}>
          <span className="recs__score" aria-label={`Compatibilidade ${r.pontuacao} por cento`}>{r.pontuacao}%</span>
          <div>
            <Link to={r.tipo === "bolsa" ? `/bolsas/${r.item.id}` : `/mentorias/${r.item.id}`}>{r.item.titulo}</Link>
            <small>{r.tipo === "bolsa" ? "Bolsa" : "Mentoria"}{r.item.categoria_nome ? ` de ${r.item.categoria_nome}` : ""}</small>
          </div>
        </li>
      ))}
    </ul>
  );
}
