import { Router } from "express";

import Paths from "../constants/Paths";
import AuthRouter from "./AuthRoutes";
import MailRouter from "./MailRoutes";
import UserRouter from "./UserRoutes";
import { authenticateJWT } from "@src/middleware/authMiddleware";

const apiRouter = Router();

apiRouter.use(Paths.Auth.Base, AuthRouter);
apiRouter.use(Paths.Mail.Base, authenticateJWT, MailRouter);
apiRouter.use(Paths.User.Base, authenticateJWT, UserRouter);

export default apiRouter;
