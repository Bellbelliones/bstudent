import { z } from "zod";
import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/users.service";

const listSchema = z.object({
  q: z.string().optional(),
  role: z.enum(["candidato", "mentor", "administrador"]).optional(),
});

export const adminList = asyncHandler(async (req, res) =>
  res.json(await svc.adminList(listSchema.parse(req.query)))
);

export const adminSetEstado = asyncHandler(async (req, res) => {
  const { estado } = z.object({ estado: z.enum(["ativo", "suspenso"]) }).parse(req.body);
  res.json(await svc.adminSetEstado(req.user!.id, req.params.id, estado));
});