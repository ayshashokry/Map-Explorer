import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-hijri";
import { useTranslation } from "react-i18next";
//import Components
import Loader from "../../containers/Loader";
import MapComponent from "../../mapComponents/Map";
import DashHeader from "./DashboardHeader/index";
import DataTable from "./DashboardTbls/DataTable";
import CustomLineChart from "./dashboardCharts/customCharts/CustomLineChart";
import SideTbls from "./DashboardTbls/SideTbls";
import DashboardCountAreaPart from "./DashboardCountAreaPart";
import LeftSideChartsContainer from "./dashboardCharts/LeftChartsComp/LeftSideChartsContainer";

//helper funcs
import {
  getLayerId,
} from "../../helper/common_func";

import {
  getCountPerTimeContext,
  getDefaultStatistics,
  getTimePeriod,
} from "./helpers/helperFunc";
import {
  notificationMessage,
} from "../../helper/utilsFunc";

function DashboardPage(props) {
  const { i18n, t } = useTranslation("dashboard", "common");
  const navigate = useNavigate();
  const [activeHeatMapFactor, setActiveHeatMapFactor] = useState("");
  const [routeName, setNavRouteName] = useState("plans");
  const [leftChartsExist, setLeftChartsExist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState();
  const [layersNames, setLayersNames] = useState([]);

  const [mapTablesShow, setMapTablesShow] = useState(false);
  /**
   * queryData => contains (selectedLayer [refactored],
   * selectedBoundaryType [refactored], selectedTimeContext)
   */
  const [queryData, setQueryData] = useState({
    selectedLayer: "Landbase_Parcel",
    selectedBoundaryType: {
      value: undefined,
      boundariesArr: [],
      selectedBoundary: null,
    },
    selectedTimeContext: {
      type: undefined,
      dateData: [],
    },
  });
  /**@description
   * count: related to count section (display count Totol number by default or pie chart with count of selected boundaryType)
   * countPerPeriod: contains {type:String, data:Array, timePeriod:Array, default:Boolean} &
   * related to timeContext line chart at the middle section below map
   * geoType: to check if there is area of not if geoType === polygon
   */
  const [chartsData, setChartsData] = useState({
    count: undefined,
    areaOrLength: {
      value: undefined,
      type: undefined,
    },
    countPerPeriod: undefined,
    // restChartData: [],    //initial total value
    geoType: undefined, // to check if there is area of not if geoType === polygon
  });
  //side tbl data
  const [sideTblData, setSideTblData] = useState({
    title: "",
    data: [],
  });
  // if user is not logged navigate to /
  // if logged: intialize layersNames array and get the
  useEffect(() => {
    if (!props.mainData.logged) navigate("/");
    if (map) {
      window.__moment__ = moment;
      //intialize layersNames
      let mapAllLayers = map.__mapInfo.info.$layers.layers;
      // let mapAllTbls = props.map.__mapInfo.info.$layers.tables;
      let layersSetting = props.mainData.layers;
      let layersNames = Object.entries(layersSetting)
        ?.filter((l) => {
          let mapLayerNames = mapAllLayers.map((lay) => lay.name);
          if (
            mapLayerNames.includes(l[1].englishName) &&
            !l[1].isHiddenOnDashboard
          )
            return l;
          else return;
        })
        ?.map((l) => {
          let mapLayer = mapAllLayers.find((lay) => lay.name === l[0]);
          return {
            englishName: l[0],
            arabicName: l[1].arabicName,
            geoType: mapLayer.geometryType,
            statistics: l[1]?.statistics,
            dashboardCharts: l[1]?.dashboardCharts,
          };
        });
      let params = {
        changeType: layersNames,
        getTotalData: true,
        boundAdminType: null,
        callBack: handlerToSetQueryDChartsD,
        changedVal: null,
      };
      //set is there left charts for this layer or not
      let isLedtChartsExist = layersNames.find(
        (l) => l.englishName === queryData.selectedLayer
      ).dashboardCharts;
      if (isLedtChartsExist.length) setLeftChartsExist(true);
      /////////////
      setLayersNames(layersNames);
      getDefaultData(params);
    }
    return () => null;
  }, [map]);

  //in case of change time context
  useEffect(() => {
    if (
      queryData.selectedTimeContext.type &&
      queryData.selectedTimeContext.dateData.length
    ) {
      getCountDataPerPeriod((reqData, timePeriod) => {
        if (reqData) {
          let { data } = reqData;
          setChartsData({
            ...chartsData,
            countPerPeriod: {
              type: queryData.selectedTimeContext.type,
              data,
              timePeriod,
              default: false,
            },
          });
        } else {
          handleClearCalender();
          notificationMessage(t("dashboard:noDataForEnteredTimeContext"));
        }
        setLoading(false);
      });
    } else return;
  }, [
    queryData.selectedTimeContext.type,
    queryData.selectedTimeContext.dateData,
    queryData.selectedBoundaryType.selectedBoundary,
  ]);

  // in case of change selectedBoundary
  useEffect(() => {
    if (map && !queryData.selectedTimeContext.dateData.length) {
      let { selectedBoundaryType } = queryData;
      let currentLayer = layersNames.find(
        (lay) => lay.englishName === queryData.selectedLayer
      );
      let layerID = getLayerId(map.__mapInfo, currentLayer.englishName);
      if (
        selectedBoundaryType.selectedBoundary &&
        selectedBoundaryType.boundariesArr.length
      ) {
        //get data of sub boundary
        let boundAdminType = selectedBoundaryType.value;
        getCountDataSubBound(
          layerID,
          selectedBoundaryType.selectedBoundary,
          boundAdminType
        );
      } else if (
        selectedBoundaryType.selectedBoundary === undefined &&
        selectedBoundaryType.boundariesArr.length
      ) {
        let params = {
          changeType: "selectedBoundary",
          getTotalData: chartsData.countPerPeriod?.default ? true : false,
          boundAdminType: selectedBoundaryType.value,
          callBack: handlerToSetQueryDChartsD,
          changedVal: null,
        };
        getDefaultData(params);
      }
    }
  }, [queryData.selectedBoundaryType.selectedBoundary]);

  //in case of change adminBound to apply heat map

  const getCountDataSubBound = async (layerID, subBoundary, boundAdminType) => {
    setLoading(true);
    try {
      let whereStatement = boundAdminType
        ? boundAdminType === "PLAN_NO"
          ? `${boundAdminType} = '${subBoundary}'`
          : `${boundAdminType} = ${subBoundary}`
        : "";
      //getStatisticsForFeatLayer
      let data = await getCountPerTimeContext(
        layerID,
        queryData.selectedTimeContext.type
          ? queryData.selectedTimeContext.type
          : "yearly",
        null,
        whereStatement
      );
      if (data) {
        setChartsData({
          ...chartsData,
          countPerPeriod: {
            ...chartsData.countPerPeriod,
            data: data.data,
            default: true,
          },
        });
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      notificationMessage(t("common:retrievError"));
      setLoading(false);
    }
  };

  const changeMapTablesShow = (data) => {
    if (data.title === mapTablesShow) {
      setSideTblData();
      setMapTablesShow(false);
    } else {
      setSideTblData(data);
      setMapTablesShow(data.title);
    }
  };

  const onMapLoaded = (map) => {
    setMap(map);
  };

  const getDefaultData = async ({
    changeType,
    getTotalData,
    boundAdminType,
    callBack,
    changedVal,
  }) => {
    let layersNs = typeof changeType === "object" ? changeType : layersNames;
    let currentLayer = layersNs.find((lay) => {
      let layerName =
        changedVal && changeType === "layer"
          ? changedVal
          : queryData.selectedLayer;
      return lay?.englishName === layerName;
    });
    if (currentLayer) {
      let { englishName, statistics, geoType } = currentLayer;
      let layerID = getLayerId(map.__mapInfo, englishName);
      let layerObj = {
        layerID,
        statistics,
        boundAdminType,
        getTotalData,
      };
      try {
        setLoading(true);
        let statData =
          changeType === "calendar"
            ? {
                count: chartsData.count,
                areaOrLength: chartsData.areaOrLength,
              }
            : await getDefaultStatistics(layerObj); //count, area or only count based on layer's statistics
        let yearlyData;
        if (getTotalData)
          yearlyData = await getCountPerTimeContext(
            layerID,
            "yearly",
            undefined
          );
        callBack(
          {
            statData,
            yearlyData,
          },
          getTotalData,
          geoType,
          changeType,
          changedVal,
          boundAdminType
        );
      } catch (err) {
        notificationMessage(t("common:retrievError"));
        setLoading(false);
      }
    } else {
      notificationMessage(t("common:retrievError"));
      setLoading(false);
    }
  };
  /**
   * (handlerToSetQueryDChartsD, getChartsDataBasedOnStatData, getQueryDataBasedOnStatData)
   * Helpers functions related to getDefaultData
   */
  const handlerToSetQueryDChartsD = (
    data,
    getTotalData,
    geoType,
    changeType,
    changedVal,
    boundAdminType
  ) => {
    let { statData, yearlyData } = data;
    let queryD = getQueryDataBasedOnStatData(
      statData,
      boundAdminType,
      getTotalData,
      changeType
    );
    switch (changeType) {
      case "layer":
        queryD.selectedLayer = changedVal;
        break;
      case "boundAdmin":
        queryD.selectedBoundaryType.value = changedVal;
        break;
      case "subBound":
        queryD.selectedBoundaryType.selectedBoundary = changedVal;
        break;
    }
    setQueryData({ ...queryD });
    if (yearlyData) {
      let chartD = getChartsDataBasedOnStatData(yearlyData);
      setChartsData({
        ...chartD,
        ...statData,
        geoType,
      });
    } else {
      setChartsData({
        ...chartsData,
        ...statData,
        geoType,
      });
    }
    setLoading(false);
  };
  const getChartsDataBasedOnStatData = (yearlyData) => {
    let { data } = yearlyData;

    return {
      ...chartsData,
      countPerPeriod: {
        type: "yearly",
        data,
        timePeriod: undefined,
        default: true,
      },
    };
  };
  const getQueryDataBasedOnStatData = (
    statData,
    boundAdminType,
    getTotalData,
    changeType
  ) => {
    let queryDataClone = { ...queryData };
    //if there is a count data array
    if (typeof statData.count === "object" && boundAdminType) {
      queryDataClone.selectedBoundaryType = {
        ...queryDataClone.selectedBoundaryType,
        selectedBoundary:
          queryData.selectedBoundaryType.selectedBoundary !== null
            ? undefined
            : null,
        boundariesArr: statData.count
          .filter((item) => item[boundAdminType])
          .map((item) => {
            return {
              name: item[boundAdminType],
              value:
                boundAdminType === "PLAN_NO"
                  ? item[boundAdminType]
                  : item[boundAdminType + "_Code"],
            };
          }),
      };
      if (getTotalData)
        queryDataClone.selectedTimeContext = {
          type: undefined,
          dateData: [],
        };
    } else {
      queryDataClone.selectedBoundaryType = {
        ...queryDataClone.selectedBoundaryType,
        selectedBoundary:
          queryData.selectedBoundaryType.selectedBoundary !== null
            ? undefined
            : null,
        boundariesArr: [],
      };
      if (changeType === "layer")
        queryDataClone.selectedBoundaryType.value = undefined;
      if (getTotalData)
        queryDataClone.selectedTimeContext = {
          type: undefined,
          dateData: [],
        };
    }
    return queryDataClone;
  };
  /********************************************/
  const getCountDataPerPeriod = async (callBack) => {
    let currentLayer = layersNames.find(
      (lay) => lay.englishName === queryData.selectedLayer
    );
    let layerID = getLayerId(map.__mapInfo, currentLayer.englishName);
    let timePeriod = getTimePeriod(queryData);

    setLoading(true);
    try {
      let { selectedBoundaryType, selectedTimeContext } = queryData;
      let data = await getCountPerTimeContext(
        layerID,
        selectedTimeContext.type,
        timePeriod,
        selectedBoundaryType.selectedBoundary
          ? selectedBoundaryType.value === "PLAN_NO"
            ? `${selectedBoundaryType.value} = '${selectedBoundaryType.selectedBoundary}'`
            : `${selectedBoundaryType.value} = ${selectedBoundaryType.selectedBoundary}`
          : ""
      );
      callBack(data, timePeriod);
    } catch (err) {
      console.log(err);
      notificationMessage(t("common:retrievError"));
      setLoading(false);
    }
  };

  const handleClearCalender = (isDefault) => {
    let currentLayer = layersNames.find(
      (lay) => lay.englishName === queryData.selectedLayer
    );
    if (isDefault) {
      setQueryData({
        ...queryData,
        selectedTimeContext: {
          type: undefined,
          dateData: [],
        },
      });
    }
    if (!chartsData.countPerPeriod?.default) {
      let subBound = queryData.selectedBoundaryType.selectedBoundary;
      let layerID = getLayerId(map.__mapInfo, currentLayer.englishName);

      //get data of sub boundary
      let boundAdminType = queryData.selectedBoundaryType.value;
      getCountDataSubBound(layerID, subBound, boundAdminType);

      //reset calendar
      setQueryData({
        ...queryData,
        selectedTimeContext: {
          ...queryData.selectedTimeContext,
          dateData: [],
        },
      });
    }
  };
  const handleAdminBoundChange = (adminBoundary) => {
    console.log({ adminBoundary });
    let params = {
      changeType: "boundAdmin",
      getTotalData: false,
      boundAdminType: null,
      callBack: handlerToSetQueryDChartsD,
      changedVal: adminBoundary,
    };
    if (!adminBoundary) {
      if(activeHeatMapFactor) setActiveHeatMapFactor('');

      if (!chartsData.count) return;
      else if (typeof chartsData.count === "object") {
        //reset sub boundary array to hide from UI
        if (queryData.selectedTimeContext.dateData.length) {
          params.changeType = "boundAdmin";
          getDefaultData("boundAdmin", false, null, handlerToSetQueryDChartsD);
        } else {
          params.changeType = "boundAdmin";
          params.getTotalData = chartsData.countPerPeriod?.default
            ? false
            : true;
          getDefaultData(params);
        }
      } else {
        params.changeType = "boundAdmin";
        params.getTotalData = chartsData.countPerPeriod?.default ? false : true;
        getDefaultData(params);
      }
    } else {
      setActiveHeatMapFactor("count");    //count is default for drawing heat map
      params.boundAdminType = adminBoundary;
      getDefaultData(params);
    }
  };
  const handleLayerChange = (layerName) => {
    if(mapTablesShow){
      setSideTblData();
      setMapTablesShow(false);
    }
    //set is there left charts for this layer or not
    let isLedtChartsExist = layersNames.find(
      (l) => l.englishName === layerName
    ).dashboardCharts;
    if (isLedtChartsExist.length) setLeftChartsExist(true);
    else if (leftChartsExist) setLeftChartsExist(false);
    //it should reset all dropdown lists and
    //just display the default data (count, area, line bar with count per years),
    //reset select of max 6, min-6 and all in count, area pie charts to be max-6
    //reset select of max-6
    let getTotalData = true;
    let params = {
      changeType: "layer",
      getTotalData,
      boundAdminType: null,
      callBack: handlerToSetQueryDChartsD,
      changedVal: layerName,
    };

    getDefaultData(params);
  };
  const handleChangeSubBoundary = (subBound) => {
    let { selectedBoundaryType } = queryData;
    let currentLayer = layersNames.find(
      (lay) => lay.englishName === queryData.selectedLayer
    );
    let layerID = getLayerId(map.__mapInfo, currentLayer.englishName);
    if (subBound && selectedBoundaryType.boundariesArr.length) {
      //get data of sub boundary
      let boundAdminType = selectedBoundaryType.value;
      getCountDataSubBound(layerID, subBound, boundAdminType);
    } else if (
      subBound === undefined &&
      selectedBoundaryType.boundariesArr.length
    ) {
      let params = {
        changeType: "subBound",
        getTotalData: chartsData.countPerPeriod?.default ? true : false,
        boundAdminType: selectedBoundaryType.value,
        callBack: handlerToSetQueryDChartsD,
        changedVal: subBound,
      };
      getDefaultData(params);
    }
  };


  

  return (
    <div className="dashboardPage">
      {loading && <Loader />}

      <DashHeader
        defaultKey="eastern"
        dash
        layersNames={layersNames}
        languageStatus={i18n.language}
        queryData={queryData}
        setQueryData={setQueryData}
        handleClearCalender={handleClearCalender}
        handleLayerChange={handleLayerChange}
        handleAdminBoundChange={handleAdminBoundChange}
        handleChangeSubBoundary={handleChangeSubBoundary}
        map={map}
      />
      <div className="dashboard-page-layout">
        {/**on right: (map+2tbls) 74vw [50vw, 24vw], on left: charts 26vw[13vw+13vw] */}
        {mapTablesShow && sideTblData.title ? (
          <SideTbls data={sideTblData} />
        ) : null}
        {/**Map Part */}
        <div
          className="map-wrapper"
          style={{
            width: !leftChartsExist ? "100vw" : mapTablesShow ? "50vw" : "74vw",
          }}
        >
          {/**Map Container */}
          <div
            className="dashMap"
            // id={mapTablesShow ? "dashMapHeight" : "dashMapHeightDefault"}
          >
            <MapComponent mapload={onMapLoaded} mainData={props.mainData} />
          </div>
          {/**End Map Container */}
          {/**Charts and Sum containers below map */}
          <div className="charts-below-map mt-2">
            {!chartsData.count ? (
              <Loader />
            ) : (
              <DashboardCountAreaPart
                type="count"
                chartsData={chartsData}
                queryData={queryData}
                title={t("dashboard:totalCount")}
                map={map}
                activeHeatMapFactor={activeHeatMapFactor}
                setActiveHeatMapFactor={setActiveHeatMapFactor}
              />
            )}
            {(queryData.selectedTimeContext.type &&
              queryData.selectedTimeContext.dateData.length &&
              chartsData.countPerPeriod) ||
            chartsData.countPerPeriod?.default ? (
              <div className="mapSquare mx-1">
                {/* <h6>أعداد أقطار مخارج المزارعين </h6>  */}
                <CustomLineChart
                  title={
                    queryData.selectedBoundaryType.selectedBoundary
                      ? t("dashboard:countPerTime") +
                        " (" +
                        queryData.selectedBoundaryType.boundariesArr.find(
                          (i) =>
                            i.value ===
                            queryData.selectedBoundaryType.selectedBoundary
                        )?.name +
                        ")"
                      : t("dashboard:countPerTime")
                  }
                  chartData={chartsData.countPerPeriod}
                />
              </div>
            ) : null}
            {chartsData.geoType === "esriGeometryPoint" ? null : chartsData
                .areaOrLength.type && typeof chartsData.areaOrLength.value ? (
              <DashboardCountAreaPart
                type="areaOrLength"
                chartsData={chartsData}
                queryData={queryData}
                title={t("dashboard:totalArea")}
                map={map}
                activeHeatMapFactor={activeHeatMapFactor}
                setActiveHeatMapFactor={setActiveHeatMapFactor}
              />
            ) : null}
          </div>
          {/**End Charts and Sum containers below map */}
        </div>
        {/*************** */}
        {/**Left side Charts */}
        {layersNames.length && queryData?.selectedLayer && map  ? (
          <LeftSideChartsContainer
            layersNames={layersNames}
            map={map}
            selectedLayer={queryData.selectedLayer}
            changeMapTablesShow={changeMapTablesShow}
            mapTablesShow={mapTablesShow}
            queryData={queryData}
          />
        ) : null}
        {/**End Left side Charts */}
      </div>
      {/**Details Table on the bottom of the page */}
      <div className="routesData mt-5">
        <DataTable
          routeName={routeName}
          chartsData={chartsData}
          title={queryData.selectedBoundaryType.value}
          hasArea={chartsData.areaOrLength.value}
        />
      </div>
      {/**End Details Table on the bottom of the page */}
    </div>
  );
}

export default DashboardPage;
