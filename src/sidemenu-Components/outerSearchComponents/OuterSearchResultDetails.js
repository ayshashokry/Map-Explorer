import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import {
  faInfo,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import zwa2dTnzemya from "../../assets/images/zwa2dIcon.svg";

// import { layersSetting } from "../../helper/layers";
import {
  clearGraphicLayer,
  getFeatureDomainName,
  getLayerId,
  navigateToGoogle,

  queryTask,
  showLoading,
  zoomToFeatureByObjectId,
  zoomToFeatureDefault,
} from "../../helper/common_func";

import googleLocation from "../../assets/images/googleLocation.png";
import kroky from "../../assets/images/kroky.svg";
import krokyWhite from "../../assets/images/krokyWhite.svg";

import splitIcon from "../../assets/images/splitIcon.svg";
import splitWhite from "../../assets/images/splitWhite.svg";

import updateContract from "../../assets/images/updateContracts.svg";
import updateContractWhite from "../../assets/images/updateContractWhite.svg";

import { useTranslation } from "react-i18next";
import { isNumber, notificationMessage, showDataSplittedBySlash } from "../../helper/utilsFunc";

export default function OuterSearchResultDetails(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dependcyLayer, setDependcyLayer] = useState(null);
  const { t } = useTranslation("map", "common", "layers");

  const [iconsData] = useState([
    {
      id: 1,
      icon: faSearchPlus,
      tooltip: "zoomIn",
      data: "Zoom Data",
    },
    ...(props.mainData.layers[props.data.layerName].dependecies.filter(
      dep=>{if(
        dep.showingField !== "OWNER_TYPE" ||
        (dep.showingField == "OWNER_TYPE" &&
        props.data[dep.showingField + "_Code"] ===
            dep.codeValue)
      ) return dep}
    ) || []),
  ]);

  const makeClickAction = (index) => {
    let layersSetting = props.mainData.layers;
    if (index != 2 && index != 1) setSelectedTab(index);

    if (index == 1 || index == 2) {
      zoomToFeatureByObjectId(
        props.data,
        props.map,
        props.data.isNotZoom,
        (feature) => {
          props.data.geometry = feature.geometry;

          if (index == 1) {
            navigateToGoogle(
              props.data.geometry.latitude ||
              props.data.geometry.centroid.latitude,
              props.data.geometry.longitude ||
              props.data.geometry.centroid.longitude
            );
          } else if (index == 2) {
            zoomToFeatureDefault(props.data, props.map);
          }
        }
      );
    }
    //get dependcy
    else if (index > 2) {
      let dependency = iconsData[index-2];
      let layerdId = getLayerId(props.map.__mapInfo, dependency.name);
      let field = "";
      if(["LGR_ROYAL", "PARCEL_PRIVACY",'KROKY_SUBMISSIONS','FARZ_SUBMISSIONS','CONTRACT_UPDATE_SUBMISSIONS',
    "ZAWAYED_SUBMISSIONS","SERVICE_PROJECTS_SUBMISSIONS"]
      .includes(dependency.name)){
        getDepDataAPIDepend(dependency)
      }else{

      if (dependency.filter) {
        field = dependency.filter;
      } else field = layersSetting[dependency.name].filter;

      var where = field + "= '" + props.data[field] + "'";

      queryTask({
        url: window.mapUrl + "/" + layerdId,
        outFields: layersSetting[dependency.name].outFields,
        where: where,
        callbackResult: ({ features }) => {
          if (features.length) {
            getFeatureDomainName(features, layerdId).then((res) => {
              res.forEach((r) => {
                r.attributes.layerName = dependency.name;
              });

              if (dependency.isTable) {
                setDependcyLayer(res[0]);
              } else {
                let mappingRes = res.map((f) => {
                  return {
                    layerName: dependency.name,
                    id: f.attributes["OBJECTID"],
                    ...f.attributes,
                  };
                });

                props.setOuterSearchResult(mappingRes);

                if (res.length > 1) {
                  props.generalOpenResultMenu();
                } else {
                  props.outerOpenResultdetails(mappingRes[0]);
                }
              }
            });
          } else {
            setDependcyLayer([]);
          }
        },
      });
    }
  }
  };
  const getDepDataAPIDepend = (dependencyData)=>{
    showLoading(true);
    let layersSetting = props.mainData.layers;

    let token = props.mainData.user?.token;
    let requestURL ='', field='';
    if(["LGR_ROYAL", "PARCEL_PRIVACY"].includes(dependencyData.name)){
      if (dependencyData.filter) {
        field = dependencyData.filter;
      } else field = layersSetting[dependencyData.name].filter;
      requestURL = dependencyData.url + props.data[field];
    } else{
      let parcel_no = props.data['PARCEL_PLAN_NO'];
      let mun_no = props.data['MUNICIPALITY_NAME_Code'];
      let plan_no = props.data['PLAN_NO'];
      let block_no = props.data['PARCEL_BLOCK_NO']||'';
      let subdivision_type=props.data['SUBDIVISION_TYPE_Code'] || '';
      let subdivision_Desc = props.data['SUBDIVISION_DESCRIPTION']||'';
      requestURL = dependencyData.url+`?Parcel_no=${parcel_no}&Mun_code=${mun_no}&plan_no=${plan_no}&block_no=${block_no}&subdivision_Desc=${subdivision_Desc}&subdivision_type=${subdivision_type}`;
    }
    axios
      .get(requestURL)
      .then((res) => {
        let data = dependencyData.name==='LGR_ROYAL'?[res.data]:(res.data || []);
        if (data.length) {
          data = data.map(item=>{
            return {
              attributes:{...item}
            }
          })
              let mappingRes = data.map((f) => {
                return {
                  layerName: dependencyData.name,
                  id: f.attributes["OBJECTID"],
                  attributes:{...f.attributes},
                  isExternalFetchedData:true
                };
              });
            setDependcyLayer(mappingRes)

                props.outerOpenResultdetails(mappingRes);

        } else {
          setDependcyLayer([]);
        }
      
        showLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showLoading(false);
        notificationMessage("حدث خطأ أثناء استرجاع البيانات", 5);
      });
  }

  useEffect(() => {
    if (props.data && !props.data.isNotZoom) {
      console.log("detail data", props.data);
      if (!props.data.geometry) {
        zoomToFeatureByObjectId(props.data, props.map, false, (feature) => {
          props.data.geometry = feature.geometry;
        });
      } else zoomToFeatureDefault(props.data, props.map);
    }
    return () => {
      clearGraphicLayer("ZoomGraphicLayer", props.map);
    }
  }, []);


  const getSubmissionsData = async(typeOfData)=>{
    
    switch (typeOfData){
      case 'kroky':
        break;
      case 'split':
        break;
      case 'updateContract':
        break;
    }
  }

  return (
    <div className="generalResultDetails cardDetailsHelp">
      {props.data && (
        <Tabs
          defaultFocus={true}
          selectedIndex={selectedTab}
          onSelect={(x) => makeClickAction(x)}
        >
          {console.log(selectedTab)}
          <TabList>
            <Tab>
              <Tooltip title={t("map:results")} placement="top">
                <IconButton className="tooltipButton">
                  <FontAwesomeIcon
                    icon={faInfo}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Tab>

             
            <Tab>
              <Tooltip
                title={t("map:mapToolsServices.googleMaps")}
                placement="top"
              >
                <button className="tooltipButton">
                  <img
                    style={{ width: "15px" }}
                    src={googleLocation}
                    alt="googleLocation"
                  />
                </button>
              </Tooltip>
            </Tab>
         

            {iconsData.map((ic, index) => {
              if (
                ic.showingField === undefined ||
                ic.showingField !== "OWNER_TYPE" ||
                (ic?.showingField == "OWNER_TYPE" &&
                  props.data[ic?.showingField + "_Code"] === ic?.codeValue)
              )
                return (
                  <Tab>
                    {console.log(ic.tooltip)}
                    <Tooltip title=
                      {t(`layers:${ic.tooltip}`)}
                      placement="top">
                      <IconButton className="tooltipButton">
                        {ic.icon?<FontAwesomeIcon
                          icon={ic.icon}
                          style={{
                            cursor: "pointer",
                          }}
                        />: <img className={ic.className=="contzwa2edClass"?"updaeContractImgClass":""}
                        src={ic.imgIconSrc}
                        style={{
                          cursor: "pointer",
                        }}
                      />}
                      </IconButton>
                    </Tooltip>
                  </Tab>
                );
            })}

{/* <Tab>
              <Tooltip title={t("map:kroky")} placement="top">
                <IconButton className="tooltipButton">
                  <img 
                    src={selectedTab==6?krokyWhite:kroky}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Tab>
            <Tab>
              <Tooltip title={t("map:split")} placement="top">
                <IconButton className="tooltipButton">
                <img 
                    src={selectedTab==8?splitWhite:splitIcon}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Tab>

            <Tab>
              <Tooltip title={t("map:updateContract")} placement="top">
                <IconButton className="tooltipButton">
                <img className=""
                    src={selectedTab==8?updateContractWhite:updateContract}
                    style={{paddingTop:"7px",
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Tab> */}
          </TabList>
          <TabPanel>
            <Table
              striped
              responsive
              hover
              className="mt-2 outerSearchDetailTrStyle"
            >
              {props.mainData.layers[props.data.layerName].outFields
                .filter((x) => x != "OBJECTID" && x.indexOf("SPATIAL_ID") < 0)
                .map((attribute, index) => {
                  return (
                    <tr key={index}>
                      <td className="infoTableTd">
                        {t(`layers:${props.mainData.layers[props.data.layerName]
                          .aliasOutFields[index]}`)}


                      </td>
                      <td
                        className="infoTableData"
                        style={{ textAlign: "center" }}
                      >
                        {(attribute.indexOf("_AREA") > -1
                          ? (+props.data[attribute]).toFixed(2)
                          : props.data[attribute]) || t("common:notAvailable")}
                      </td>
                    </tr>
                  );
                })}
            </Table>
          </TabPanel> 
         
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>

          
          {iconsData
            .filter((y) => y.id != 1)
            .map((ic, index) => {
              return (
                <TabPanel>
                  {dependcyLayer &&
                  !dependcyLayer?.length&&
                    dependcyLayer?.attributes &&
                    props.mainData.layers[dependcyLayer?.attributes.layerName]
                    && !dependcyLayer?.attributes.isExternalFetchedData
                    ? (
                    <Table
                      striped
                      responsive
                      hover
                      className="mt-2 outerSearchDetailTrStyle"
                    >
                      {props.mainData.layers[
                        dependcyLayer.attributes.layerName
                      ].outFields
                        .filter(
                          (x) => x != "OBJECTID" && x.indexOf("SPATIAL_ID") < 0
                        )
                        .map((attribute, index) => {
                          return (
                            <tr key={index}>
                              <td className="infoTableTd">

                                {t(`layers:${props.mainData.layers[
                                  dependcyLayer.attributes.layerName
                                ].aliasOutFields[index]}`)}
                              </td>
                              <td
                                className="infoTableData"
                                style={{ textAlign: "center" }}
                              >
                                {(attribute.indexOf("_AREA") > -1
                                  ? (+dependcyLayer.attributes[
                                    attribute
                                  ]).toFixed(2)
                                  : showDataSplittedBySlash(dependcyLayer.attributes[attribute])) ||
                                  t("common:notAvailable")}
                              </td>
                            </tr>
                          );
                        })}
                    </Table>
                  ) 
                 :dependcyLayer &&
                 dependcyLayer?.length
                 ? 
                  
                 (dependcyLayer?.map(item=>(

                 <Table
                   striped
                   responsive
                   hover
                   className="mt-2 outerSearchDetailTrStyle"
                 >
                   {props.mainData.layers[
                     item.layerName
                   ].outFields
                     .filter(
                       (x) => x.name !== "id"
                     )
                     .map((attribute, index) => {
                       let token = props.mainData.user?.token;
                       let dependency = iconsData.find(it=>it.name===item.layerName);
                       
                       console.log(attribute,item,dependcyLayer,iconsData, dependency);
                       return (
                         <tr key={index}>
                           <td className="infoTableTd">

                             {t(`layers:${attribute.alias}`)}
                           </td>
                           <td
                             className="infoTableData"
                             style={{ textAlign: "center" }}
                           >
                      {
                      (attribute.isAnchor 
                        && attribute.name==='request_no' 
                        && item.attributes[attribute.name])
                        ?
                          <a target="_blank" rel="noreferrer noopener"  
                          href={dependency.workflowUrl + item.attributes['id'] +`?tk=${token}`}>
                            {showDataSplittedBySlash(item.attributes[attribute.name])}
                          </a>:
                             (showDataSplittedBySlash(item.attributes[attribute.name])) ||
                               t("common:notAvailable")
                      }
                           </td>
                         </tr>
                       );
                     })}
                 </Table>
                 )


               )) 

                  : dependcyLayer && dependcyLayer.length == 0 ? (
                    <p className="noDataStyle">
                      {" "}
                      {t("common:notAvailableData")}
                    </p>
                  ) : (
                    <></>
                  )}
                </TabPanel>
              );
            })}

             {/*beginning: split,contract,kroky */}
           <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
           {/*end: split,contract,kroky */}
        </Tabs>
      )}
    </div>
  );
}
