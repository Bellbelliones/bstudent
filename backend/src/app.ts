import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middlewares/error";
import routes from "./routes";

const app = express();
app.use(cors({ origin: env.clientUrl }));
// rawBody é necessário para validar a assinatura do webhook
app.use(express.json({ verify: (req, _res, buf) => { (req as express.Request).rawBody = buf; } }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
