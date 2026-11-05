import { FormEvent, useState } from "react";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import FormField from "../../components/FormField";
import Loader from "../../components/Loader";
import ScholarshipCard from "../../components/ScholarshipCard";
import { useFetch } from "../../hooks/useFetch";
import { Bolsa, Categoria } from "../../types";
import { NIVEIS, PAISES } from "../../utils/format";
import "./style.css";

export default function Scholarships() {
  const [form, setForm] = useState({ q: "", categoria: "", pais: "", nivel: "" });
  const [applied, setApplied] = useState("");
  const { data: categorias } = useFetch<Categoria[]>("/categories");
  const { data, loading, error } = useFetch<Bolsa[]>(`/scholarships${applied}`);
  const set = (k: string) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  function apply(e: FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams(Object.entries(form).filter(([, v]) => v)).toString();
    setApplied(qs ? `?${qs}` : "");
  }

  return (
    <div className="container page">
      <div className="page__head"><h1>Bolsas abertas</h1><p>Ordenadas pelo prazo mais próximo.</p></div>
      <form className="filters panel" onSubmit={apply}>
        <FormField label="Pesquisar"><input value={form.q} onChange={set("q")} placeholder="Título ou palavra-chave" /></FormField>
        <FormField label="Categoria">
          <select value={form.categoria} onChange={set("categoria")}><option value="">Todas</option>{categorias?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
        </FormField>
        <FormField label="País">
          <select value={form.pais} onChange={set("pais")}><option value="">Todos</option>{PAISES.map((p) => <option key={p}>{p}</option>)}</select>
        </FormField>
        <FormField label="Nível">
          <select value={form.nivel} onChange={set("nivel")}><option value="">Todos</option>{NIVEIS.map((n) => <option key={n}>{n}</option>)}</select>
        </FormField>
        <Button type="submit">Aplicar filtros</Button>
      </form>
      {loading && <Loader />}
      {error && <p className="form-error">{error}</p>}
      {data && !data.length && <EmptyState title="Nenhuma bolsa encontrada" text="Experimente remover algum filtro ou pesquisar por outra palavra." />}
      <div className="grid">{data?.map((b) => <ScholarshipCard key={b.id} bolsa={b} />)}</div>
    </div>
  );
}
