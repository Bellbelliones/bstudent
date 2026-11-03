import Button from "../../components/Button";
import "./style.css";

export default function NotFound() {
  return (
    <div className="container page notfound">
      <h1>Página não encontrada</h1>
      <p>O endereço que abriu não existe ou foi movido.</p>
      <Button to="/">Voltar ao início</Button>
    </div>
  );
}
