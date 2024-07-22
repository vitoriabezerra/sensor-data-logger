import SensorLogger, { SensorMeasurement} from "../models/sensor.model";


export const createSensorLog = async (log: SensorMeasurement) => {
    try {
        const response = await SensorLogger.findOneAndUpdate(
            { equipmentId: log.equipmentId },
            {
                $push: {
                    measurements: log,
                },
            },
            { 
                new: true, 
                upsert: true 
            }
        );
        
        return response;
    } catch (error) {
        throw new Error("Error while trying to create sensor log");
    }
};


export const getSensorLogByIdAndDate = async (equipmentId: string, date: string): Promise<SensorLogger> => {
    try {
        const endDate = new Date().toISOString();

        const response = await SensorLogger.aggregate([
            { $match: { equipmentId: equipmentId } },
            {
                $project: {
                    filteredMeasurements: {
                        $filter: {
                            input: "$measurements",
                            as: "measurement",
                            cond: {
                                $and: [
                                    { $gte: ["$$measurement.timestamp", date] },
                                    { $lte: ["$$measurement.timestamp", endDate] }
                                ]
                            }
                        }
                    },
                    equipmentId: 1,
                    _id: 0
                }
            },
            {
                $project: {
                    equipmentId: 1,
                    measurements: "$filteredMeasurements",
                    averageValue: { $avg: "$filteredMeasurements.value" }
                }
            }
        ]);

        return response.length > 0 
            ? { equipmentId, measurements: response[0].measurements, averageValue: response[0].measurements.length > 0 ? response[0].averageValue : 0 }
            : { equipmentId, measurements: [], averageValue: 0 };
    } catch (error) {
        throw new Error("Error while trying to get sensor log by ID and date");
    }
};


export const getSensorLogsByDate = async (date: string): Promise<SensorLogger[]> => {
    try {
        const endDate = new Date().toISOString();

        const response = await SensorLogger.aggregate([
            {
                $project: {
                    filteredMeasurements: {
                        $filter: {
                            input: "$measurements",
                            as: "measurement",
                            cond: {
                                $and: [
                                    { $gte: ["$$measurement.timestamp", date] },
                                    { $lte: ["$$measurement.timestamp", endDate] }
                                ]
                            }
                        }
                    },
                    equipmentId: 1,
                    _id: 0
                }
            },
            {
                $project: {
                    equipmentId: 1,
                    measurements: "$filteredMeasurements",
                    averageValue: { $avg: "$filteredMeasurements.value" }
                }
            }
        ]);

        const sensorLogs: SensorLogger[] = response.map((item: any) => ({
            equipmentId: item.equipmentId,
            measurements: item.measurements,
            averageValue: item.measurements.length > 0 ? item.averageValue : 0
        }));

        return sensorLogs;
    } catch (error) {
        throw new Error("Error while trying to get sensor logs by date");
    }
};

export const createMultipleSensorLogs = async (logs: SensorMeasurement[]) => {
    try {
        for (const log of logs) {
            await createSensorLog(log);
        }
    } catch (error) {
        throw new Error("Error while trying to create sensor logs");
    }
};