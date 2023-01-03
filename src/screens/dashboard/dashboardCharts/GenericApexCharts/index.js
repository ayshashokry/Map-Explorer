import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../../containers/Loader";
import BarChartComp from "./BarChart";
import DonutChart from "./DonutChart";
import LineChartComp from "./lineChart";
import PieChart from "./PieChart";
import PolarAreaChart from "./PolarAreaChart";
import RadialBar from "./RadialBar";
import { getLayerId } from "../../../../helper/common_func";
import { getStatisticsDataForChart, getTimePeriod } from "../../helpers/helperFunc";
import MAPLOGO from '../../../../assets/images/dashboard/map-marker.png'
function GenericChart({
  chartObj,
  onClickTitle,
  selectedLayer,
  title,
  type,
  map,
  sideTblTitle,
  queryData,
}) {
  const { t } = useTranslation("dashboard");

  const [preparedChartData, setPreparedChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let layerID = getLayerId(map.__mapInfo, selectedLayer);
    let statisticsObj = chartObj;
    let fieldName = chartObj.name;
    let timeContextType = queryData.selectedTimeContext.type;
    let whereClause = '';
    if (queryData?.selectedBoundaryType?.value && queryData?.selectedBoundaryType?.selectedBoundary) {
      whereClause += `${queryData?.selectedBoundaryType?.value} = ${queryData?.selectedBoundaryType?.selectedBoundary}`;
    }
    if (queryData.selectedTimeContext.dateData?.length) {
      let timePeriod = getTimePeriod(queryData);
      let extractedPeriod =
        timeContextType === "yearly"
          ? "YEAR"
          : timeContextType === "monthly"
            ? "MONTH"
            : "DAY";
      let extractedStatment =
        timeContextType === "yearly"
          ? `EXTRACT (${extractedPeriod} FROM CREATED_DATE)`
          : timeContextType === "monthly"
            ? `EXTRACT (${extractedPeriod} FROM CREATED_DATE), EXTRACT (YEAR FROM CREATED_DATE)`
            : `EXTRACT (${extractedPeriod} FROM CREATED_DATE),EXTRACT (MONTH FROM CREATED_DATE), EXTRACT (YEAR FROM CREATED_DATE)`;
      let whereClauseDueToTimeContext =
        timeContextType === "yearly"
          ? `${extractedStatment} IN (${timePeriod.join(",")})`
          : timePeriod.length > 1 && ["monthly", "daily"].includes(timeContextType)
            ? "" +
            'CREATED_DATE' +
            " BETWEEN DATE '" +
            timePeriod.join("' AND DATE '") +
            "'"
            : `CREATED_DATE =DATE '${timePeriod.join(" ")}'`;
            whereClause = whereClause? whereClause + " AND " +whereClauseDueToTimeContext: whereClauseDueToTimeContext;
    }
    getStatisticsDataForChart(
      statisticsObj,
      layerID,
      ({ data }) => {
        setIsLoading(true);
        let haveCodeValue = data.find(i => i[fieldName + "_Code"]);
        let preparedSeries = data.reduce((cu, item) => {
          let hasArea = statisticsObj.shownData.find((i) => i === "area");
          if (!cu.length) {
            if (
              (![null, -1].includes(item[fieldName]) &&
                !haveCodeValue) ||
              (haveCodeValue && item[fieldName + "_Code"] &&
                ![null, -1].includes(item[fieldName + "_Code"]))
            )
              //to filter null, no value
              hasArea
                ? cu.push({
                  label: item[fieldName],
                  count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  area: parseFloat(item["AREADISTINCT"] || item["AREA"]),
                  value: (haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                })
                : cu.push({
                  label: item[fieldName],
                  count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                });
            else
              hasArea
                ? cu.push({
                  label: t("NotDefined"),
                  count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  area: parseFloat(item["AREADISTINCT"] || item["AREA"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                })
                : cu.push({
                  label: t("NotDefined"),
                  count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                });
          } else {
            if (
              (![null, -1].includes(item[fieldName]) &&
                !haveCodeValue) ||
              (haveCodeValue && item[fieldName + "_Code"] &&
                ![null, -1].includes(item[fieldName + "_Code"]))
            )
              hasArea
                ? cu.push({
                  label: item[fieldName],
                  count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  area: parseFloat(item["AREADISTINCT"] || item["AREA"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                })
                : cu.push({
                  label: item[fieldName],
                  count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                });
            else {
              let isUndefinedExist = cu.find(
                (i) => i.label === t("NotDefined")
              );
              if (isUndefinedExist) {
                isUndefinedExist["count"] += parseFloat(
                  item["COUNTDISTINCT"] || item["COUNT"]
                );
                if (hasArea)
                  isUndefinedExist.area += parseFloat(
                    item["AREADISTINCT"] || item["AREA"]
                  );
              } else
                hasArea
                  ? cu.push({
                    label: t("NotDefined"),
                    count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                    area: parseFloat(item["AREADISTINCT"] || item["AREA"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                  })
                  : cu.push({
                    label: t("NotDefined"),
                    count: parseFloat(item["COUNTDISTINCT"] || item["COUNT"]),
                  value:(haveCodeValue && item[fieldName + "_Code"] &&
                  ![null, -1].includes(item[fieldName + "_Code"]))? item[fieldName+"_Code"]
                  :item[fieldName]
                  });
            }
          }

          return cu;
        }, []);
        setPreparedChartData(preparedSeries);
        console.log({ data, preparedSeries });
      },
      (err) => {
        console.log(err);
        setIsLoading(true);
      }, whereClause    //where clause
    );
  }, [selectedLayer,
    queryData?.selectedTimeContext?.dateData,
    queryData?.selectedTimeContext?.type,
    queryData?.selectedBoundaryType?.selectedBoundary
  ]);
  if (!isLoading) return <Loader />;
  else if (["bar", "col"].includes(type) && preparedChartData)
    return (
      <BarChartComp
        preparedChartData={preparedChartData}
        shownDataTypes={chartObj.shownData}
        title={title}
        onClickTitle={onClickTitle}
        sideTblTitle={sideTblTitle}
        type={type}
        mapLogoSrc={MAPLOGO}
      />
    );
  else if (type === "line" && preparedChartData)
    return (
      <LineChartComp
        preparedChartData={preparedChartData}
        shownDataTypes={chartObj.shownData}
        title={title}
        onClickTitle={onClickTitle}
        sideTblTitle={sideTblTitle}
        mapLogoSrc={MAPLOGO}
      />
    );
  else if (type === "pie" && preparedChartData)
    return (
      <PieChart
        preparedChartData={preparedChartData}
        shownDataTypes={chartObj.shownData}
        title={title}
        onClickTitle={onClickTitle}
        sideTblTitle={sideTblTitle}
        mapLogoSrc={MAPLOGO}
      />
    );
  else if (type === "donut" && preparedChartData)
    return (
      <DonutChart
        preparedChartData={preparedChartData}
        shownDataTypes={chartObj.shownData}
        title={title}
        onClickTitle={onClickTitle}
        sideTblTitle={sideTblTitle}
        mapLogoSrc={MAPLOGO}
      />
    );
  else if (type === "radialBar" && preparedChartData)
    return (
      <RadialBar
        shownDataTypes={chartObj.shownData}
        preparedChartData={preparedChartData}
        title={title}
        onClickTitle={onClickTitle}
        sideTblTitle={sideTblTitle}
        mapLogoSrc={MAPLOGO}
      />
    );
  else if (type === "polarArea" && preparedChartData)
    return (
      <PolarAreaChart
        shownDataTypes={chartObj.shownData}
        preparedChartData={preparedChartData}
        title={title}
        onClickTitle={onClickTitle}
        sideTblTitle={sideTblTitle}
        mapLogoSrc={MAPLOGO}
      />
    );
  else return null;
}

export default GenericChart;
