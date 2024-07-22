import { SensorLogger, SensorMeasurement } from "../models/sensor.model";

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

export const createNewLog = async (data: SensorMeasurement) => {
    const response = await fetch(`${API_URL}/create-log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create new log');
    }

    const responseData = await response.json();
    return responseData;
};

export const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/upload-csv`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        return true;
    } catch (error) {
        console.error('Error uploading file', error);
        return false;
}  
}