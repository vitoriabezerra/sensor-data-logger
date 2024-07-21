const API_URL = 'http://localhost:4000';

export const getSensorData = async (date:string, id:string) => {
    const response = await fetch(`${API_URL}/logs/${id}/${date}`);
    const data = await response.json();
    return data;
};

export const getAverageSensorData = async (date:string) => {
    const response = await fetch(`${API_URL}/average-logs/${date}`);
    const data = await response.json();
    return data;
};