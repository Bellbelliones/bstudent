import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => console.log(`BStudent API em http://localhost:${env.port}/api`));
