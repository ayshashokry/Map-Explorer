import React from "react";
import ReactExport from "react-export-excel";
import { useTranslation } from "react-i18next";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExportCSV({ dataSet, columns, labels, layerName }) {
  const [t] = useTranslation("common");

  return (
    <ExcelFile
      filename={layerName + "CSV"}
      element={
        <span>
          {/* <Tooltip placement="topLeft" title={` استخراج ملف CSV `}> */}
         
          {t("extractExcelFile")}
          {/* </Tooltip> */}
        </span>
      }
    >
      <ExcelSheet data={dataSet} name="AttributeTable">
        {labels.map((head, index) => (
          <ExcelColumn
            label={head}
            value={(col) => {
              return col[columns[index]] ? col[columns[index]] : t("without");
            }}
          />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
}

export default ExportCSV;
