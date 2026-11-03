import { api } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import { CandidaturaAdmin } from "../../types";
import { formatDate } from "../../utils/format";
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import "./style.css";

const ESTADOS = [
  ["submetida", "Submetida"], ["em_analise", "Em análise"], ["aprovada", "Aprovada"], ["rejeitada", "Rejeitada"],
];

export default function AdminApplications() {
  const { data, loading, error, reload } = useFetch<CandidaturaAdmin[]>("/admin/applications");

  async function change(id: string, estado: string) {
    await api(`/admin/applications/${id}`, { method: "PATCH", body: { estado } });
    reload();
  }

  if (loading) return <Loader />;
  if (error) return <p className="form-error">{error}</p>;
  if (!data?.length) return <EmptyState title="Sem candidaturas" text="As candidaturas submetidas aparecem aqui." />;
  return (
    <div className="admin-table">
      <table>
        <thead><tr><th>Candidato</th><th>Bolsa</th><th>Data</th><th>Estado</th></tr></thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id}>
              <td>{a.candidato_nome}</td><td>{a.bolsa_titulo}</td><td>{formatDate(a.data_candidatura)}</td>
              <td>
                <select value={a.estado} onChange={(e) => change(a.id, e.target.value)} aria-label={`Estado da candidatura de ${a.candidato_nome}`}>
                  {ESTADOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
