// src/server.ts
import { app } from "./app";
import { config } from "./config/config";
import { logger } from "./middleware/logger";

const startServer = () => {
  try {
    app.listen(config.port, () => {
      logger.info(`Server is forging requests on port ${config.port}`);
    });
  } catch (error) {
    logger.fatal(error, "Failed to ignite server");
    process.exit(1);
  }
};

startServer();
