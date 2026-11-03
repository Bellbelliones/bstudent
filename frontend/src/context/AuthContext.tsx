import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api, TOKEN_KEY } from "../services/api";
import { Role, User } from "../types";

interface RegisterData { nome: string; email: string; senha: string; telefone?: string; role: "candidato" | "mentor" }
interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<User>;
  register: (d: RegisterData) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

  const refresh = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) { setUser(null); return; }
    try { setUser(await api<User>("/me")); } catch { localStorage.removeItem(TOKEN_KEY); setUser(null); }
  }, []);

  useEffect(() => { refresh().finally(() => setLoading(false)); }, [refresh]);

  const start = async (path: string, body: unknown) => {
    const { token } = await api<{ token: string; user: { role: Role } }>(path, { method: "POST", body });
    localStorage.setItem(TOKEN_KEY, token);
    const me = await api<User>("/me");
    setUser(me);
    return me;
  };

  const value: AuthState = {
    user, loading, refresh,
    login: (email, senha) => start("/auth/login", { email, senha }),
    register: (d) => start("/auth/register", d),
    logout: () => { localStorage.removeItem(TOKEN_KEY); setUser(null); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
