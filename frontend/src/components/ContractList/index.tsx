import { Link } from "react-router-dom";
import { Contratacao } from "../../types";
import { formatMoney } from "../../utils/format";
import EmptyState from "../EmptyState";
import StatusBadge from "../StatusBadge";
import "../ApplicationList/style.css";

export default function ContractList({ items }: { items: Contratacao[] }) {
  if (!items.length) {
    return <EmptyState title="Sem mentorias contratadas" text="A mentoria é opcional. Pode contratá-la quando fizer sentido para si."><Link to="/mentorias">Ver mentorias</Link></EmptyState>;
  }
  return (
    <ul className="rows">
      {items.map((c) => (
        <li key={c.id}>
          <div><Link to={`/mentorias/${c.mentoria_id}`}>{c.titulo}</Link><small>{formatMoney(c.preco)}</small></div>
          <StatusBadge estado={c.estado === "ativa" ? "ativa" : c.pagamento_estado ?? c.estado} />
        </li>
      ))}
    </ul>
  );
}
