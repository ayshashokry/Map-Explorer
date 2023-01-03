import React, { useState } from "react";
import leftIcon from "../assets/images/leftMenuIcon.svg";
import Fade from "react-reveal/Fade";
import { Tooltip } from "@mui/material";
import compareLayers from "../assets/images/tools/tool1.svg";
import help from "../assets/images/tools/help.svg";
import inquiry from "../assets/images/tools/tool2.svg";
import googleMaps from "../assets/images/tools/tool3.svg";
import smallMap from "../assets/images/tools/tool4.svg";
import layersMenu from "../assets/images/tools/tool5.svg";
import traffic from "../assets/images/tools/tool7.svg";
import gas from "../assets/images/services/gas.svg";
import water from "../assets/images/services/water.svg";
import less from "../assets/images/services/less.svg";
import homeIcon from "../assets/images/services/homeIcon.svg";
import fullScreenIcon from "../assets/images/services/fullScreenIcon.svg";
import more from "../assets/images/services/more.svg";
import pharmacy from "../assets/images/services/pharmacy.svg";
import foodcart from "../assets/images/services/foodcart.svg";
import hospital from "../assets/images/services/hospital.svg";
import setting from "../assets/images/services/setting.svg";
import ServicesSearch from "./Services/ServicesSearch";
import AllTools from "./tools/AllTools";
import Swipe from "@arcgis/core/widgets/Swipe";

import { CustomTileLayer } from "../helper/common_func";
import { useTranslation } from "react-i18next";

export default function MapToolsAndServicesIcons(props) {
  const { t } = useTranslation("map");
  const [openServSearch, setServSearch] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [activeServiceItem, setActiveServiceItem] = useState(null);
  const [openToolData, setToolData] = useState(false);
  const [activeTool, setActiveTool] = useState(0);
  const openServiceSearch = (e) => {
    setServSearch(true);
    setActiveService(e.id);
    setActiveServiceItem(e);
    setToolData(false);
    setActiveTool("");
  };

  const closeServiceSearch = () => {
    setServSearch(false);
    setActiveService(0);
  };

  const openToolsData = (e) => {
    setServSearch(false);
    setActiveService(0);
    setToolData(true);
    e !== undefined && e.target !== undefined
      ? setActiveTool(e.target.name)
      : setActiveTool("");
console.log(e)
    if (e.target.name == "compareLayers") {
      var swipe = props.map.view.ui._components.find(
        (x) =>
          x.widget._container &&
          x.widget._container.className.indexOf("swipe") > -1
      );

      if (swipe) {
        swipe.widget.destroy();
        props.map.view.ui.remove(swipe);
        setActiveTool("");
      } else {
        var swipeLayer = props.map.findLayerById("baseMap");
        let swipe = new Swipe({
          view: props.map.view,
          leadingLayers: [swipeLayer],
          direction: "horizontal", // swipe widget will move from top to bottom of view
          position: 50, // position set to middle of the view (50%)
        });
        props.map.view.ui.add(swipe);
      }
    } else if (e.target.name == "traffic") {
      if (!props.map.findLayerById("trafficLayerId")) {
        let layer = new CustomTileLayer({
          urlTemplate: window.trafficUrl,
          id: "trafficLayerId",
        });

        props.map.layers.add(layer);
      } else {
        props.map.remove(props.map.findLayerById("trafficLayerId"));
      }
    }
  };
  const [openToolservice, setToolService] = useState(true);
  const openToolsMenu = () => {
    if (openToolservice) {
      setToolService(false);
      setToolData(false);
      setActiveTool("");
      setActiveService(0);
      setServSearch(false);
    } else {
      setToolService(true);
      setToolData(false);
      setActiveTool("");
      setActiveService(0);
      setServSearch(false);
    }
  };
  const closeToolsData = (e) => {
    setToolData(false);
    setActiveTool("");
  };
  const [tools] = useState([
    
    {
      id: 2,
      icon: inquiry,
      name: "inquiry",
      tooltip: "mapToolsServices.inquiry",
    },  {
      id: 5,
      icon: layersMenu,
      name: "layersMenu",
      tooltip: "mapToolsServices.layersMenu",
    },
    {
      id: 3,
      icon: googleMaps,
      name: "googleMaps",
      tooltip: "mapToolsServices.googleMaps",
      className:'googleMapToolClass'
    },
    {
      id: 4,
      icon: smallMap,
      name: "smallMap",
      tooltip: "mapToolsServices.smallMap",
    },
  
    {
      id: 7,
      icon: traffic,
      name: "traffic",
      tooltip: "mapToolsServices.traffic",
    },
  ]);


  // const [moreservices] = useState([
  //   {
  //     id: 4,
  //     icon: setting,
  //     tooltip: "mapToolsServices.maintenance",
  //     where: " SRVC_SUBTYPE = '10015' ",
  //   },
  //   {
  //     id: 5,
  //     icon: hospital,
  //     tooltip: "mapToolsServices.hospitals",
  //     where: " SRVC_TYPE = '700' ",
  //   },
  //   {
  //     id: 6,
  //     icon: foodcart,
  //     tooltip: "mapToolsServices.catering",
  //     where: " SRVC_SUBTYPE = '10005' ",
  //   },
  // ]);
  // const [openMoreSer, setOpenMoreSer] = useState(false);
  // const openMoreServices = () => {
  //   setOpenMoreSer(true);
  // };
  // const closeMoreServices = () => {
  //   setOpenMoreSer(false);
  // };
  const openHelp = (e) => {
    e.preventDefault();
    setServSearch(false);
    setActiveService(0);
    setToolData(true);
    e !== undefined && e.target !== undefined
      ? setActiveTool(e.target.name)
      : setActiveTool("");
    localStorage.removeItem("showHelp");
    localStorage.removeItem("showMetaHelp");
    localStorage.removeItem("showOpenSideHelp");
    localStorage.removeItem("showCardsResultHelp");
    localStorage.removeItem("showCardDetailsHelp");
    setTimeout(() => {
      props.setHelpShow(false);
      props.setHelpShow(true);
    }, 1);
    props.setHelpShow(false);
    console.log("zzz");
  };

  return (
    <div>
     <Tooltip title={openToolservice?t("mapTools.CloseTools"):t("mapTools.OpenTools")} placement="top">
       <div
        className="leftIconMenu openCloseToolServHelp"
        onClick={openToolsMenu}
      >
        <img src={leftIcon} alt="" />
      </div></Tooltip>

      <Fade left delay={500}>
        <div
          className={
            openToolservice
              ? "openedservicesMenu servicesHelp"
              : "closedservicesMenu servicesHelp"
          }
        >
          <ul>
            {/* {openMoreSer ? (
              <Tooltip title={t("mapToolsServices.lessServ")} placement="top">
                <li onClick={closeMoreServices} className="moreLessIcon">
                  <img
                    src={less}
                    style={{ transform: "rotate(180deg" }}
                    alt="lessServices"
                  />
                </li>
              </Tooltip>
            ) : (
              <Tooltip title={t("mapToolsServices.moreServ")} placement="top">
                <li onClick={openMoreServices} className="moreLessIcon">
                  <img src={more} alt="moreServices" />
                </li>
              </Tooltip>
            )}
            {openMoreSer
              ? moreservices.map((s, index) => (
                  <Tooltip title={t(s.tooltip)} placement="top" key={index}>
                    <li
                      id={s.id}
                      onClick={() => openServiceSearch(s)}
                      className={
                        Number(activeService) === Number(s.id)
                          ? "activeService"
                          : "serviceLi"
                      }
                    >
                      <img src={s.icon} alt="servicesIcon" id={s.id} />
                    </li>
                  </Tooltip>
                ))
              : null} */}    <Tooltip title={t("mapToolsServices.compareLayers")} placement="top" >
                <li name="compareLayers"    onClick={openToolsData}
                  className="serviceLi"
                 
                >
                  <img src={compareLayers}  name="compareLayers"className='openedservicesMenuImg' alt="servicesIcon" />
                </li>
                
              </Tooltip>
 
<Tooltip title={t("mapTools.fullScreen")} placement="top">
<li
                  className="fullscreenServHelp serviceLi"
  onClick={props.handle.enter}
>
  <img src={fullScreenIcon}className='openedservicesMenuImg' alt="fullScreenIcon" />
</li>
</Tooltip>
<Tooltip title={t("mapToolsServices.home")} placement="top">
<li         className=' serviceLi'
>
  <a
    href={`${window.hostURL}/home/Apps`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={homeIcon} alt="homeIcon"className='openedservicesMenuImg' />
  </a>
</li>
</Tooltip>  
<Tooltip title={t("mapToolsServices.help")} placement="top" >
<li                   className="serviceLi " onClick={openHelp}name='openhelp'
                 
                >
                  <img src={help} alt="servicesIcon"name='openhelp' className='openedservicesMenuImg'/>
                </li>
                
              </Tooltip>
          
          </ul>
        </div>
      </Fade>
      <Fade top delay={500}>
        <div
          className={
            openToolservice
              ? "openedToolsMenu toolsHelp"
              : "closedToolsMenu toolsHelp"
          }
        >
          <ul>
          
            {tools.map((tool, index) => (
              <>
                {tool.name !== "openHelp" ? (
                  <Tooltip
                    title={t(tool.tooltip)}
                    placement="right"
                    key={index}
                  >
                    <li
                      onClick={openToolsData}
                      name={tool.name}
                      id={openToolservice ? "openedToolsMenuLi" : ""}
                      className={
                        String(activeTool) === String(tool.name)
                          ? "activeService "
                          : ""
                      }
                  
                    >
                      {tool.icon ? (
                        <img className='openedservicesMenuImg'
                          src={tool.icon}
                          alt="toolsIcon"
                          id={tool.id}
                          name={tool.name}     style={{position:tool.className==='googleMapToolClass'?"absolute":"",
                          top:tool.className==='googleMapToolClass'?"10px":"",
                          left:tool.className==='googleMapToolClass'?"10px":""}}
                        />
                      ) : null}
                    </li>
                  </Tooltip>
                ) : (
                  <Tooltip title={t(tool.tooltip)} placement="right">
                    <li
                      onClick={openHelp}
                      // id={tool.id}
                      name={tool.name}
                      id={openToolservice ? "openedToolsMenuLi" : ""}
                      className={
                        String(activeTool) === String(tool.name)
                          ? "activeService "
                          : ""
                      }
                    >
                      <img className='openedservicesMenuImg'
                        src={tool.icon}
                        alt="toolsIcon"
                        id={tool.id}
                        name={tool.name}
                      />
                    </li>
                  </Tooltip>
                )}

                {openToolData && String(activeTool) === String(tool.name) ? (
                  <AllTools
              languageState={props.languageState}

                    mainData={props.mainData}
                    setPopupInfo={props.setPopupInfo}
                    popupInfo={props.popupInfo}
                    activeTool={tool.name}
                    map={props.map}
                    closeToolsData={closeToolsData}
                    openToolsData={openToolsData}
                    openToolData={openToolData}
                  />
                ) : null}
              </>
            ))}
          </ul>
        </div>
      </Fade>
      {openServSearch ? (
        <ServicesSearch
          mainData={props.mainData}
          outerResultMenuShown={props.outerResultMenuShown}
          outerOpenResultMenu={props.outerOpenResultMenu}
          handleDrawerOpen={props.handleDrawerOpen}
          setFilteredResult={props.setFilteredResult}
          activeService={activeServiceItem}
          map={props.map}
          closeServiceSearch={closeServiceSearch}
        />
      ) : null}
    </div>
  );
}
