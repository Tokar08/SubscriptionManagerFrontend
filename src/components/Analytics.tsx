import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

import MainNavbar from "./MainNavbar";


const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Analytics: React.FC = () => {
    const [dataPoints, setDataPoints] = useState<{ x: number, y: number, label: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:7878/api/v1/subscriptions/total-amounts');
                const data = await response.json();
                const formattedData = data.map((item: { value: number, title: string }, index: number) => ({
                    x: index + 1,
                    y: item.value,
                    label: item.title,
                }));
                setDataPoints(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column",
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: dataPoints
        }]
    };

    return (
        <div className="min-h-screen gradient-background">
            <MainNavbar/>
            <div className="container mx-auto py-8 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white mb-8">Total Amounts by Subscription</h1>
                <hr className="w-full border-t-2 border-white mb-8"/>
                <div className="w-full bg-white rounded-lg p-4">
                    <CanvasJSChart options={options}/>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
