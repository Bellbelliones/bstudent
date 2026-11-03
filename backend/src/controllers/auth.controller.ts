import { z } from "zod";
import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/auth.service";

const registerSchema = z.object({
  nome: z.string().min(2, "Indique o seu nome."),
  email: z.string().email("Email inválido."),
  senha: z.string().min(8, "A palavra-passe precisa de pelo menos 8 caracteres."),
  telefone: z.string().optional(),
  role: z.enum(["candidato", "mentor"]),
});
const loginSchema = z.object({ email: z.string().email("Email inválido."), senha: z.string().min(1, "Indique a palavra-passe.") });

export const register = asyncHandler(async (req, res) => {
  res.status(201).json(await svc.register(registerSchema.parse(req.body)));
});
export const login = asyncHandler(async (req, res) => {
  const d = loginSchema.parse(req.body);
  res.json(await svc.login(d.email, d.senha));
});
