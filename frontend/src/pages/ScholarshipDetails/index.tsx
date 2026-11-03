import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import DeadlineTag from "../../components/DeadlineTag";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { Bolsa } from "../../types";
import { formatDate } from "../../utils/format";
import "./style.css";

export default function ScholarshipDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: b, loading, error } = useFetch<Bolsa>(`/scholarships/${id}`);

  useEffect(() => {
    if (b && user?.role === "candidato") {
      api("/candidates/me/interactions", { method: "POST", body: { tipo: "visualizacao", descricao: `Viu ${b.titulo}`, referencia_id: b.id } }).catch(() => {});
    }
  }, [b?.id, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="container page"><Loader /></div>;
  if (error || !b) return <div className="container page"><p className="form-error">{error ?? "Bolsa não encontrada."}</p></div>;

  return (
    <div className="container page sd">
      <article>
        <p className="sd__cat">{b.categoria_nome}</p>
        <h1>{b.titulo}</h1>
        <p className="sd__desc">{b.descricao}</p>
      </article>
      <aside className="panel sd__side">
        <dl>
          <dt>Prazo</dt><dd>{formatDate(b.data_limite)} <DeadlineTag date={b.data_limite} /></dd>
          {b.pais && <><dt>País</dt><dd>{b.pais}</dd></>}
          {b.nivel_academico && <><dt>Nível académico</dt><dd>{b.nivel_academico}</dd></>}
        </dl>
        {user?.role === "candidato" && <Button to={`/bolsas/${b.id}/candidatura`}>Candidatar-me</Button>}
        {!user && <Button to="/entrar">Entrar para me candidatar</Button>}
        <p className="muted sd__note">A candidatura é gratuita.</p>
      </aside>
    </div>
  );
}
