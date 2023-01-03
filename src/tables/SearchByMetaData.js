import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { Button, Tooltip, Row, Col, Input, Table, Space, Select } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faExpandArrowsAlt,
  faFilter,
  faSearchPlus,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DownCircleFilled } from "@ant-design/icons";

import { SearchOutlined } from "@ant-design/icons";
import moment from "moment-hijri";
import { useNavigate } from "react-router-dom";
import FilteRModal from "./FiltersComps/FilterByAttr/FilterModal";
import HijriDatePicker from "../components/hijriDatePicker/components/HijriDatePicker";
import MetaDataStatistics from "./StatisticsOfAttrTbl/MetaDataStatistics";
//import layers data
// import { layersSetting } from "../helper/layers";
//common_func
import {
  queryTask,
  getLayerId,
  getFeatureDomainName,
  showLoading,
  zoomToFeatureDefault,
  clearGraphics,
  highlightFeature,
  drawLine,
  clearCanvasLine,
  convertHirjiDateToTimeSpan,
} from "../helper/common_func";

import PaginationComp from "./TablePagination/paginationComp";
import ExportFilesComp from "./ExportsFeatures/ExportFilesComp";
import {
  convertEngNumbersToArabic,
  convertNumbersToEnglish,
  isNumber,
  notificationMessage,
  showDataSplittedBySlash,
} from "../helper/utilsFunc";
import {
  getStatisticsForChart,
  getStatisticsForFeatsLayer,
  getSubtypes,
} from "./tableFunctions";
import { externalBtnsForTblData } from "../helper/constants";
import { useTranslation } from "react-i18next";
import kroky from "../assets/images/kroky.svg";
import splitIcon from "../assets/images/splitIcon.svg";
import updateContract from "../assets/images/updateContracts.svg";

// const { Column } = Table;
export default function SearchByMetaData(props) {
  const [fieldDistictValues, setFieldDistictValues] = useState({});
  const [t]=useTranslation('common','map',"layers")
  const navigate = useNavigate();
  const filterWhereClauseRef = useRef({
    current: "1=1",
    dep: {
      default: "",
      filtered: "",
    },
  });
  //for pagination
  const [currentPageNum, setCurrentPageNum] = useState({
    current: 1,
    dep: 1,
  });

  const [layersNames, setLayersNames] = useState([]);
  const [displayedLinks, setDisplayedLinks] = useState([]);
  //main layer data
  const [tableData, setTableData] = useState([]);
  const [tblColumns, setTblColumns] = useState([]);
  const [countNumber, setCountNumber] = useState({
    current: 0,
    dep: 0,
  });
  const [totalArea, setTotalArea] = useState({
    current: null,
    dep: null,
  });

  //dependencties data
  const [depTableData, setDepTableData] = useState({
    data: [],
    layerData: "",
    layerMetadata: {},
  });
  const [depTblColumns, setDepTblColumns] = useState();

  const [activeLink, setActiveLink] = useState({
    value: "", //layerName
    layerData: "",
  });

  const [showFilterModal, seFilteRModal] = useState(false);
  const [sideDisplay, setSide] = useState(true);
  const [searchText, setFormValues] = useState("");
  //for filters
  const filterInput = useRef(null);
  const [colFilterWhere, setColFilterWhere] = useState({
    current: [],
    dep: [],
  });
  //begin Filter Columns
  let countNumberRef = useRef({});
  let totalAreaRef = useRef({});
  const [showMetaStat, setMetaStat] = useState(false);
  //useEffects

  useEffect(() => {
    if(!props.mainData.logged) navigate('/')
    //intialize layersNames
    let mapAllLayers = props.map.__mapInfo.info.$layers.layers;
    // let mapAllTbls = props.map.__mapInfo.info.$layers.tables;
    let layersSetting = props.mainData.layers;
    let layersNames = Object.entries(layersSetting)
      ?.filter((l) => {
        let mapLayerNames = mapAllLayers.map(lay=>lay.name);
        if(mapLayerNames.includes(l[1].englishName)) return l
        else return 
      })
      ?.map((l) => {
        return {
          layerName: l[0],
          layerMetadata: l[1],
        };
      });
    window.moment = moment;
    setLayersNames(layersNames);
    return () => {
      console.log("unmount");
      //clear highlightGraphicLayer + ZoomGraphicLayer
      clearGraphics(["ZoomGraphicLayer", "highlightGraphicLayer"], props.map);
      setDisplayedLinks([]);
      setTblColumns([]);
      setTableData([]);
      setActiveLink({
        layerData: null,
        value: null,
      });
      setFieldDistictValues({});
      seFilteRModal(false);
      filterWhereClauseRef.current = {
        current: "1=1",
        dep: {
          default: "",
          filtered: "",
        },
      };
      setSide(true);
      setLayersNames([]);
      setFormValues("");
      setCountNumber({
        current: 0,
        dep: 0,
      });
      totalAreaRef.current = null;
      countNumberRef.current = {};
      setTotalArea({
        current: null,
        dep: null,
      });
      //for pagination
      setCurrentPageNum({
        current: 1,
        dep: 1,
      });
      //for filters
      setColFilterWhere({
        current: [],
        dep: [],
      });
      setMetaStat(null);
      navigate("/");
    };
  }, []);
  // getFeatures based on currentPageNum (pagination)
  useEffect(() => {
    if (currentPageNum.current > 1 || currentPageNum.dep > 1) {
      showLoading(true);
      let queriedLayerData = depTblColumns
        ? depTableData.layerData
        : activeLink.layerData;
      let startIndex = depTblColumns
        ? (currentPageNum.dep - 1) * window.paginationCount
        : (currentPageNum.current - 1) * window.paginationCount;
      getLayerFeatures(queriedLayerData, false, {
        num: window.paginationCount,
        start: startIndex,
      }).then((data) => {
        settingTableData(
          depTblColumns ? depTblColumns : tblColumns,
          data.tableData,
          {
            isNewTbl: false,
            colsIsNeeded: false,
            isDependData: depTblColumns ? true : false,
          }
        );
        showLoading(false);
      });
    }
  }, [currentPageNum]);

//useEffect for language state
useEffect(()=>{
  if(!props.languageState) return;
  else{
    if(props.languageState==='ar'&&(depTblColumns || tblColumns).length){
      if(depTblColumns && depTblColumns?.length){
        let cloneDepTblCol = [...depTblColumns]
        for(let i=0; i<cloneDepTblCol.length; i++){
          let item = cloneDepTblCol[i];
          item.title = item.arAlias;
        }
        setDepTblColumns(cloneDepTblCol)
      }
      if(tblColumns?.length){
        let cloneTblCol = [...tblColumns]
        for(let i=0; i<cloneTblCol.length; i++){
          let item = cloneTblCol[i];
          item.title = item.arAlias;
        }
        setTblColumns(cloneTblCol)
      }
    }else if(props.languageState==='en'&&(depTblColumns || tblColumns).length){
      if(depTblColumns && depTblColumns?.length){
        let cloneDepTblCol = [...depTblColumns]
        for(let i=0; i<cloneDepTblCol.length; i++){
          let item = cloneDepTblCol[i];
          item.title = item.enAlias;
        }
        setDepTblColumns(cloneDepTblCol)
      }
      if(tblColumns?.length){
        let cloneTblCol = [...tblColumns]
        for(let i=0; i<cloneTblCol.length; i++){
          let item = cloneTblCol[i];
          item.title = item.enAlias;
        }
        setTblColumns(cloneTblCol)
      }
    }
  }
},[props.languageState])

  const getWhereForStatistics = (isDepNotCurrent) => {
    let where = "";
    //in case of dependent layer
    if (isDepNotCurrent) {
      let isFilteredByCol = colFilterWhere.dep.length ? colFilterWhere.dep : [];
      let isFilteredByAttr =
        filterWhereClauseRef.current.dep.filtered ||
        filterWhereClauseRef.current.dep.default;
      if (isFilteredByAttr) where = isFilteredByAttr;
      if (isFilteredByCol.length)
        where = isFilteredByAttr
          ? where + " AND " + isFilteredByCol.join(" AND ")
          : isFilteredByCol.join(" AND ");
    } else {
      //current
      let isFilteredByCol = colFilterWhere.current.length
        ? colFilterWhere.current
        : [];
      let isFilteredByAttr = filterWhereClauseRef.current.current;
      if (isFilteredByAttr) where = isFilteredByAttr;
      if (isFilteredByCol.length)
        where = isFilteredByAttr
          ? where + " AND " + isFilteredByCol.join(" AND ")
          : isFilteredByCol.join(" AND ");
    }
    return where || "1=1";
  };
  const openMetaStat = async () => {
    if (showMetaStat) setMetaStat(false);
    else {
      let layerName = "Landbase_Parcel";
      let layerID = getLayerId(props.map.__mapInfo, layerName);
      let layerData = layersNames.find((f) => f.layerName === layerName);
      let isDepNotCurrent = depTblColumns ? true : false;
      let whereClause = getWhereForStatistics(isDepNotCurrent);
      showLoading(true);
      try {
        let { data } = await getStatisticsForChart(
          layerID,
          layerData,
          whereClause
        );
        if (data.length) {
          let landUseValues = props.map.__mapInfo.info.$layers.layers
            .find((l) => l.name === layerName)
            .fields.find((f) => f.name === "PARCEL_MAIN_LUSE");
          setMetaStat({
            totalCount: isDepNotCurrent ? countNumber.dep : countNumber.current,
            totalArea: isDepNotCurrent ? totalArea.dep : totalArea.current,
            landUseValues,
            data: data.map((f) => f.attributes),
            where: whereClause,
          });
        } else {
          notificationMessage("لا يوجد بيانات متاحة لإظهار الاحصائيات");
        }
        showLoading(false);
      } catch (err) {
        notificationMessage("حدث خطأ برجاء المحاولة مرة أخرى", 4);
        showLoading(false);
      }
    }
  };
  const exportPDFStatistics = () => {
    let isDepNotCurrent = depTblColumns ? true : false;
    let whereClause = showMetaStat.where;
    let count = isDepNotCurrent ? countNumber.dep : countNumber.current;
    let area = isDepNotCurrent ? totalArea.dep : totalArea.current;
    localStorage.setItem(
      "attrTblChart",
      whereClause + ";" + area + ";" + count
    );
    window.open(process.env.PUBLIC_URL+ "/PrintPdfAttrTbl", "_blank");
  };

  const openFilterModal = () => {
    seFilteRModal(!showFilterModal);
  };

  const openSideLinkData = (e, queriedLayerData) => {
    //1- check if it is the same active link
    if (e.target.id != activeLink.value) {
      //reset filter columns
      filterInput.current = null;
      let defaultWhereClause = "1=1";
      let layerName = e.target.id;
      //2- highlight the item in list
      setActiveLink({
        layerData: queriedLayerData,
        value: layerName,
      });
      //3- get the layer data
      let layerID = getLayerId(props.map.__mapInfo, layerName);
      let params = {
        layerID,
        pagCount: window.paginationCount,
        layerData: queriedLayerData,
        isNewTbl: true,
        colsIsNeeded: true,
      };
      setCurrentPageNum({
        current: 1,
        dep: 1,
      });
      setColFilterWhere({
        current: [],
        dep: [],
      });
      setDepTableData({
        data: [],
        layerData: "",
      });
      setDepTblColumns();
      setCountNumber({ ...countNumber, dep: 0 });
      countNumberRef.current = {
        ...countNumberRef.current,
        dep: 0,
      };
      setFieldDistictValues({});
      setTotalArea({ ...totalArea, dep: null });
      totalAreaRef.current = {
        ...totalAreaRef.current,
        dep: null,
      };
      setCurrentPageNum({ ...currentPageNum, dep: 1 });
      getLayerDataForTable(params);
      filterWhereClauseRef.current = {
        current: defaultWhereClause,
        dep: {
          default: "",
          filtered: "",
        },
      };
    }
  };
  const openSide = (e) => {
    setSide(true);
  };
  const closeSide = (e) => {
    setSide(false);
  };
  const handleChangeInput = (e) => {
    let searchQuery = e.target.value.toLowerCase();
    setFormValues(e.target.value.toLowerCase());
    let displayed = layersNames
      // .filter((la) => la.layerMetadata.isSearchable)
      .filter(function (el) {
        let searchValue = el.layerMetadata.name.toLowerCase();
        return searchValue.indexOf(searchQuery) !== -1;
      });
    setDisplayedLinks(displayed);
  };

  function drawLineWithZoom(feature, event) {
    if (
      feature.geometry &&
      (feature.geometry?.rings ||
        feature.geometry?.x ||
        feature.geometry?.paths)
    ) {
      highlightFeature(feature, props.map, {
        layerName: "SelectGraphicLayer",
        isHiglightSymbol: true,
      });

      drawLine({
        feature: feature,
        map: props.map,
        event: event,
        //condition here depend on css style
        hideFromHeight:
          props.searchTableDisplay == "searchTableShown"
            ? window.innerHeight * 0.6
            : 200,
      });
    }
  }

  const clearFeatures = () => {
    props.map.findLayerById("SelectGraphicLayer").removeAll();
    clearCanvasLine();
  };
  const zoomToFeature = (feature) => {
    if (
      feature.geometry?.rings ||
      feature.geometry?.x ||
      feature.geometry?.paths
    )
      zoomToFeatureDefault(feature, props.map);
  };

  //helpers functions

  const getLayerDataForTable = (params) => {
    const {
      layerID,
      pagCount,
      layerData,
      isNewTbl,
      callBackFunc,
      where,
      orderByFields,
      colsIsNeeded,
      isDependData,
    } = params;
    showLoading(true);

    Promise.all([
      getStatisticsForFeatsLayer(layerID, layerData, where),
      getLayerFeatures(layerData, colsIsNeeded, {
        where: where || "1=1",
        num: pagCount || window.paginationCount,
        start: 0,
        orderByFields,
      }),
    ])
      .then((data) => {
        setCountNumber(
          !isDependData
            ? {
                ...countNumberRef.current,
                current: data[0].countPlusArea.COUNT,
              }
            : {
                ...countNumberRef.current,
                dep: data[0].countPlusArea.COUNT,
              }
        );
        setTotalArea(
          !isDependData
            ? {
                ...totalAreaRef.current,
                current: data[0].countPlusArea.AREA
                  ? parseFloat(data[0].countPlusArea.AREA / 1000000).toFixed(2)
                  : null,
              }
            : {
                ...totalAreaRef.current,
                dep: data[0].countPlusArea.AREA
                  ? parseFloat(data[0].countPlusArea.AREA / 1000000).toFixed(2)
                  : null,
              }
        );
        countNumberRef.current = !isDependData
          ? { ...countNumberRef.current, current: data[0].countPlusArea.COUNT }
          : { ...countNumberRef.current, dep: data[0].countPlusArea.COUNT };
        totalAreaRef.current = !isDependData
          ? {
              ...totalAreaRef.current,
              current: data[0].countPlusArea.AREA
                ? parseFloat(data[0].countPlusArea.AREA / 10000).toFixed(2)
                : null,
            }
          : {
              ...totalAreaRef.current,
              dep: data[0].countPlusArea.AREA
                ? parseFloat(data[0].countPlusArea.AREA / 10000).toFixed(2)
                : null,
            };
        let tblCols = data[1].tblColumns.length
          ? data[1].tblColumns
          : tblColumns;
        settingTableData(tblCols, data[1].tableData, {
          isNewTbl,
          colsIsNeeded,
          isDependData,
        });
        showLoading(false);
        callBackFunc && callBackFunc();
      })
      .catch((err) => {
        notificationMessage("حدث خطأ برجاء المحاولة مرة أخرى", 4);
        console.log(err);
        showLoading(false);
      });
  };
  const getLayerFeatures = async (queriedLayerData, colsIsNeeded, params) => {
    let { num, start, ...rest } = params;
    let layerID = getLayerId(props.map.__mapInfo, queriedLayerData.layerName);
    let promise = new Promise((resolve, reject) => {
      let queryParams = {
        url: window.mapUrl + "/" + layerID,
        num: num || 20,
        start: start || 0,
        notShowLoading: true,
        returnGeometry: true,
        outFields: queriedLayerData.layerMetadata.outFields,
        ...rest,
      };
      queryTask({
        ...queryParams,
        callbackResult: ({ features, fields }) => {
          let reqFieldsWithoutObjectID = [],
            tblData = [],
            tblCols = [];
          if (colsIsNeeded) {
            let layData = [
              ...props.map.__mapInfo.info.$layers.layers,
              ...props.map.__mapInfo.info.$layers.tables,
            ].find((l) => l.name === queriedLayerData.layerName);

            reqFieldsWithoutObjectID = layData.fields.filter((f) => {
              return (
                queriedLayerData.layerMetadata.outFields.includes(f.name) &&
                f.name !== "OBJECTID"
              );
            });
            tblCols = reqFieldsWithoutObjectID.map((f, index) => {
              let hasSubtype = getSubtypes(
                f.name,
                props.map,
                queriedLayerData.layerName
              );
              if (hasSubtype)
                f.domain = hasSubtype.subTypeData.reduce((total, item) => {
                  if (!total.length) {
                    total = item.domains;
                  } else {
                    total = [...total, ...item.domains];
                  }
                  return total;
                }, []);
              let rowProp = {
                filtered: false,
                title: props.languageState==='ar'?f.alias:f.name,
                enAlias:f.name,
                arAlias:f.alias,
                dataType: f.type,
                withDomain: f.domain,
                dataIndex: f.name.includes("_DATE")||f.name.includes("_date")
                  ? [f.name, "hijri"]
                  : f.name,
                key: f.name,
                sorter: true,
                sortOrder: false,
                filteredValue: null,
                defaultFilteredValue: undefined,
                filterResetToDefaultFilteredValue: true,
                ...setFiltersIntoTable(f, queriedLayerData),

                sortDirections: ["ascend", "descend", "ascend"],
                showSorterTooltip: true,
              };
              if (!index) rowProp.width = "max-content";
              return {
                ...rowProp,
              };
            });
            let isLayer = props.map.__mapInfo.info.$layers.layers.find(
              (lay) => lay.name === queriedLayerData.layerName
            );
            let haveDependencies = queriedLayerData.layerMetadata?.dependecies;
            if ((isLayer || haveDependencies) && features.length)
              tblCols.push({
                title: "",
                key: "zoom",
                render: (text, record) => {
                  return (
                    <>
                      {isLayer ? (
                        <Button
                          className="tableHeaderBtn "
                          onClick={() => zoomToFeature(record)}
                        >
                          <Tooltip placement="topLeft" title={t('map:zoomMap')}>
                            <FontAwesomeIcon icon={faSearchPlus} />
                          </Tooltip>
                        </Button>
                      ) : null}
                      {haveDependencies?.map((dep, index) => {
                        if (
                          dep.showingField !== "OWNER_TYPE" ||
                          (dep.showingField == "OWNER_TYPE" &&
                            record[dep.showingField + "_Code"] ===
                              dep.codeValue)
                        )
                          return (
                            <Button
                              key={index}
                              className="tableHeaderBtn"
                              onClick={() => getDepData(dep, record)}
                            >
                              <Tooltip placement="topLeft" title=                         {t(`layers:${dep.tooltip}`)}
>
                                {dep.icon?<FontAwesomeIcon icon={dep.icon} />
                                
                              :
                              <img
                                src={dep.imgIconSrc}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            }
                              </Tooltip>
                            </Button>
                          );
                      })}
                    </>
                  );
                },
              });
          }

          if (features.length)
            getFeatureDomainName(features, layerID).then((feats) => {
              tblData = feats.map((f) => {
                return { ...f.attributes, geometry: f.geometry };
              });
              resolve({
                tableData: tblData,
                tblColumns: tblCols,
              });
            });
          else
            resolve({
              tableData: tblData,
              tblColumns: tblCols,
            });
        },
        callbackError: (err) => {
          notificationMessage("حدث خطأ برجاء المحاولة مرة أخرى", 4);

          reject(err);
        },
      });
    });
    return promise;
  };

  const getLayerExtext = () => {
    clearGraphics("ZoomGraphicLayer", props.map);
    if (tableData.length && tableData.find((d) => d.geometry)) {
      let features = tableData.filter((d) => {
        if (d.geometry?.rings || d.geometry?.paths || d.geometry?.x) return d;
        else return;
      });
      highlightFeature(features, props.map, {
        layerName: "highlightGraphicLayer",
        isZoom: true,
        zoomDuration: 1000,
      });
    }
  };

  const settingTableData = (tblColumns, newTableData, params) => {
    let { isNewTbl, colsIsNeeded, isDependData } = params;
    let totalDataToShow = [];
    //fill all empty values with لا يوجد
    let colData = [...tblColumns];
    let tblDataWithNotFoundValues = newTableData?.map((row) => {
      colData.forEach((col) => {
        if (col.key.includes("_DATE")) {
          let hijriDate =
            row[col.key] && isNumber(row[col.key])
              ? {
                  timeStamp: row[col.key],
                  hijri: (
                    row[col.key].length>8? moment(row[col.key]).format("iYYYY/iM/iD"):
                    moment(row[col.key]).format("iYYYY/iM")
                  ),
                }
              :row[col.key] && !isNumber(row[col.key])?
              {
                hijri: row[col.key],
                  timeStamp: null,
              }: {
                  hijri: "لا يوجد",
                  timeStamp: null,
                };
          //use convertEngNumbersToArabic method in utilsFunc to show it in arabic numbers
          row[col.key] = hijriDate;
        } else {
          row[col.key] =
            typeof row[col.key] === "string"
              ? // if string
                row[col.key].trim()
                ? (row[col.key])
                : "لا يوجد"
              : //if not string
              row[col.key]
              ? (row[col.key])
              : "لا يوجد";
        }
      });
      return row;
    });
    let isLayer;
    if (isDependData) {
      isLayer = props.map.__mapInfo.info.$layers.layers.find(
        (lay) => lay.name === isDependData.layerName
      );

      if (isNewTbl) {
        totalDataToShow = [...tblDataWithNotFoundValues];
        setDepTableData(
          typeof isDependData === "object"
            ? {
                data: totalDataToShow,
                layerData: isDependData,
                layerMetadata: props.mainData.layers[isDependData.layerName],
              }
            : {
                ...depTableData,
                data: totalDataToShow,
                layerMetadata: props.mainData.layers[isDependData.layerName],
              }
        );
        if (colsIsNeeded) setDepTblColumns(colData);
      } else {
        //used in case of pagination to add old data with new data
        totalDataToShow = [...depTableData.data, ...tblDataWithNotFoundValues];
        setDepTableData(
          typeof isDependData === "object"
            ? {
                data: totalDataToShow,
                layerData: isDependData,
                layerMetadata: props.mainData.layers[isDependData.layerName],
              }
            : {
                ...depTableData,
                data: totalDataToShow,
                layerMetadata: props.mainData.layers[isDependData.layerName],
              }
        );
      }
    } else {
      isLayer = true;
      if (isNewTbl) {
        totalDataToShow = [...tblDataWithNotFoundValues];
        setTableData(totalDataToShow);
        if (colsIsNeeded) setTblColumns(colData);
        // clearGraphics(["highlightGraphicLayer"], props.map);
      } else {
        //used in case of pagination to add old data with new data
        totalDataToShow = [...tableData, ...tblDataWithNotFoundValues];
        setTableData(totalDataToShow);
      }
    }
    clearGraphics(["ZoomGraphicLayer", "highlightGraphicLayer"], props.map);
    if (isLayer) {
      if (totalDataToShow.length) {
        let features = totalDataToShow.filter((d) => {
          if (d.geometry?.rings || d.geometry?.paths || d.geometry?.x) return d;
          else return;
        });
        highlightFeature(features, props.map, {
          layerName: "highlightGraphicLayer",
          isZoom: true,
          zoomDuration: 1000,
        });
      }
    }
  };
  const resetFilters = () => {
    console.log("reset");
    let defaultWhere = "1=1";
    if (
      colFilterWhere.dep.length ||
      (depTblColumns && filterWhereClauseRef.current.dep.filtered)
    ) {
      //dependency data
      let layerID = getLayerId(
        props.map.__mapInfo,
        depTableData.layerData.layerName
      );
      getLayerDataForTable({
        layerID,
        layerData: depTableData.layerData,
        isNewTbl: true,
        where: filterWhereClauseRef.current.dep.default,
        colsIsNeeded: true,
      });
      filterWhereClauseRef.current = {
        ...filterWhereClauseRef.current,
        dep: {
          ...filterWhereClauseRef.current.dep,
          filtered: "",
        },
      };
    } else if (
      colFilterWhere.current.length ||
      (!depTblColumns && filterWhereClauseRef.current.current !== "1=1")
    ) {
      //currnet layer
      let layerID = getLayerId(props.map.__mapInfo, activeLink.value);
      getLayerDataForTable({
        layerID,
        layerData: activeLink.layerData,
        isNewTbl: true,
        where: defaultWhere,
        colsIsNeeded: true,
      });
      filterWhereClauseRef.current = {
        ...filterWhereClauseRef.current,
        current: defaultWhere,
      };
      // setFilterWhereClause({ ...filterWhereClause, current: defaultWhere });
    }
    setColFilterWhere({
      current: [],
      dep: [],
    });
  };
  const resetColFilters = () => {
    if (depTblColumns) {
      //dependency data
      let layerID = getLayerId(
        props.map.__mapInfo,
        depTableData.layerData.layerName
      );
      getLayerDataForTable({
        layerID,
        layerData: depTableData.layerData,
        isNewTbl: true,
        where: filterWhereClauseRef.current.dep.filtered
          ? filterWhereClauseRef.current.dep.filtered
          : filterWhereClauseRef.current.dep.default,
        colsIsNeeded: true,
      });
      filterWhereClauseRef.current = {
        ...filterWhereClauseRef.current,
        dep: {
          ...filterWhereClauseRef.current.dep,
          filtered: "",
        },
      };
    } else {
      //currnet layer
      let layerID = getLayerId(props.map.__mapInfo, activeLink.value);
      getLayerDataForTable({
        layerID,
        layerData: activeLink.layerData,
        isNewTbl: true,
        where: filterWhereClauseRef.current.current,
        colsIsNeeded: true,
      });
      filterWhereClauseRef.current = {
        ...filterWhereClauseRef.current,
      };
      // setFilterWhereClause({ ...filterWhereClause, current: defaultWhere });
    }
    setColFilterWhere({
      current: [],
      dep: [],
    });
  };
  //for filter in server side
  const setFiltersIntoTable = (rowData, layerData) => {
    // let hasDropDownList = rowData.domain || getSubtypes(rowData.name,props.map,layerData.layerName );
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div
            style={{
              padding: 8,
            }}
          >
            {rowData.domain?.codedValues || rowData.domain ? (
              <Select
                virtual={false}
                suffixIcon={<DownCircleFilled />}
                showSearch
                // allowClear
                onSelect={(value, input) => {
                  setSelectedKeys([
                    {
                      name: input.name,
                      value,
                    },
                  ]);
                }}
                ref={filterInput}
                placeholder={`ابحث بـ ${rowData.alias}`}
                value={selectedKeys[0]?.name}
                // onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                style={{
                  marginBottom: 8,
                  display: "block",
                }}
                // placeholder="القيمة"
                getPopupContainer={(trigger) => trigger.parentNode}
                optionFilterProp="name"
                filterOption={(input, option) => {
                  return option.name && option.name.indexOf(input) >= 0;
                }}
              >
                {(rowData.domain?.codedValues || rowData.domain)
                  .filter((c) => c.name && c.code)
                  .map((domain, index) => {
                    return (
                      <Select.Option
                        key={index}
                        name={domain.name}
                        value={domain.code}
                      >
                        {domain.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            ) : rowData.type === "esriFieldTypeDate" ? (
              <HijriDatePicker
                disableOnClickOutside
                placeholder={t('common:selectDate')}
                input={{
                  ref: { filterInput },
                  // id:"value" + row.id,
                  value: selectedKeys,
                  onChange: (e) => setSelectedKeys(e),
                }}
              />
            ) : (
              <Input
                ref={filterInput}
                placeholder={`ابحث بـ ${rowData.alias}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                  handleTblFilter(selectedKeys, confirm, rowData.name)
                }
                style={{
                  marginBottom: 8,
                  display: "block",
                }}
              />
            )}

            <Space>
              <button
                type="primary"
                className="SearchBtn mt-3 w-25"
                size="large"
                htmlType="submit"
                onClick={() => handleTblFilter(selectedKeys, confirm, rowData)}
                icon={<SearchOutlined />}
                style={{
                  width: 90,
                }}
              >
                بحث
              </button>
              <button
                className="SearchBtn mt-3 w-25"
                size="large"
                htmlType="submit"
                onClick={() =>
                  clearFilters && handleResetTblFilter(clearFilters, confirm)
                }
                style={{
                  width: 90,
                }}
              >
{t('common:cancelSearch')}              </button>
            </Space>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <SearchOutlined
          // onClick={(e)=>handleClickingOnfilterIcon(e, rowData, layerData)}
          style={{
            color: filtered ? "#1890ff" : undefined,
          }}
        />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => filterInput.current?.select?.(), 100);
        }
      },
      render: (text) => text,
    };
  };

  const handleTblFilter = (selectedKeys, confirm, rowData) => {
    confirm(); //confirm will fire onTableChange
  };

  const handleResetTblFilter = (clearFilters, confirm) => {
    clearFilters();
    confirm(); //confirm will fire onTableChange
  };

  const onTableChange = (newPagination, filters, sorter, actionObj, e) => {
    console.log({ newPagination }, { filters }, { sorter }, { actionObj });
    let layData = [
      ...props.map.__mapInfo.info.$layers.layers,
      ...props.map.__mapInfo.info.$layers.tables,
    ].find(
      (l) =>
        l.name ===
        (depTblColumns ? depTableData.layerData.layerName : activeLink.value)
    );
    let layerFields = layData.fields;
    let reqLayer = depTblColumns
      ? depTableData.layerData
      : activeLink.layerData;
    let layerID = getLayerId(props.map.__mapInfo, reqLayer.layerName);
    //if server
    if (actionObj.action === "sort" && actionObj?.currentDataSource?.length) {
      //1- set sortOrder to highlight sort icon on table
      let tblColsEdited = [...tblColumns];

      tblColsEdited.forEach((c) => {
        if (c.key === sorter.columnKey) c.sortOrder = sorter.order;
        else c.sortOrder = false;
      });
      let filterColWhere = [];
      let filterDic = {};
      for (let f in filters) {
        if (filters[f]) {
          filterDic[f] =
            typeof filters[f] === "object" ? filters[f][0] : filters[f];
        }
      }
      setTblColumns(tblColsEdited);
      let whereClause = depTblColumns
        ? filterWhereClauseRef.current.dep.filtered
          ? filterWhereClauseRef.current.dep.filtered
          : filterWhereClauseRef.current.dep.default
        : filterWhereClauseRef.current.current;
      if (Object.values(filterDic).length) {
        Object.entries(filterDic).forEach((f) => {
          let fLayer = layerFields.find((fl) => fl.name === f[0]);

          if (fLayer.type === "esriFieldTypeString") {
            filterColWhere.push(` ${fLayer.name} LIKE '%${f[1]}%'`);
          } else if (
            [
              "esriFieldTypeInteger",
              "esriFieldTypeDouble",
              "esriFieldTypeSmallInteger",
            ].includes(fLayer.type)
          ) {
            let value = typeof f[1] === "object" ? f[1].value : f[1];
            filterColWhere.push(` ${fLayer.name} = ${value}`);
          } else {
            //date

            filterColWhere.push(
              `(${fLayer.name} >= ${convertHirjiDateToTimeSpan(f[1])})`
            );
            filterColWhere.push(
              `(${fLayer.name} <= ${convertHirjiDateToTimeSpan(f[1], true)})`
            );
          }
        });
        if (filterColWhere.length) {
          whereClause =
            whereClause !== "1=1"
              ? "(" +
                whereClause +
                ") AND (" +
                filterColWhere.join(" AND ") +
                ")"
              : "(" + filterColWhere.join(" AND ") + ")";
        }
      }
      showLoading(true);
      getLayerDataForTable({
        layerID,
        layerData: reqLayer,
        isNewTbl: true,
        callBackFunc: () => notificationMessage( t('orderSucc')),
        where: whereClause,
        orderByFields: [
          `${sorter.columnKey} ${sorter.order === "ascend" ? "ASC" : "DESC"}`,
        ],
        colsIsNeeded: false,
      });
    }
    else if(actionObj.action === "sort" && !actionObj?.currentDataSource?.length){
      notificationMessage("لا يوجد داتا للترتيب")
    }
     else if (actionObj.action === "filter") {
      let filterColWhere = [];
      let filterDic = {};
      for (let f in filters) {
        if (filters[f]) {
          filterDic[f] =
            typeof filters[f] === "object" ? filters[f][0] : filters[f];
        }
      }
      //1- set filtered to highlight filter icon on table
      let tblColsEdited = depTblColumns ? [...depTblColumns] : [...tblColumns];
      tblColsEdited.forEach((col) => {
        if (col.key === "zoom") return;
        col.filtered = Object.keys(filterDic).includes(col.key);
        if (!col.filtered) col.filteredValue = null;
        else col.filteredValue = [filterDic[col.key]];
      });
      depTblColumns
        ? setDepTblColumns(tblColsEdited)
        : setTblColumns(tblColsEdited);
      let whereClause;
      //check if there is a column filter
      if (Object.values(filterDic).length) {
        Object.entries(filterDic).forEach((f) => {
          let fLayer = layerFields.find((fl) => fl.name === f[0]);

          if (fLayer.type === "esriFieldTypeString") {
            filterColWhere.push(` ${fLayer.name} LIKE '%${f[1]}%'`);
          } else if (
            [
              "esriFieldTypeInteger",
              "esriFieldTypeDouble",
              "esriFieldTypeSmallInteger",
            ].includes(fLayer.type)
          ) {
            let value = typeof f[1] === "object" ? f[1].value : f[1];
            filterColWhere.push(` ${fLayer.name} = ${value}`);
          } else {
            //date

            filterColWhere.push(
              `(${fLayer.name} >= ${convertHirjiDateToTimeSpan(f[1])})`
            );
            filterColWhere.push(
              `(${fLayer.name} <= ${convertHirjiDateToTimeSpan(f[1], true)})`
            );
          }
        });
        if (filterColWhere.length) {
          let reqWhereClause = depTblColumns
            ? filterWhereClauseRef.current.dep.filtered
              ? filterWhereClauseRef.current.dep.filtered
              : filterWhereClauseRef.current.dep.default
            : filterWhereClauseRef.current.current;
          whereClause =
            reqWhereClause !== "1=1"
              ? "(" +
                reqWhereClause +
                ") AND (" +
                filterColWhere.join(" AND ") +
                ")"
              : "(" + filterColWhere.join(" AND ") + ")";

          if (whereClause !== reqWhereClause) {
            showLoading(true);
            getLayerDataForTable({
              layerID,
              layerData: reqLayer,
              isNewTbl: true,
              callBackFunc: () => notificationMessage( t('common:filteredSucc')),
              where: whereClause,
              colsIsNeeded: false,
              isDependData: depTblColumns ? depTableData.layerData : false,
            });
            let settedFilterWhere = depTblColumns
              ? {
                  ...colFilterWhere,
                  dep: filterColWhere,
                }
              : {
                  ...colFilterWhere,
                  current: filterColWhere,
                };
            setColFilterWhere(settedFilterWhere);
          } else showLoading(false);
        }
      } else {
        //in case of reset filter if just one column was filtered

        if (colFilterWhere.length) {
          let reqWhereClause = depTblColumns
            ? filterWhereClauseRef.current.dep.filtered
              ? filterWhereClauseRef.current.dep.filtered
              : filterWhereClauseRef.current.dep.default
            : filterWhereClauseRef.current.current;
          showLoading(true);
          getLayerDataForTable({
            layerID,
            layerData: reqLayer,
            isNewTbl: true,
            callBackFunc: () => notificationMessage("تم الفلترة بنجاح"),
            where: reqWhereClause,
            colsIsNeeded: false,
            isDependData: depTblColumns ? depTableData.layerData : false,
          });
          setColFilterWhere({
            current: [],
            dep: [],
          });
        } else {
          resetColFilters();
        }
      }
    }
  };

  const getDepData = (dependencyData, record) => {
    clearFeatures();
    let attributes = record;
    let filteredValue = "";
    let isDepChanged =
      depTableData.layerData?.layerName &&
      dependencyData.name &&
      depTableData.layerData?.layerName === dependencyData.name;
    if (isDepChanged) {
      setCurrentPageNum({ ...currentPageNum, dep: 1 });
      setColFilterWhere({ ...colFilterWhere, dep: [] });
    }

    if (
      Object.keys(attributes).includes(`${dependencyData.filter}` + "_Code")
    ) {
      filteredValue = convertNumbersToEnglish(
        attributes[`${dependencyData.filter}` + "_Code"]
      );
    } else
      filteredValue = convertNumbersToEnglish(
        attributes[dependencyData.filter]
      );

    //put condition if(LGR_ROYAL or PARCEL_PRIVACY,KROKY_SUBMISSIONS,FARZ_SUBMISSIONS,CONTRACT_UPDATE_SUBMISSIONS)
    if (["LGR_ROYAL", "PARCEL_PRIVACY",'KROKY_SUBMISSIONS','FARZ_SUBMISSIONS','CONTRACT_UPDATE_SUBMISSIONS',
    "ZAWAYED_SUBMISSIONS","SERVICE_PROJECTS_SUBMISSIONS"]
    .includes(dependencyData.name)) {
      showLoading(true);
      let token = props.mainData.user?.token;
      let requestURL =''
      if(["LGR_ROYAL", "PARCEL_PRIVACY"].includes(dependencyData.name)){
        requestURL = dependencyData.url + filteredValue;
      } else{
        let parcel_no = record['PARCEL_PLAN_NO'];
        let mun_no = record['MUNICIPALITY_NAME_Code'];
        let plan_no = (record['PLAN_NO']&&record['PLAN_NO']!=='لا يوجد')?record['PLAN_NO']:'';
        let block_no = (record['PARCEL_BLOCK_NO']&&record['PARCEL_BLOCK_NO']!=='لا يوجد')?record['PARCEL_BLOCK_NO']:'' || '';
        let subdivision_type=record['SUBDIVISION_TYPE_Code'] || '';
        let subdivision_Desc = (record['SUBDIVISION_DESCRIPTION']&&record['SUBDIVISION_DESCRIPTION']!=='لا يوجد')?record['SUBDIVISION_DESCRIPTION']:''|| '';
  
          requestURL = dependencyData.url+`?Parcel_no=${parcel_no}&Mun_code=${mun_no}&plan_no=${plan_no}&block_no=${block_no}&subdivision_Desc=${subdivision_Desc}&subdivision_type=${subdivision_type}`;  
      }
      axios
        .get(requestURL)
        .then((res) => {
          let data = dependencyData.name==='LGR_ROYAL'?[res.data]:(res.data || []);

          setCountNumber({
            ...countNumberRef.current,
            dep: data.length,
          });
          setTotalArea({
            ...totalAreaRef.current,
            dep: null,
          });
          countNumberRef.current = {
            ...countNumberRef.current,
            dep: data.length,
          };
          totalAreaRef.current = {
            ...totalAreaRef.current,
            dep: null,
          };
          let layersSetting = props.mainData.layers;
          let tblCols = layersSetting[dependencyData.name].outFields
          .map(
            (f, index) => {
              let rowProp = {
                filtered: false,
                title: t(`layers:${f.alias}`),
                dataType: "esriFieldTypeString",
                // withDomain: f.domain,
                dataIndex: f.name,
                key: f.name,
                sorter: true,
                sortOrder: false,
                filteredValue: undefined,
                defaultFilteredValue: undefined,
                filterResetToDefaultFilteredValue: true,
                // ...setFiltersIntoTable(f, queriedLayerData),
                sortDirections: ["ascend", "descend", "ascend"],
                showSorterTooltip: true,
              };
              if(f.isAnchor){
                rowProp.render = (txt, {id})=>{
                console.log(txt, id);
                  return<a href={dependencyData.workflowUrl + id +`?tk=${token}`}
                  target="_blank" rel="noreferrer noopener"
                  >{txt}</a>
              }
              }
              if (!index) rowProp.width = "max-content";
              return {
                ...rowProp,
              };
            }
          );

          let tblDataWithNotFoundValues = data?.map((row) => {
            tblCols.forEach((col) => {
              if (col.key.includes("_dateh")) {
                let hijriDate =
                  row[col.key] && isNumber(row[col.key])
                    ?
                          row[col.key].length>8? moment(row[col.key]).format("iYYYY/iM/iD"):
                          moment(row[col.key]).format("iYYYY/iM")
                      
                    :  "لا يوجد";
                //use convertEngNumbersToArabic method in utilsFunc to show it in arabic numbers
                row[col.key] = hijriDate;
              } 
              
              else
                row[col.key] =
                  typeof row[col.key] === "string"
                    ? // if string
                      row[col.key].trim()
                      ? showDataSplittedBySlash(row[col.key])
                      : "لا يوجد"
                    : //if not string
                    row[col.key]
                    ? showDataSplittedBySlash(row[col.key])
                    : "لا يوجد";
            });
            return row;
          });
          console.log(tblDataWithNotFoundValues);

          setDepTableData({
            data: tblDataWithNotFoundValues,
            layerData: dependencyData.name,
          });
          setDepTblColumns(tblCols);
          showLoading(false);
        })
        .catch((err) => {
          console.log(err);
          showLoading(false);
          notificationMessage("حدث خطأ أثناء استرجاع البيانات", 5);
        });
    } else {
      let whereClause =
        dependencyData.filterDataType === "esriFieldTypeString"
          ? `${dependencyData.filter}='${filteredValue}'`
          : `${dependencyData.filter}=${filteredValue}`;
      let layerID = getLayerId(props.map.__mapInfo, dependencyData.name);
      let layerData = Object.entries(props.mainData.layers)
        ?.filter((l) => l[0] === dependencyData.name)
        ?.map((l) => {
          return {
            layerName: l[0],
            layerMetadata: l[1],
          };
        });
      if (layerData.length) layerData = layerData[0];
      // let layerData = layersNames.find(
      //   (l) => l.layerName === dependencyData.name
      // );
      filterWhereClauseRef.current = {
        ...filterWhereClauseRef.current,
        dep: {
          default: whereClause,
          filtered: "",
        },
      };
      getLayerDataForTable({
        layerID,
        layerData,
        isNewTbl: true,
        // callBackFunc,
        where: whereClause,
        // orderByFields:layerData,
        colsIsNeeded: true,
        isDependData: layerData,
      });
    }
  };
  const handleBackClick = () => {
    clearGraphics(["ZoomGraphicLayer", "highlightGraphicLayer"], props.map);
    if (tableData.length) {
      let features = tableData.filter((d) => {
        if (d.geometry?.rings || d.geometry?.paths || d.geometry?.x) return d;
        else return;
      });
      highlightFeature(features, props.map, {
        layerName: "highlightGraphicLayer",
        isZoom: true,
        zoomDuration: 1000,
      });
    }
    setDepTableData({
      data: [],
      layerData: "",
    });
    setDepTblColumns();
    setCountNumber({ ...countNumber, dep: 0 });
    countNumberRef.current = {
      ...countNumberRef.current,
      dep: 0,
    };
    setTotalArea({ ...totalArea, dep: null });
    totalAreaRef.current = {
      ...totalAreaRef.current,
      dep: null,
    };
    setCurrentPageNum({ ...currentPageNum, dep: 1 });
    filterWhereClauseRef.current = {
      ...filterWhereClauseRef.current,
      dep: {
        default: "",
        filtered: "",
      },
    };
  };
  const CustomtableRow = ({
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    let tblDataNumber = depTblColumns
      ? depTableData.data.length
      : tableData.length;
    return (
      <>
        <tr {...restProps}>{children}</tr>

        {tblDataNumber != 0 && index + 1 == tblDataNumber ? (
          countNumber.current !== tblDataNumber &&
          tblColumns.length &&
          !depTblColumns ? (
            props.searchTableDisplay !== "searchTableHidden" ? (
              <tr>
                <PaginationComp
                  currentPageNum={currentPageNum}
                  isCurrent={false}
                  setCurrentPageNum={setCurrentPageNum}
                />
              </tr>
            ) : null
          ) : depTblColumns ? (
            countNumber.dep !== tblDataNumber ? (
              <tr>
                <PaginationComp
                  currentPageNum={currentPageNum}
                  isCurrent={false}
                  searchTableDisplay={props.searchTableDisplay}
                  setCurrentPageNum={setCurrentPageNum}
                />
              </tr>
            ) : null
          ) : null
        ) : null}
      </>
    );
  };
  return (
    <div
      className={props.searchTableDisplay}
      id="searchMeta"
      style={{ right: props.openDrawer ? "260px" : "135px" }}
    >
      <Container fluid className="openMetaHelp">
        <Row className="metaRow">
          <Col span={sideDisplay ? 5 : 0}>
            <div className="metaSide">
              <Input
                placeholder={t('common:layerFilter')}
                allowClear
                value={searchText}
                onChange={handleChangeInput}
              />
              <div className="metaSideScroll">
                {searchText !== ""
                  ? displayedLinks.map((layData) => (
                      // <Tooltip title={text.name} placement="left">
                      <div
                        id={layData.layerName}
                        onClick={(e) => openSideLinkData(e, layData)}
                        key={layData.layerName}
                        className={
                          activeLink.value === layData.layerName
                            ? "activeMetaSide metaSideDiv"
                            : " metaSideDiv"
                        }
                      >
                        
                        {props?.languageState==='ar'?
                        layData.layerMetadata.arabicName:
                        layData.layerMetadata.englishName}
                      </div>
                      // </Tooltip>
                    ))
                  : layersNames
                      // ?.filter((la) => la.layerMetadata.isSearchable)
                      .map((layer) => (
                        // <Tooltip title={text.name} placement="left">
                        <div
                          id={layer.layerName}
                          key={layer.layerName}
                          onClick={(e) => openSideLinkData(e, layer)}
                          className={
                            activeLink.value === layer.layerName
                              ? "activeMetaSide metaSideDiv"
                              : " metaSideDiv"
                          }
                        >

{props?.languageState==='ar'?
                        layer.layerMetadata.arabicName:
                        layer.layerMetadata.englishName}

                        </div>
                        // </Tooltip>
                      ))}
              </div>
            </div>
          </Col>{" "}
          {props.searchTableDisplay === "searchTableHidden" ? (
            <i
              onClick={props.openSearchTable}
              className="fas fa-arrow-up tableArrow searchTableArrow"
            ></i>
          ) : (
            <i
              onClick={props.closeSearchTable}
              className="fas fa-arrow-down tableArrow searchTableArrow"
            ></i>
          )}
          {(depTblColumns || tblColumns).length ? (
            <Col span={sideDisplay ? 19 : 24}>
              <div className="tableHeaderIconsDiv">
                {showMetaStat ? (
                  <MetaDataStatistics
                    openMetaStat={openMetaStat}
                    showMetaStat={showMetaStat}
                    exportPDFStatistics={exportPDFStatistics}
                  />
                ) : null}
                <p className="resultsNumber">
                  {sideDisplay ? (
                    <Button onClick={closeSide} className="metaheaderBtn">
                      <FontAwesomeIcon
                        icon={faChevronCircleRight}
                        style={{
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                      />
                    </Button>
                  ) : (
                    <Button onClick={openSide} className="metaheaderBtn">
                      <FontAwesomeIcon
                        icon={faChevronCircleLeft}
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                      />
                    </Button>
                  )}
                  <span style={{ fontWeight: "bold" }} className="px-2">{t("map:mapTools.resultNum")}</span>
                  {depTblColumns ? (
                    <span >
                       {(countNumber.dep)}
                    </span>
                  ) : (
                    <span >
                       {(countNumber.current)}
                    </span>
                  )}
                  {(depTblColumns ? totalArea.dep : totalArea.current) ? (
                    <>
                      <span style={{ fontWeight: "bold" }}className="metaHeaderSpacePadding px-2">{t('map:mapTools.area')} </span>
                      <span >
                        {(
                          depTblColumns ? totalArea.dep : totalArea.current
                        ).toLocaleString()}{" "}
                   {t('map:km2')} 
                      </span>
                    </>
                  ) : null}
                </p>

                <div className="tableFiltersButtons">
                {/* <Button className="tableHeaderBtn "> <Tooltip title={t("map:kroky")} placement="top">
                
                <img className="splitKrokyMetaSVG"
                    src={kroky}
                    style={{
                      cursor: "pointer",
                    }}
                  />
              </Tooltip></Button>
              <Button className="tableHeaderBtn ">
              <Tooltip title={t("map:split")} placement="top">
               
                  <img className="splitKrokyMetaSVG"
                    src={splitIcon}
                    style={{
                      cursor: "pointer",
                    }}
                  />
              </Tooltip></Button>
              <Button className="tableHeaderBtn ">
              <Tooltip title={t("map:updateContract")} placement="top">
              <img className="splitKrokyMetaSVG"
                    src={updateContract}
                    style={{paddingTop:"7px",
                      cursor: "pointer",
                    }}
                  />
              </Tooltip></Button> */}
                  {(depTblColumns &&
                    countNumber.dep &&
                    depTableData.layerData?.layerName === "Landbase_Parcel" &&
                    depTableData?.layerMetadata?.dependencies?.find(
                      (d) => d.name === externalBtnsForTblData.statisticsAttrTbl
                    )) ||
                    (!depTblColumns &&
                      countNumber.current &&
                      activeLink.value === "Landbase_Parcel" &&
                      activeLink?.layerData?.layerMetadata?.dependencies?.find(
                        (d) =>
                          d.name === externalBtnsForTblData.statisticsAttrTbl
                      ) && (
                        <Button
                          className="tableHeaderBtn "
                          onClick={openMetaStat}
                        >
                          <Tooltip placement="topLeft"title={t("common:stat")}>
                            <FontAwesomeIcon icon={faChartPie} />
                          </Tooltip>
                        </Button>
                      ))}

                  {depTblColumns && depTableData
                    ? depTableData?.layerMetadata?.dependencies?.find(
                        (d) =>
                          d.name === externalBtnsForTblData.filterAttrTblBtn
                      )
                    : activeLink?.layerData?.layerMetadata?.dependencies?.find(
                        (d) =>
                          d.name === externalBtnsForTblData.filterAttrTblBtn
                      ) && (
                        <>
                          <Button
                            disabled={["LGR_ROYAL", "PARCEL_PRIVACY"].includes(
                              depTableData?.layerData
                            )}
                            className="tableHeaderBtn "
                            onClick={openFilterModal}
                          >
                            <Tooltip placement="topLeft" title={t("common:filter")}>
                              <FontAwesomeIcon icon={faFilter} />
                            </Tooltip>
                          </Button>
                          <Button
                            disabled={["LGR_ROYAL", "PARCEL_PRIVACY"].includes(
                              depTableData?.layerData
                            )}
                            className="tableHeaderBtn"
                            onClick={resetFilters}
                          >
                            <Tooltip
                              placement="topLeft"
                              title={t('map:cancelFilter')}
                            >
                              <RestartAltIcon />
                            </Tooltip>
                          </Button>

                          <FilteRModal
                            showLoading={showLoading}
                            fields={depTblColumns || tblColumns}
                            isDepend={
                              depTblColumns ? depTableData?.layerData : false
                            }
                            setTblColumns={
                              depTblColumns ? setDepTblColumns : setTblColumns
                            }
                            showFilterModal={showFilterModal}
                            openFilterModal={openFilterModal}
                            reqLayer={
                              depTblColumns
                                ? depTableData.layerData
                                : activeLink.layerData
                            }
                            map={props.map}
                            getLayerDataForTable={getLayerDataForTable}
                            setColFilterWhere={setColFilterWhere}
                            filterWhereClauseRef={filterWhereClauseRef}
                          />
                        </>
                      )}
                  {/**Export files */}
                  {(depTblColumns &&
                    depTableData?.layerMetadata?.dependencies?.find(
                      (d) => d.name === externalBtnsForTblData.exportAttrTbl
                    )) ||
                  (tblColumns.length &&
                    activeLink?.layerData?.layerMetadata?.dependencies?.find(
                      (d) => d.name === externalBtnsForTblData.exportAttrTbl
                    )) ? (
                    <ExportFilesComp
                      map={props.map}
                      isDepend={depTblColumns ? true : false}
                      columns={
                        depTblColumns
                          ? depTblColumns
                              ?.filter((c) => c.title)
                              ?.map((c) => c.dataIndex)
                          : tblColumns
                              ?.filter((c) => c.title)
                              ?.map((c) => c.dataIndex)
                      }
                      filterWhereClause={filterWhereClauseRef.current}
                      dataSet={depTblColumns ? depTableData.data : tableData}
                      labels={
                        depTblColumns
                          ? depTblColumns
                              ?.filter(
                                (c) =>
                                  c.title &&
                                  !["PARCEL_SPATIAL_ID", "OBJECTID"].includes(
                                    c.dataIndex
                                  )
                              )
                              ?.map((c) => c.title)
                          : tblColumns
                              ?.filter(
                                (c) =>
                                  c.title &&
                                  !["PARCEL_SPATIAL_ID", "OBJECTID"].includes(
                                    c.dataIndex
                                  )
                              )
                              ?.map((c) => c.title)
                      }
                      layerData={
                        depTblColumns
                          ? depTableData.layerData
                          : layersNames.length
                          ? activeLink.layerData
                          : ""
                      }
                    />
                  ) : null}
                  {/****** */}
                  {(depTblColumns
                    ? depTableData
                    : activeLink.layerData
                  )?.layerMetadata?.dependencies?.find(
                    (d) => d.name === externalBtnsForTblData.zoomBtn
                  ) && (
                    <Button
                      className="tableHeaderBtn"
                      onClick={() =>
                        getLayerExtext(
                          depTblColumns
                            ? depTableData.layerData
                            : activeLink.layerData
                        )
                      }
                    >
                      <Tooltip placement="topLeft" title={t("map:mapTools.zoomToAll")}>
                        <FontAwesomeIcon icon={faExpandArrowsAlt} />
                      </Tooltip>
                    </Button>
                  )}
                  {!depTblColumns ? null : (
                    <Button
                      className="tableHeaderBtn"
                      onClick={handleBackClick}
                    >
                      <Tooltip placement="topLeft" title={t("map:mapTools.prev")}>
                        <ArrowBackIcon />
                      </Tooltip>
                    </Button>
                  )}
                </div>
              </div>
              <Table
                components={{
                  body: {
                    row: CustomtableRow,
                  },
                }}
                className="metaTableIcons"
                bordered
                locale={{
                  filterTitle: "Filter menu",
                  filterConfirm: "OK",
                  filterReset: "Reset",
                  filterEmptyText: "No filters",
                  filterCheckall: "Select all items",
                  filterSearchPlaceholder: "Search in filters",
                  emptyText: (
                    <h2 style={{ textAlign: "center" }}>{t("common:noResults")} </h2>
                  ),
                  selectAll: "Select current page",
                  selectInvert: "Invert current page",
                  selectNone: "Clear all data",
                  selectionAll: "Select all data",
                  sortTitle: "Sort",
                  expand: "Expand row",
                  collapse: "Collapse row",
                  triggerDesc: t("map:clickDescSort"),
                  triggerAsc: t("map:clickAscSort"),
                  cancelSort: t("map:cancelSort"),
                }}
                // columns={tblColumns}
                dataSource={depTblColumns ? depTableData.data : tableData}
                pagination={false}
                onChange={onTableChange}
                scroll={{ x: 200, y: 300 }}
                onRow={(record, index) => {
                  return {
                    onMouseMove: (e) => drawLineWithZoom(record, e), // mouse enter row
                    onMouseLeave: clearFeatures, // mouse leave row
                    index,
                  };
                }}
                columns={(depTblColumns || tblColumns).filter(
                  (c) =>
                    !["PARCEL_SPATIAL_ID", "OBJECTID",'id'].includes(c.dataIndex)
                )}
              >
                {/* {setColumnsComps(tblColumns)} */}
              </Table>
            </Col>
          ) : (
            <div className="no-chosen-layer">
              <strong>{t("common:noLayer")}</strong>
              <br />
              <h4>{t("common:chooseLayerToresult")}</h4>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
}
