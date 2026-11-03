import Loader from "../../components/Loader";
import MentorshipCard from "../../components/MentorshipCard";
import MentorshipForm from "../../components/MentorshipForm";
import EmptyState from "../../components/EmptyState";
import { useFetch } from "../../hooks/useFetch";
import { Categoria, Mentoria } from "../../types";
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
        <div className="mentor__list">{mine.data?.map((m) => <MentorshipCard key={m.id} mentoria={m} />)}</div>
      </section>
      <section className="panel">
        <h2>Nova mentoria</h2>
        <MentorshipForm categorias={cats.data ?? []} onCreated={mine.reload} />
      </section>
    </div>
  );
}
