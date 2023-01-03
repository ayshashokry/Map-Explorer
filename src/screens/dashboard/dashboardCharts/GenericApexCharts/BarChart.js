import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { getMinMax } from "../../../../helper/utilsFunc";

function BarChartComp(props) {
  const { i18n, t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [options, setOptions] = useState({});
  useEffect(() => {
    let max = getMinMax(props.preparedChartData.map((i) => i.count)).max;

    setSeries([
      {
        name: props.title,
        data:
          max < 10000
            ? props.preparedChartData.map((i) => i.count)
            : props.preparedChartData.map((i) => i.count / 1000),
      },
    ]);
    setLabels(
      props.preparedChartData.map((i) => {
        return {
          value: i.label,
          countInK: !(max < 10000),
        };
      })
    );

    setOptions({
      chart: {
        id: "basic-bar",
        height: "100%",
      },
      legend: { show: false },
      plotOptions: {
        bar: {
          // dataLabels: {
          //     position: 'bottom', // top, center, bottom
          // },
          horizontal: props.type === "bar" ? true : false,
          distributed: true,

          columnWidth: "90%",
        },
      },
      xaxis: {
        categories: props.preparedChartData.map((i) => i.label),
        title:
          props.type === "bar"
            ? {
                text: max < 10000 ? t("count") : `${t("count")} *1000`,
              }
            : {},
      },
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val * 1000;
        },
        offsetY: 0,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      yaxis: {
        reversed: false,
        axisTicks: {
          show: true,
        },
      },
      // title: {
      //     text: props.title,
      //     align: 'center',
      //     style: {
      //         fontSize: '16px',
      //         fontWeight: 'bold',
      //         fontFamily: "NeoSansArabic",

      //     },
      // },

      tooltip: {
        followCursor: true,
        fillSeriesColor: true,
        onDatasetHover: {
          highlightDataSeries: true,
        },
        items: {
          display: "flex",
        },
        fixed: {
          enabled: true,
          position: "topRight",
          offsetX: 0,
          offsetY: 0,
        },
        x: {
          formatter: function (
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            return w.globals.labels[dataPointIndex];
          },
        },
        y: {
          formatter: function (value) {
            return `${t("count")}:${value}`;
          },
          title: {
            formatter: (seriesName) => "",
          },
        },
      },
    });
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
    
  },[series])
  const handleHeatMap =()=>{
    console.log("create heat map");
  }
  return (
    <div
      className="ape-chart bar"
      style={
        i18n.language === "ar" ? { direction: "ltr" } : { direction: "rtl" }
      }
    >
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
        // height={'auto'}
        width={"100%"}
        type={"bar"}
      />
    </div>
  );
}

export default BarChartComp;
