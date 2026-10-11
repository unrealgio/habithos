import { APP_NAME } from "@habithos/shared";
import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`${APP_NAME} API running on http://localhost:${env.PORT}`);
});
