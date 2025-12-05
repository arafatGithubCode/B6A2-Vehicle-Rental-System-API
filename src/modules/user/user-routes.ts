import { Router } from "express";
import auth from "../../middlewares/auth";
import { userControllers } from "./user-controllers";

const router = Router();

// GET-> get all users
router.get("/", auth(["admin"]), userControllers.getAllUsers);
// PUT:userId-> update single user by id
router.put(
  "/:userId",
  auth(["admin", "customer"]),
  userControllers.updateUserById
);

export const userRoutes = router;
