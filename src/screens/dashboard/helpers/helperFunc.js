import moment from "moment-hijri";
import { getFeatureDomainName, queryTask } from "../../../helper/common_func";
import { convertNumbersToEnglish, getNoDaysPerMonth } from "../../../helper/utilsFunc";

//get default data for dashboard
export async function getDefaultStatistics(layerObj) {
  let { boundAdminType } = layerObj;
  let statisticsData = await getStatisticsForFeatLayer(layerObj);
  let { data } = statisticsData;

  let count = data.length && Object.keys(data[0]).includes('COUNT')
    ? data.map((item) => {
        return {
          COUNT: item.COUNT,
          [boundAdminType]: item[boundAdminType],
          [boundAdminType==='PLAN_NO'?boundAdminType:boundAdminType+"_Code"]:
          item[[boundAdminType==='PLAN_NO'?boundAdminType:boundAdminType+"_Code"]]
        };
      })
    : data.COUNT;
  let area = data.length&& Object.keys(data[0]).includes('AREA')
    ? data.map((item) => {
        return {
          AREA: item.AREA,
          [boundAdminType]: item[boundAdminType],
          [boundAdminType==='PLAN_NO'?boundAdminType:boundAdminType+"_Code"]:
          item[[boundAdminType==='PLAN_NO'?boundAdminType:boundAdminType+"_Code"]]
        };
      })
    : data.AREA;
  let length = data.length&&Object.keys(data[0]).includes('LENGTH')
    ? data.map((item) => {
        return {
          LENGTH: item.LENGTH,
          [boundAdminType]: item[boundAdminType],
          [boundAdminType==='PLAN_NO'?boundAdminType:boundAdminType+"_Code"]:
          item[[boundAdminType==='PLAN_NO'?boundAdminType:boundAdminType+"_Code"]]
        };
      })
    : data.LENGTH;
  let settedData = {
    count: count,
  };
  if (area) {
    settedData.areaOrLength = {
      value: typeof area === "number" ? parseInt(area / 1000000) : area,
      type: "area",
    };
  } else if (length) {
    settedData.areaOrLength = {
      value: typeof length === "number" ? parseInt(length / 1000) : length,
      type: "length",
    };
  } else {
    settedData.areaOrLength = {
      value: undefined,
      type: "",
    };
  }

  return settedData;
}

export const getCountPerTimeContext = async (
  layerID,
  timeContextType,
  timePeriod,whereStat
) => {
  let groupByField = "CREATED_DATE";
  let extractedPeriod =
    timeContextType === "yearly"
      ? "YEAR"
      : timeContextType === "monthly"
      ? "MONTH"
      : "DAY";
  let extractedStatment = 
    timeContextType === "yearly"
      ? `EXTRACT (${extractedPeriod} FROM ${groupByField})`
      : timeContextType === "monthly"
      ? `EXTRACT (${extractedPeriod} FROM ${groupByField}), EXTRACT (YEAR FROM ${groupByField})`
      : `EXTRACT (${extractedPeriod} FROM ${groupByField}),EXTRACT (MONTH FROM ${groupByField}), EXTRACT (YEAR FROM ${groupByField})`;
  let where = !timePeriod?"1=1":
    timeContextType === "yearly"
      ? `${extractedStatment} IN (${timePeriod.join(",")})`
      : timePeriod.length > 1 && ["monthly", "daily"].includes(timeContextType)
      ? "" +
        groupByField +
        " BETWEEN DATE '" +
        timePeriod.join("' AND DATE '") +
        "'"
      : `${groupByField} =DATE '${timePeriod.join(" ")}'`;
      if(whereStat) where =where!=="1=1"?"("+ where + ") AND " +whereStat:whereStat;
  let statistics = [
    {
      type: "count",
      field: `${extractedStatment}`,
      name: "count",
    },
  ];
  let promise = new Promise((resolve, reject) => {
    let queryParams = {
      url: window.mapUrl + "/" + layerID,
      notShowLoading: true,
      returnGeometry: false,
      groupByFields: `${extractedStatment}`,
      statistics: !timePeriod?statistics: (statistics || [
        {
          type: "count",
          field: "OBJECTID",
          name: "count",
        },
      ]),
      where,
    };

    queryTask({
      ...queryParams,
      callbackResult: ({ features }) => {
        if (features.length)
          getFeatureDomainName(features, layerID).then((data) => {
            let sortedData = [];
          
              sortedData = data
                .map((f) => f.attributes)
                .sort((a, b) => a["EXPR1"] - b["EXPR1"]);
            console.log({ sortedData });
            resolve({ data: sortedData });
          });
        else resolve(undefined);
      },
      callbackError: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
  return promise;
};


export const getStatisticsForFeatLayer = async (layerObj, where = "1=1") => {
  let { layerID, statistics, boundAdminType } = layerObj;
  // groupByFields
  let promise = new Promise((resolve, reject) => {
    let queryParams = {
      url: window.mapUrl + "/" + layerID,
      notShowLoading: true,
      returnGeometry: false,
      statistics: statistics || [
        {
          type: "count",
          field: "OBJECTID",
          name: "count",
        },
      ],
      where,
    };
    if (boundAdminType) {
      queryParams.groupByFields = boundAdminType;
    }
    queryTask({
      ...queryParams,
      callbackResult: ({ features }) => {
        if (features.length)
          getFeatureDomainName(features, layerID).then((data) => {
            resolve({
              data: boundAdminType
                ? data.map((f) => f.attributes)
                : data[0].attributes,
            });
          });
          else resolve({data:[]})
      },
      callbackError: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
  return promise;
};

export function getStatisticsDataForChart(statisticsObj,layerID,callBackFunc, callBackError,where="1=1"){
  let { name, shownData } = statisticsObj;
 
    let queryParams = {
      url: window.mapUrl + "/" + layerID,
      notShowLoading: true,
      returnGeometry: false,
      returnDistinctValues:true,
      groupByFields: `${name}`,
      statistics: (shownData.map((item)=>{
        if(item==='area'&& name ==='OWNER_TYPE')return {
          type:'sum', field:'PARCEL_AREA', name:item
        };
        else
        return {
          type:item, field:name, name:item
        }
      }) || [
        {
          type: "count",
          field: "OBJECTID",
          name: "count",
        },
      ]),
      where,
    };

    queryTask({
      ...queryParams,
      callbackResult: ({ features }) => {
        if (features.length)
          getFeatureDomainName(features, layerID).then((data) => {
            let sortedData = [];
          
              sortedData = data
                .map((f) => f.attributes)
                .sort((a, b) => (a["COUNTDISTINCT"] || a["COUNT"]) - (b["COUNTDISTINCT"]||b["COUNT"]));
            console.log({ sortedData });
            callBackFunc({ data: sortedData });
          });
        else callBackFunc(undefined);
      },
      callbackError: (err) => {
        console.log(err);
        callBackError(err);
      },
    });
 
}

export const getWhereClauseForTimeContext = (
  timeContextType,
  timePeriod)=>{
  let groupByField = "CREATED_DATE";
  let extractedPeriod =
    timeContextType === "yearly"
      ? "YEAR"
      : timeContextType === "monthly"
      ? "MONTH"
      : "DAY";
  let extractedStatment = 
    timeContextType === "yearly"
      ? `EXTRACT (${extractedPeriod} FROM ${groupByField})`
      : timeContextType === "monthly"
      ? `EXTRACT (${extractedPeriod} FROM ${groupByField}), EXTRACT (YEAR FROM ${groupByField})`
      : `EXTRACT (${extractedPeriod} FROM ${groupByField}),EXTRACT (MONTH FROM ${groupByField}), EXTRACT (YEAR FROM ${groupByField})`;
  let where = !timePeriod?"1=1":
    timeContextType === "yearly"
      ? `${extractedStatment} IN (${timePeriod.join(",")})`
      : timePeriod.length > 1 && ["monthly", "daily"].includes(timeContextType)
      ? "" +
        groupByField +
        " BETWEEN DATE '" +
        timePeriod.join("' AND DATE '") +
        "'"
      : `${groupByField} =DATE '${timePeriod.join(" ")}'`;
 
  return where;
}


export const getTimePeriod = (queryData)=>{
  let timePeriod = [];
  if (queryData.selectedTimeContext.dateData.length === 1) {
    let dateData = queryData.selectedTimeContext.dateData[0];
    if (queryData.selectedTimeContext.type === "yearly") {
      let utcDate = moment(`${dateData.year}`, "YYYY");
      timePeriod.push(utcDate.year());
    } else if (queryData.selectedTimeContext.type === "monthly") {
      let utcDate = moment(
        `${dateData.year}/${dateData.month.number}/01`,
        "YYYY/M/D"
      ).format("YYYY-MM-DD");
      let year = utcDate.split("-")[0];
      let month = utcDate.split("-")[1];
      let day = utcDate.split("-")[2];
      timePeriod = [
        `${year}-${month}-${day}`,
        `${year}-${month}-${getNoDaysPerMonth(month)}`,
      ];
    } else if (queryData.selectedTimeContext.type === "daily") {
      let utcDate = moment(
        `${dateData.year}/${dateData.month.number}/${dateData.day}`,
        "YYYY/M/D"
      ).format("YYYY-MM-DD");
      let year = utcDate.split("-")[0];
      let month = utcDate.split("-")[1];
      let day = utcDate.split("-")[2];
      timePeriod = [`${year}-${month}-${day}`];
    }
  } else if (queryData.selectedTimeContext.dateData.length === 2) {
    let start,
      end,
      startUTC,
      endUTC,
      startUTCMonth,
      endUTCMonth,
      startUTCDay,
      endUTCDay,
      startUTCYear,
      endUTCYear;
    let startDate = queryData.selectedTimeContext.dateData[0];
    let endDate = queryData.selectedTimeContext.dateData[1];
    switch (queryData.selectedTimeContext.type) {
      case "yearly":
        startUTC = moment(`${startDate.year}`, "YYYY");
        start = parseInt(convertNumbersToEnglish(startUTC.year()));
        endUTC = moment(`${endDate.year}`, "YYYY");
        end = parseInt(convertNumbersToEnglish(endUTC.year()));
        if (end - start === 0) timePeriod = [start];
        else {
          while (!timePeriod.includes(end)) {
            if (!timePeriod.length) timePeriod.push(start);
            else timePeriod.push(timePeriod[timePeriod.length - 1] + 1);
          }
        }
        break;
      case "monthly":
        startUTC = moment(
          `${startDate.year}/${startDate.month.number}/01`,
          "YYYY/M/D"
        ).format("YYYY-MM-DD");
        startUTCYear = parseInt(
          convertNumbersToEnglish(startUTC.split("-")[0])
        );
        start = parseInt(convertNumbersToEnglish(startUTC.split("-")[1]));
        endUTC = moment(
          `${endDate.year}/${endDate.month}/${getNoDaysPerMonth(
            endDate.month
          )}`,
          "YYYY/M/D"
        ).format("YYYY-MM-DD");
        endUTCYear = parseInt(convertNumbersToEnglish(endUTC.split("-")[0]));
        end = parseInt(convertNumbersToEnglish(endUTC.split("-")[1]));
        if (end - start === 0)
          timePeriod = [`${startUTCYear}-${start}-${startUTC.split("-")[2]}`];
        else {
          timePeriod = [
            `${startUTCYear}-${start}-${startUTC.split("-")[2]}`,
            `${endUTCYear}-${end}-${endUTC.split("-")[2]}`,
          ];
        }
        break;
      default:
        startUTC = moment(
          `${startDate.year}/${startDate.month.number}/${startDate.day}`,
          "YYYY/M/D"
        ).format("YYYY-MM-DD");
        startUTCYear = parseInt(
          convertNumbersToEnglish(startUTC.split("-")[0])
        );
        startUTCMonth = parseInt(
          convertNumbersToEnglish(startUTC.split("-")[1])
        );
        start = parseInt(convertNumbersToEnglish(startUTC.split("-")[2]));
        endUTC = moment(
          `${endDate.year}/${endDate.month}/${endDate.day}`,
          "YYYY/M/D"
        ).format("YYYY-MM-DD");
        endUTCYear = parseInt(convertNumbersToEnglish(endUTC.split("-")[0]));
        endUTCMonth = parseInt(convertNumbersToEnglish(endUTC.split("-")[1]));
        end = parseInt(convertNumbersToEnglish(endUTC.split("-")[2]));
        if (end - start === 0)
          timePeriod = [`${startUTCYear}-${startUTCMonth}-${start}`];
        else {
          timePeriod = [
            `${startUTCYear}-${startUTCMonth}-${start}`,
            `${endUTCYear}-${endUTCMonth}-${end}`,
          ];
        }
        break;
    }
  }
  return timePeriod
}