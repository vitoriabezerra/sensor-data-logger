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

export const getSensorLogByIdAndDate = async (equipmentId: string, date: string) => {
    try {
        const endDate = new Date().toISOString(); // Data atual

        const response = await SensorLogger.aggregate([
            { $match: { equipmentId: equipmentId } },
            {
                $project: {
                    measurements: {
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
                    _id: 0
                }
            }
        ]);

        return response.length > 0 
            ? { equipmentId, measurements: response[0].measurements }
            : { equipmentId, measurements: [] };
    } catch (error) {
        throw new Error("Error while trying to get sensor log by ID and date");
    }
};

export const getSensorLogsByDate = async (date: string) => {
    try {
        const startDate = new Date(date);
        const endDate = new Date().toISOString(); // Data atual

        const response = await SensorLogger.aggregate([
            {
                $project: {
                    measurements: {
                        $filter: {
                            input: "$measurements",
                            as: "measurement",
                            cond: {
                                $and: [
                                    { $gte: ["$$measurement.timestamp", startDate] },
                                    { $lte: ["$$measurement.timestamp", endDate] }
                                ]
                            }
                        }
                    },
                    _id: 0,
                    equipmentId: 1
                }
            }
        ]);

        return response;
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