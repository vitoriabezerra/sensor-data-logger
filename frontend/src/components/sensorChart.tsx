import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getSensorData } from '../services/api';
import { SensorLogger } from '../models/sensor.model';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    date: string;
    id?: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ date }) => {
    const [chartData, setChartData] = useState<ChartData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const sensorData: SensorLogger[] = await getSensorData(date);
            
            const labels = sensorData.map(sensorLog => sensorLog.equipmentId);
            const averageValues = sensorData.map(sensorLog => sensorLog.averageValue);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Average Sensor Values',
                        data: averageValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: true,
                    },
                ],
            });
        };

        fetchData();
    }, [date]);

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Average Sensor Data</h2>
            {chartData && <Bar data={chartData} options={options} />}
        </div>
    );
};

export default SensorChart;
