import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import moment from "moment-hijri";
import Loader from '../../../LoadingComponent/index.jsx';
function LineChartComp(props) {
  const { t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  useEffect(() => {
    let { data, type,timePeriod } = props.chartData;
    if (data.length) {
      
      console.log(data);
      let series = data.map((item) => item["COUNT"]);
      let labels = data.map((item,index) => {
        //logic to conveert from Milady to Hijri
        let startDate = timePeriod && timePeriod[0];
        let endDate = timePeriod?(timePeriod?.length)>1?timePeriod[1]:timePeriod[0]:'';
        let startDayDate= ['monthly','daily'].includes(type)?startDate.split("-")[2]:'';
        let endDayDate=['monthly','daily'].includes(type)? endDate.split("-")[2]:'';
        switch (type) {
          case 'yearly':
            return moment(String(item["EXPR1"]),"YYYY").format("YYYY")
          case 'monthly':
            if(index===0)
            return moment(`${item["EXPR2"]}/${item["EXPR1"]}/${startDayDate}`,"YYYY/M/D").format("YYYY/MM")
            else if(index===(data.length-1))
            return moment(`${item["EXPR2"]}/${item["EXPR1"]}/${endDayDate}`,"YYYY/M/D").format("YYYY/MM")
            else
            return moment(`${item["EXPR2"]}/${item["EXPR1"]}/01`,"YYYY/M/D").format("YYYY/MM")
          default:
            console.log(moment(`${item["EXPR3"]}/${item["EXPR2"]}/${item["EXPR1"]}`,"YYYY/M/D").format("YYYY/MM/DD"));
            return moment(`${item["EXPR3"]}/${item["EXPR2"]}/${item["EXPR1"]}`,"YYYY/M/D").format("YYYY/MM/DD")
            
        }
      });
      setSeries([
        {
          name:
            type === "yearly"
              ? t("countPerYear")
              : type === "monthly"
              ? t("countPerMonth")
              : t("countPerDay"),
          data: series,
          type: "column",
        },
        {
          name:
            type === "yearly"
              ? t("countPerYear")
              : type === "monthly"
              ? t("countPerMonth")
              : t("countPerDay"),
          data: series,
          type: "line",
        },
      ]);
      setOptions({
        chart: {
          // width: "100%",
          height: labels.length>5?'320':"100%",

          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
          colors: ["#77B6EA", "#545454"],
          zoom: {
            enabled: true,
          },
        },
        stroke: {
          width: [0, 4],
        },
        //   stroke: {
        //     curve: 'smooth'
        //   },

        title: {
          text: props.title,
          align: "center",
          style: {
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: "NeoSansArabic",
          },
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: labels,
          title: {
            text:
              type === "yearly"
                ? t("year")
                : type === "monthly"
                ? t("month")
                : t("day"),
          },
          labels: {
            rotate: 90,
            show: true,
            align: 'center',
            minWidth: 0,
            maxWidth: 12,
            style: {
                colors: [],
                fontSize: '10px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 200,
                cssClass: 'apexcharts-yaxis-label',
                transform: 'rotate(270deg)'
            },
            // offsetX: 0,
            // offsetY: 0, 
            // rotateAlways: true,
            formatter: (value) => { return value },
        },
        },
        yaxis: [{
          title: {
            text: t("count"),
          },
          labels: {
            show: true,
            offsetX: -15,
            formatter: (val) => { 
            if(props.chartData.type==='daily') return val;
            else return val/1000 +"K" 
            },
        },
        },{
               show: false,
        }],
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        tooltip: {
          enabled: true,
          enabledOnSeries: [0],
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return value
            }
          }
        }
      });
    }
   
  }, [props.chartData?.data]);
useEffect(()=>{
  return ()=>{
    setSeries([]);
    setOptions({})
}
},[])
if(!props.chartData?.data) return <Loader />
  else return (
    <div
      className="Columnchart1"
      style={{
        maxWidth: "50vh",
        margin: "auto",
      }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        // height={200}
      />
    </div>
  );
}

export default LineChartComp;
