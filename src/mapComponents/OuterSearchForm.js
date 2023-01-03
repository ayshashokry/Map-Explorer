import React, { useState, useEffect, useContext, useRef } from "react";
import { Input, Form, Tooltip } from "antd";
import nearbyIcon from "../assets/images/outerSearchIcon.svg";
import activeNearByIcon from "../assets/images/outerSearchActive.svg";
import {
  addPictureSymbol,
  getFeatureDomainName,
  getLayerId,
  makeIdentify,
  queryTask,
  showLoading,
} from "../helper/common_func";
// import { layersSetting } from "../helper/layers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";import Fade from "react-reveal";
let displayed = [];
export default function OuterSearchForm(props) {
  const { t,i18n } = useTranslation("common");
  const timeoutObj = {};
  const [displayedOuterSearch, setDisplayedOuterSearch] = useState([]);
  const [outerAutoComplete, setOuterComplete] = useState(true);
  const [outerSearchText, setFormValues] = useState("");
  const [isActiveBufferSearch, setActiveBufferSearch] = useState(false);  

  const componentRef = useRef({});
  const formRef = useRef();
  const { current: timeout } = componentRef;
  const selectedTabsIndex = ["Landbase_Parcel", "Serivces_Data"];
  const searchfields = [
    "PARCEL_PLAN_NO",
    "SRVC_NAME",
    "DISTRICT_NAME",
    "MUNICIPALITY_NAME",
  ];

  let navigate = useNavigate();

  const handleOuterSearchText = (e) => {
    e.preventDefault();
    setOuterComplete(true);
    props.map.__selectedItem = null;
    let searchQuery = e.target.value.toLowerCase();
    //close the side menu, empty the search list, navigate to home 
    if(searchQuery===''){
      props.closeResultMenu();
      setDisplayedOuterSearch([]);
      navigate("/");
    }else{
    setFormValues(e.target.value.toLowerCase());

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (searchQuery.length >= 3) {
        getFilterUserSearchInput(searchQuery);
      }

      props.outerOpenResultMenu();
    }, 500);

    props.outerOpenResultMenu();
  }
  };

  const activeBufferSearch = () => {
    setActiveBufferSearch(!isActiveBufferSearch);
  };

  const getFilterUserSearchInput = (e) => {
    let layersId = [];
    let promiseQueries = [];
    selectedTabsIndex.forEach((layer, index) => {
      let layerdId = getLayerId(props.map.__mapInfo, layer);
      layersId.push(layerdId);
      let layersSetting = props.mainData.layers;
      promiseQueries.push(
        queryTask({
          url: window.mapUrl + "/" + layerdId,
          where: searchfields[index] + " Like '%" + e + "%'",
          outFields: layersSetting[layer].outFields,
          returnGeometry: true,
          start: 0,
          num: window.paginationCount,
          geometry: isActiveBufferSearch ? props.map.view.extent : null,
          returnExecuteObject: true,
        })
      );
    });

    showLoading(true);
    Promise.all(promiseQueries).then((resultsData) => {
      var allResult = [];

      let filteredResultLength = resultsData.filter(
        (f) => f.features.length
      ).length;

      if (filteredResultLength) {
        resultsData.forEach((result, index) => {
          if (result.features.length) {
            getFeatureDomainName(result.features, layersId[index]).then(
              (res) => {
                let mappingRes = res.map((f) => {
                  return {
                    layerName: selectedTabsIndex[index],
                    __filterDisplayField: searchfields[index],
                    id: f.attributes["OBJECTID"],
                    ...f.attributes,
                    geometry: f.geometry,
                  };
                });

                allResult = allResult.concat(mappingRes);
                --filteredResultLength;

                if (filteredResultLength == 0) {
                  showLoading(false);
                  let searchQuery = e;
                  displayed = allResult.filter(function (el) {
                    var searchValue =
                      el[el["__filterDisplayField"]].toLowerCase();
                    return searchValue.indexOf(searchQuery) !== -1;
                  });
                  setDisplayedOuterSearch(displayed);
                  //props.getOuterSearchData(searchQuery);

                  props.setFilteredResult(displayed);
                }
              }
            );
          }
        });
      } else {
        showLoading(false);
        setDisplayedOuterSearch([]);

        props.setFilteredResult([]);
      }
    });
  };

  useEffect(() => {
    setOuterComplete(false);
  }, [props.routeName]);

  const onEnterOuterSearch = (value) => {
    if (value && value.layerName) {
      props.setFilteredResult([value]);
      //set selected value to input text to show 
      setFormValues(value['SRVC_NAME']);
      formRef.current.setFieldsValue({'searchText':value['SRVC_NAME']}) 
    } else {
      props.setFilteredResult(displayed);
    }
    navigate("/search");
    props.handleDrawerOpen();
    props.outerOpenResultMenu();
    // props.setHelpName("cardsResultHelp");
    setOuterComplete(false);
  };
  //   const openDetailsOuterSearch = () => {
  //     navigate("/search");
  //     props.handleDrawerOpen();
  //     props.outerOpenResultdetails();
  //   };
  return ( <div
    className="mapOuterSearch "
    style={{
      position: "absolute",
      right:
        i18n.language === "ar"
          ? props.openDrawer
            ? window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "generalSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "search" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "coordinateSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "marsed"
              ? "480px":window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              )==""|| window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") 
              )==process.env.PUBLIC_URL?
              "210px":"400px"
            : "150px"
          : "unset",
      left:
        i18n.language === "en"
          ? props.openDrawer
            ? displayedOuterSearch.length > 0 &&outerSearchText !== ""&&
            ( window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "generalSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "search" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "coordinateSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "marsed")
              ? "480px"
              :displayedOuterSearch.length == 0 &&outerSearchText == ""&&( window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "generalSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "search" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "coordinateSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "marsed")?"480px"
              :displayedOuterSearch.length > 0 &&outerSearchText !== ""&&  (window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              )==""||window.location.pathname==process.env.PUBLIC_URL)?"210px"
              : displayedOuterSearch.length == 0 &&outerSearchText == ""&&  (window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              )||window.location.pathname==process.env.PUBLIC_URL)==""?"210px"
              // :displayedOuterSearch.length > 0 &&outerSearchText !== ""? "400px"
              // :displayedOuterSearch.length == 0 &&outerSearchText == ""?"400px":"460px"
          :""
            :!props.openDrawer?
            displayedOuterSearch.length > 0 &&outerSearchText !== ""? "150px":"150px" : ""
          : "unset"
    }}
  >
    <Fade right delay={1000}>
    <div
      className="outerSearchForm outerSearchHelp"
      id={
        displayedOuterSearch.length > 0 &&outerSearchText !== ""
          ? "outerFormWidthFit" : "outerFormWidth"
      }
    >
      <Form ref={formRef} className="GeneralForm" layout="vertical" name="validate_other">
        <Form.Item name="searchText" className="outerSearchInput">
          <Input
            placeholder={t("SearchForService")}
            allowClear
            value={outerSearchText}
            onPressEnter={onEnterOuterSearch}
            onChange={handleOuterSearchText}
            size="large"
            suffix={ i18n.language === "ar"?
              <Tooltip placement="bottom" title={t("outerActiveSearch")}>
                <img
                  alt="nearbyIcon"
                  src={isActiveBufferSearch ? activeNearByIcon : nearbyIcon}
                  onClick={activeBufferSearch}
                  className="nearbyIcon"
                />
              </Tooltip>:""
            }
            prefix={ i18n.language === "en"?
              <Tooltip placement="bottom" title={t("outerActiveSearch")}>
                <img
                  alt="nearbyIcon"
                  src={isActiveBufferSearch ? activeNearByIcon : nearbyIcon}
                  onClick={activeBufferSearch}
                  className="nearbyIcon"
                />
              </Tooltip>:""
            }
          />
        </Form.Item>
        {outerSearchText !== "" &&
          displayedOuterSearch.length > 0 &&
          outerAutoComplete && (
            <div className="outerSearchAutoComplete">
              {displayedOuterSearch.slice(0, window.paginationCount).map((x) => (
                <div
                  onClick={() => onEnterOuterSearch(x)}
                  style={{ display: "flex", overflowX: "hidden" }}
                >
                  <label style={{ whiteSpace: "pre" }}>
                    {x[searchfields[0]] || x[searchfields[1]]}
                  </label>
                  <label className="searchLocationInfo">
                    , {x[searchfields[2]]} , {x[searchfields[3]]}
                  </label>
                </div>
              ))}
            </div>
          )}
      </Form>
    </div></Fade></div>
  );
}
