import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/bstudent",
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret",
  webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "dev-webhook-secret",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  isProd: process.env.NODE_ENV === "production",
};

if (env.isProd && (!process.env.JWT_SECRET || !process.env.PAYMENT_WEBHOOK_SECRET)) {
  throw new Error("Defina JWT_SECRET e PAYMENT_WEBHOOK_SECRET em produção.");
}
