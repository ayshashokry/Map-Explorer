import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

//just width affects the chart

function PieChart(props) {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    let { preparedChartData, title, shownDataTypes } = props;

    setOptions({
      chart: {},
      legend: {
        show: false,
      },
      labels: preparedChartData.map((i) => i.label),

      chartOptions: {
        labels: preparedChartData.map((i) => i.label),
      },


    });
    setLabels(preparedChartData.map((i) => i.label));

    setSeries(preparedChartData.map((i) => i.count));
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
        options={options}
        series={series}
        type="pie"
        // width={props.width||250}
        // height={props.height||250}
      />
    </div>
  );
}

export default PieChart;
