import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function DonutChart(props) {
  const { t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {

      setOptions({
        chart: {
          width: '100%',
          type: "pie",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        theme: {
          mode: 'light',
          palette: statisticsType === 'count' ? 'palette10' : 'palette3',
          monochrome: {
            enabled: false,
            // color: '#255aee',
            shadeTo: 'light',
            shadeIntensity: 0.8
          }
        },
        
        plotOptions: {
          pie: {
            // donut: {
            size: "80%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 200,
                color: undefined,
                offsetY: 0,
                formatter: function (val) {
                  return val;
                },
              },
              value: {
                show: true,
                fontSize: "12px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 200,
                color: undefined,
                offsetY: 8,
                formatter: function (val) {
                  let statisticsTypeUpper = statisticsType.toUpperCase();

                  if (series[0][statisticsTypeUpper].toString().length > 4)
                    return String(Number(parseFloat(val).toFixed(2)))+"K";
                  else
                    return String(Number(parseFloat(val).toFixed(2))) + "K";
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: "Total",
                fontSize: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 300,
                color: "#373d3f",
                formatter: function (w) {
                  let totalSum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                  totalSum = Number(parseFloat(totalSum).toFixed(2));
                  console.log(totalSum);
                  return totalSum;
                },
              },
            },
            // },
          },
        },
        labels: labels,
        legend: {
          show: false,
          // /shownListVal.areaOrLength=='all'||shownListVal.count=='all'?false:true,
          position: 'bottom',
          horizontalAlign: 'center',
          height: '100%',
          width: '100%',
          fontSize: '10px',
          offsetX: 10,
          markers: {
            width: 6,
            height: 6,
          }
        },
        // dataLabels: {
        //   formatter(val, opts) {
        //     const name = opts.w.globals.labels[opts.seriesIndex]
        //     return [name, val.toFixed(1) + '%']
        //   }
        // },
        responsive: [
          {
            breakpoint: 150,
            options: {
              chart: {
                width: 150,
              },
              legend: {
                show: false,
                // position: 'bottom'
              },
            },
          },
        ],
      });
      setSeries( [44, 55, 41, 17, 15]);
    
  }, []);

  return (
    <div
      className="donut-chart"
      style={{
        maxWidth: "32vh",
        margin: "auto",
      }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
      // width={props.width||250}
      // height={props.height||250}
      />
    </div>
  );
}

export default DonutChart;
