import { Col, Row } from "antd";
import React, { useState } from "react";
import NavBar from "../../containers/NavBar";
import FilesTable from "./FilesTable";
import SearchHeader from "./SearchHeader";
import SideTree from "./SideTree";
import { toArabic } from "arabic-digits";

export default function ArchivePage() {
  const [selectedNode, setSelectNode] = useState("");
  const onSelectNode = (keys, info) => {
    console.log(keys);
    setSelectNode(keys[0]);
  };
  return (
    <div className="archivePage">
      <NavBar />
      <SearchHeader />

      <Row className="archiveData">
        <Col span={6}>
          <SideTree onSelectNode={onSelectNode} />
        </Col>
        <Col span={18}>
          <FilesTable selectedNode={selectedNode} />
        </Col>
      </Row>
      <footer className="archiveFooter">
        <h6>
          جميع الحقوق محفوظة - لأمانة المنطقة الشرقية
          {toArabic(new Date().getFullYear())}
        </h6>
      </footer>
    </div>
  );
}
