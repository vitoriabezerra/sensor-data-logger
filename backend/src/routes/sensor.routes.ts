import { Router } from "express";
import * as sensorController from "../controllers/sensor.controller";
import multer from "multer";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post("/create-log", sensorController.createNewLog);
router.get("/logs/:date/:id?", sensorController.getSensorLogFromDate);
router.post('/upload-csv', upload.single('file'), sensorController.uploadCSV);

export default router;