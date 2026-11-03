import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth";
import * as auth from "../controllers/auth.controller";
import * as cand from "../controllers/candidates.controller";
import * as sch from "../controllers/scholarships.controller";
import * as app from "../controllers/applications.controller";
import * as men from "../controllers/mentorships.controller";
import * as con from "../controllers/contracts.controller";
import * as rec from "../controllers/recommendations.controller";

const r = Router();
const candidato = [authenticate, requireRole("candidato")];
const admin = [authenticate, requireRole("administrador")];
const mentor = [authenticate, requireRole("mentor")];

r.get("/health", (_req, res) => res.json({ ok: true }));

r.post("/auth/register", auth.register);
r.post("/auth/login", auth.login);
r.get("/me", authenticate, cand.me);

r.patch("/candidates/me", ...candidato, cand.updateProfile);
r.put("/candidates/me/interests", ...candidato, cand.updateInterests);
r.post("/candidates/me/interactions", ...candidato, cand.interaction);

r.get("/categories", sch.categories);
r.get("/scholarships", sch.list);
r.get("/scholarships/:id", sch.get);
r.get("/scholarships/:id/suggested-mentorship", sch.suggestedMentorship);
r.post("/scholarships/:id/applications", ...candidato, app.submit);
r.get("/applications/me", ...candidato, app.listMine);

r.get("/mentorships", men.list);
r.get("/mentorships/:id", men.get);
r.post("/mentor/mentorships", ...mentor, men.create);
r.get("/mentor/mentorships", ...mentor, men.listMine);

r.post("/mentorship-contracts", ...candidato, con.create);
r.get("/mentorship-contracts/me", ...candidato, con.listMine);
r.post("/payments/webhook", con.webhook);
r.post("/payments/dev-simulate", ...candidato, con.devSimulate);

r.get("/recommendations/me", ...candidato, rec.mine);

r.get("/admin/applications", ...admin, app.adminList);
r.patch("/admin/applications/:id", ...admin, app.adminSetEstado);
r.post("/admin/scholarships", ...admin, sch.create);

export default r;
