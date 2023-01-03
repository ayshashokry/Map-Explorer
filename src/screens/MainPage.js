import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideMenu from "../containers/SideMenu";
import MainPageHelp from "../containers/helpTooltip/MainPageHelp";
import ImportFileTable from "../tables/ImportFileTable";
import SearchByMetaData from "../tables/SearchByMetaData";
import MapTools from "../mapComponents/MapTools";
import MapComponent from "../mapComponents/Map";
import OuterSearchForm from "../mapComponents/OuterSearchForm";
import MapToolsAndServicesIcons from "../mapComponents/MapToolsAndServicesIcons";
import LoadingComponent from "./LoadingComponent";
import { showLoading } from "../helper/common_func";
import LandIcons from "../mapComponents/landsData/LandIcons";
import Fade from "react-reveal";
import { useTranslation } from "react-i18next";

let displayedOuterSearch = [];
export default function MainPage(props) {
  const { i18n } = useTranslation();

  const [showHelp, setHelpShow] = useState(true);
  const [popupInfo, setPopupInfo] = useState();

  const [outerSearchResult, setOuterSearchResult] = useState([]);

  const setFilteredResult = (result) => {
    setOuterSearchResult(result);
  };

  /*Outer Search Functions*/
  const [outerResultMenuShown, setOuterResultMenu] = useState(true);
  const [outerResultDetailsShown, setOuterResultDetails] = useState(false);

  const outerOpenResultMenu = (e) => {
    setOuterResultMenu(true);
    setOuterResultDetails(false);
  };
  const closeResultMenu =()=>{
    setOuterResultMenu(false);
    setOuterResultDetails(false);
  }
  const outerOpenResultdetails = (e) => {
    setOuterResultMenu(false);
    setOuterResultDetails(true);
    setHelpName("cardDetailsHelp");
  };

  const [importTableDisplay, setImportDisplayTable] =
    useState("closeImportTable");
  const openImportTable = (e) => {
    setImportDisplayTable("importTableShown");
    // setOpenDrawer(false);
  };
  const closeImportTable = (e) => {
    setOpenDrawer(false);
    setImportDisplayTable("importTableHidden");
  };

  const [searchTableDisplay, setSearchTableDisplay] =
    useState("closeSearchTable");
  const openSearchTable = (e) => {
    setSearchTableDisplay("searchTableShown");
    setHelpName("openMetaHelp");
  };
  const closeSearchTable = (e) => {
    setOpenDrawer(false);
    setSearchTableDisplay("searchTableHidden");
  };
  // const showResultCardsHelp = () => {
  //   setHelpName("cardsResultHelp");
  // };
  const showCardDetailsHelp = () => {
    setHelpName("cardDetailsHelp");
  };
  const handle = useFullScreenHandle();
  const [openDrawer, setOpenDrawer] = useState(true);

  const [mapObj, setMapLoaded] = useState(null);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  //help
  const [helpName, setHelpName] = useState("main");

  const handleDrawerCloseGeneral = () => {
    setOpenDrawer(false);
  };
  const handleDrawerCloseButton = () => {
    setOpenDrawer(false);
    setHelpName("openSideMenu");
  };

  const getOuterSearchData = (e) => {
    displayedOuterSearch = e;
  };

  const onMapLoaded = async (map) => {
    //for padding map on zoom
    setMapLoaded(map);
    showLoading(false);
  };

  useEffect(() => {
    showLoading(true);
    if (
      window.location.pathname.substring(
        window.location.pathname.lastIndexOf("/") + 1
      ) === "metaDataSearch"
    )
      openSearchTable();
  }, []);

  return (
    <div className="mainPage">
      {popupInfo?.mapPoint &&
      popupInfo?.currentLayer &&
      ["Street_Naming", "Landbase_Parcel"].includes(popupInfo?.currentLayer) ? (
        <LandIcons
          popupInfo={popupInfo}
          map={mapObj}
          setPopupInfo={setPopupInfo}
          currentLayer={popupInfo?.currentLayer}
        />
      ) : null}
      {showHelp && (
        <>
          {!localStorage.getItem("showHelp") && (
            <MainPageHelp helpName={"main"} />
          )}
          {!localStorage.getItem("showOpenSideHelp") &&
            helpName === "openSideMenu" && (
              <MainPageHelp helpName={"openSideMenu"} />
            )}
          {!localStorage.getItem("showMetaHelp") &&
            helpName === "openMetaHelp" && (
              <MainPageHelp helpName={"openMetaHelp"} />
            )}
          {/* {!localStorage.getItem("showCardsResultHelp") &&
            helpName === "cardsResultHelp" && (
              <MainPageHelp helpName={"cardsResultHelp"} />
            )} */}
          {!localStorage.getItem("showCardDetailsHelp") &&
            helpName === "cardDetailsHelp" && (
              <MainPageHelp helpName={"cardDetailsHelp"} />
            )}
        </>
      )}
      <LoadingComponent />
      <canvas id="myCanvas" className="canvas-line-zoom" />
      <FullScreen handle={handle} style={{ height: "100%" }}>
        <MapComponent mapload={onMapLoaded} mainData={props.mainData} />

        {mapObj && (
          <Box sx={{ display: "flex" }}>
            <SideMenu
              toggleCurrentLang={props.toggleCurrentLang}
              languageState={props.languageState}
              mainData={props.mainData}
              map={mapObj}
              setOuterSearchResult={setOuterSearchResult}
              // showResultCardsHelp={showResultCardsHelp}
              outerSearchResult={outerSearchResult}
              showCardDetailsHelp={showCardDetailsHelp}
              displayedOuterSearch={displayedOuterSearch}
              closeImportTable={closeImportTable}
              openImportTable={openImportTable}
              closeSearchTable={closeSearchTable}
              openSearchTable={openSearchTable}
              open={openDrawer}
              handleDrawerCloseButton={handleDrawerCloseButton}
              handleDrawerCloseGeneral={handleDrawerCloseGeneral}
              handleDrawerOpen={handleDrawerOpen}
              outerOpenResultdetails={outerOpenResultdetails}
              outerOpenResultMenu={outerOpenResultMenu}
              closeResultMenu={closeResultMenu}
              outerResultMenuShown={outerResultMenuShown}
              outerResultDetailsShown={outerResultDetailsShown}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <div
                className="SideMenuOpenArrow"
                style={{
                  right: i18n.language === "ar" ? "75px" : "",
                  left: i18n.language === "en" ? "80px" : "",
                }}
              >
                <IconButton
                  className="openSideHelp"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    ...(openDrawer && { display: "none" }),
                  }}
                >
                  <FontAwesomeIcon
                    icon={faChevronCircleLeft}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </div>

             
                  {mapObj && (
                    <OuterSearchForm
                      mainData={props.mainData}openDrawer={openDrawer}
                      map={mapObj}
                      setFilteredResult={setFilteredResult}
                      getOuterSearchData={getOuterSearchData}
                      handleDrawerOpen={handleDrawerOpen}
                      setHelpName={setHelpName}
                      outerSearchResult={outerSearchResult}
                      outerOpenResultMenu={outerOpenResultMenu}
                      closeResultMenu={closeResultMenu}
                      outerOpenResultdetails={outerOpenResultdetails}
                    />
                  )}
               
              {/* <div
              className="languageIcon"
              style={{ right: openDrawer ? "495px" : "295px" }}
            >
              <IconButton color="inherit" onClick={changeLang} value={language}>
                {language}
              </IconButton>
            </div> */}
              {mapObj && (
                <Fade bottom delay={1000}>
                  <div
                    className="mapTools mapToolsHelp"
                    style={{
                      left:
                        i18n.language === "en"
                          ? openDrawer
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
                              ? "420px": window.location.pathname.substring(
                                window.location.pathname.lastIndexOf("/") + 1
                              )==""|| window.location.pathname.substring(
                                window.location.pathname.lastIndexOf("/") 
                              )==process.env.PUBLIC_URL?
                              "170px":"345px"
                            : "50px"
                          : "unset",
                    }}
                  >
                    <MapTools
              languageState={props.languageState}

                      map={mapObj}
                      mainData={props.mainData}
                      openDrawer={openDrawer}
                    />
                  </div>
                </Fade>
              )}

              <MapToolsAndServicesIcons
              languageState={props.languageState}

                mainData={props.mainData}
                setPopupInfo={setPopupInfo}
                popupInfo={popupInfo}
                outerOpenResultMenu={outerOpenResultMenu}
                closeResultMenu={closeResultMenu}
                setFilteredResult={setFilteredResult}
                handleDrawerOpen={handleDrawerOpen}
                handle={handle}
                map={mapObj}
                outerResultMenuShown={setOuterResultMenu}
                setHelpShow={setHelpShow}
              />

              {window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "import" ? (
                <ImportFileTable
                  mainData={props.mainData}
                  importTableDisplay={importTableDisplay}
                  openImportTable={openImportTable}
                  closeImportTable={closeImportTable}
                />
              ) : null}
              {window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "metaDataSearch"
                ? mapObj && (
                    <SearchByMetaData
                      mainData={props.mainData}
                      openDrawer={openDrawer}
                      searchTableDisplay={searchTableDisplay}
                      closeSearchTable={closeSearchTable}
                      openSearchTable={openSearchTable}
                      languageState={props.languageState}
                      map={mapObj}
                    />
                  )
                : null}
            </Box>
          </Box>
        )}
      </FullScreen>
    </div>
  );
}
