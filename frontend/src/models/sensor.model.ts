export interface SensorMeasurement{
    equipmentId: string
    value: number
    timestamp: string

}

export interface SensorLogger{
    equipmentId: string
    measurements: SensorMeasurement[]

}