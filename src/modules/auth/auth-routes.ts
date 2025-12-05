import { Router } from "express";
import { authController } from "./auth-controllers";

const router = Router();

// POST-> signup a user
router.post("/signup", authController.signup);
// POST-> signin a user and create jwt token
router.post("/signin", authController.signin);

export const authRoutes = router;
