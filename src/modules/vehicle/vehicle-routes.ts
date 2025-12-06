import { Router } from "express";
import auth from "../../middlewares/auth";
import { vehicleControllers } from "./vehicle-controllers";

const router = Router();

// POST-> create a vehicle
router.post("/", auth(["admin"]), vehicleControllers.createVehicle);
// GET-> get all vehicles
router.get("/", vehicleControllers.getAllVehicles);
// GET:vehicleId-> get single vehicle by id
router.get("/:vehicleId", vehicleControllers.getSingleVehicleById);
// PUT:vehicleId-> update single vehicle by id
router.put(
  "/:vehicleId",
  auth(["admin"]),
  vehicleControllers.updateSingleVehicleById
);
// DELETE:vehicleId-> delete single vehicle by id -> admin only
router.delete(
  "/:vehicleId",
  auth(["admin"]),
  vehicleControllers.deleteVehicleById
);

export const vehicleRouter = router;
