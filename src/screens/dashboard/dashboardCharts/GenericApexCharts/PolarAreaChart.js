import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function PolarAreaChart(props) {
  const { t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    let { preparedChartData, title, shownDataTypes } = props;

    setOptions({
      chart: {
        width: "100%",
        type: "polarArea",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },

        stroke: {
          colors: ["#fff"],
        },
        fill: {
          opacity: 0.8,
        },
      },
      // title: {
      //   text: title,
      //   align: 'center',
      //   style: {
      //       fontSize:  '14',
      //       fontWeight:  'bold',
      //       fontFamily:  "NeoSansArabic",

      //     },
      // },
      legend: { show: false },
      labels: preparedChartData.map((i) => i.label),
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
    setSeries(preparedChartData.map((i) => i.count));
    setLabels(preparedChartData.map((i) => i.label));

    return () => {
      setSeries([]);
      setOptions({});
    };
  }, [props.preparedChartData]);
  useEffect(()=>{
    if(props.sideTblTitle===props.title){
      props.onClickTitle({
        data: series,
        title: props.title,
        labels,
      })
    }
    
  },[series]);
  const handleHeatMap =()=>{
    console.log("create heat map");
  }
  return (
    <div className="ape-chart">
      <div className="col text-center">

      <h6
        onClick={() =>
          props.onClickTitle({ data: series, title: props.title, labels })
        }
        style={{
          fontFamily: "NeoSansArabic",
          textAlign: "center",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {props.title}
      </h6>
      {/* <img src={props.mapLogoSrc} className="map-pointer" alt="map logo" onClick={handleHeatMap} /> */}
          </div>

      <ReactApexChart
        options={props.options || options}
        series={props.series || series}
        type="polarArea"
        // width={props.width||250}
        // height={props.height||250}
      />
    </div>
  );
}

export default PolarAreaChart;
