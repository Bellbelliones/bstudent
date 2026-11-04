import ApplicationList from "../../components/ApplicationList";
import ContractList from "../../components/ContractList";
import InterestsForm from "../../components/InterestsForm";
import Loader from "../../components/Loader";
import RecommendationList from "../../components/RecommendationList";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Candidatura, Categoria, Contratacao, Recomendacao } from "../../types";
import "./style.css";

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const apps = useFetch<Candidatura[]>("/applications/me");
  const contracts = useFetch<Contratacao[]>("/mentorship-contracts/me");
  const recs = useFetch<Recomendacao[]>("/recommendations/me");
  const cats = useFetch<Categoria[]>("/categories");
  if (!user) return null;

  return (
    <div className="container page dash">
      <div className="page__head"><h1>Olá! {user.nome.split(" ")[0]}</h1><p>As suas candidaturas, mentorias e sugestões num só lugar.</p></div>
      <div className="dash__grid">
        <section className="panel"><h2>Candidaturas</h2>{apps.loading ? <Loader /> : <ApplicationList items={apps.data ?? []} />}</section>
        <section className="panel"><h2>Mentorias</h2>{contracts.loading ? <Loader /> : <ContractList items={contracts.data ?? []} />}</section>
        <section className="panel"><h2>Sugestões para si</h2>{recs.loading ? <Loader /> : <RecommendationList items={recs.data ?? []} />}</section>
        <section className="panel dash__wide">
          <h2>O seu perfil</h2>
          {cats.data && <InterestsForm user={user} categorias={cats.data} onSaved={() => { refresh(); recs.reload(); }} />}
        </section>
      </div>
    </div>
  );
}
