import { Request, Response } from "express";
import * as SensorService from "../services/sensor.service";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { SensorMeasurement } from "../models/sensor.model";

export const getSensorLogFromDate = async (req: Request, res: Response) => {
    try {
        const { date, id } = req.params;
        
        if (!date) {
            return res.status(400).send('Date is required.');
        }

        let sensorLogs;
        if (id) {
            sensorLogs = await SensorService.getSensorLogByIdAndDate(id, date);
        } else {
            sensorLogs = await SensorService.getSensorLogsByDate(date);
        }

        res.status(200).json(sensorLogs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
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

    const sensorData: SensorMeasurement[] = [];
    const filePath = path.resolve(req.file.path);

    try {
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => {
                    sensorData.push({
                        equipmentId: data.equipmentId,
                        timestamp: data.timestamp,
                        value: parseFloat(data.value)
                    });
                })
                .on('end', async () => {
                    try {
                        await SensorService.createMultipleSensorLogs(sensorData);
                        resolve();
                    } catch (error) {
                        reject(new Error("Error while trying to save sensor data"));
                    } finally {
                        fs.unlinkSync(filePath);
                    }
                })
                .on('error', (error) => {
                    reject(new Error("Error processing CSV file"));
                });
        });

        res.status(201).send('Data successfully saved.');
    } catch (error) {
        res.status(500).send(error);
    }
};



