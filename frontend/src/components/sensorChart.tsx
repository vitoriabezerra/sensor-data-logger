import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getSensorData } from '../services/api';
import { Moment } from 'moment';


interface SensorLog {
    timestamp: string;
    value: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill: boolean;
    }[];
}

interface SensorChartProps {
    date: string| Moment;
    id: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ date, id }) => {
    const [chartData, setChartData] = useState<ChartData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const sensorData: SensorLog[] = await getSensorData(date.toString(), id);
            const labels = sensorData.map(log => log.timestamp);
            const data = sensorData.map(log => log.value);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Sensor Values',
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            });
        };

        fetchData();
    }, [date, id]);

    return (
        <div>
            <h2>Sensor Data</h2>
            {chartData && <Line data={chartData} />}
        </div>
    );
};

export default SensorChart;