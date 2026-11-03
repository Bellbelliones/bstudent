import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "./error";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(new HttpError(401, "Inicie sessão para continuar."));
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, "Sessão inválida ou expirada."));
  }
};

export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) =>
    roles.includes(req.user?.role ?? "")
      ? next()
      : next(new HttpError(403, "Não tem permissão para esta ação."));
