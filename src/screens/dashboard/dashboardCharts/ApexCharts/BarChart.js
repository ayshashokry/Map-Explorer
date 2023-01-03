import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function BarChartComp (props) {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});
 useEffect(()=>{
    setSeries(  [{
        name: 'Maintainence Cost',
        data: [50,30,20]
    }]);
    setOptions({

        chart: {
            // height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'bottom', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + "M";
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        xaxis: {
            categories: ["Road1", "Road2","Road3"],
            position: 'bottom',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val + "M";
                }
            }
        },
        title: {
            text: 'Monthly Inflation in Argentina, 2002',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        },
        tooltip: {
            followCursor:true,
            onDatasetHover: {
                highlightDataSeries: true,
            },
            items: {
                display: 'flex',
             },
            fixed: {
                enabled: true,
                position: 'topRight',
                offsetX: 0,
                offsetY: 0,
            },
        }
    }
    )
 },[])
     
        return (
            
            <div id="Columnchart1">
                <ReactApexChart options={options} series={series} type="bar" 
                // height={props.height||200}
                // width={props.width||200}
                />
            </div>
        
        );
}

export default BarChartComp;