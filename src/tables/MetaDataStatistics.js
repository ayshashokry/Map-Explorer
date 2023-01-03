import React, { useState } from "react";
import { Modal, Row, Col } from "antd";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const MetaDataStatistics = (props) => {
  const { t } = useTranslation("print");

  const handleOk = async () => {};
  const [statColorsTable] = useState([
    { id: 1, report: "سكني", color: "#0a8eb9" },
    { id: 2, report: "تجاري", color: "#0a8eb9" },
    { id: 3, report: "زراعة", color: "#0a8eb9" },
    { id: 4, report: "سكني", color: "#0a8eb9" },
    { id: 5, report: "سكني", color: "#0a8eb9" },
  ]);
  return (
    <Modal
      className="metaStatModal"
      visible={props.showMetaStat}
      onOk={handleOk}
      width={"50%"}
    >
      <h5 className="statTitle mb-5">{t("landStat")} </h5>
      <Row>
        <Col md={{ span: 24 }} lg={{ span: 8 }}>
          <Table className="table table-bordered">
            <thead>
              <th>{t("statement")}</th>

              <th>{t("drawKey")} </th>
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
          chart
        </Col>
        <Col md={{ span: 24 }} lg={{ span: 8 }}>
          <Table className="table table-bordered">
            <tr>
              <th>{t("useDesc")} </th>
              <td>سكني</td>
            </tr>
            <tr>
              <th>{t("landsNumber")} </th>
              <td>12</td>
            </tr>
            <tr>
              <th>{t("area")}</th>
              <td>12</td>
            </tr>
          </Table>
        </Col>
      </Row>
      {/* <Button onClick={props.showMetaStat}>إغلاق</Button> */}
    </Modal>
  );
};

export default MetaDataStatistics;
