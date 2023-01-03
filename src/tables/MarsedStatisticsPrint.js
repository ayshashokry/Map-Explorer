import React, { useEffect, useState } from "react";
import moment from "moment-hijri";
import { toArabic } from "arabic-digits";
import logoPrint from "./logo.png";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import DefaultPieChart from "../components/charts/DefaultPieChart";
import DefaultBarChart from "../components/charts/DefaultBarChart";
import MarsadTable from "../components/marsadTable";
import { useTranslation } from "react-i18next";
export default function MarsedStatisticsPrint() {
  const { t,i18n } = useTranslation("print");
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableDate] = useState(null);

  useEffect(() => {
    let data = JSON.parse(localStorage["marsedChart"]);
    setChartData(data.chart);
    setTableDate(data);
  }, []);

  const getDataForGov = (gov) => {
    let data = JSON.parse(JSON.stringify(tableData.data));
    Object.values(data).map(
      (item) =>
        (item.govs = [
          ...item.govs.filter((x) => x.attributes.GOV_NAME.indexOf(gov) > -1),
        ])
    );
    return data;
  };

  return (
    <div className="exportPdfPage">
      <button
        className="SearchBtn mt-3 w-25 printBtnDisplay"
        size="large"
        htmlType="submit"
        onClick={() => {
          window.print();
        }}
      >
        <FontAwesomeIcon
          icon={faPrint}
          className="mx-2"
          style={{ fontSize: "15px" }}
        />
        {t("print")}
      </button>

      <ul className="exportPdful">
        <li>
          <img alt="logo" src={logoPrint} />
        </li>
        <li className="exportPdfRightLi mt-4 mr-3">
          <h6>{t("sudiArabia")}</h6>

          <h6>{t("eastern")}</h6>
        </li>
        <li className="mt-4">
          <h6 style={{ fontSize: "18px", marginBottom: "7px" }}>
{t('geoGate')}          </h6>

          <h6> {t('firstEdition')} </h6>
        </li>
      </ul>
      <p style={{ paddingLeft: "30px" }}className='marsadPrintDate'>
        {i18n.language=='en'?moment().format("iD/iM/iYYYY"):toArabic(moment().format("iYYYY/iM/iD"))}
      </p>
      <div style={{ direction: "rtl" }}>
        {tableData && (
          <div>
            <MarsadTable data={tableData.data} />
          </div>
        )}

        {chartData && (
          <div>
            {chartData.map((feature) => {
              return (
                <div>
                  <div className="centerPrintChart">
                    <label>{feature.attributes.GOVERNORAT}</label>
                    {feature.chartType == "Pie Chart" ? (
                      <DefaultPieChart
                        width={200}
                        height={200}
                        outerRadius={100}
                        data={feature}
                      />
                    ) : (
                      <DefaultBarChart
                        data={feature}
                        barSize={50}
                        width={200}
                        height={200}
                      />
                    )}
                  </div>
                  {tableData && (
                    <div>
                      <MarsadTable
                        data={getDataForGov(feature.attributes.GOVERNORAT)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
