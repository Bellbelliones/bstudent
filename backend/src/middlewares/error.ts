import { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) return void res.status(err.status).json({ message: err.message });
  if (err instanceof ZodError) {
    return void res.status(400).json({ message: err.issues[0]?.message ?? "Dados inválidos." });
  }
  if (err?.code === "22P02") return void res.status(400).json({ message: "Identificador inválido." });
  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor." });
};
