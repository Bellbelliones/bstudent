import Loader from "../../components/Loader";
import MentorshipCard from "../../components/MentorshipCard";
import MentorshipForm from "../../components/MentorshipForm";
import EmptyState from "../../components/EmptyState";
import { useFetch } from "../../hooks/useFetch";
import { Categoria, Mentoria } from "../../types";
import MentorshipEnrollments from "../../components/MentorshipEnrollments";
import "./style.css";

export default function MentorArea() {
  const mine = useFetch<Mentoria[]>("/mentor/mentorships");
  const cats = useFetch<Categoria[]>("/categories");
  return (
    <div className="container page mentor">
      <section>
        <div className="page__head"><h1>As minhas mentorias</h1></div>
        {mine.loading && <Loader />}
        {mine.data && !mine.data.length && <EmptyState title="Ainda não publicou mentorias" text="Use o formulário para criar a primeira." />}
        <div className="mentor__list">
          {mine.data?.map((m) => (
            <div key={m.id}>
              <MentorshipCard mentoria={m} />
              <p className="mentor__stats">
                <strong>{m.ativas ?? 0}</strong> ativas · <strong>{m.pendentes ?? 0}</strong> pendentes · {m.total_contratacoes ?? 0} no total
              </p>
              <MentorshipEnrollments mentoriaId={m.id} titulo={m.titulo} total={m.total_contratacoes ?? 0} />
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Nova mentoria</h2>
        <MentorshipForm categorias={cats.data ?? []} onCreated={mine.reload} />
      </section>
    </div>
  );
}
