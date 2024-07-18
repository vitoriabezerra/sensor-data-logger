import { Router } from "express";
import * as sensorController from "../controllers/sensor.controller";

const router = Router();

// Defining the routes
router.post(
    "/create-log",
    sensorController.createNewLog
);
router.get(
    "/:id/:date",
    sensorController.getSensorLogFromDate
);