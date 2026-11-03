import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import { useAuth } from "../../context/AuthContext";
import { homeFor } from "../../utils/roles";
import "./style.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try { const u = await login(email, senha); navigate(from ?? homeFor(u.role), { replace: true }); }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }

  return (
    <div className="container page auth">
      <form className="panel auth__form" onSubmit={submit}>
        <h1>Entrar</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <FormField label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></FormField>
        <FormField label="Palavra-passe"><input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required /></FormField>
        <Button type="submit" disabled={busy}>{busy ? "A entrar…" : "Entrar"}</Button>
        <p className="auth__alt">Ainda não tem conta? <Link to="/registar">Criar conta</Link></p>
      </form>
    </div>
  );
}
