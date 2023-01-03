import React from "react";
import { Table } from "react-bootstrap";

export default function ImportFileTable(props) {
  return (
    <div className={props.importTableDisplay}>
      {props.importTableDisplay === "importTableHidden" ? (
        <i
          onClick={props.openImportTable}
          className="fas fa-arrow-up tableArrow importTableArrow"
        ></i>
      ) : (
        <i
          onClick={props.closeImportTable}
          className="fas fa-arrow-down tableArrow importTableArrow"
        ></i>
      )}
      <Table striped responsive></Table>
    </div>
  );
}
