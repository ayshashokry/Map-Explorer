import React, { useState, useEffect } from "react";
import { Modal, Row, Divider } from "antd";

import {
  getLayerId,
  convertHirjiDateToTimeSpan,
} from "../../../helper/common_func";
import { convertNumbersToEnglish, getUniqeID } from "../../../helper/utilsFunc";
import FilterForm from "./filterModalForm";
import { useTranslation } from "react-i18next";
const FilteRModal = (props) => {
  const { t } = useTranslation("common");
  const prevDepend = React.useRef();
  const [filterGroups, setFilterGroups] = useState({
    current: [
      {
        rows: [
          {
            operator: undefined,
            field: undefined,
            value: undefined,
            id: getUniqeID(),
          },
        ],
        logicalOperator: undefined,
        id: getUniqeID(),
        formRef: null,
      },
    ],
    dep: [
      {
        rows: [
          {
            operator: undefined,
            field: undefined,
            value: undefined,
            id: getUniqeID(),
          },
        ],
        logicalOperator: undefined,
        id: getUniqeID(),
        formRef: null,
      },
    ],
  });
  const [isNotFiltering, setIsNotFiltering] = useState({
    current: true,
    dep: true,
  });
  useEffect(() => {
    //reset filter form in case of clicking on reset
    //@{isDependFiltered} refers to dependency data is filtered
    let isDependFiltered =
      props.isDepend &&
      props.filterWhereClauseRef.current.dep.filtered &&
      props.filterWhereClauseRef.current.dep.filtered !==
        props.filterWhereClauseRef.current.dep.default;

    //@{isCurrentLayerFiltered} refers to data of selected layer is filtered
    let isCurrentLayerFiltered =
      !props.isDepend && props.filterWhereClauseRef.current.current !== "1=1";

    let isDependNotFiltered = !isDependFiltered;

    let isCurrentLayerNotFiltered = !isCurrentLayerFiltered;
    //in case of dependent data
    if (props.isDepend) {
      if (isDependFiltered) {
        setIsNotFiltering({
          ...isNotFiltering,
          dep: false,
        });
      } else if (isDependNotFiltered && isNotFiltering.dep) {
        return;
      } else {
        setFilterGroups({
          ...filterGroups,
          dep: [
            {
              rows: [
                {
                  operator: undefined,
                  field: undefined,
                  value: undefined,
                  id: getUniqeID(),
                },
              ],
              logicalOperator: undefined,
              id: getUniqeID(),
              formRef: null,
            },
          ],
        });
        setIsNotFiltering({
          ...isNotFiltering,
          dep: true,
        });
      }
    }
    //in case of layer data not dependent
    else {
      if (isCurrentLayerFiltered) {
        setIsNotFiltering({
          ...isNotFiltering,
          current: false,
        });
      } else if (isCurrentLayerNotFiltered && isNotFiltering.current) {
        return;
      } else {
        setFilterGroups({
          ...filterGroups,
          current: [
            {
              rows: [
                {
                  operator: undefined,
                  field: undefined,
                  value: undefined,
                  id: getUniqeID(),
                },
              ],
              logicalOperator: undefined,
              id: getUniqeID(),
              formRef: null,
            },
          ],
        });
        setIsNotFiltering({ ...isNotFiltering, current: true });
      }
    }

    // if(props.filterWhereClauseRef.current==='1=1'
    // &&
    // !props.filterWhereClauseRef.filtered
    // &&
    // !props.filterWhereClauseRef.depdefault){

    // }
  }, [props?.filterWhereClauseRef?.current]);

  useEffect(() => {
    if (props.isDepend) {
      let currentDepend = props.isDepend;
      let isTherePrevDep = prevDepend.current;
      if (
        (isTherePrevDep &&
          currentDepend.layerName !== isTherePrevDep.layerName) ||
        (isTherePrevDep && !currentDepend.layerName)
      ) {
        setFilterGroups({
          ...filterGroups,
          dep: [
            {
              rows: [
                {
                  operator: undefined,
                  field: undefined,
                  value: undefined,
                  id: getUniqeID(),
                },
              ],
              logicalOperator: undefined,
              id: getUniqeID(),
              formRef: null,
            },
          ],
        });
      }
      prevDepend.current = props.isDepend;
    }
  }, [props.isDepend]);

  const handleOk = async () => {
    let errPromises = [],
      formsErrors = [];

    (props.isDepend ? filterGroups.dep : filterGroups.current).forEach((gr) => {
      gr.formRef.current.validateFields();
      errPromises.push(isFormErrors(gr.formRef));
    });
    formsErrors = await Promise.all(errPromises);
    if (formsErrors.some((err) => err)) return;
    else {
      let whereClause = (
        props.isDepend ? filterGroups.dep : filterGroups.current
      ).map((gr) => {
        return {
          rowsWhereClause: [],
        };
      });
      (props.isDepend ? filterGroups.dep : filterGroups.current).forEach(
        (gr, index) => {
          if (!index) {
            gr.rows.forEach((r) => {
              if (r.operator === "like")
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator} '%${r.value}%'`
                );
              else if (["is not null", "is null"].includes(r.operator)) {
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator}`
                );
              } else if (r.field?.dataType === "esriFieldTypeString") {
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator} '${r.value}'`
                );
              } else if (["esriFieldTypeDate"].includes(r.field?.dataType)) {
                if (r.operator === "=") {
                  whereClause[index].rowsWhereClause.push(
                    `(${r.field.name} >${
                      r.operator
                    } ${convertHirjiDateToTimeSpan(r.value)})`
                  );
                  whereClause[index].rowsWhereClause.push(
                    `(${r.field.name} <${
                      r.operator
                    } ${convertHirjiDateToTimeSpan(r.value, true)})`
                  );
                } else
                  whereClause[index].rowsWhereClause.push(
                    `${r.field.name} ${r.operator} ${convertHirjiDateToTimeSpan(
                      r.value
                    )}`
                  );
              } else
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator} ${convertNumbersToEnglish(r.value)}`
                );
            });
            whereClause[index].rowsWhereClause =
              "(" + whereClause[index].rowsWhereClause.join(" and ") + ")";
          } else {
            gr.rows.forEach((r, i) => {
              if (r.operator === "like")
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator} '%${r.value}%'`
                );
              else if (r.field?.dataType === "esriFieldTypeString") {
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator} '${r.value}'`
                );
              } else if (["esriFieldTypeDate"].includes(r.field?.dataType)) {
                if (r.operator === "=") {
                  whereClause[index].rowsWhereClause.push(
                    `(${r.field.name} >${
                      r.operator
                    } ${convertHirjiDateToTimeSpan(r.value)})`
                  );
                  whereClause[index].rowsWhereClause.push(
                    `(${r.field.name} <${
                      r.operator
                    } ${convertHirjiDateToTimeSpan(r.value, true)})`
                  );
                } else
                  whereClause[index].rowsWhereClause.push(
                    `${r.field.name} ${r.operator} ${convertHirjiDateToTimeSpan(
                      r.value
                    )}`
                  );
              }
              else if (["is not null", "is null"].includes(r.operator)) {
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator}`
                );
              }
              else
                whereClause[index].rowsWhereClause.push(
                  `${r.field.name} ${r.operator} ${convertNumbersToEnglish(r.value)}`
                );
            });

            whereClause[index].rowsWhereClause =
              gr.logicalOperator +
              " (" +
              whereClause[index].rowsWhereClause.join(" and ") +
              ")";
          }
        }
      );
      whereClause = whereClause.map((wh) => wh.rowsWhereClause).join(" ");
      if (
        (!props.isDepend &&
          whereClause !== props.filterWhereClauseRef.current.current) ||
        (props.isDepend &&
          whereClause !== props.filterWhereClauseRef.current.dep.filtered)
      ) {
        let layerID = getLayerId(props.map.__mapInfo, props.reqLayer.layerName);
        props.getLayerDataForTable({
          layerID,
          layerData: props.reqLayer,
          isNewTbl: true,
          callBackFunc: props.openFilterModal,
          where: props.isDepend
            ? whereClause +
              `AND (${props.filterWhereClauseRef.current.dep.default})`
            : whereClause,
          colsIsNeeded: false,
          isDependData: props.isDepend ? props.reqLayer : false,
        });
        //reset filter and sorting
        let tblColsEdited = [...props.fields];
        tblColsEdited.forEach((col) => {
          if (col.key === "zoom") return;
          col.filtered = false;
          col.sortOrder = false;
          col.filteredValue = null;
        });
        props.setTblColumns(tblColsEdited);
        props.filterWhereClauseRef.current = props.isDepend
          ? {
              ...props.filterWhereClauseRef.current,
              dep: {
                ...props.filterWhereClauseRef.current.dep,
                filtered: whereClause,
              },
            }
          : {
              ...props.filterWhereClauseRef.current,
              current: whereClause,
            };
        props.setColFilterWhere({
          current: [],
          dep: [],
        });
      } else props.openFilterModal();
    }
  };
  const addFilterGroup = () => {
    console.log("add new filter group");
    props.isDepend
      ? setFilterGroups({
          ...filterGroups,
          dep: [
            ...filterGroups.dep,
            {
              rows: [
                {
                  operator: undefined,
                  field: undefined,
                  value: undefined,
                  id: getUniqeID(),
                },
              ],
              logicalOperator: "OR",
              id: getUniqeID(),
            },
          ],
        })
      : setFilterGroups({
          ...filterGroups,
          current: [
            ...filterGroups.current,
            {
              rows: [
                {
                  operator: undefined,
                  field: undefined,
                  value: undefined,
                  id: getUniqeID(),
                },
              ],
              logicalOperator: "OR",
              id: getUniqeID(),
            },
          ],
        });
  };

  const removeFilterGroup = (filterGrID) => {
    console.log("remove filter group");
    let filterGroupsClone = props.isDepend
      ? [...filterGroups.dep]
      : [...filterGroups.current];
    if (filterGroupsClone.length) {
      let filterGrIndex = filterGroupsClone.findIndex(
        (gr) => gr.id === filterGrID
      );
      filterGroupsClone.splice(filterGrIndex, 1);
      props.isDepend
        ? setFilterGroups({ ...filterGroups, dep: filterGroupsClone })
        : setFilterGroups({ ...filterGroups, current: filterGroupsClone });
    }
  };

  const addNewFilterRow = (filterGrID) => {
    let filterGroupsClone = props.isDepend
      ? [...filterGroups.dep]
      : [...filterGroups.current];
    let filterGr = filterGroupsClone.find((gr) => gr.id === filterGrID);
    let filterGrClone = { ...filterGr };
    filterGrClone.rows.push({
      operator: undefined,
      field: undefined,
      value: undefined,
      id: getUniqeID(),
    });
    props.isDepend
      ? setFilterGroups({ ...filterGroups, dep: filterGroupsClone })
      : setFilterGroups({ ...filterGroups, current: filterGroupsClone });
  };

  const removeFilterRow = (filterGrID, rowId) => {
    console.log("remove filter row");
    let filterGroupsClone = props.isDepend
      ? [...filterGroups.dep]
      : [...filterGroups.current];
    let filterGr = filterGroupsClone.find((gr) => gr.id === filterGrID);
    if (filterGr?.rows.length) {
      let rowIndex = filterGr.rows.findIndex((r) => r.id === rowId);
      filterGr.rows.splice(rowIndex, 1);
      props.isDepend
        ? setFilterGroups({ ...filterGroups, dep: filterGroupsClone })
        : setFilterGroups({ ...filterGroups, current: filterGroupsClone });
    }
  };
  const isFormErrors = async (form) => {
    try {
      let res = await form.current.validateFields();
      return false;
    } catch (err) {
      return true;
    }
  };
  return (
    <>
      <Modal
        className="filterModal"
        title={t("filter")}
        visible={props.showFilterModal}
        onOk={handleOk}
        onCancel={props.openFilterModal}
        okText={t("confirm")}
        cancelText={t("close")}
        width={"60%"}
      >
        <Row justify="center">
          <button
            onClick={addFilterGroup}
            className="SearchBtn mt-3 w-25"
            size="large"
            htmlType="submit"
          >
            {t("addFilterGroup")}
          </button>
        </Row>
        <Divider orientation="left"></Divider>

        {(props.isDepend ? filterGroups.dep : filterGroups.current).map(
          (gr, index) => (
            <React.Fragment key={index}>
              <FilterForm
                filterGr={gr}
                filterGroups={filterGroups}
                grID={gr.id}
                isDepend={props.isDepend}
                setFilterGroups={setFilterGroups}
                addFilterGroup={addFilterGroup}
                addNewFilterRow={addNewFilterRow}
                removeFilterGroup={removeFilterGroup}
                removeFilterRow={removeFilterRow}
                moreOne={index ? true : false}
                fields={props.fields}
                map={props.map}
                reqLayer={props.reqLayer}
              />
              {/* {index?<Divider orientation="left"></Divider>:null} */}
            </React.Fragment>
          )
        )}
      </Modal>
    </>
  );
};

export default FilteRModal;
