import { z } from "zod";
import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/applications.service";

const submitSchema = z.object({
  motivacao: z.string().min(50, "A carta de motivação precisa de pelo menos 50 caracteres."),
  ficheiros: z.array(z.object({ nome: z.string(), tamanho: z.number().optional() })).default([]),
});

export const submit = asyncHandler(async (req, res) =>
  res.status(201).json(await svc.submit(req.user!.id, req.params.id, submitSchema.parse(req.body)))
);
export const listMine = asyncHandler(async (req, res) => res.json(await svc.listMine(req.user!.id)));
export const adminList = asyncHandler(async (_req, res) => res.json(await svc.adminList()));
export const adminSetEstado = asyncHandler(async (req, res) => {
  const { estado } = z.object({ estado: z.enum(["submetida", "em_analise", "aprovada", "rejeitada"]) }).parse(req.body);
  res.json(await svc.adminSetEstado(req.params.id, estado));
});
