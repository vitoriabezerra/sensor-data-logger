import { Request, Response } from "express";
import * as SensorService from "../services/sensor.service";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

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


export const uploadCSV = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const results: any[] = [];

    fs.createReadStream(path.resolve(req.file.path))
        .pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', async () => {
            try {
                console.log(results);
            } catch (error) {
                res.status(500).send('Error saving data.');
            } finally {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
            }
        })
        .on('error', (error) => {
            res.status(500).send('Error processing CSV file.');
        });
}



