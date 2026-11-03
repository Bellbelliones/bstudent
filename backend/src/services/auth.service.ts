import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, withTransaction } from "../config/db";
import { env } from "../config/env";
import { HttpError } from "../middlewares/error";

const sign = (u: { id: string; role: string }) =>
  jwt.sign({ role: u.role }, env.jwtSecret, { subject: u.id, expiresIn: "7d" });

export async function register(d: {
  nome: string; email: string; senha: string; telefone?: string; role: "candidato" | "mentor";
}) {
  const email = d.email.toLowerCase();
  const exists = await query("SELECT 1 FROM utilizador WHERE email=$1", [email]);
  if (exists.rowCount) throw new HttpError(409, "Este email já está registado.");
  const hash = await bcrypt.hash(d.senha, 10);
  const user = await withTransaction(async (c) => {
    const u = await c.query(
      "INSERT INTO utilizador (nome,email,senha_hash,telefone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,nome,email,role",
      [d.nome, email, hash, d.telefone ?? null, d.role]
    );
    await c.query(`INSERT INTO ${d.role} (utilizador_id) VALUES ($1)`, [u.rows[0].id]);
    return u.rows[0];
  });
  return { user, token: sign(user) };
}

export async function login(email: string, senha: string) {
  const r = await query(
    "SELECT id,nome,email,role,senha_hash,estado FROM utilizador WHERE email=$1",
    [email.toLowerCase()]
  );
  const u = r.rows[0];
  const ok = u && u.estado === "ativo" && (await bcrypt.compare(senha, u.senha_hash));
  if (!ok) throw new HttpError(401, "Email ou palavra-passe incorretos.");
  delete u.senha_hash;
  return { user: u, token: sign(u) };
}
