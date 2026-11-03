import { FormEvent, useState } from "react";
import { api } from "../../services/api";
import { Categoria } from "../../types";
import { MODALIDADES } from "../../utils/format";
import Button from "../Button";
import FormField from "../FormField";

interface Props { categorias: Categoria[]; onCreated: () => void }

export default function MentorshipForm({ categorias, onCreated }: Props) {
  const [f, setF] = useState({ titulo: "", descricao: "", preco: "", modalidade: "online", categoria_id: "" });
  const [error, setError] = useState("");
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/mentor/mentorships", { method: "POST", body: { ...f, preco: Number(f.preco), categoria_id: f.categoria_id || undefined } });
      setF({ titulo: "", descricao: "", preco: "", modalidade: "online", categoria_id: "" });
      onCreated();
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <form onSubmit={submit}>
      {error && <p className="form-error" role="alert">{error}</p>}
      <FormField label="Título"><input value={f.titulo} onChange={set("titulo")} required /></FormField>
      <FormField label="Descrição"><textarea value={f.descricao} onChange={set("descricao")} required /></FormField>
      <FormField label="Preço"><input type="number" min="0" step="100" value={f.preco} onChange={set("preco")} required /></FormField>
      <FormField label="Modalidade">
        <select value={f.modalidade} onChange={set("modalidade")}>{MODALIDADES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
      </FormField>
      <FormField label="Categoria">
        <select value={f.categoria_id} onChange={set("categoria_id")}>
          <option value="">Sem categoria</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </FormField>
      <Button type="submit">Publicar mentoria</Button>
    </form>
  );
}
