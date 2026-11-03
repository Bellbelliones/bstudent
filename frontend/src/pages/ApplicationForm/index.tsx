import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Loader from "../../components/Loader";
import SuggestedMentorship from "../../components/SuggestedMentorship";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { Bolsa, Candidatura, Mentoria } from "../../types";
import "./style.css";

export default function ApplicationForm() {
  const { id } = useParams();
  const { data: bolsa, loading } = useFetch<Bolsa>(`/scholarships/${id}`);
  const { data: sugestao } = useFetch<Mentoria | null>(`/scholarships/${id}/suggested-mentorship`);
  const [motivacao, setMotivacao] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Candidatura | null>(null);
  const [dismissed, setDismissed] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const c = await api<Candidatura>(`/scholarships/${id}/applications`, {
        method: "POST",
        body: { motivacao, ficheiros: files.map((f) => ({ nome: f.name, tamanho: f.size })) },
      });
      setDone(c);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  if (loading || !bolsa) return <div className="container page"><Loader /></div>;
  const showSuggestion = sugestao && !dismissed;

  return (
    <div className="container page appform">
      <div>
        <h1>Candidatura</h1>
        <p className="muted">{bolsa.titulo}</p>
        {done ? (
          <div className="panel appform__done" role="status">
            <h2>Candidatura submetida</h2>
            <p>Ficou guardada. Pode acompanhar o estado no seu painel.</p>
            <Button to="/painel">Ir para o painel</Button>
          </div>
        ) : (
          <form className="panel" onSubmit={submit}>
            {error && <p className="form-error" role="alert">{error}</p>}
            <FormField label="Carta de motivação" hint="Pelo menos 50 caracteres">
              <textarea value={motivacao} onChange={(e) => setMotivacao(e.target.value)} required minLength={50} />
            </FormField>
            <FormField label="Documentos" hint="Certificados, CV e outros documentos exigidos pela bolsa">
              <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
            </FormField>
            <Button type="submit" disabled={busy}>{busy ? "A submeter…" : "Submeter candidatura"}</Button>
            <Link className="appform__back" to={`/bolsas/${id}`}>Voltar aos detalhes</Link>
          </form>
        )}
      </div>
      {showSuggestion && <SuggestedMentorship mentoria={sugestao} candidaturaId={done?.id} onDismiss={() => setDismissed(true)} />}
    </div>
  );
}
