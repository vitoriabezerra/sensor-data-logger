import { Router } from "express";
import * as sensorController from "../controllers/sensor.controller";

const router = Router();

router.post("/create-log", sensorController.createNewLog);
router.get("/logs/:id/:date", sensorController.getSensorLogFromDate);

export default router;