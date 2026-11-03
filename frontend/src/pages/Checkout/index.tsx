import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { Contratacao, Mentoria, Pagamento } from "../../types";
import { formatMoney, modalidadeLabel } from "../../utils/format";
import "./style.css";

export default function Checkout() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { data: m, loading } = useFetch<Mentoria>(`/mentorships/${id}`);
  const [pay, setPay] = useState<{ contrato: Contratacao; pagamento: Pagamento } | null>(null);
  const [estado, setEstado] = useState("pendente");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true); setError("");
    try {
      const r = await api<{ contrato: Contratacao; pagamento: Pagamento }>("/mentorship-contracts", {
        method: "POST", body: { mentoria_id: id, candidatura_id: params.get("candidatura") },
      });
      setPay(r); setEstado("pendente");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  // Em desenvolvimento simula-se o gateway; em produção a confirmação chega pelo webhook.
  async function simulate(novo: "aprovado" | "falhado") {
    if (!pay) return;
    setBusy(true); setError("");
    try {
      await api("/payments/dev-simulate", { method: "POST", body: { referencia: pay.pagamento.referencia_gateway, estado: novo } });
      const mine = await api<Contratacao[]>("/mentorship-contracts/me");
      const c = mine.find((x) => x.id === pay.contrato.id);
      setEstado(c?.estado === "ativa" ? "ativa" : c?.pagamento_estado ?? novo);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  if (loading || !m) return <div className="container page"><Loader /></div>;

  return (
    <div className="container page checkout">
      <h1>Contratar mentoria</h1>
      <section className="panel">
        <h2>{m.titulo}</h2>
        <p className="muted">{m.mentor_nome} — {modalidadeLabel(m.modalidade)}</p>
        <p className="checkout__total">Total: <strong>{formatMoney(m.preco)}</strong></p>

        {error && <p className="form-error" role="alert">{error}</p>}

        {!pay && <Button onClick={start} disabled={busy}>{busy ? "A preparar…" : `Confirmar e pagar ${formatMoney(m.preco)}`}</Button>}

        {pay && estado === "pendente" && (
          <div className="checkout__pay" role="status">
            <p><StatusBadge estado="pendente" /> A aguardar confirmação do pagamento.</p>
            <p className="muted">Referência: {pay.pagamento.referencia_gateway}</p>
            {import.meta.env.DEV && (
              <div className="checkout__dev">
                <p className="muted">Modo de desenvolvimento: simule a resposta do gateway.</p>
                <Button size="sm" onClick={() => simulate("aprovado")} disabled={busy}>Simular pagamento aprovado</Button>{" "}
                <Button size="sm" variant="ghost" onClick={() => simulate("falhado")} disabled={busy}>Simular pagamento recusado</Button>
              </div>
            )}
          </div>
        )}

        {estado === "ativa" && (
          <div role="status"><p><StatusBadge estado="ativa" /> Mentoria ativa.</p><Button to="/painel">Ir para o painel</Button></div>
        )}
        {(estado === "falhado" || estado === "cancelado") && (
          <div role="alert"><p><StatusBadge estado="falhado" /> O pagamento não foi concluído.</p><Button onClick={start} disabled={busy}>Tentar novamente</Button></div>
        )}
      </section>
      <p className="muted">A sua candidatura à bolsa não depende desta compra. <Link to="/painel">Voltar ao painel</Link></p>
    </div>
  );
}
