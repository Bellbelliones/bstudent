import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { homeFor } from "../../utils/roles";
import Button from "../Button";
import "./style.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">BStudent</Link>
        <nav className="navbar__links" aria-label="Principal">
          <NavLink to="/bolsas">Bolsas</NavLink>
          <NavLink to="/mentorias">Mentorias</NavLink>
        </nav>
        <div className="navbar__actions">
          {user ? (
            <>
              <Link to={homeFor(user.role)}>{user.nome.split(" ")[0]}</Link>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>Sair</Button>
            </>
          ) : (
            <>
              <Link to="/entrar">Entrar</Link>
              <Button to="/registar" size="sm">Criar conta</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
