import React from "react";
import { Menu, Dropdown, Space, Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

import {
  executeGPTool,
  showLoading,
  getLayerId,
} from "../../helper/common_func";
import { notificationMessage } from "../../helper/utilsFunc";
import ExportCSV from "./ExportCSV";
import { externalBtnsForTblData } from "../../helper/constants";
import { useTranslation } from "react-i18next";
function ExportFilesComp({
  layerData,
  dataSet,
  labels,
  columns,
  filterWhereClause,
  isDepend,
  map,
}) {
  const exportFile = (fileType) => {
    if (dataSet.length) {
      let whereClause = [
        {
          ["SDE." + layerData.layerName]: isDepend
            ? filterWhereClause.dep.filtered
              ? filterWhereClause.dep.filtered
              : filterWhereClause.dep.default
            : filterWhereClause.current,
        },
      ];
      let params = {
        Filters: whereClause,
        FileType: fileType,
      };
      showLoading(true);
      //notification with it is succeeded
      notificationMessage(t("fileUploading"), 5);
      executeGPTool(
        window.exportFeaturesGPUrl,
        params,
        callBackExportFile,
        callbackExportError,
        "output_value"
      );
    } else {
      //notify there is no data to export
    }
  };
  const { t } = useTranslation("print");

  function callBackExportFile(result) {
    if (result) {
      let anchor = document.createElement("a");
      anchor.href = window.filesURL + result;
      // anchor.download = layersNames[activeLink].layerName
      document.body.appendChild(anchor);
      anchor.click();
    }
    showLoading(false);
  }
  function callbackExportError(err) {
    console.log(err);
    //notification with something error happened
    notificationMessage(t("ErrorOccurd"), 5);
    showLoading(false);
  }
  const exportPDF = () => {
    let neededWhereClause = isDepend
      ? filterWhereClause.dep.filtered
        ? filterWhereClause.dep.filtered
        : filterWhereClause.dep.default
      : filterWhereClause.current;
    let layerID = getLayerId(map.__mapInfo, layerData.layerName);
    localStorage.setItem(
      "dataForExportPDF",
      layerID +
        ";" +
        neededWhereClause +
        ";" +
        layerData.layerMetadata.outFields
    );
    window.open(process.env.PUBLIC_URL + "/ExportPdf");
    // exportPDFRef.current.click();
  };

  const exportMenu = () => {
    let isLayer = map.__mapInfo.info.$layers.layers.find(
      (lay) => lay.name === layerData.layerName
    );

    return (
      <Menu className="exportMenu">
        <Menu.Item>
    
          <>
            {columns.length &&
              layerData.layerMetadata?.dependencies?.find(
                (d) => d.name === externalBtnsForTblData.exportXlAttrTbl
              ) && (
                <ExportCSV
                  columns={columns.filter(
                    (c) => !["PARCEL_SPATIAL_ID", "OBJECTID"].includes(c)
                  )}
                  dataSet={dataSet}
                  labels={labels}
                  layerName={layerData?.layerName}
                />
              )}
          </>
        </Menu.Item>
        <Menu.Item disabled={!isLayer}>
          {" "}
          {layerData.layerMetadata?.dependencies?.find(
            (d) => d.name === externalBtnsForTblData.exportKmlAttrTbl
          ) && (
            <span onClick={() => exportFile("KML")}>
              {" "}
              {t("ExtractFile")} KML
            </span>
          )}
        </Menu.Item>
        <Menu.Item disabled={!isLayer}>
          {" "}
          {layerData.layerMetadata?.dependencies?.find(
            (d) => d.name === externalBtnsForTblData.googleMapsAttrTbl
          ) && <span>{t("googleMapExtr")}</span>}
        </Menu.Item>

        <Menu.Item disabled={!isLayer}>
          {layerData.layerMetadata?.dependencies?.find(
            (d) => d.name === externalBtnsForTblData.exportCadAttrTbl
          ) && (
            <span onClick={() => exportFile("CAD")}>{t("ExtractFile")} CAD</span>
          )}
        </Menu.Item>
        <Menu.Item disabled={!isLayer}>
          {layerData.layerMetadata?.dependencies?.find(
            (d) => d.name === externalBtnsForTblData.exportShpAttrTbl
          ) && (
            <span onClick={() => exportFile("Shape")}>
              {t("ExtractFile")} Shape
            </span>
          )}
        </Menu.Item>
        <Menu.Item disabled={!isLayer}>
          {/* <Link to="/ExportPdf" ref={exportPDFRef} target="_blank">
          </Link>{" "} */}
          {layerData.layerMetadata?.dependencies?.find(
            (d) => d.name === externalBtnsForTblData.exportPdfAttrTbl
          ) && <span onClick={exportPDF}>{t("ExtractFile")} PDF</span>}
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <Dropdown overlay={exportMenu()}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Button className="tableHeaderBtn">
            <Tooltip placement="topLeft" title={t("export")}>
              <FontAwesomeIcon icon={faFileExport} />
            </Tooltip>
          </Button>
        </Space>
      </a>
    </Dropdown>
  );
}

export default ExportFilesComp;
