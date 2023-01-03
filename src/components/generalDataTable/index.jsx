import { faPrint, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import React, { Component, useState } from "react";
import { showGeneralDataTable } from "../../helper/common_func";
import ImportGisTable from "../importGisTable";
import MarsadTable from "../marsadTable";import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function GeneralDataTable(props) {

    const [tableData, setData] = useState(props.data);
    const [searchTableDisplay, setSearchTableDisplay] = useState("dataTableHidden");

    const openSearchTable = () => {
        setSearchTableDisplay("searchTableShown");
    }

    const closeSearchTable = () => {
        setSearchTableDisplay("dataTableHidden");
    }
    const hideTable = () => {
        showGeneralDataTable({ show: false });
    }

    return (
        props.data ? <div
            className={searchTableDisplay + (props.data.type == "importGisFile" ? " generalDataTableMax" : " generalDataTableMin")}
            style={{ overflowX: 'auto' }}
            id="searchMeta"
        >
            <div style={{ padding: '2px 5px 10px 5px' }}className='generalDataTableHeadDiv'>
                
                <Button className="tableStatClose" onClick={hideTable} style={{padding:'5px'}}>  <FontAwesomeIcon
          icon={faTimes}
          className="mx-2"
          style={{ fontSize: "15px" }}
        /></Button>
                {props.data && props.data.type == "marsadTable" && <FontAwesomeIcon
          icon={faPrint}onClick={props.handlePrint}
          className="mx-2"
          style={{ fontSize: "20px" ,color:'#0a8eb9',cursor:'pointer'}}
        />}
                {searchTableDisplay === "dataTableHidden" ? (
                    <i
                        onClick={openSearchTable}
                        className="fas fa-arrow-up tableArrow searchTableArrow"
                    ></i>
                ) : (
                    <i
                        onClick={closeSearchTable}
                        className="fas fa-arrow-down tableArrow searchTableArrow"
                    ></i>
                )}
            </div>

            {props.data && props.data.type == "marsadTable" && <MarsadTable data={props.data.data} />}
            {props.data && props.data.type == "importGisFile" && <ImportGisTable searchTableDisplay={searchTableDisplay} data={props.data} />}
        </div> : null)
}
