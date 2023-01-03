import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';


function PieChart(props) {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});
 
    useEffect(()=>{
        setOptions({
            chart: {
                // width: 250,
                type: 'pie',
            },
            legend: {
                show: false
              },
              chartOptions: {
                labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
              }
            ,
            responsive: [{
                breakpoint: 150,
                options: {
                    chart: {
                        width: 150
                    },
                    legend: {
                        show:false
                        // position: 'bottom'
                    }
                }
            }],
        })
        setSeries([3,6, 2 , 1])
    },[])
   

    return (

        <div id="piechart1">
            <ReactApexChart options={options} series={series} type="pie" 
            // width={props.width||250} 
            // height={props.height||250}
            
            />
        </div>



    )

}

export default PieChart;