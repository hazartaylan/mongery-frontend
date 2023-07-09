import { Card, Dropdown } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RevenueChart = () => {
    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false,
            },
            stacked: false,
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: [3, 3],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        fill: {
            type: 'solid',
            opacity: [0, 1],
        },
        colors: ['#3cc469', '#188ae2'],
        xaxis: {
            categories: ['01/23', '02/23', '03/23', '04/23', '05/23', '06/23', '07/23', '08/23'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: '#adb5bd',
                },
            },
        },
        yaxis: {
            tickAmount: 4,
            min: 0,
            max: 100,
            labels: {
                style: {
                    colors: '#adb5bd',
                },
            },
        },
        grid: {
            show: false,
            padding: {
                top: 0,
                bottom: 0,
            },
        },
        tooltip: {
            theme: 'dark',
        },
    };

    const series = [
        {
            name: 'Toplam Kazanç',
            type: 'area',
            data: [50, 75, 30, 50, 75, 50, 75, 100],
        },
        {
            name: 'Toplam Sipariş',
            type: 'line',
            data: [0, 40, 80, 40, 10, 40, 50, 70],
        },
    ];

    return (
        <Card>
            <Card.Body>
               

                <h4 className="header-title mt-0">Kazanç Grafiği</h4>

                <div dir="ltr">
                    <Chart options={options} series={series} type="line" height={268} className="apex-charts mt-2" />
                </div>
            </Card.Body>
        </Card>
    );
};

export default RevenueChart;
