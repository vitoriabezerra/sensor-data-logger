import { Request, Response } from "express";
import * as SensorService from "../services/sensor.service";

export const getSensorLogFromDate = async (req: Request, res: Response) => {
    try {
        const sensorLog = await SensorService.getSensorLogFromDate(req.params.equipmentId, req.params.date);
        res.status(200).json(sensorLog);
    } catch (error) {
        res.status(500).json({error: (error as unknown as Error).message});
    }
};

export const createNewLog = async (req: Request, res: Response) => {
    try {
        const newSensorLog = await SensorService.createSensorLog(req.body);
        res.status(201).json(newSensorLog);
    } catch (error) {
        res.status(500).json({error: (error as unknown as Error).message});
    }
};



