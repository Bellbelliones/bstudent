import crypto from "crypto";
import { z } from "zod";
import { env } from "../config/env";
import { HttpError, asyncHandler } from "../middlewares/error";
import * as svc from "../services/contracts.service";

const createSchema = z.object({ mentoria_id: z.string().uuid(), candidatura_id: z.string().uuid().nullish() });
const eventSchema = z.object({
  referencia: z.string().min(1),
  estado: z.enum(["aprovado", "falhado", "cancelado"]),
  valor: z.number(),
});

export const create = asyncHandler(async (req, res) =>
  res.status(201).json(await svc.create(req.user!.id, createSchema.parse(req.body)))
);
export const listMine = asyncHandler(async (req, res) => res.json(await svc.listMine(req.user!.id)));

// RN13: a confirmação vem do gateway (servidor a servidor), nunca do browser.
export const webhook = asyncHandler(async (req, res) => {
  const received = Buffer.from(req.header("x-signature") ?? "");
  const expected = Buffer.from(
    crypto.createHmac("sha256", env.webhookSecret).update(req.rawBody ?? Buffer.alloc(0)).digest("hex")
  );
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    throw new HttpError(401, "Assinatura inválida.");
  }
  res.json(await svc.processPaymentEvent(eventSchema.parse(req.body)));
});

// Apenas desenvolvimento: simula o gateway chamando o mesmo processamento do webhook.
export const devSimulate = asyncHandler(async (req, res) => {
  if (env.isProd) throw new HttpError(404, "Rota não encontrada.");
  const d = z.object({ referencia: z.string(), estado: z.enum(["aprovado", "falhado", "cancelado"]) }).parse(req.body);
  const valor = await svc.paymentOwnedBy(req.user!.id, d.referencia);
  res.json(await svc.processPaymentEvent({ ...d, valor }));
});
