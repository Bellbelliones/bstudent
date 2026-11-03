import { useState } from "react";
import AdminApplications from "../../components/AdminApplications";
import ScholarshipForm from "../../components/ScholarshipForm";
import { useFetch } from "../../hooks/useFetch";
import { Categoria } from "../../types";
import "./style.css";

export default function Admin() {
  const [tab, setTab] = useState<"candidaturas" | "bolsas">("candidaturas");
  const [created, setCreated] = useState(false);
  const cats = useFetch<Categoria[]>("/categories");
  return (
    <div className="container page">
      <div className="page__head"><h1>Painel administrativo</h1></div>
      <div className="admin__tabs" role="tablist">
        <button role="tab" aria-selected={tab === "candidaturas"} onClick={() => setTab("candidaturas")}>Candidaturas</button>
        <button role="tab" aria-selected={tab === "bolsas"} onClick={() => setTab("bolsas")}>Nova bolsa</button>
      </div>
      {tab === "candidaturas" ? (
        <AdminApplications />
      ) : (
        <div className="panel admin__form">
          {created && <p role="status">Bolsa publicada.</p>}
          <ScholarshipForm categorias={cats.data ?? []} onCreated={() => setCreated(true)} />
        </div>
      )}
    </div>
  );
}
