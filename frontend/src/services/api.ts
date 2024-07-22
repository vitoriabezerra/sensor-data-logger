import { SensorLogger } from "../models/sensor.model";

const API_URL = 'http://localhost:4000';

export const getSensorData = async (date: string, id?: string): Promise<SensorLogger[]> => {
    console.log(date, 'teste')
    const url = id ? `${API_URL}/logs/${date}/${id}` : `${API_URL}/logs/${date}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    return data;
};

export const getAverageSensorData = async (date:string) => {
    const response = await fetch(`${API_URL}/average-logs/${date}`);
    const data = await response.json();
    return data;
};