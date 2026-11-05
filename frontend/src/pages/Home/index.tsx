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
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="hero__label">
              OPORTUNIDADES PARA O TEU FUTURO
            </span>

            <h1>
              Encontra bolsas de estudo.
              <span> Descobre mentorias. Constrói o teu futuro.</span>
            </h1>

            <p>
              Uma plataforma que liga estudantes a oportunidades de
              financiamento académico e orientação especializada.
            </p>

            <div className="hero__actions">
              <Button to="/bolsas">Explorar bolsas →</Button>
              <Button to="/mentorias" variant="ghost">
                Ver mentorias
              </Button>
            </div>

            <div className="hero__highlights">
             
            </div>
          </div>

          <div className="hero__image">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f303224c94?w=1200"
              alt="Estudantes numa cerimónia de graduação"
            />
          </div>
        </div>
      </section>

      {/* PRAZOS DAS BOLSAS */}
      <section className="container opportunities">
        <div className="board">
          <div className="board__header">
            <div>
              <span className="section-label">FICA ATENTO</span>
              <h2>Prazos de candidaturas</h2>
              <p>Não percas as próximas oportunidades.</p>
            </div>

            <Link to="/bolsas" className="board__more">
              Ver todas as bolsas →
            </Link>
          </div>

          {loading && <Loader text="A procurar bolsas…" />}

          {error && (
            <p className="board__msg">
              Não foi possível carregar as bolsas.
            </p>
          )}

          {data && !data.length && (
            <p className="board__msg">
              Sem bolsas abertas neste momento.
            </p>
          )}

          <ol className="board__list">
            {data?.map((b) => (
              <li key={b.id}>
                <span className="board__date">
                  {formatDate(b.data_limite)}
                </span>

                <Link to={`/bolsas/${b.id}`}>
                  {b.titulo}
                  <small>📍 {b.pais}</small>
                </Link>

                <DeadlineTag date={b.data_limite} />
              </li>
            ))}
          </ol>
        </div>

        <div className="opportunities__image">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000"
            alt="Livros e materiais de estudo"
          />

          <div className="opportunities__quote">
            O conhecimento abre portas.
            <br />
            Nós ligamos-te às oportunidades.
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="features">
        <div className="container">
          <div className="section-heading">
            <span className="section-label">O QUE ENCONTRAS AQUI</span>
            <h2>Uma plataforma, várias oportunidades.</h2>
            <p>
              Tudo o que precisas para descobrir oportunidades e
              desenvolver o teu percurso académico e profissional.
            </p>
          </div>

          <div className="features__grid">
            <article className="feature-card">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700"
                alt="Estudante a pesquisar"
              />
              <div className="feature-card__body">
                <span>01</span>
                <h3>Pesquisa de bolsas</h3>
                <p>
                  Descobre oportunidades de financiamento académico
                  e consulta os requisitos de cada bolsa.
                </p>
                <Link to="/bolsas">Explorar bolsas →</Link>
              </div>
            </article>

            <article className="feature-card">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700"
                alt="Pessoas numa sessão de orientação"
              />
              <div className="feature-card__body">
                <span>02</span>
                <h3>Mentorias</h3>
                <p>
                  Conhece oportunidades de orientação e acompanhamento
                  para o teu desenvolvimento.
                </p>
                <Link to="/mentorias">Conhecer mentorias →</Link>
              </div>
            </article>

            <article className="feature-card">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700"
                alt="Pessoa a trabalhar num computador"
              />
              <div className="feature-card__body">
                <span>03</span>
                <h3>Candidaturas</h3>
                <p>
                  Acede às oportunidades e inicia o processo de
                  candidatura através da plataforma.
                </p>
                <Link to="/bolsas">Começar agora →</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="container steps">
        <div className="section-heading">
          <span className="section-label">COMO FUNCIONA?</span>
          <h2>Três passos para aproveitares o sistema.</h2>
        </div>

        <ol>
          <li>
            <span className="steps__number">01</span>
            <h3>Descobre</h3>
            <p>
              Explora bolsas e mentorias disponíveis na plataforma.
            </p>
          </li>

          <li>
            <span className="steps__number">02</span>
            <h3>Candidata-te</h3>
            <p>
              Consulta os requisitos e submete a tua candidatura.
            </p>
          </li>

          <li>
            <span className="steps__number">03</span>
            <h3>Desenvolve-te</h3>
            <p>
              Aproveita as oportunidades para crescer académica
              e profissionalmente.
            </p>
          </li>
        </ol>
      </section>
    </>
  );
}