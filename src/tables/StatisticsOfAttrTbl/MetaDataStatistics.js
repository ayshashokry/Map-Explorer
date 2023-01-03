import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "antd";
import { Table } from "react-bootstrap";
import Sunburst from "sunburst-chart";
import generateRandomColor from "../../helper/utilsFunc";
import { useTranslation } from "react-i18next";
const MetaDataStatistics = (props) => {
  const handleOk = async () => {};
  const { t } = useTranslation("print");
  const [statColorsTable, setStatColorsTable] = useState([]);
  const [hoverData, setHoverData] = useState(null);
  const chartRef = React.useRef();
  useEffect(() => {
    let settedData = [];
    if (props.showMetaStat) {
      let colors = [
        "#6FE3E1ff",
        "#6ACCE2ff",
        "#FFBF00",
        "#65B4E2ff",
        "#506959",
        "#00FF2A",
        "#A77E02",
        "#EAFCF9",
        "#C53676ff",
        "#6CD3BCff",
        "#0AB6F8ff",
        "#309FDDff",
        "#5688C1ff",
        "#7C72A6ff",
        "#A15B8Aff",
        "#C7446Fff",
        "#ED2D53ff",
        "#DA3B3Aff",
        "#C75649ff",
        "#B37157ff",
        "#A08C66ff",
        "#79C283ff",
        "#65DD91ff"
      ];
      settedData = props.showMetaStat.landUseValues.domain.codedValues.map(
        (c, index) => {
          console.log(c.name);
          return {
            id: c.code,
            report: c.name,
            color:c?.name.includes("سكن")? "#D9D93B":
            c?.name.includes("تجار")? "#D31F1F":
              index < colors.length ? colors[index] : generateRandomColor(),
          };
        }
      );
      let mainLUseDictionary = {};
      props.showMetaStat.data.forEach((feat, index) => {
        if (
          !Object.keys(mainLUseDictionary).includes(feat["PARCEL_MAIN_LUSE"])
        ) {
          let colorMain = settedData.find(
            (d) => d.id === feat["PARCEL_MAIN_LUSE_Code"]
          )
            ? settedData.find((d) => d.id === feat["PARCEL_MAIN_LUSE_Code"])
                .color
            : "black";
          mainLUseDictionary[feat["PARCEL_MAIN_LUSE"]] = {
            area: parseFloat((feat["AREA"] / 1000000).toFixed(2)),
            count: feat["COUNTDISTINCT"],
            color: colorMain,
            // code:feat['PARCEL_MAIN_LUSE_Code'],
            name: feat["PARCEL_MAIN_LUSE"]
              ? feat["PARCEL_MAIN_LUSE"]
              : "غير متوفر",
            children: [
              {
                area: parseFloat((feat["AREA"] / 1000000).toFixed(2)),
                size: feat["COUNTDISTINCT"],
                code: feat["PARCEL_SUB_LUSE_Code"],
                name: feat["PARCEL_SUB_LUSE"]
                  ? feat["PARCEL_SUB_LUSE"]
                  : "غير متوفر",
                color:
                  colors[parseInt(Math.random()*colors.length)] ,
              },
            ],
          };
        } else {
          mainLUseDictionary[feat["PARCEL_MAIN_LUSE"]] = {
            ...mainLUseDictionary[feat["PARCEL_MAIN_LUSE"]],
            area:
            parseFloat((parseFloat(
                mainLUseDictionary[feat["PARCEL_MAIN_LUSE"]]["area"].toFixed(2)
              ) + parseFloat((feat["AREA"] / 1000000).toFixed(2))).toFixed(2)),
            count:
              mainLUseDictionary[feat["PARCEL_MAIN_LUSE"]]["count"] +
              feat["COUNTDISTINCT"],
          };
          let mainChilds =
            mainLUseDictionary[feat["PARCEL_MAIN_LUSE"]].children;
          let subLUseInMain = mainChilds.find(
            (c) => c.name === feat["PARCEL_SUB_LUSE"]
          );
          if (!subLUseInMain) {
            mainChilds.push({
              area: parseFloat((feat["AREA"] / 1000000).toFixed(2)),
              size: feat["COUNTDISTINCT"],
              code: feat["PARCEL_SUB_LUSE_Code"],
              name: feat["PARCEL_SUB_LUSE"]
                ? feat["PARCEL_SUB_LUSE"]
                : "غير متوفر",
              color: colors[parseInt(Math.random()*colors.length)] ,
            });
          } else {
            subLUseInMain = {
              ...subLUseInMain,
              area:
              parseFloat((parseFloat(subLUseInMain["area"].toFixed(2)) +
                parseFloat((feat["AREA"] / 1000000).toFixed(2))).toFixed(2)),
              size: subLUseInMain["size"] + feat["COUNTDISTINCT"],
            };
          }
        }
      });
      let data = {
        name: "الإجمالي",
        color: "#65DD91",
        children:
          // put here array of childs each child will be represent as pie chart
          // mainLUseData.map() at first item then sub main arrany in the
          //second item
          Object.values(mainLUseDictionary).map((item) => item),
      };

      console.log(data);
      // set el height and width etc.
      Sunburst()
        .data(data)
        .label("name")
        .size("size")
        .color("color")
        .showLabels(false)
        .width("400")
        .radiusScaleExponent(0.8)
        .onHover((e) => {
          console.log(e);
          if (e) {
            if (e.name === "الإجمالي") {
              setHoverData({
                landUse: null,
                count: props.showMetaStat.totalCount,
                area: props.showMetaStat.totalArea,
              });
            } else
              setHoverData({
                landUse: e.name,
                count: e.count ? e.count : e.size,
                area: e.area,
              });
          }
        })
        .tooltipContent((d, node) => `<i>${node.value}</i>`)(chartRef.current);
      // setChartData(data)

      setStatColorsTable(settedData);
    } else {
      if (hoverData) setHoverData(null);
      if (statColorsTable.length) setStatColorsTable([]);
    }
    return () => {
      setHoverData(null);
      setStatColorsTable([]);
      props.openMetaStat(false);
    };
  }, [props.showMetaStat]);
  return (
    <Modal
      className="metaStatModal"
      visible={props.showMetaStat ? true : false}
      onOk={handleOk}
      onCancel={props.openMetaStat}
      width={"50%"}
    >
      <h5 className="statTitle mb-5">إحصائيات إستعمالات الأراضي</h5>
      <Row align="top">
        <Col md={{ span: 24 }} lg={{ span: 8 }}>
          <Table className="table  metastatTable">
            <thead>
            <th>{t("statement")}</th>

<th> {t('drawKey')} </th>
            </thead>

            <tbody>
              {statColorsTable.map((s, index) => (
                <tr>
                  <td>{s.report}</td>
                  <td>
                    <p
                      className="colorBall"
                      style={{ background: s.color }}
                    ></p>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={{ span: 24 }} lg={{ span: 8 }}>
          <div className="sunburst-chart" ref={chartRef}></div>
        </Col>{" "}
        <Col lg={{ span: 2 }}></Col>
        <Col md={{ span: 24 }} lg={{ span: 6 }}>
          {hoverData ? (
            <Table className="table metastatTable2">
              {hoverData.landUse ? (
                <tr>
            <th> {t('useDesc')}</th>
                  <td>{hoverData.landUse}</td>
                </tr>
              ) : null}
              <tr>
                <th>           {t('landsNumber')}
</th>
                <td>{hoverData.count}</td>
              </tr>
              <tr>
              <th>
           
           {t('spaceM2')}
           </th>                <td>{hoverData.area} {t('km2')}</td>
              </tr>
              <tr>
                <th>{t('ratio')}</th>
                <td>
                  {parseFloat(
                    (
                      (hoverData.count / props.showMetaStat.totalCount) *
                      100
                    ).toFixed(2)
                  )}{" "}
                  %{" "}
                </td>
              </tr>
            </Table>
          ) : null}
        </Col>
      </Row>
      <div className="metaStatBtns">
        {" "}
        <button
          onClick={props.openMetaStat}
          className="SearchBtn mt-3 w-25"
          size="large"
          htmlType="submit"
        >
      {t('close')}
        </button>
        <button
          onClick={props.exportPDFStatistics}
          className="SearchBtn mt-3 w-25"
          size="large"
        >
          PDF  {t('ExtractFile')}
        </button>
      </div>
    </Modal>
  );
};

export default MetaDataStatistics;
