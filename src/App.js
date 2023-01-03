import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useNavigate } from "react-router-dom";
import { Routes } from "react-router";
import MainPage from "./screens/MainPage";
import * as intl from "@arcgis/core/intl";
import axios from "axios";
import Media from "react-media";
import { useTranslation } from "react-i18next";
import interceptor from "./interceptors";

import MarsedStatisticsPrint from "./tables/MarsedStatisticsPrint";
import AttrTblStatisticsPrint from "./tables/StatisticsOfAttrTbl/AttrTblStatisticsPrint";
import DashboardPage from "./screens/dashboard/DashboardPage";
import ArchivePage from "./screens/archive/ArchivePage";

import ExportPdf from "./tables/ExportsFeatures/ExportPdf";
import MobileAppScreen from "./screens/MobileAppScreen";
import ServerErrPage from "./screens/ErrorsPages/ServerErrPage";
import UnauthPage from "./screens/ErrorsPages/UnauthPage";
import NotFoundPage404 from "./screens/ErrorsPages/404";

import Loader from "./containers/Loader";
import { loginLayersSetting, TempobjectLayer } from "./helper/layers";
import { notificationMessage } from "./helper/utilsFunc";
interceptor();

//
export default function App() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [languageState, setChangeLang] = useState("ar");
  const toggleCurrentLang = () => {
    const styleLink = document.getElementById("cssStyleLink");
    if (languageState == "ar") {
      setChangeLang("en");
      i18n.changeLanguage("en");
      localStorage.setItem("lang", "en");
      styleLink.href = process.env.PUBLIC_URL + "/css/english.css";
      intl.setLocale("en");
      //window.location.reload();
    } else {
      setChangeLang("ar");
      i18n.changeLanguage("ar");
      localStorage.setItem("lang", "ar");
      styleLink.href = process.env.PUBLIC_URL + "/css/App.css";
      intl.setLocale("ar");
      //window.location.reload();
    }
  };
  useEffect(() => {
    let lang = localStorage.getItem("lang");
    setChangeLang(lang);
    const styleLink = document.getElementById("cssStyleLink");

    if (lang === "en") {
      styleLink.href = process.env.PUBLIC_URL + "/css/english.css";
      i18n.changeLanguage("en");
      intl.setLocale("en");
      setChangeLang("en");
      localStorage.setItem("lang", "en");
      // window.location.reload();
    } else {
      setChangeLang("ar");
      styleLink.href = process.env.PUBLIC_URL + "/css/App.css";
      localStorage.setItem("lang", "ar");
      i18n.changeLanguage("ar");
      intl.setLocale("ar");
      // window.location.reload();
    }
  }, [i18n.language]);

  const [loading, setLoading] = useState(true);
  const [mainData, setMainData] = useState({});
  useEffect(() => {
    //check login user
    try {
      checkAuth((data) => {
        setMainData(data);
        setLoading(false);
        if (!data.logged) navigate("/");
      });
    } catch (error) {
      setLoading(false);
      notificationMessage("حدث خطأ أثناء استرجاع البيانات");
      navigate("/serverErr");
    }
  }, []);
  const checkAuth = async (callBackFunc) => {
    let isUserInLocalStorage = localStorage.getItem("user");
    if (isUserInLocalStorage) {
      isUserInLocalStorage = JSON.parse(isUserInLocalStorage);
      if (isUserInLocalStorage?.groups?.length) {
        //app_id = 5 for mapExpolerer
        //module_id == 53 of employee-users, 52 of public-users
        let empData = isUserInLocalStorage?.groups
          ?.filter(
            (gp) =>
              gp.groups_permissions.filter((gper) => gper.app_id === 5).length
          )
          ?.filter((gp) => gp.layers);
        //layers==> the layers must be displayed for logged users
        let layers = [];
        empData?.forEach((layGr) => {
          //check on layer if exist check if dep exist
          layGr.layers.forEach((l) => {
            let isExistLayer = layers.find((ll) => ll.name === l.name);
            if (isExistLayer) {
              l.dependencies.forEach((dep) => {
                let existDepsNames = isExistLayer.dependencies.map(
                  (depExist) => depExist.name
                );
                if (existDepsNames.includes(dep.name)) return;
                else isExistLayer.dependencies.push(dep);
              });
            } else {
              layers.push(l);
            }
          });
        });
        let layersWithReqData = fillLayersWithReqData(layers);
        /**
         * mainFunction includes the sidebar icons that will be displayed to logged user  
         * module_id =47 -> المرصد
          module_id=49 -> استيراد الملفات   //this one became for public user
          module_id=50 -> تصدير جوجل
          module_id = 48 -> البحث بالبيانات الوصفية
         */
        let mainFunctions = isUserInLocalStorage?.groups?.filter((g) => {
          if (
            g.groups_permissions.filter((gp) =>
              [47, 50, 48, 49].includes(gp.module_id)
            ).length
          )
            return g;
        });
        callBackFunc({
          layers: layersWithReqData,
          mainFunctions,
          logged: true,
          user: isUserInLocalStorage,
        });
      }
    } else {
      //logout
      try {
        let res = await axios(window.webApiUrl + "public-privilege");
        let data = res.data;
        let layers = data?.layers || [];
        let layersWithReqData = fillLayersWithReqData(layers);

        callBackFunc({
          layers: layersWithReqData,
          logged: false,
          user: null,
        });
      } catch (error) {
        throw new Error(error);
        // setLoading(false);
        // notificationMessage("حدث خطأ أثناء استرجاع البيانات");
        //todo: redirect to Error 404 page or contact with server page
      }
    }
  };
  const fillLayersWithReqData = (layers) => {
    let layersWithReqData = {};
    let layerNames = layers.map((l) => l.name);
    let predefinedLayersSettings = { ...loginLayersSetting };
    layers?.forEach((lay) => {
      if (Object.keys(predefinedLayersSettings).includes(lay.name)) {
        let reqOutFields = [],
          reqAliasOutFields = [];
        lay.englishName = lay.name;
        // console.log(lay.englishName);
        lay.arabicName =
          predefinedLayersSettings[lay.name].name ||
          lay.arname ||
          lay.englishName;
        let preparedOutFields =
          predefinedLayersSettings[lay.name].outFields || [];
        let preparedAliasOutFields =
          predefinedLayersSettings[lay.name].aliasOutFields || [];
        let fetchedOutFields = lay.outfields.map((f) => {
          let outF = f.name;
          if (typeof outF === "string") outF = outF.trim();
          return outF;
        });
        preparedOutFields.forEach((f, index) => {
          if (fetchedOutFields.includes(f)) {
            reqOutFields.push(f);
            if (f !== "OBJECTID")
              reqAliasOutFields.push(preparedAliasOutFields[index - 1]);
          }
        });

        lay = {
          ...lay,
          ...predefinedLayersSettings[lay.name],
          outFields: reqOutFields.length
            ? reqOutFields
            : [...lay.outfields].map((f) => f.name.trim()),
          aliasOutFields: reqAliasOutFields,
        };
        delete lay.outfields;
        let haveDependencies =
          lay?.dependecies?.filter((dep) => {
            if (lay?.dependencies?.map((d) => d.name).includes(dep.depName))
              return dep;
          }) || [];
        lay.dependecies = haveDependencies;
        //copy dep data to lay
        haveDependencies?.forEach((dep) => {
          if (layerNames.includes(dep.name)) return;
          else {
            if (layersWithReqData[dep.name]) return;
            else
              layersWithReqData[dep.name] = predefinedLayersSettings[dep.name];
          }
        });
      } else {
        let reqOutFields = [],
          reqAliasOutFields = [];
        lay.englishName = lay.name;
        lay.arabicName = lay.arname || lay.englishName; //make it arName when arName is stored in db
        let preparedOutFields = lay.outfields?.map((f) => {
          let outF = f.name;
          if (typeof outF === "string") outF = outF.trim();
          return outF;
        });
        let preparedAliasOutFields = lay.outfields
          ?.filter((f) => f.name.trim() !== "OBJECTID")
          .map((f) => {
            let outF = f.arname;
            if (typeof outF === "string") outF = outF.trim();
            else if (!outF) outF = f.name.trim();
            return outF;
          });

        let fetchedOutFields = lay.outfields.map((f) => {
          let outF = f.name;
          if (typeof outF === "string") outF = outF.trim();
          return outF;
        });
        preparedOutFields.forEach((f, index) => {
          if (fetchedOutFields.includes(f)) {
            reqOutFields.push(f);
            if (f !== "OBJECTID")
              reqAliasOutFields.push(preparedAliasOutFields[index - 1]);
          }
        });
        lay = {
          ...lay,
          outFields: reqOutFields,
          aliasOutFields: reqAliasOutFields,
          ...TempobjectLayer,
        };
        lay.searchFields.push({
          field: reqOutFields[0],
          alias: reqAliasOutFields[0] ? reqAliasOutFields[0] : reqOutFields[0],
          isSearch: true,
        });
        delete lay.outfields;
      }
      layersWithReqData[lay.englishName] = lay;
    });
    return layersWithReqData;
  };

  if (loading) return <Loader />;
  else
    return (
      <div className="App">
        <Media query="(max-width: 768px)">
          {(matches) =>
            matches ? (
              <MobileAppScreen />
            ) : (
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <MainPage
                      mainData={mainData}
                      languageState={languageState}
                      setMainData={setMainData}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/Archive"
                  element={
                    <ArchivePage toggleCurrentLang={toggleCurrentLang} />
                  }
                />
                <Route
                  exact
                  path="/coordinateSearch"
                  element={
                    <MainPage
                      mainData={mainData}
                      languageState={languageState}
                      setMainData={setMainData}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/generalSearch"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/nearestService"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/contact"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/measurement"
                  element={
                    <MainPage
                      mainData={mainData}
                      languageState={languageState}
                      setMainData={setMainData}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/geoRange"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/painting"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/print"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/kml"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/bookmark"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/marsed"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/import"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/metaDataSearch"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/search"
                  element={
                    <MainPage
                      mainData={mainData}
                      setMainData={setMainData}
                      languageState={languageState}
                      toggleCurrentLang={toggleCurrentLang}
                    />
                  }
                />
                <Route
                  exact
                  path="/ExportPdf"
                  element={
                    <ExportPdf
                      languageState={languageState}
                      mainData={mainData}
                    />
                  }
                />
                <Route
                  exact
                  path="/PrintPdfAttrTbl"
                  element={
                    <AttrTblStatisticsPrint
                      languageState={languageState}
                      mainData={mainData}
                    />
                  }
                />
                <Route
                  exact
                  path="/MarsedStatisticsPrint"
                  element={<MarsedStatisticsPrint />}
                />{" "}
                <Route
                  exact
                  path="/dashboard"
                  element={<DashboardPage mainData={mainData} />}
                />
                <Route exact path="/serverErr" element={<ServerErrPage />} />
                <Route exact path="/unauthPage" element={<UnauthPage />} />
                <Route
                  exact
                  path="/404notfound"
                  element={<NotFoundPage404 />}
                />
              </Routes>
            )
          }
        </Media>
      </div>
    );
}
