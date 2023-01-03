import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-hijri";
import { toArabic } from "arabic-digits";
import Sunburst from "sunburst-chart";
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import logoPrint from "../logo.png";
import { getFromEsriRequest, showLoading } from "../../helper/common_func";
import generateRandomColor, { notificationMessage} from "../../helper/utilsFunc";

import { getStatisticsForChart } from "../tableFunctions";
// import { layersSetting } from "../../helper/layers";
import LoadingComponent from '../../screens/LoadingComponent'
import { useTranslation } from "react-i18next";

export default function AttrTblStatisticsPrint(props) {
  const {t,i18n}=useTranslation('print')
  const navigate = useNavigate();
  const chartRef = useRef();
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableDate] = useState([]);
  const [statColorsTable, setStatColorsTable] = useState([]);

  useEffect(() => {
    let colors = [
      "#6be031", "#0a8eb9", "#2a0cd1", "#2a6334", "#ff5b5b", "#e07131", '#e0c931', '#ff5bad'
      , '#a7ff5b'
    ];
    let localStorageData = localStorage.getItem("attrTblChart");
    if (localStorageData) {
      try{
        showLoading(true);
        //fetch layer data to get fields
        getTblData(colors, localStorageData).then(()=>{
          showLoading(false);
        })

      }catch(err){
        console.log(err);
        showLoading(false);
        notificationMessage("حدث خطأ أثناء جلب البيانات ")
        navigate("/")

      }

    } else {
     
      //show notification error and redirect to home
      notificationMessage("حدث خطأ أثناء جلب البيانات ")
      navigate("/")
    }
  }, []);

  const getTblData = async (colors, localStorageData) => {
    let layersSetting = props.mainData.layers;
    let mapInfo = await getFromEsriRequest(window.mapUrl + '/layers?f=pjson');
    let landUseLayer = mapInfo.layers.find(l => l.name === "Landbase_Parcel");
    let landUseFieldDomain = landUseLayer.fields.find(f => f.name === "PARCEL_MAIN_LUSE");
    let layerID = landUseLayer.id;
    let settedData = landUseFieldDomain.domain.codedValues.map((c, index) => {
      return {
        id: c.code,
        report: c.name,
        color: index < colors.length ? colors[index] : generateRandomColor()
      }
    });

    let whereClause = localStorageData.split(';')[0];
    let layerData = {
                layerMetadata:layersSetting['Landbase_Parcel']
              };
      
    let { data } = await getStatisticsForChart(layerID, layerData, whereClause);
    data = data.filter(f=>f.attributes["AREA"]).map(f => f.attributes)
    let mainLUseDictionary = {};
    let subLandUseDict = {};
    data.forEach(feat => {
      if (!Object.keys(mainLUseDictionary).includes(feat['PARCEL_MAIN_LUSE'])) {
        let colorMain = settedData.find(d => d.id === feat['PARCEL_MAIN_LUSE_Code']) ?
          settedData.find(d => d.id === feat['PARCEL_MAIN_LUSE_Code']).color : 'black';
        mainLUseDictionary[feat['PARCEL_MAIN_LUSE']] = {
          area: parseFloat((feat['AREA'] / 1000000).toFixed(2)),
          count: feat['COUNTDISTINCT'],
          color: colorMain,
          // code:feat['PARCEL_MAIN_LUSE_Code'],
          name: feat['PARCEL_MAIN_LUSE'] ? feat['PARCEL_MAIN_LUSE'] : "غير متوفر",
          children: [{
            area: parseFloat((feat['AREA'] / 1000000).toFixed(2)),
            size: feat['COUNTDISTINCT'],
            code: feat['PARCEL_SUB_LUSE_Code'],
            name: feat['PARCEL_SUB_LUSE'] ? feat['PARCEL_SUB_LUSE'] : "غير متوفر",
            color: generateRandomColor()
          }]
        }
      } else {
        mainLUseDictionary[feat['PARCEL_MAIN_LUSE']] = {
          ...mainLUseDictionary[feat['PARCEL_MAIN_LUSE']],
          area: parseFloat((mainLUseDictionary[feat['PARCEL_MAIN_LUSE']]['area']).toFixed(2)) + parseFloat((feat['AREA'] / 1000000).toFixed(2)),
          count: mainLUseDictionary[feat['PARCEL_MAIN_LUSE']]['count'] + feat['COUNTDISTINCT']
        }
        let mainChilds = mainLUseDictionary[feat['PARCEL_MAIN_LUSE']].children;
        let subLUseInMain = mainChilds.find(c => c.name === feat['PARCEL_SUB_LUSE']);
        if (!subLUseInMain) {
          mainChilds.push({
            area: parseFloat((feat['AREA'] / 1000000).toFixed(2)),
            size: feat['COUNTDISTINCT'],
            code: feat['PARCEL_SUB_LUSE_Code'],
            name: feat['PARCEL_SUB_LUSE'] ? feat['PARCEL_SUB_LUSE'] : "غير متوفر",
            color: generateRandomColor()
          })
        } else {
          subLUseInMain = {
            ...subLUseInMain,
            area: parseFloat((subLUseInMain['area']).toFixed(2)) + parseFloat((feat['AREA'] / 1000000).toFixed(2)),
            size: subLUseInMain['size'] + feat['COUNTDISTINCT']
          }
        }

      }
      if (!Object.keys(subLandUseDict).includes(feat['PARCEL_SUB_LUSE'])) {
        subLandUseDict[feat['PARCEL_SUB_LUSE']] = {
          landUse: feat['PARCEL_SUB_LUSE'],
          count: feat['COUNTDISTINCT'],
          area: parseFloat((feat['AREA']).toFixed(2))
        }
      } else {
        subLandUseDict[feat['PARCEL_SUB_LUSE']] = {
          ...subLandUseDict[feat['PARCEL_SUB_LUSE']],
          count: subLandUseDict[feat['PARCEL_SUB_LUSE']].count + feat['COUNTDISTINCT'],
          area: parseFloat((subLandUseDict[feat['PARCEL_SUB_LUSE']].area).toFixed(2)) + parseFloat((feat['AREA']).toFixed(2))
        }
      }
    })

    let finalData = {
      "name": "الإجمالي",
      color: generateRandomColor(),
      "children": Object.values(mainLUseDictionary).map(item => item)
    }
    setChartData(finalData);
    // set el height and width etc.
    Sunburst()
      .data(finalData)
      .label("name")
      .size("size")
      .color("color")
      .showLabels(false)
      .width("500")
      .tooltipContent((d, node) => `<i>${node.value}</i>`)(chartRef.current);
    setTableDate(Object.values(subLandUseDict));
    setStatColorsTable(settedData)

  }

  return (
    <div className="exportPdfPage">
      <LoadingComponent />

      <button
         className="SearchBtn mt-3 w-25"
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
        {t('print')}
      </button>
        <div style={{borderBottom:'solid', marginBottom:'3em'}}>
      <ul className="exportPdful" >
        <li>
          <img alt="logo" src={logoPrint} />
        </li>
        <li className="exportPdfRightLi mt-4 mr-3">
        <h6>{t("sudiArabia")}</h6>
          <h6>{t("eastern")}</h6>{" "}
        </li>
        <li className="mt-4">
          <h6 style={{ fontSize: "18px", marginBottom: "7px" }}>
          {t("geoGate")}{" "}
          </h6>

          <h6> {t("firstEdition")} </h6>
        </li>
      </ul>
      <p style={{ paddingLeft: "30px" }}>

        {i18n.language=='en'?moment().format("iD/iM/iYYYY"):toArabic(moment().format("iYYYY/iM/iD"))}

      </p>
      </div>
      <div style={{ direction: "rtl", textAlign:'center' }}>
        {statColorsTable && (
          <div>
            <Table className="table table-bordered">
              <thead>
                <th>{t("statement")}</th>

                <th> {t('drawKey')} </th>
              </thead>

              <tbody>
                {statColorsTable.map((s, index) => (
                  <tr key={index}>
                    <td>{s.report}</td>
                    <td>
                      <p
                        className="colorBall"
                        style={{ background: s.color,
                          width: '20px',
                          height: '20px',
                          padding: '10px',
                          borderRadius: '50%',
                          margin: 'auto' }}
                      ></p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <div className="m-4">

          <h2 className="text-center">
{t('landStat')}</h2>
        </div>
        {chartData && (
          <div ref={chartRef}>
          </div>
        )}
        { tableData.length?
          <Table className="table table-bordered">
          <thead>
            <th> {t('useDesc')}</th>
            <th>
           {t('landsNumber')}
            </th>
            <th>
           
            {t('spaceM2')}
            </th>
          </thead>

          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.landUse}</td>
                <td>{item.count}</td>
                <td>{item.area.toLocaleString('en-US')}</td>
                
              </tr>
            ))}
          </tbody>
        </Table>:null
        }
      </div>
    </div>
  );
}
