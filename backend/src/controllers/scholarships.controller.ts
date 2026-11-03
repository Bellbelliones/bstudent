import { z } from "zod";
import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/scholarships.service";
import * as mentorships from "../services/mentorships.service";

const createSchema = z.object({
  titulo: z.string().min(3, "Indique o título."),
  descricao: z.string().min(10, "Descreva a bolsa."),
  pais: z.string().optional(),
  nivel_academico: z.string().optional(),
  categoria_id: z.string().uuid().optional(),
  data_limite: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use AAAA-MM-DD)."),
});

export const list = asyncHandler(async (req, res) => {
  const q = req.query as Record<string, string | undefined>;
  res.json(await svc.list({ q: q.q, categoria: q.categoria, pais: q.pais, nivel: q.nivel, limite: q.limite ? Number(q.limite) : undefined }));
});
export const get = asyncHandler(async (req, res) => res.json(await svc.getById(req.params.id)));
export const suggestedMentorship = asyncHandler(async (req, res) =>
  res.json(await mentorships.suggestedForScholarship(req.params.id))
);
export const create = asyncHandler(async (req, res) =>
  res.status(201).json(await svc.create(req.user!.id, createSchema.parse(req.body)))
);
export const categories = asyncHandler(async (_req, res) => res.json(await svc.categories()));
