import { FormEvent, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { UtilizadorAdmin } from "../../types";
import { formatDate } from "../../utils/format";
import Button from "../Button";
import EmptyState from "../EmptyState";
import FormField from "../FormField";
import Loader from "../Loader";
import StatusBadge from "../StatusBadge";
import "../AdminApplications/style.css";

const ROLES = [["candidato", "Candidato"], ["mentor", "Mentor"], ["administrador", "Administrador"]];

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [form, setForm] = useState({ q: "", role: "" });
  const [applied, setApplied] = useState("");
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useFetch<UtilizadorAdmin[]>(`/admin/users${applied}`);

  function apply(e: FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams(Object.entries(form).filter(([, v]) => v)).toString();
    setApplied(qs ? `?${qs}` : "");
  }

  async function toggle(u: UtilizadorAdmin) {
    setActionError("");
    try {
      await api(`/admin/users/${u.id}`, { method: "PATCH", body: { estado: u.estado === "ativo" ? "suspenso" : "ativo" } });
      reload();
    } catch (e) { setActionError((e as Error).message); }
  }

  return (
    <div>
      <form className="panel" onSubmit={apply} style={{ display: "flex", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <FormField label="Pesquisar"><input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} placeholder="Nome ou email" /></FormField>
        <FormField label="Perfil">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="">Todos</option>
            {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </FormField>
        <Button type="submit">Filtrar</Button>
      </form>

      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      {loading && <Loader />}
      {error && <p className="form-error">{error}</p>}
      {data && !data.length && <EmptyState title="Nenhum utilizador encontrado" text="Tente outro filtro." />}
      {data && data.length > 0 && (
        <div className="admin-table">
          <table>
            <thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Registo</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td><td>{u.email}</td><td>{u.role}</td><td>{formatDate(u.criado_em)}</td>
                  <td><StatusBadge estado={u.estado} /></td>
                  <td>
                    {u.id !== me?.id && (
                      <Button size="sm" variant="ghost" onClick={() => toggle(u)}>
                        {u.estado === "ativo" ? "Suspender" : "Reativar"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}