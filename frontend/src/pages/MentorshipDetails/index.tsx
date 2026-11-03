import { useParams, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Mentoria } from "../../types";
import { formatMoney, modalidadeLabel } from "../../utils/format";
import "./style.css";

export default function MentorshipDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const candidatura = params.get("candidatura");
  const { user } = useAuth();
  const { data: m, loading, error } = useFetch<Mentoria>(`/mentorships/${id}`);

  if (loading) return <div className="container page"><Loader /></div>;
  if (error || !m) return <div className="container page"><p className="form-error">{error ?? "Mentoria não encontrada."}</p></div>;

  return (
    <div className="container page md">
      <article>
        <p className="md__cat">{m.categoria_nome}</p>
        <h1>{m.titulo}</h1>
        <p className="md__desc">{m.descricao}</p>
      </article>
      <aside className="panel md__side">
        <p className="md__price">{formatMoney(m.preco)}</p>
        <dl>
          <dt>Mentor</dt><dd>{m.mentor_nome}</dd>
          <dt>Modalidade</dt><dd>{modalidadeLabel(m.modalidade)}</dd>
        </dl>
        {user?.role === "candidato" && <Button to={`/checkout/${m.id}${candidatura ? `?candidatura=${candidatura}` : ""}`}>Contratar mentoria</Button>}
        {!user && <Button to="/entrar">Entrar para contratar</Button>}
        <p className="muted md__note">O pagamento só é pedido no passo seguinte. A sua candidatura não depende dele.</p>
      </aside>
    </div>
  );
}
