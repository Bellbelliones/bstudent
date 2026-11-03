import { Link } from "react-router-dom";
import { Candidatura } from "../../types";
import { formatDate } from "../../utils/format";
import EmptyState from "../EmptyState";
import StatusBadge from "../StatusBadge";
import "./style.css";

export default function ApplicationList({ items }: { items: Candidatura[] }) {
  if (!items.length) {
    return <EmptyState title="Ainda não se candidatou" text="Escolha uma bolsa aberta e submeta a sua candidatura."><Link to="/bolsas">Ver bolsas abertas</Link></EmptyState>;
  }
  return (
    <ul className="rows">
      {items.map((a) => (
        <li key={a.id}>
          <div><Link to={`/bolsas/${a.bolsa_id}`}>{a.bolsa_titulo}</Link><small>Enviada em {formatDate(a.data_candidatura)}</small></div>
          <StatusBadge estado={a.estado} />
        </li>
      ))}
    </ul>
  );
}
