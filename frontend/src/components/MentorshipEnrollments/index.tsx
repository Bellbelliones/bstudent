import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Inscrito } from "../../types";
import { formatDate } from "../../utils/format";
import Button from "../Button";
import Loader from "../Loader";
import StatusBadge from "../StatusBadge";
import "../AdminApplications/style.css";
import "./style.css";

interface Props { mentoriaId: string; titulo: string; total: number }

export default function MentorshipEnrollments({ mentoriaId, titulo, total }: Props) {
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useFetch<Inscrito[]>(open ? `/mentor/mentorships/${mentoriaId}/contracts` : null);

  return (
    <div className="enroll">
      <Button size="sm" variant="ghost" onClick={() => setOpen((o) => !o)}>
        {open ? "Esconder inscritos" : `Ver inscritos (${total})`}
      </Button>
      {open && (
        <div className="enroll__body">
          <h4 className="enroll__title">Inscritos em: {titulo}</h4>
          {loading && <Loader />}
          {error && <p className="form-error">{error}</p>}
          {data && !data.length && <p className="muted">Ainda ninguém contratou esta mentoria.</p>}
          {data && data.length > 0 && (
            <div className="admin-table">
              <table>
                <thead><tr><th>Candidato</th><th>Email</th><th>Bolsa associada</th><th>Data</th><th>Estado</th></tr></thead>
                <tbody>
                  {data.map((i) => (
                    <tr key={i.id}>
                      <td>{i.candidato_nome}</td>
                      <td>{i.candidato_email}</td>
                      <td>{i.bolsa_titulo ?? "—"}</td>
                      <td>{formatDate(i.data_contratacao)}</td>
                      <td><StatusBadge estado={i.estado === "ativa" ? "ativa" : i.pagamento_estado ?? i.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}