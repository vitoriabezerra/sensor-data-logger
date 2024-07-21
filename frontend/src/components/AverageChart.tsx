import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getAverageSensorData } from '../services/api';
import { Moment } from 'moment';

interface AverageLog {
    equipmentId: string;
    averageValue: number;
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

interface AverageChartProps {
    date: string| Moment;
}

const AverageChart: React.FC<AverageChartProps> = ({ date }) => {
    const [chartData, setChartData] = useState<ChartData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const averageData: AverageLog[] = await getAverageSensorData(date.toLocaleString());
            const labels = averageData.map(log => log.equipmentId);
            const data = averageData.map(log => log.averageValue);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Average Sensor Values',
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            });
        };

        fetchData();
    }, [date]);

    return (
        <div>
            <h2>Average Sensor Data</h2>
            {chartData && <Bar data={chartData} />}
        </div>
    );
};

export default AverageChart;
