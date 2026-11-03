import { z } from "zod";
import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/candidates.service";

export const me = asyncHandler(async (req, res) => {
  res.json(await svc.getMe(req.user!.id, req.user!.role));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const d = z.object({
    nivel_academico: z.string().optional(),
    instituicao: z.string().optional(),
    area_formacao: z.string().optional(),
  }).parse(req.body);
  res.json(await svc.updateProfile(req.user!.id, d));
});

export const updateInterests = asyncHandler(async (req, res) => {
  const d = z.object({
    nivel_academico: z.string().optional(),
    pais_preferido: z.string().optional(),
    categorias: z.array(z.object({ categoria_id: z.string().uuid(), peso: z.number().int().min(1).max(5) })),
  }).parse(req.body);
  await svc.updateInterests(req.user!.id, d);
  res.status(204).end();
});

export const interaction = asyncHandler(async (req, res) => {
  const d = z.object({
    tipo: z.enum(["visualizacao", "pesquisa"]),
    descricao: z.string().max(200),
    referencia_id: z.string().uuid().optional(),
  }).parse(req.body);
  await svc.recordInteraction(req.user!.id, d.tipo, d.descricao, d.referencia_id);
  res.status(204).end();
});
