import { Request, Response } from "express";
import * as SensorService from "../services/sensor.service";

export const getSensorLogFromDate = async (req: Request, res: Response) => {
    try {
        const { id, date } = req.params;
        const sensorLog = await SensorService.getSensorLogFromDate(id, date);
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
        res.status(500).json({ error: (error as Error).message });
    }
};



