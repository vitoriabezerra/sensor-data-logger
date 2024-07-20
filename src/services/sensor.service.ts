
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

export const getSensorLogFromDate = async (equipmentId: string, date: string) => {
    try {
        const startDate = new Date(date);
        const endDate = new Date().toISOString(); // Data atual

        //return only the measurements that are between the start and end date
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

        return response.length ? response[0].measurements : [];
    } catch (error) {
        throw new Error("Error while trying to get sensor log");
    }
};





