import dotenv from "dotenv";
dotenv.config();
import logger from "jet-logger";

import EnvVars from "@src/constants/EnvVars";
import server from "./server";

// **** Run **** //

const SERVER_START_MSG =
  "Express server started on port: " + EnvVars.Port.toString();

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
