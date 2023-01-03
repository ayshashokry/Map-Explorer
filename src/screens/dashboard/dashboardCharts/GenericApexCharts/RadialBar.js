import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

function RadialGauge(props) {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    let { preparedChartData, title, shownDataTypes } = props;

    setOptions({
      chart: {
        // width: 250,
        type: "radialBar",
      },

      colors: ["#20E647"],
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
            },
          },
        },
      },

      legend: { show: false },
      labels: preparedChartData.map((i) => i.label),
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
          props.onClickTitle({
            data: series,
            title: props.title,
            labels,
          })
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
        type="radialBar"
        // width={props.width||250}
        // height={props.height||250}
      />
    </div>
  );
}

export default RadialGauge;
