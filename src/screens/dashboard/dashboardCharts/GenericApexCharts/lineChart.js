import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { getMinMax } from "../../../../helper/utilsFunc";

function LineChartComp(props) {
  const { t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [options, setOptions] = useState({});
  useEffect(() => {
    let { preparedChartData, title, shownDataTypes } = props;
    let hasArea = shownDataTypes.find((i) => i === "area");
    let max = getMinMax(preparedChartData.map((i) => i.count)).max;

    if (hasArea) {
      setSeries([
        {
          name: t("count"),
          data:
            max < 10000
              ? preparedChartData.map((i) => parseFloat(i.count).toFixed(2))
              : preparedChartData.map((i) =>
                  parseFloat(i.count / 1000).toFixed(2)
                ),
        },
        {
          name: t("area"),
          data: preparedChartData.map((i) =>
            parseFloat(i.area / 1000000).toFixed(2)
          ),
        },
      ]);
    } else
      setSeries([
        {
          name: title,
          data:
            max < 10000
              ? preparedChartData.map((i) => parseFloat(i.count).toFixed(2))
              : preparedChartData.map((i) =>
                  parseFloat(i.count / 1000).toFixed(2)
                ),
        },
      ]);
    setLabels(
      preparedChartData.map((i) => {
        return {
          value: i.label,
          countInK: !(max < 10000),
        };
      })
    );
    setOptions({
      chart: {
        // height: 250,
        // type: 'line',
        id: "areachart-2",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },
      // title: {
      //   text: title,
      //   align: "center",
      //   style: {
      //     fontSize: "14",
      //     fontWeight: "bold",
      //     fontFamily: "NeoSansArabic",
      //   },
      // },
      yaxis: {
        reversed: false,
      },
      tooltip: {
        enabled: true,
        x: {
          formatter: function (
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            // console.log(value, { series, seriesIndex, dataPointIndex, w });
            return w.globals.categoryLabels[dataPointIndex];
          },
        },
        y: {
          formatter: function (
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            if (hasArea) {
              if (seriesIndex === 1) return `${t("area")}: ${value}`;
              else return `${t("count")}:${value}`;
            }
            return `${t("count")}:${value}`;
          },
          title: {
            formatter: (seriesName) => "",
          },
        },
      },
      yasix: {
        title: {
          // text: "count",
          // rotate: -90,
        },
      },
      markers: {
        size: 4,
        color: "#28a745",
      },
      xaxis: {
        categories: preparedChartData.map((i) => i.label),
        labels: {
          show: false,
          rotate: 90,
          // rotateAlways: true,
        },
        title: {
          text: props.shownDataTypes.includes("area")
            ? max < 10000
              ? t("CountAndAreaWthKM")
              : t("CountKAndAreaWthKM")
            : max < 10000
            ? t("count")
            : `${t("count")} * 1000`,
        },
      },
    });
    return () => {
      setSeries([]);
      setOptions({});
    };
  }, [props.preparedChartData]);
  useEffect(() => {
    return () => {
      setSeries([]);
      setOptions({});
    };
  }, []);
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
            title: props.title,
            data: series,
            labels,
            hasArea: props.shownDataTypes.find((i) => i === "area"),
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
        type="line"
        // width={'100%'}
        height={150}
      />
    </div>
  );
}

export default LineChartComp;
