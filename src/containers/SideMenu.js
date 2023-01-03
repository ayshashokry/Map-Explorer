import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CoordinatesSearch from "../sidemenu-Components/CoordinatesSearch";
import GeneralSearch from "../sidemenu-Components/GeneralSearch";
import BarChartIcon from "@mui/icons-material/BarChart";
import NearestServiceSearch from "../sidemenu-Components/NearestServiceSearch";
import GeoRange from "../sidemenu-Components/GeoRange";
import MeasureTool from "../sidemenu-Components/MeasureTool";
import Painting from "../sidemenu-Components/Painting";
import PrintComponent from "../sidemenu-Components/PrintComponent";
import KmlGoogle from "../sidemenu-Components/KmlGoogle";
import BookMark from "../sidemenu-Components/BookMark";
import google from "../assets/images/sidemenu/google.svg";
import importFile from "../assets/images/sidemenu/importFile.svg";
import general from "../assets/images/sidemenu/general.svg";
import desSearch from "../assets/images/sidemenu/desSearch.svg";
import bookmark from "../assets/images/sidemenu/bookmark.svg";
import cooSearch from "../assets/images/sidemenu/cooSearch.svg";
import measurTool from "../assets/images/sidemenu/measurTool.svg";
import Paint from "../assets/images/sidemenu/Paint.svg";
import print from "../assets/images/sidemenu/print.svg";
import englishIcon from "../assets/images/sidemenu/englishIcon.svg";
import arabicIcon from "../assets/images/sidemenu/arabicIcon.svg";
import Phone from "../assets/images/sidemenu/Phone.svg";
import Marsed from "../assets/images/sidemenu/marsed.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import OuterSearchMainPage from "../sidemenu-Components/outerSearchComponents/OuterSearchMainPage";
import MarsedComponent from "../sidemenu-Components/MarsedComponent";
import axios from "axios";
import { Fade } from "react-reveal";
import {
  showGeneralDataTable,
  executeGPTool,
  showLoading,
} from "../helper/common_func";
import { useTranslation } from "react-i18next";
export default function SideMenu(props) {
  const { t, i18n } = useTranslation("sidemenu", "common");

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width:
      window.location.pathname.substring(
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
        ? 450:window.location.pathname.substring(
        window.location.pathname.lastIndexOf("/") + 1
      )==""?200
      :window.location.pathname==process.env.PUBLIC_URL
      ?200
      
      :  window.location.pathname.substring(
        window.location.pathname.lastIndexOf("/") + 1
      ) === "metaDataSearch"?200
        : 370,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));
  const openedMixin = (theme) => ({
    width:
      window.location.pathname.substring(
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
        ? 450:window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        )==""?200
        
        :window.location.pathname==process.env.PUBLIC_URL
        ?200:window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "metaDataSearch"?200
        : 370,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(9)} + 1px)`,
    },
  });
  const [sideLinks, setSideLinks] = useState([
    {
      id: 1,
      name: "sideLinks.generalSearch",
      icon: general,
      to: "generalSearch",
    },
    { id: 4, name: "sideLinks.print", icon: print, to: "print" },
    {
      id: 5,
      name: "sideLinks.coordinateSearch",
      icon: cooSearch,
      to: "coordinateSearch",
    },
  
    {
      id:7,
      name: "sideLinks.measurementTools",
      icon: measurTool,
      to: "measurement",
    },
    { id: 8, name: "sideLinks.paint", icon: Paint, to: "painting" },
    { id: 10, name: "sideLinks.bookmark", icon: bookmark, to: "bookmark" },

    { id: 13, name: "sideLinks.contact", icon: Phone, to: "contact" },
    {
      id: 11,
      name: "sideLinks.importFiles",
      module_id: 49,
      icon: importFile,
      to: "import",
    },
  ]);
  useEffect(() => {
    if (props?.mainData) {
      let mainFunctions = props?.mainData?.mainFunctions || [];
      let reqMainFuncIDs = [];
      if (mainFunctions.length) {
        for (let index = 0; index < mainFunctions.length; index++) {
          let item = mainFunctions[index];
          let moduleIds = item.groups_permissions.map((i) => i.module_id);
          reqMainFuncIDs = [...reqMainFuncIDs, ...moduleIds];
        }
      }
      let sideLinksOfMainFunc = [
        {
          id: 9,
          name: "sideLinks.marsad",
          module_id: 47,className:"marsadImg",
          icon: Marsed,
          to: "marsed",
        },
        {
          id: 6,
          module_id: 48,
          name: "sideLinks.MetaSearch",
          icon: desSearch,
          to: "metaDataSearch",
        },

        {
          id: 12,
          name: "sideLinks.exportGoogle",
          module_id: 50,
          icon: google,
          to: "kml",
        },
      ];

      let reqMainFuncSideLinks = sideLinksOfMainFunc.filter((sL) =>
        reqMainFuncIDs.includes(sL.module_id)
      );
      let reqSideLinksToSet = [...reqMainFuncSideLinks, ...sideLinks].sort(
        (a, b) => (a.id < b.id ? -1 : 1)
      );
      setSideLinks(reqSideLinksToSet);
    }
  }, [/*props.mainData*/]);
  // const openImportTable = (e) => {
  //   props.handleDrawerOpen();
  //   props.openImportTable();
  // };
  const openSearchTable = (e) => {
    props.openSearchTable();
    props.handleDrawerCloseGeneral();
  };

  const generalOpenSearchInput = (e) => {
    setOpenResultMenu(false);
    setOpenSearchInputs(true);
    setOpenResultDetails(false);
    props.handleDrawerOpen();
  };
  /*General Search Functions*/
  const [generalSearchInputsShown, setOpenSearchInputs] = useState(true);
  const [generalResultMenuShown, setOpenResultMenu] = useState(false);
  const [generalResultDetailsShown, setOpenResultDetails] = useState(false);

  const generalOpenResultMenu = (e) => {
    setOpenResultMenu(true);
    setOpenSearchInputs(false);
    setOpenResultDetails(false);
    //props.showResultCardsHelp();
  };
  const generalOpenSearchInputs = (e) => {
    setOpenResultMenu(false);
    setOpenSearchInputs(true);
    setOpenResultDetails(false);
  };
  const generalOpenResultdetails = (e) => {
    setOpenResultMenu(false);
    setOpenSearchInputs(false);
    setOpenResultDetails(true);
    props.showCardDetailsHelp();
  };

  const setFile = (e) => {
    const status = e.file.status;
    if (status !== "uploading") {
      console.log(e.file, e.fileList);
    }
    if (status === "done") {
      const formData = new FormData();
      formData.append(
        `file[${0}]`,
        e.fileList[e.fileList.length - 1].originFileObj
      );

      axios
        .post(window.ApiUrl + "uploadMultifiles", formData)
        .then((res) => {
          let fileExt = e.fileList[e.fileList.length - 1].name.split(".");
          fileExt = fileExt[fileExt.length - 1];

          //debugger;
          let params;
          let processingToolUrl;
          let fileType = "cad";
          let outputName = "output_value";

          if (fileExt == "kmz" || fileExt == "kml") {
            params = {
              KML_File_Name: res.data[0].data,
            };
            processingToolUrl = window.kmlToJSONGPUrl;
            outputName = "Output_JSON";
            fileType = "kmz";
          } else if (fileExt == "dwg") {
            params = {
              CAD_File_Name: res.data[0].data,
            };
            processingToolUrl = window.cadToJsonGPUrl;
            outputName = "output_value";
          }

          showLoading(true);

          executeGPTool(
            processingToolUrl,
            params,
            (result) => {
              showLoading(false);

              showGeneralDataTable({
                type: "importGisFile",
                data: result,
                map: props.map,
                uploadFileType: fileType,
                show: true,
              });
            },
            (error) => {
              showLoading(false);
              message.error(t("sidemenu:uploadFilesError"));
            },
            outputName
          );
        })
        .catch((err) => {
          message.error(t("sidemenu:uploadFilesError"));
        });
    }
  };

  return (
    <Drawer
      variant="permanent"
      open={props.open}
      anchor="right"
      className="SideMenu"
      id={
        window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "search" ||
        window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "generalSearch" ||
        window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "coordinateSearch"
          ? "SearchSidemenu"
          : ""
      }
>      {props.open &&
      (window.location.pathname === process.env.PUBLIC_URL ||
        window.location.pathname === `${process.env.PUBLIC_URL}/`) ? (
        <DrawerHeader className="drawerHeder">
          <p className="sideMenuTitle">{t("sidemenu:mainTitle")}</p>
          <p className="TitleEdition">{t("sidemenu:titleEdition")} <span className="editionNo">2.0</span></p>

        
          <Link to="/">
            <IconButton
              onClick={props.handleDrawerCloseButton}
              className="closeMenuIcon openSideMenuHelp"
              color="inherit"
              aria-label="open drawer"
              edge="start"
            >
              <FontAwesomeIcon
                icon={faChevronCircleRight}
                style={{
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Link>
        </DrawerHeader>
      ) : props.open && window.location.pathname !== "/" ? (
        <DrawerHeader
          className="backBtn"
          style={{
            marginBottom:
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "coordinateSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "generalSearch" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "search"
                ? "15px"
                : "",
          }}
        >
          <Link to="/" className="backBar">
            <BarChartIcon />
          </Link>
         {window.location.pathname.substring(
              window.location.pathname.lastIndexOf("/") + 1
            ) !== "metaDataSearch"? <h3
            className="mb-3"
            id={
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "search" ||
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "generalSearch"
                ? "h3SideSearch"
                : ""
            }
          >
            {window.location.pathname.substring(
              window.location.pathname.lastIndexOf("/") + 1
            ) !== "generalSearch" &&
            window.location.pathname.substring(
              window.location.pathname.lastIndexOf("/") + 1
            ) !== "search" ? (
              t(
                sideLinks.filter(
                  (x) =>
                    window.location.pathname.substring(
                      window.location.pathname.lastIndexOf("/") + 1
                    ) === x.to
                )[0]?.name
              )
            ) : (
              <div className="searchStepsWizard">
                {window.location.pathname.substring(
                  window.location.pathname.lastIndexOf("/") + 1
                ) === "generalSearch" ? (
                  <nav class="breadcrumbs">
                    <li
                      onClick={generalOpenSearchInputs}
                      className={
                        generalSearchInputsShown
                          ? "breadcrumbs__item breadcrumbs__itemActive first"
                          : "breadcrumbs__item first"
                      }
                    >
                      <p> {t("common:search")}</p>
                    </li>
                    {generalResultMenuShown || generalResultDetailsShown ? (
                      <li
                        onClick={generalOpenResultMenu}
                        className={
                          generalResultMenuShown
                            ? "breadcrumbs__item breadcrumbs__itemActive second"
                            : "breadcrumbs__item second"
                        }
                      >
                        <p> {t("common:menu")}</p>
                      </li>
                    ) : null}
                    {generalResultDetailsShown ? (
                      <li
                        onClick={generalOpenResultdetails}
                        className={
                          generalResultDetailsShown
                            ? "breadcrumbs__item breadcrumbs__itemActive third"
                            : "breadcrumbs__item third"
                        }
                      >
                        <p> {t("common:results")}</p>
                      </li>
                    ) : null}
                  </nav>
                ) : (
                  <nav class="breadcrumbs">
                    <li
                      onClick={props.outerOpenResultMenu}
                      className={
                        props.outerResultMenuShown
                          ? "breadcrumbs__item breadcrumbs__itemActive first"
                          : "breadcrumbs__item first"
                      }
                    >
                      <p> {t("common:menu")}</p>
                    </li>
                    {props.outerResultDetailsShown ? (
                      <li
                        onClick={props.outerOpenResultdetails}
                        className={
                          props.outerResultDetailsShown
                            ? "breadcrumbs__item breadcrumbs__itemActive second"
                            : "breadcrumbs__item second"
                        }
                      >
                        <p> {t("common:results")}</p>
                      </li>
                    )  :null}
                  </nav>
                )}
              </div>
            )}
          </h3>:          <p className="sideMenuTitle">{t("sidemenu:mainTitle")}</p>
}
          <Link
            to={
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf("/") + 1
              ) === "metaDataSearch"
                ? ""
                : "/"
            }
            className=""
          >
            <IconButton onClick={props.handleDrawerCloseButton}              className="closeMenuIcon"
>
              <FontAwesomeIcon
                icon={faChevronCircleRight}
                style={{
                  marginTop: "5px",
                  marginRight: "5px",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Link>
        </DrawerHeader>
      ) : null}

      <Divider />
      {window.location.pathname === "/" ||
      window.location.pathname ===`${process.env.PUBLIC_URL}/` ||
      window.location.pathname === process.env.PUBLIC_URL ||
      window.location.pathname.substring(
        window.location.pathname.lastIndexOf("/") + 1
      ) === "metaDataSearch" ? (
        <Fade right>
          <List>
            {sideLinks.map((text, index) => (
              <Tooltip
                title={props.open ? "" : t(text.name)}
                placement="left"
                key={index}
              >
                <div className="sideLinkDiv">
                  <Button
                    variant="contained"
                    component="label"
                    onClick={
                      text.to === "metaDataSearch"
                        ? openSearchTable
                        : text.to === "generalSearch"
                        ? generalOpenSearchInput
                        : props.handleDrawerOpen
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      width: "100%",
                      height: "100%",
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    {text.to === "import" ? <input type="file" hidden /> : null}
                    <Link to={"/" + text.to}>
                      <ListItem button key={text.id}>
                      <div style={{textAlign:"center"}}><img className={text.to==='marsed'?text.className:""}
                            src={text.icon}
                            alt="sidemenuIcon"
                            style={{ width: "20px" }}
                          /></div>
                       {props.open? <ListItemText primary={t(text.name)}  />:null}
                      </ListItem>
                    </Link>
                  </Button>
                </div>
              </Tooltip>
            ))}
            <Tooltip
              title={
                props.open ? "" : t("sidemenu:sideLinks.changeLangTooltip")
              }
              placement="left"
            >
              <div className="sideLinkDiv languageSideDiv">
                <Button
                  variant="contained"
                  component="label"
                  onClick={props.toggleCurrentLang}
                  style={{
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "100%",
                    padding: "0",
                    margin: "0",
                    cursor: "pointer",
                  }}
                >
                  <ListItem button >
                  <div style={{textAlign:"center"}}className='changeLanguageAREN'>
                  {i18n.language === "en" ? <img className="changeLangIcon"
                        src={ arabicIcon } 
                        alt="sidemenuIcon"
                        style={{ width: "40px",marginRight:'10px' }}
                      />:<p>EN</p>}
                    </div>

                    {props.open?<ListItemText primary={t("sidemenu:sideLinks.language")} />:null}
                  </ListItem>
                </Button>
              </div>
            </Tooltip>
            
            {props.open ? (
              <p className="sideMenuFooter pt-2">{t("sidemenu:sideMsg")}</p>
            ) : null}
          </List>
        </Fade>
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "coordinateSearch" ? (
        <CoordinatesSearch map={props.map} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "contact" ? (
        (window.open(`${window.hostURL}/home/ContactUs`),
        window.open("/", "_self"))
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "generalSearch" ? (
        <GeneralSearch
          mainData={props.mainData}
          languageState={props.languageState}
          map={props.map}
          outerSearchResult={props.outerSearchResult}
          setOuterSearchResult={props.setOuterSearchResult}
          generalOpenResultdetails={generalOpenResultdetails}
          generalOpenResultMenu={generalOpenResultMenu}
          generalOpenSearchInputs={generalOpenSearchInputs}
          generalResultMenuShown={generalResultMenuShown}
          generalResultDetailsShown={generalResultDetailsShown}
          generalSearchInputsShown={generalSearchInputsShown}
        />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "nearestService" ? (
        <NearestServiceSearch
          map={props.map}
          mainData={props.mainData}
          setOuterSearchResult={props.setOuterSearchResult}
          outerOpenResultdetails={props.outerOpenResultdetails}
          outerOpenResultMenu={props.outerOpenResultMenu}
          outerResultMenuShown={props.outerResultMenuShown}
          outerResultDetailsShown={props.outerResultDetailsShown}
        />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "measurement" ? (
        <MeasureTool map={props.map} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "geoRange" ? (
        <GeoRange />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "painting" ? (
        <Painting map={props.map} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "marsed" ? (
        <MarsedComponent map={props.map} mainData={props.mainData} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "print" ? (
        <PrintComponent map={props.map} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "kml" ? (
        <KmlGoogle map={props.map} mainData={props.mainData} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "bookmark" ? (
        <BookMark map={props.map} />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "search" ? (
        <OuterSearchMainPage
          mainData={props.mainData}
          map={props.map}
          outerSearchResult={props.outerSearchResult}
          outerOpenResultdetails={props.outerOpenResultdetails}
          outerOpenResultMenu={props.outerOpenResultMenu}
          outerResultMenuShown={props.outerResultMenuShown}
          outerResultDetailsShown={props.outerResultDetailsShown}
        />
      ) : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        ) === "import" ? (
        <div style={{ textAlign: "center" }}>
          <Upload
            name="fileUpload"
            multiple={true}
            onChange={setFile}
            accept=".kmz, .kml, .dwg"
            type="file"
            action={window.ApiUrl + "uploadMultifiles"}
          >
            <button
              className="SearchBtn mt-3 "
              size="large"
              htmlType="submit"
              block
            >
              {t("sidemenu:upload")} <UploadOutlined />
            </button>
          </Upload>
        </div>
      ) : null}
    </Drawer>
  );
}
