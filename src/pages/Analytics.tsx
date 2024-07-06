import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import axios from 'axios';
import {Button, ButtonGroup, Tooltip} from '@nextui-org/react';
import MainNavbar from "../components/MainNavbar";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Analytics: React.FC = () => {
    const [dataPoints, setDataPoints] = useState<{ y: number, label: string }[]>([]);
    const [, setSortOrder] = useState<string>('');
    const [chartOptions, setChartOptions] = useState<any>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:7878/api/v1/subscriptions/total-amounts');
            const data = response.data;
            const formattedData = data.map((item: { value: number, title: string }, index: number) => ({
                y: item.value,
                label: item.title,
            }));
            setDataPoints(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const sortData = (order: string) => {
        setSortOrder(order);
        const sortedData =
            [...dataPoints].sort((a, b) => order === 'asc' ? a.y - b.y : b.y - a.y);
        setDataPoints(sortedData);
    };

    const resetSorting = () => {
        setSortOrder('');
        fetchData();
    };

    useEffect(() => {
        setChartOptions({
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2",
            axisY: { includeZero: true },
            data: [{
                type: "column",
                indexLabelFontColor: "#5A5757",
                indexLabelPlacement: "outside",
                dataPoints: dataPoints.map((point) => ({
                    label: point.label,
                    y: point.y,
                })),
            }]
        });
    }, [dataPoints]);

    return (
        <div className="min-h-screen gradient-background">
            <MainNavbar/>
            <div className="container mx-auto py-8 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white mb-8">Total Amounts by Subscription</h1>
                <hr className="w-full border-t-2 border-white mb-8"/>
                <div className="flex justify-end w-full mb-5">
                    <ButtonGroup>
                    <Tooltip content="Sort ascending" className="dark text-white">
                        <Button color="primary" variant="ghost" isIconOnly onClick={() => sortData('asc')} className="text-2xl">
                            ↑
                        </Button>
                    </Tooltip>
                    <Tooltip content="Sort descending" className="dark text-white">
                        <Button color="primary" variant="ghost" isIconOnly onClick={() => sortData('desc')} className="ml-2 text-2xl">
                            ↓
                        </Button>
                    </Tooltip>
                    <Tooltip content="Reset sorting" className="dark text-white">
                        <Button color="primary" variant="ghost" isIconOnly onClick={resetSorting} className="ml-2 text-2xl">
                            ✕
                        </Button>
                    </Tooltip>
                    </ButtonGroup>
                </div>
                <div className="w-full bg-white rounded-lg p-4 mb-8">
                    {dataPoints.length > 0 && (
                        <CanvasJSChart options={chartOptions} />
                    )}
                </div>
                <hr className="w-full border-t-2 border-white mb-8"/>
            </div>
        </div>
    );
};

export default Analytics;
