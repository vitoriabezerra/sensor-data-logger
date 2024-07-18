import mongoose from "mongoose";

interface SensorLoggerInput {
    equipmentId: string
    timestamp: string
    value: number
}

interface SensorMeasurement {
    timestamp: string
    value: number
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