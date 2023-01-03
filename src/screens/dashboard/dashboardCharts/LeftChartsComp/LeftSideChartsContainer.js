import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import GenericChart from "../GenericApexCharts";


function LeftSideChartsContainer({
  changeMapTablesShow,
  mapTablesShow,
  layersNames,
  selectedLayer,
  map,
  queryData,
}) {
  const { t } = useTranslation("dashboard");

  const [chartsDataArr, setChartsDataArr] = useState({
    data:[],
    layerName:''
  });
  
  useEffect(() => {
    if (selectedLayer) {
      let layerDataWithCharts = layersNames.find(
        (lay) => lay?.englishName === selectedLayer
      );
      setChartsDataArr({data:layerDataWithCharts.dashboardCharts, layerName:selectedLayer});
    }
  }, [selectedLayer]);
  if (chartsDataArr.data.length)
    return (
      <div
      className="left-side-chart-container"
      >
        <div
          className={
            chartsDataArr.data.filter((c) => c.position === "top").length <= 2
              ? "charts-layout-col"
              : "charts-layout-row"
          }
          style={chartsDataArr.data.length===3?{flexBasis:'60%'}:chartsDataArr.data.length===2?
          {flexBasis:'50%'}:{flexBasis:'auto'}}
        >
          {chartsDataArr.data
            .filter((c) => c.position === "top")
            .map((item, index) => {
              if (chartsDataArr.length === 2)
                return (
                  <div className="single-chart-item mapSquare" key={"chart"+index+"apex"}>
                    <GenericChart title={t(item.alias)} 
                    onClickTitle={changeMapTablesShow} 
                    sideTblTitle={mapTablesShow}
                    chartObj={item} 
                    selectedLayer={chartsDataArr.layerName}
                    map={map}
                    layersNames={layersNames}
                    type={item.chartType}
                   queryData={queryData}
                    />
                    {/* <PieChart width={200} height={200} title={t(item.alias)} /> */}
                  </div>
                );
              else
                return (
                  <div className="normal-chart-item mapSquare" key={"chart"+index+"apex"}>  
                    <GenericChart title={t(item.alias)} 
                    onClickTitle={changeMapTablesShow} 
                    sideTblTitle={mapTablesShow}
                    chartObj={item}
                    map={map}
                    selectedLayer={chartsDataArr.layerName}
                    layersNames={layersNames}
                    type={item.chartType} 
                   queryData={queryData}
                    
                    />
                  </div>
                );
            })}
        </div>
        {chartsDataArr.data
          .filter((c) => c.position === "bottom")
          .map((item) => {
            return (
              <div className="last-chart-item mapSquare" key={"chart-last"}>
               <GenericChart title={t(item.alias)} 
                    onClickTitle={changeMapTablesShow} 
                    sideTblTitle={mapTablesShow}
                    chartObj={item}
                    layersNames={layersNames}
                    map={map}
                    selectedLayer={chartsDataArr.layerName}
                    type={item.chartType}
                   queryData={queryData}
                    
                    />
              </div>
            );
          })}
      </div>
    );
  else return null;
}

export default LeftSideChartsContainer;
