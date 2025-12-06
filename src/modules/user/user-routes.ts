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
// DELETE:userId-> delete single suer by id -> admin only
router.delete("/:userId", auth(["admin"]), userControllers.deleteUserById);
export const userRoutes = router;
