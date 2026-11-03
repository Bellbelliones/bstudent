import { FormEvent, useState } from "react";
import { api } from "../../services/api";
import { Categoria } from "../../types";
import { NIVEIS } from "../../utils/format";
import Button from "../Button";
import FormField from "../FormField";

export default function ScholarshipForm({ categorias, onCreated }: { categorias: Categoria[]; onCreated: () => void }) {
  const empty = { titulo: "", descricao: "", pais: "", nivel_academico: "", categoria_id: "", data_limite: "" };
  const [f, setF] = useState(empty);
  const [error, setError] = useState("");
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const body = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ""));
    try { await api("/admin/scholarships", { method: "POST", body }); setF(empty); onCreated(); }
    catch (err) { setError((err as Error).message); }
  }

  return (
    <form onSubmit={submit}>
      {error && <p className="form-error" role="alert">{error}</p>}
      <FormField label="Título"><input value={f.titulo} onChange={set("titulo")} required /></FormField>
      <FormField label="Descrição"><textarea value={f.descricao} onChange={set("descricao")} required /></FormField>
      <FormField label="País"><input value={f.pais} onChange={set("pais")} /></FormField>
      <FormField label="Nível académico">
        <select value={f.nivel_academico} onChange={set("nivel_academico")}><option value="">Qualquer</option>{NIVEIS.map((n) => <option key={n}>{n}</option>)}</select>
      </FormField>
      <FormField label="Categoria">
        <select value={f.categoria_id} onChange={set("categoria_id")}><option value="">Sem categoria</option>{categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
      </FormField>
      <FormField label="Data limite"><input type="date" value={f.data_limite} onChange={set("data_limite")} required /></FormField>
      <Button type="submit">Publicar bolsa</Button>
    </form>
  );
}
