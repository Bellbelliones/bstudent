import { asyncHandler } from "../middlewares/error";
import * as svc from "../services/recommendations.service";

export const mine = asyncHandler(async (req, res) => res.json(await svc.forCandidate(req.user!.id)));
