import mongoose from "mongoose";

export interface SensorMeasurement{
    equipmentId: string
    value: number
    timestamp: string

}

interface SensorLogger{
    equipmentId: string
    measurements: SensorMeasurement[]

}

const SensorLoggerSchema = new mongoose.Schema(
    {
        equipmentId: { type: String, required: true },
        measurements: [
            {
                timestamp: { type: String, required: true },
                value: { type: Number, required: true }
            }
        ]
    },
    { timestamps: true });

const SensorLogger = mongoose.model<SensorLogger>("SensorLogger", SensorLoggerSchema);

export default SensorLogger;