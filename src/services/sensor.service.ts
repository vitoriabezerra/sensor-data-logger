
import SensorLogger, { SensorMeasurement} from "../models/sensor.model";


export const createSensorLog = async (log: SensorMeasurement) => {
    try {
        const response = await SensorLogger.findOneAndUpdate(
            { equipmentId: log.equipmentId },
            {
                $push: {
                    measurements: {log},
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
        const response = await SensorLogger.findOne(
            { equipmentId: equipmentId, "measurements.timestamp": { $gte: date } }
        );
        return response;
    } catch (error) {
        throw new Error("Error while trying to get sensor log");
    }
}




