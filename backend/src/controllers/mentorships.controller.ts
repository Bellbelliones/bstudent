import { z } from "zod";
import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/mentorships.service";

const createSchema = z.object({
  titulo: z.string().min(3, "Indique o título."),
  descricao: z.string().min(10, "Descreva a mentoria."),
  preco: z.coerce.number().min(0, "O preço não pode ser negativo."),
  modalidade: z.enum(["online", "presencial", "hibrida"]),
  categoria_id: z.string().uuid().optional(),
});

export const list = asyncHandler(async (req, res) => {
  const q = req.query as Record<string, string | undefined>;
  res.json(await svc.list({ q: q.q, categoria: q.categoria }));
});
export const get = asyncHandler(async (req, res) => res.json(await svc.getById(req.params.id)));
export const create = asyncHandler(async (req, res) =>
  res.status(201).json(await svc.create(req.user!.id, createSchema.parse(req.body)))
);
export const listMine = asyncHandler(async (req, res) => res.json(await svc.listMine(req.user!.id)));
export const enrollments = asyncHandler(async (req, res) =>
  res.json(await svc.listEnrollments(req.user!.id, req.params.id))
);