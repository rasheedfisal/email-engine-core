import express from "express";
import { UserController } from "@src/controllers/UserController";

const router = express.Router();

router.get("/profile", UserController.getUserProfile);

export default router;
