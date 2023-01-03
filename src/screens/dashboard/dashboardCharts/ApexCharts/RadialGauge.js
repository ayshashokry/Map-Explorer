import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';


function RadialGauge(props) {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        setOptions({
            chart: {
                // width: 250,
                type: 'radialBar',
            },

            colors: ["#20E647"],
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#333',
                        startAngle: -90,
                        endAngle: 90,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontSize: "22px",
                            fontWeight: 'bold',
                            show: true,
                            formatter: function (val) {
                                return val
                              }
                        }
                    }
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "horizontal",
                    gradientToColors: ["#87D4F9"],
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: "butt"
            },
            labels: ["Total"]
        })
        setSeries([70])
    }, [])


    return (

        <div className="piechart1"
        style={{maxWidth:'50vh', margin:'auto'}}
        >
            <ReactApexChart options={options} series={series} type="radialBar"
            // width={props.width||250} 
            // height={props.height||250}

            />
        </div>



    )

}

export default RadialGauge;