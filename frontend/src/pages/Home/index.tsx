import { Link } from "react-router-dom";
import Button from "../../components/Button";
import DeadlineTag from "../../components/DeadlineTag";
import Loader from "../../components/Loader";
import { useFetch } from "../../hooks/useFetch";
import { Bolsa } from "../../types";
import { formatDate } from "../../utils/format";
import "./style.css";

export default function Home() {
  const { data, loading, error } = useFetch<Bolsa[]>("/scholarships?limite=6");
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>Candidate-se à bolsa certa. Contrate um mentor só se quiser(Recomendado).</h1>
            <p>O BStudent reúne bolsas de estudo abertas e mentorias de pessoas que já passaram pelo processo. A candidatura nunca depende de pagar nada.</p>
            <div className="hero__actions">
              <Button to="/bolsas">Ver bolsas abertas</Button>
              <Button to="/mentorias" variant="ghost">Ver mentorias</Button>
            </div>
          </div>
          <section className="board" aria-labelledby="board-title">
            <h2 id="board-title">Prazos a terminar</h2>
            {loading && <Loader text="A procurar bolsas…" />}
            {error && <p className="board__msg">Não foi possível carregar as bolsas.</p>}
            {data && !data.length && <p className="board__msg">Sem bolsas abertas neste momento.</p>}
            <ol>
              {data?.map((b) => (
                <li key={b.id}>
                  <span className="board__date">{formatDate(b.data_limite)}</span>
                  <Link to={`/bolsas/${b.id}`}>{b.titulo}<small>{b.pais}</small></Link>
                  <DeadlineTag date={b.data_limite} />
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>

      <section className="container steps">
        <h2>Como funciona</h2>
        <ol>
          <li><h3>Complete o seu perfil</h3><p>Nível académico, área e países de interesse. Usamos isto para ordenar as bolsas por compatibilidade.</p></li>
          <li><h3>Submeta a candidatura</h3><p>Preencha o formulário da bolsa. Fica guardada, aconteça o que acontecer com qualquer mentoria.</p></li>
          <li><h3>Decida sobre a mentoria</h3><p>Se houver uma mentoria relacionada, mostramos o preço antes de qualquer pagamento. Pode ignorá-la.</p></li>
        </ol>
      </section>
    </>
  );
}
