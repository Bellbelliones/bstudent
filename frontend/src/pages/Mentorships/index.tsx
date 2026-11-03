import { FormEvent, useState } from "react";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import FormField from "../../components/FormField";
import Loader from "../../components/Loader";
import MentorshipCard from "../../components/MentorshipCard";
import { useFetch } from "../../hooks/useFetch";
import { Categoria, Mentoria } from "../../types";
import "./style.css";

export default function Mentorships() {
  const [form, setForm] = useState({ q: "", categoria: "" });
  const [applied, setApplied] = useState("");
  const { data: categorias } = useFetch<Categoria[]>("/categories");
  const { data, loading, error } = useFetch<Mentoria[]>(`/mentorships${applied}`);

  function apply(e: FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams(Object.entries(form).filter(([, v]) => v)).toString();
    setApplied(qs ? `?${qs}` : "");
  }

  return (
    <div className="container page">
      <div className="page__head"><h1>Mentorias</h1><p>Sessões com quem já passou por processos de candidatura. O preço aparece sempre antes de contratar.</p></div>
      <form className="m-filters panel" onSubmit={apply}>
        <FormField label="Pesquisar"><input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} /></FormField>
        <FormField label="Categoria">
          <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}><option value="">Todas</option>{categorias?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
        </FormField>
        <Button type="submit">Aplicar filtros</Button>
      </form>
      {loading && <Loader />}
      {error && <p className="form-error">{error}</p>}
      {data && !data.length && <EmptyState title="Nenhuma mentoria encontrada" text="Tente outra categoria ou pesquisa." />}
      <div className="grid">{data?.map((m) => <MentorshipCard key={m.id} mentoria={m} />)}</div>
    </div>
  );
}
