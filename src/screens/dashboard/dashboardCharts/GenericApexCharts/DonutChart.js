import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function DonutChart(props) {
  const { t } = useTranslation("dashboard");
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    let { preparedChartData } = props;

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
          monochrome: {
            enabled: false,
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
                // formatter: function (val) {
                //   let statisticsTypeUpper = statisticsType.toUpperCase();

                //   if (series[0][statisticsTypeUpper].toString().length > 4)
                //     return String(Number(parseFloat(val).toFixed(2)))+"K";
                //   else
                //     return String(Number(parseFloat(val).toFixed(2))) + "K";
                // },
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
        labels: preparedChartData.map(i=>i.label),
        legend: {
          show: false,
        
        },
  
      
      });
      setSeries( preparedChartData.map(i=>i.count));
      setLabels(preparedChartData.map((i) => i.label))
    
      return ()=>{
        setSeries([]);
        setOptions({})
      }
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
    className="ape-chart"
    >
      <div className="col text-center">

      <h6 
            onClick={()=>props.onClickTitle({title:props.title, data:series,labels})}

      
      style={{fontFamily: 'NeoSansArabic', textAlign:'center',fontWeight:'bold',cursor:'pointer'}}>{props.title}</h6>
        {/* <img src={props.mapLogoSrc} className="map-pointer" alt="map logo" onClick={handleHeatMap} /> */}

        </div>
      <ReactApexChart
        options={props.options || options}
        series={props.series || series}
        type="donut"
      // width={props.width||250}
      // height={props.height||250}
      />
    </div>
  );
}

export default DonutChart;
