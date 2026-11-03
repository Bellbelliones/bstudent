import { FormEvent, useState } from "react";
import { api } from "../../services/api";
import { Categoria, User } from "../../types";
import { NIVEIS } from "../../utils/format";
import Button from "../Button";
import FormField from "../FormField";
import "./style.css";

interface Props { user: User; categorias: Categoria[]; onSaved: () => void }

export default function InterestsForm({ user, categorias, onSaved }: Props) {
  const p = user.perfil;
  const [nivel, setNivel] = useState(p?.nivel_academico ?? "");
  const [instituicao, setInstituicao] = useState(p?.instituicao ?? "");
  const [area, setArea] = useState(p?.area_formacao ?? "");
  const [pais, setPais] = useState(p?.pais_preferido ?? "");
  const [sel, setSel] = useState<Set<string>>(new Set(user.interesses?.map((i) => i.categoria_id)));
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      await api("/candidates/me", { method: "PATCH", body: { nivel_academico: nivel || undefined, instituicao: instituicao || undefined, area_formacao: area || undefined } });
      await api("/candidates/me/interests", {
        method: "PUT",
        body: { nivel_academico: nivel || undefined, pais_preferido: pais || undefined, categorias: [...sel].map((id) => ({ categoria_id: id, peso: 3 })) },
      });
      setMsg("Perfil guardado.");
      onSaved();
    } catch (err) { setMsg((err as Error).message); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="interests">
      <div className="interests__grid">
        <FormField label="Nível académico">
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="">Selecione</option>
            {NIVEIS.map((n) => <option key={n}>{n}</option>)}
          </select>
        </FormField>
        <FormField label="Instituição"><input value={instituicao} onChange={(e) => setInstituicao(e.target.value)} /></FormField>
        <FormField label="Área de formação"><input value={area} onChange={(e) => setArea(e.target.value)} /></FormField>
        <FormField label="País preferido para estudar"><input value={pais} onChange={(e) => setPais(e.target.value)} /></FormField>
      </div>
      <fieldset className="interests__cats">
        <legend>Áreas de interesse</legend>
        {categorias.map((c) => (
          <label key={c.id} className={sel.has(c.id) ? "on" : ""}>
            <input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} /> {c.nome}
          </label>
        ))}
      </fieldset>
      <Button type="submit" disabled={saving}>{saving ? "A guardar…" : "Guardar perfil"}</Button>
      {msg && <span className="interests__msg" role="status">{msg}</span>}
    </form>
  );
}
