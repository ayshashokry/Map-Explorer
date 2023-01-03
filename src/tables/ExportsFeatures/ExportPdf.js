import React, { useEffect, useState, useRef } from "react";
import moment from "moment-hijri";
import { toArabic } from "arabic-digits";
import { Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { notificationMessage } from "../../helper/utilsFunc";
import {
  getFeatureDomainName,
  highlightFeature,
  queryTask,
} from "../../helper/common_func";

import MapComponent from "../../mapComponents/Map";
import Loader from "../../containers/Loader";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next";

export default function ExportPdf(props) {
  const { t,i18n } = useTranslation("print");
  const [tblColumns, setTblColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [map, setMap] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let reqData = localStorage.getItem("dataForExportPDF");
    if (reqData) {
      let layerID = reqData.split(";")[0];
      let where = reqData.split(";")[1];
      let outFields = reqData.split(";")[2];
      getLayerFeatures(layerID, where, outFields).then((data) => {
        settingTableData(data.tblColumns, data.tableData, false);
      });
    } else {
      notificationMessage(t("ErrorOccurd"));
    }
  }, []);
  const getLayerFeatures = async (layerID, where, outFields) => {
    let promise = new Promise((resolve, reject) => {
      let queryParams = {
        url: window.mapUrl + "/" + layerID,
        notShowLoading: false,
        returnGeometry: true,
        outFields: outFields,
        where,
      };
      queryTask({
        ...queryParams,
        callbackResult: ({ features, fields }) => {
          let reqFieldsWithoutObjectID = [],
            tblData = [],
            tblCols = [];

          reqFieldsWithoutObjectID = fields.filter((f, index) => index);
          tblCols = reqFieldsWithoutObjectID.map((f) => {
            return {
              title: f.alias,
              dataIndex: f.name.includes("_DATE") ? [f.name, "hijri"] : f.name,
              key: f.name,
              showSorterTooltip: false,
            };
          });

          if (features.length)
            tblData = getFeatureDomainName(features, layerID).then((feats) => {
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
        callbackError: (err) => reject(err),
      });
    });
    return promise;
  };
  const settingTableData = (tblColumns, tableData, isNewTbl) => {
    let totalDataToShow = [];
    //fill all empty values with لا يوجد
    let colData = [...tblColumns];
    let tblDataWithNotFoundValues = tableData?.map((row) => {
      colData.forEach((col) => {
        if (col.key.includes("_DATE")) {
          let hijriDate = row[col.key]
            ? {
                timeStamp: row[col.key],
                hijri: moment(row[col.key]).format("iYYYY/iM/iD"),
              }
            : {
                hijri: "لا يوجد",
                timeStamp: null,
              };
          //use convertEngNumbersToArabic method in utilsFunc to show it in arabic numbers
          row[col.key] = hijriDate;
        } else row[col.key] = row[col.key] ? row[col.key] : "لا يوجد";
      });
      return row;
    });

    totalDataToShow = [...tblDataWithNotFoundValues];
    setTableData(totalDataToShow);
    setTblColumns(colData);
  };
  const onMapLoaded = (map) => {
    setMap(map);
    // if(tableData.length&& isHighlighted)
    // highlightFeature(tableData, map, {
    //   layerName: "highlightGraphicLayer",
    //   isZoom: true,
    //   zoomDuration: 1000,
    // });
  };
  useEffect(() => {
    if (map && tableData.length) {
      highlightFeature(tableData, map, {
        layerName: "highlightGraphicLayer",
        isZoom: true,
        zoomDuration: 1000,
      });
      setIsLoading(false);
    }
  }, [tableData, map]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="exportPdfPage" ref={componentRef}>
      {isLoading && <Loader />}
      <button
        className="SearchBtn mt-3 w-25"
        size="large"
        htmlType="submit"
        onClick={handlePrint}
      >
        <FontAwesomeIcon
          icon={faPrint}
          className="mx-2"
          style={{ fontSize: "15px" }}
        />

        {t("print")}
      </button>
      {/* <div className="exportPdf"> */}
      <ul className="exportPdful">
        <li className="exportPdfRightLi">
          <h6>{t("sudiArabia")}</h6>
          <h6>{t("eastern")}</h6>{" "}
        </li>
        <li>
          <h6 style={{ fontSize: "18px", marginBottom: "7px" }}>
            {t("geoGate")}{" "}
          </h6>

          <h6> {t("firstEdition")} </h6>
        </li>
      </ul>
      <p style={{ paddingLeft: "30px" }}>
        {i18n.language=='en'?moment().format("iD/iM/iYYYY"):toArabic(moment().format("iYYYY/iM/iD"))}

      </p>
      {/** map */}
      <MapComponent mapload={onMapLoaded} mainData={props.mainData} />
      {/** table */}
      {tableData.length ? (
        <Table
          bordered
          columns={tblColumns}
          dataSource={tableData}
          pagination={false}
        ></Table>
      ) : (
        <div className="no-chosen-layer">
          <br />
          <h4>{t("noResults")}</h4>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
