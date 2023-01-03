import React, { useState } from "react";
import { useTranslation } from "react-i18next";

//comps
import SelectComp from "../DashboardHeader/SelectComp";
import CustomDonutChart from "../dashboardCharts/customCharts/CustomDonutChart";

//assets
import MAPLOGO from '../../../assets/images/dashboard/map-marker.png'

export default function DashboardCountAreaPart({
  chartsData,
  type,
  queryData,
  title,
  map,
  activeHeatMapFactor,
  setActiveHeatMapFactor,
}) {
  const { i18n, t } = useTranslation("dashboard");
  const [shownListVal, setShownListVal] = useState({
    count: "max-6",
    areaOrLength: "max-6", // t("sizHighestValues") or "all"
  });
  const [filterList] = useState([
    {
      name: t("sizHighestValues"),
      value: "max-6",
    },
    {
      name: t("sizLowestValues"),
      value: "min-6",
    },
    {
      name: t("all"),
      value: "all",
    },
  ]);
  React.useEffect(() => {
    return () => {
      setShownListVal({
        count: "max-6",
        areaOrLength: "max-6", // t("sizHighestValues") or "all"
      });
    };
  }, []);
  const handleSelectShownListVal = (name) => (value, e) => {
    if (name === "count")
      setShownListVal({
        ...shownListVal,
        count: value,
      });
    else
      setShownListVal({
        ...shownListVal,
        areaOrLength: value,
      });
  };
  const handleEditActiveHeatMapFactor = (name) => {
    if (activeHeatMapFactor !== name) setActiveHeatMapFactor(name);
  };
  return (
    <div
      className="mapSquare ml-2"
      style={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex" }}>
        <h6
        className={activeHeatMapFactor===type?"active-title":""}
          style={{ display: "flex", }}
         
        >
          {title}
        </h6>
      { activeHeatMapFactor && <img title={t('clickForHeatMap')} src={MAPLOGO} className="map-pointer"
      style={{cursor: activeHeatMapFactor?"pointer":'auto' }}
      alt="map logo"  onClick={activeHeatMapFactor?() => handleEditActiveHeatMapFactor(type):()=>{}} />}

        {type === "count"
          ? chartsData[type] &&
            typeof chartsData[type] === "object" && (
              <div style={{ width: "max-content" }}>
                <SelectComp
                  listName={type}
                  onChange={handleSelectShownListVal(type)}
                  value={shownListVal[type]}
                  //  placeholder={t(`chooseTimeContext`)}
                  list={filterList || []}
                  allowClear={true}
                />
              </div>
            )
          : chartsData[type].value &&
            typeof chartsData[type]?.value === "object" && (
              <div style={{ width: "max-content" }}>
                <SelectComp
                  listName={type}
                  onChange={handleSelectShownListVal(type)}
                  value={shownListVal[type]}
                  //  placeholder={t(`chooseTimeContext`)}
                  list={filterList || []}
                  allowClear={true}
                />
              </div>
            )}
      </div>
      {type === "count" ? (
        chartsData[type] && typeof chartsData[type] === "number" ? (
          <h2>{chartsData[type]}</h2>
        ) : chartsData[type] ? (
          <CustomDonutChart
            data={chartsData[type]}
            shownListVal={shownListVal}
            boundAdminType={queryData.selectedBoundaryType.value}
            statisticsType={type}
            map={map}
            queryData={queryData}
            activeHeatMapFactor={activeHeatMapFactor}
          />
        ) : null
      ) : type !== "count" ? (
        chartsData[type]?.value &&
        typeof chartsData[type]?.value === "number" ? (
          <h2>{chartsData[type]?.value}</h2>
        ) : chartsData[type]?.value ? (
          <CustomDonutChart
            data={chartsData[type]?.value}
            shownListVal={shownListVal}
            boundAdminType={queryData.selectedBoundaryType.value}
            statisticsType={type}
            map={map}
            activeHeatMapFactor={activeHeatMapFactor}
            queryData={queryData}
          />
        ) : null
      ) : null}
    </div>
  );
}
