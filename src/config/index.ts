import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  app: {
    appName: process.env.APP_NAME || "Default",
    port: process.env.PORT || 8001,
  },
  db: {
    connectionString: process.env.PG_CONNECTION_STRING || "",
  },
  jwt: {
    secrete: process.env.JWT_SECRETE,
  },
};

export default config;
