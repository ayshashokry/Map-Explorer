import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import Loader from "../../../../containers/Loader";
import {
  clearGraphics,
  getLayerId,
  highlightFeature,
  queryTask,
  zoomToFeatures,
} from "../../../../helper/common_func";
import { generateGraduatedColor } from "../../../../helper/utilsFunc";

function DonutChart(props) {
  const { t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [seriesOriginal, setSeriesOriginal] = useState([]);
  const [options, setOptions] = useState({});
  
  useEffect(() => {
    let {
      data,
      boundAdminType,
      statisticsType,
      shownListVal,
      activeHeatMapFactor,
    } = props;
    if (data) {
      let areaField = "area";
      let statisticsTypeUpper =
        statisticsType === "areaOrLength"
          ? areaField.toUpperCase()
          : statisticsType.toUpperCase();
      let sortedData = data
        .map((item) => {
          if (parseFloat(item[statisticsTypeUpper])) {
            return item;
          } else {
            item[statisticsTypeUpper] = 0;
            return item;
          }
        })
        .sort((a, b) => {
          if (statisticsType === "areaOrLength")
            return (
              Number(parseFloat(b[statisticsTypeUpper])) -
              Number(parseFloat(a[statisticsTypeUpper]))
            );
          else
            return (
              parseInt(b[statisticsTypeUpper]) -
              parseInt(a[statisticsTypeUpper])
            );
        });
        let sortedDataBeforeFilter = [...sortedData];
        let colors=[];
        let colorsBeforeFilter =
        statisticsType === "count"
          ? generateGraduatedColor(0, 128, 0, sortedData.length)
          : generateGraduatedColor(0, 56, 104, sortedData.length);
        let seriesForHeatmap = sortedDataBeforeFilter.map((item,index)=>{
          return {
            value:Object.keys(item).includes(boundAdminType + "_Code")?
            item[boundAdminType + "_Code"]:item[boundAdminType],
            color: colorsBeforeFilter[index],
          }
        })
        setSeriesOriginal(seriesForHeatmap);
        if (
        (statisticsType === "areaOrLength" &&
          shownListVal.areaOrLength == "max-6") ||
        (statisticsType === "count" && shownListVal.count == "max-6")
      )
        {
          colors = colorsBeforeFilter.slice(0,6)
          sortedData = sortedData.slice(0, 6);
        }
      else if (
        (statisticsType === "areaOrLength" &&
          shownListVal.areaOrLength == "min-6") ||
        (statisticsType === "count" && shownListVal.count == "min-6")
      )
        {
          
          colors = colorsBeforeFilter.slice(sortedData.length - 6, sortedData.length)
          sortedData = sortedData.slice(sortedData.length - 6, sortedData.length);
        }
        else{
          colors = [...colorsBeforeFilter]
          sortedData = [...sortedData];
        }
      let series = sortedData.map((item) =>
        statisticsType === "areaOrLength"
          ? Number(parseFloat(item[statisticsTypeUpper] / 1000000).toFixed(2))
          : sortedData[0][statisticsTypeUpper] < 10000
          ? parseInt(item[statisticsTypeUpper])
          : +parseInt(item[statisticsTypeUpper]).toFixed(2)
      );
      let labels = sortedData.map((item) =>
        item[boundAdminType] ? item[boundAdminType] : t("notFound")
      );
      setOptions({
        chart: {
          width: "100%",
          type: "pie",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        colors,
        // theme: {
        //   mode: 'light',
        //   // palette: statisticsType === 'count' ? 'palette10' : 'palette3',
        //   monochrome: {
        //     enabled: false,
        //     // color: '#255aee',
        //     shadeTo: 'light',
        //     shadeIntensity: 0.8
        //   }
        // },

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
                    return String(Number(parseFloat(val).toFixed(2))) + "K";
                  else return String(Number(parseFloat(val).toFixed(2))) + "K";
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
          position: "bottom",
          horizontalAlign: "center",
          height: "100%",
          width: "100%",
          fontSize: "10px",
          offsetX: 10,
          markers: {
            width: 6,
            height: 6,
          },
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
      setSeries(series);
    }
  }, [props.data, props.shownListVal]);
  useEffect(()=>{
    let { activeHeatMapFactor, statisticsType } = props;
    if ((activeHeatMapFactor === statisticsType)&&seriesOriginal.length)
    createHeatMap(seriesOriginal);
  },[props.activeHeatMapFactor, seriesOriginal,props.statisticsType])

  const createHeatMap = (data) => {
    let { queryData, boundAdminType, map,activeHeatMapFactor } = props;
    clearGraphics(["ThematicGraphicLayer"], map);
    let boundValues = data.filter(i=>{
      let value;
      if(typeof i.value==='string') {
        value = i.value.trim();
        if(value) return value;
      }
      else {
        value = i.value;
        if(value) return value;
      }
      
    }).map((i) => {
     if(typeof i.value==='string') return `${i.value}`;
     else return i.value
    });
    console.log({boundValues});
    let boundLayer;
    switch (boundAdminType) {
      case "MUNICIPALITY_NAME":
        boundLayer = "Municipality_Boundary";
        break;
      case "SUB_MUNICIPALITY_NAME":
        boundLayer = "Sub_Municipality_Boundary";

        break;
      case "PLAN_NO":
        boundLayer = "Plan_Data";

        break;

      default:
        boundLayer = "District_Boundary";
        break;
    }
    let layerID = getLayerId(map.__mapInfo, boundLayer);

    queryTask({
      url: window.mapUrl + "/" + layerID,
      notShowLoading: true,
      returnGeometry: true,
      outFields: ["OBJECTID", `${boundAdminType}`],
      where:  boundAdminType==='PLAN_NO'?`${queryData.selectedBoundaryType.value} IN ('${boundValues.join(
        "' , '"
      )}')`:`${queryData.selectedBoundaryType.value} IN (${boundValues.join(
        " , "
      )})`
      ,
      callbackResult: ({ features }) => {
        if (features.length) {
          features.forEach((feat, index) => {
            feat.attributes.color = data.find(
              (item) => item.value === feat.attributes[boundAdminType]
            ).color;
            highlightFeature(feat, map, {
              layerName: "ThematicGraphicLayer",
              isHiglightSymbol: true,
              highlighColor: feat.attributes.color,
              noclear: index == 0 ? false : true,
            });
          });
         if(!activeHeatMapFactor) zoomToFeatures(features,map)
        }
      },
      callbackError: (err) => {
        console.log(err);
      },
    });
  };
  
  return (
    <div
      className="donut-chart"
      style={{
        maxWidth: "32vh",
        margin: "auto",
      }}
    >
      {Object.keys(options).length && series.length ? (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          // width={props.width||250}
          // height={props.height||250}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default DonutChart;
