import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import { useAuth } from "../../context/AuthContext";
import { homeFor } from "../../utils/roles";
import "./style.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ nome: "", email: "", telefone: "", senha: "", role: "candidato" as "candidato" | "mentor" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try { const u = await register({ ...f, telefone: f.telefone || undefined }); navigate(homeFor(u.role), { replace: true }); }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }

  return (
    <div className="container page register">
      <form className="panel register__form" onSubmit={submit}>
        <h1>Criar conta</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <fieldset className="register__roles">
          <legend>Como quer usar o BStudent?</legend>
          <label className={f.role === "candidato" ? "on" : ""}><input type="radio" name="role" checked={f.role === "candidato"} onChange={() => setF({ ...f, role: "candidato" })} /> Quero candidatar-me a bolsas</label>
          <label className={f.role === "mentor" ? "on" : ""}><input type="radio" name="role" checked={f.role === "mentor"} onChange={() => setF({ ...f, role: "mentor" })} /> Quero oferecer mentorias</label>
        </fieldset>
        <FormField label="Nome"><input value={f.nome} onChange={set("nome")} autoComplete="name" required /></FormField>
        <FormField label="Email"><input type="email" value={f.email} onChange={set("email")} autoComplete="email" required /></FormField>
        <FormField label="Telefone" hint="Opcional"><input value={f.telefone} onChange={set("telefone")} autoComplete="tel" /></FormField>
        <FormField label="Palavra-passe" hint="Pelo menos 8 caracteres"><input type="password" value={f.senha} onChange={set("senha")} autoComplete="new-password" minLength={8} required /></FormField>
        <Button type="submit" disabled={busy}>{busy ? "A criar conta…" : "Criar conta"}</Button>
        <p className="register__alt">Já tem conta? <Link to="/entrar">Entrar</Link></p>
      </form>
    </div>
  );
}
