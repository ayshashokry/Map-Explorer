import React, { useEffect, useRef, useState } from "react";
import { DownCircleFilled } from "@ant-design/icons";
import { Button, Col, Select, Form, Row, Radio, Divider, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faTrash,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OPERATIONS } from "../../../helper/constants";
import {
  queryTask,
  getLayerId,
  getFeatureDomainName,
} from "../../../helper/common_func";

import { notificationMessage } from "../../../helper/utilsFunc";
import HijriDatePicker from "../../../components/hijriDatePicker/components/HijriDatePicker";
import { getSubtypes } from "../../tableFunctions";
import { useTranslation } from "react-i18next";
function FilterForm({
  grID,
  filterGr,
  setFilterGroups,
  addNewFilterRow,
  removeFilterGroup,
  removeFilterRow,
  moreOne,
  fields,
  map,
  reqLayer,
  filterGroups,
  isDepend,
}) {
  const formRef = useRef(null);
  const [fieldDistictValues, setFieldDistictValues] = useState({});
  const {t} = useTranslation("common","map");
  const [logicalOperators] = useState([
    {
      alias: " أو ",
      value: "OR",
    },
    {
      alias: " و ",
      value: "AND",
    },
  ]);
  useEffect(() => {
    let filterGrClone = isDepend
      ? [...filterGroups.dep]
      : [...filterGroups.current];
    let reqGroup = filterGrClone.find((gr) => gr.id === grID);
    if (formRef && !reqGroup.formRef) {
      reqGroup.formRef = formRef;
      setFilterGroups(
        isDepend
          ? { ...filterGroups, dep: filterGrClone }
          : { ...filterGroups, current: filterGrClone }
      );
    }
  }, [formRef, filterGroups, isDepend]);
  const handleSelect = (selectedValue, op, type, id) => {
    let filterGrClone = isDepend
      ? [...filterGroups.dep]
      : [...filterGroups.current];

    let reqGroup = filterGrClone.find((gr) => gr.id === grID);
    let reqRow = reqGroup.rows.find((r) => r.id === id);
    // let isParcelSubLUse = reqLayer.layerName==='Landbase_Parcel'&&selectedValue==='PARCEL_SUB_LUSE';

    switch (type) {
      case "value":
        reqRow.value = selectedValue;
        setFilterGroups(
          isDepend
            ? { ...filterGroups, dep: filterGrClone }
            : { ...filterGroups, current: filterGrClone }
        );
        break;

      case "field":
        //todo: replace hit a request to get distictvalues with using layers data in map object
        let hasSubType = getSubtypes(selectedValue, map, reqLayer.layerName);

        if (hasSubType) {
          // let parcelLayer = map.__mapInfo.info.$layers.layers.find(l=>l.name==='Landbase_Parcel');
          // let subTypes = parcelLayer.subtypes;
          let mainLUses = hasSubType.subTypeData;
          // subTypes.map(domain=>{
          //     return {
          //         "PARCEL_MAIN_LUSE":domain.name,
          //         "PARCEL_MAIN_LUSE_Code":domain.code
          //     }
          // })
          setFieldDistictValues({
            ...fieldDistictValues,
            [hasSubType.subtypeFieldName + "_ForSub"]: mainLUses,
          });
          reqRow.value = "";
          reqRow.operator = "";
          reqRow.field = {
            name: selectedValue,
            withDomain: true,
            dataType: op.type,
            subTypeField: hasSubType.subtypeFieldName,
          };
          formRef.current.resetFields([
            `${hasSubType.subtypeFieldName}_ForSub${id}`,
            `value${id}`,
            `operator${id}`,
          ]);
          setFilterGroups(
            isDepend
              ? { ...filterGroups, dep: filterGrClone }
              : { ...filterGroups, current: filterGrClone }
          );
          return;
        }
        //if input text or date === or ==== already selected before don't hit to get domain values
        else if (
          !op.withDomain ||
          Object.keys(fieldDistictValues).includes(selectedValue)
        ) {
          reqRow.value = "";
          reqRow.operator = "";
          reqRow.field = {
            name: selectedValue,
            withDomain: op.withDomain,
            dataType: op.type,
          };
          formRef.current.resetFields([`value${id}`, `operator${id}`]);
          setFilterGroups(
            isDepend
              ? { ...filterGroups, dep: filterGrClone }
              : { ...filterGroups, current: filterGrClone }
          );
          return;
        }
        //in case of Landbase_Parcel layer and field PARCEL_SUB_LUSE
        //it must get PARCEL_MAIN_LUSE first to select
        else {
          //else hit to get domain values
          let layerID = getLayerId(map.__mapInfo, reqLayer.layerName);
          let queryParams = {
            url: window.mapUrl + "/" + layerID,
            notShowLoading: false,
            returnGeometry: true,
            where: "1=1",
            returnDistinctValues: true,
            outFields: selectedValue,
          };
          queryTask({
            ...queryParams,
            callbackResult: ({ features }) => {
              getFeatureDomainName(features, layerID, false).then((feats) => {
                let newDistictValues = feats.map((feat) => feat.attributes);
                setFieldDistictValues({
                  ...fieldDistictValues,
                  [selectedValue]: newDistictValues,
                });
                reqRow.value = "";
                reqRow.operator = "";
                reqRow.field = {
                  name: selectedValue,
                  withDomain: op.withDomain,
                  dataType: op.type,
                };
                formRef.current.resetFields([`value${id}`, `operator${id}`]);
                setFilterGroups(
                  isDepend
                    ? { ...filterGroups, dep: filterGrClone }
                    : { ...filterGroups, current: filterGrClone }
                );
              });
            },
            callbackError: (err) => {
              console.log(err);
              notificationMessage("حدث خطأ");
            },
          });
        }
        break;
      case "subType":
        let isHavingSubtype = getSubtypes(
          reqRow.field.name,
          map,
          reqLayer.layerName
        );
        // let parcelLayer = map.__mapInfo.info.$layers.layers.find(l=>l.name==='Landbase_Parcel');
        // let subTypes = parcelLayer.subtypes;
        let mainLandUse = isHavingSubtype.subTypeData.find(
          (sub) =>
            sub[isHavingSubtype.subtypeFieldName + "_Code"] === selectedValue
        );
        let subMainDomains = mainLandUse.domains.map((domain) => {
          return {
            [reqRow.field.name]: domain.name,
            [reqRow.field.name + "_Code"]: domain.code,
          };
        });
        setFieldDistictValues({
          ...fieldDistictValues,
          [reqRow.field.name + selectedValue]: subMainDomains,
        });
        reqRow.value = "";
        reqRow.field = {
          ...reqRow.field,
          subTypeFieldCode: selectedValue,
        };
        formRef.current.resetFields([`value${id}`]);
        setFilterGroups(
          isDepend
            ? { ...filterGroups, dep: filterGrClone }
            : { ...filterGroups, current: filterGrClone }
        );
        break;
      default:
        //operator
        reqRow.operator = selectedValue;
        if (["is not null", "is null"].includes(reqRow.operator)) {
          reqRow.value = null;
        }
        setFilterGroups(
          isDepend
            ? { ...filterGroups, dep: filterGrClone }
            : { ...filterGroups, current: filterGrClone }
        );

        break;
    }
  };
  const onChangeLogicalOp = (e) => {
    let value = e.target.value;
    let filterGrClone = isDepend
      ? [...filterGroups.dep]
      : [...filterGroups.current];
    let reqGroup = filterGrClone.find((gr) => gr.id === grID);
    if (reqGroup.logicalOperator === value) return;
    else {
      reqGroup.logicalOperator = value;
      setFilterGroups(
        isDepend
          ? { ...filterGroups, dep: filterGrClone }
          : { ...filterGroups, current: filterGrClone }
      );
    }
  };
  const handleChange = (e, id, type) => {
    if (type === "text") {
      let value = e.target.value;
      let filterGrClone = isDepend
        ? [...filterGroups.dep]
        : [...filterGroups.current];
      let reqGroup = filterGrClone.find((gr) => gr.id === grID);
      let reqRow = reqGroup.rows.find((r) => r.id === id);
      reqRow.value = value;
      setFilterGroups(
        isDepend
          ? { ...filterGroups, dep: filterGrClone }
          : { ...filterGroups, current: filterGrClone }
      );
    } else if (type === "date") {
      let value = e;
      let filterGrClone = isDepend
        ? [...filterGroups.dep]
        : [...filterGroups.current];
      let reqGroup = filterGrClone.find((gr) => gr.id === grID);
      let reqRow = reqGroup.rows.find((r) => r.id === id);
      reqGroup.formRef.current.setFieldsValue({ ["value" + id]: value });
      reqRow.value = value;
      setFilterGroups(
        isDepend
          ? { ...filterGroups, dep: filterGrClone }
          : { ...filterGroups, current: filterGrClone }
      );
    }
  };

  return (
    <div>
      {moreOne ? <Divider orientation="center"></Divider> : null}

      <Row
        style={{
          width: "100%",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button title={t("common:addNewRow")} onClick={() => addNewFilterRow(grID)}>
            <FontAwesomeIcon icon={faPlusCircle} />
          </Button>
          {moreOne && (
            <Button
              title={t("common:removeGroup")}
              onClick={() => removeFilterGroup(grID)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
        {moreOne && (
          <>
            <Radio.Group
              onChange={onChangeLogicalOp}
              value={filterGr.logicalOperator}
            >
              {logicalOperators.map((lo, i) => (
                <Radio key={i} value={lo.value}>
                  {lo.alias}
                </Radio>
              ))}
            </Radio.Group>
          </>
        )}
      </Row>
      {/* <Row justify={'space-between'} > */}
      <Form ref={formRef} layout={"inline"} size={"large"}>
        {filterGr?.rows?.map((row, index) => {
          return (
            <Row
              justify={"space-between"}
              style={{ width: "100%" }}
              key={index}
            >
              <Col span={7}>
                <Form.Item
                  // noStyle={true}
                  rules={[
                    {
                      message:t("common:selectMenuField"),
                      required: true,
                    },
                  ]}
                  name={"field" + row.id}
                  hasFeedback
                >
                  <Select
                    virtual={false}
                    suffixIcon={<DownCircleFilled />}
                    showSearch
                    name={"field" + row.id}
                    allowClear
                    value={row.field}
                    className="dont-show"
                    placeholder={t("common:field")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp="value"
                    onSelect={(e, op) => handleSelect(e, op, "field", row.id)}
                    filterOption={(input, option) => {
                      return (
                        option.name &&
                        option.name.toString().indexOf(input) >= 0
                      );
                    }}
                  >
                    {" "}
                    {fields
                      .filter((f) => f.title && f.key)
                      .map((f, index) => {
                        return (
                          <Select.Option
                            key={index}
                            name={f.title}
                            value={f.key}
                            type={f.dataType}
                            withDomain={f.withDomain}
                          >
                            {f.title}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  // noStyle={true}

                  rules={[
                    {
                      message: t("common:chooseParam"),
                      required: true,
                    },
                  ]}
                  name={"operator" + row.id}
                  hasFeedback
                >
                  <Select
                    virtual={false}
                    suffixIcon={<DownCircleFilled />}
                    // showSearch
                    allowClear
                    className="dont-show"
                    onSelect={(e, op) =>
                      handleSelect(e, op, "operator", row.id)
                    }
                    value={row.operator}
                    name={"operator" + row.id}
                    placeholder={t("common:param")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp="value"
                    filterOption={(input, option) => {
                      return option.value && option.value.indexOf(input) >= 0;
                    }}
                  >
                    {row?.field?.dataType && row?.field?.withDomain
                      ? OPERATIONS.filter(
                          (op) =>
                            op.key.includes(row?.field?.dataType) &&
                            op.forDomain
                        ).map((op, index) => (
                          <Select.Option
                            key={index}
                            value={op.operation}
                            isDomain={op.forDomain}
                          >
                            {t(`map:attrTblFilter.${op.name}`)}
                          </Select.Option>
                        ))
                      : row?.field?.dataType && !row?.field?.withDomain
                      ? OPERATIONS.filter((op) =>
                          op.key.includes(row?.field?.dataType)
                        ).map((op, index) => (
                          <Select.Option
                            key={index}
                            value={op.operation}
                            isDomain={op.forDomain}
                          >
                            {t(`map:attrTblFilter.${op.name}`)}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </Col>

              {row?.field?.subTypeField ? (
                <>
                  <Col span={4}>
                    {row?.operator &&
                      !["is null", "is not null"].includes(row?.operator) && (
                        <Form.Item
                          // noStyle={true}

                          rules={[
                            {
                              message: t("common:enterMainAct"),
                              required: true,
                            },
                          ]}
                          name={row.field?.subTypeField + "_ForSub" + row.id}
                          hasFeedback
                        >
                          {
                            <Select
                              virtual={false}
                              suffixIcon={<DownCircleFilled />}
                              showSearch
                              // allowClear
                              name={
                                row.field?.subTypeField + "_ForSub" + row.id
                              }
                              className="dont-show"
                              value={row.value}
                              onSelect={(e, op) =>
                                handleSelect(e, op, "subType", row.id)
                              }
                              placeholder={t("common:value")}
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              optionFilterProp="value"
                              filterOption={(input, option) => {
                                return (
                                  option.name && option.name.indexOf(input) >= 0
                                );
                              }}
                            >
                              {fieldDistictValues[
                                row.field?.subTypeField + "_ForSub"
                              ]
                                ?.sort((a, b) =>
                                  a[row.field.name].localeCompare(
                                    b[row.field.name],
                                    "ar"
                                  )
                                )
                                ?.map((field, index) => {
                                  return (
                                    <Select.Option
                                      name={field[row.field.subTypeField]}
                                      key={index}
                                      value={
                                        field[row.field.subTypeField + "_Code"]
                                      }
                                      id="1"
                                    >
                                      {field[row.field.subTypeField]}
                                    </Select.Option>
                                  );
                                })}
                            </Select>
                          }
                        </Form.Item>
                      )}
                  </Col>

                  <Col span={4}>
                    {row?.operator &&
                      !["is null", "is not null"].includes(row?.operator) && (
                        <Form.Item
                          // noStyle={true}

                          rules={[
                            {
                              message: t("common:enterSubAct"),
                              required: true,
                            },
                          ]}
                          name={"value" + row.id}
                          hasFeedback
                        >
                          {row.field?.withDomain ? (
                            <Select
                              virtual={false}
                              suffixIcon={<DownCircleFilled />}
                              showSearch
                              // allowClear
                              name={"value" + row.id}
                              className="dont-show"
                              value={row.value}
                              onSelect={(e, op) =>
                                handleSelect(e, op, "value", row.id)
                              }
                              placeholder={t("common:value")}
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              optionFilterProp="value"
                              filterOption={(input, option) => {
                                return (
                                  option.name && option.name.indexOf(input) >= 0
                                );
                              }}
                            >
                              {fieldDistictValues[
                                row.field?.name + row.field?.subTypeFieldCode
                              ]
                                ?.filter(
                                  (f) =>
                                    f[row.field.name] &&
                                    f[row.field.name + "_Code"]
                                )
                                .sort((a, b) =>
                                  a[row.field.name].localeCompare(
                                    b[row.field.name],
                                    "ar"
                                  )
                                )
                                .map((field, index) => {
                                  return (
                                    <Select.Option
                                      name={field[row.field?.name]}
                                      key={index}
                                      value={field[row.field?.name + "_Code"]}
                                      id="1"
                                    >
                                      {field[row.field?.name]}
                                    </Select.Option>
                                  );
                                })}
                            </Select>
                          ) : row.field?.dataType === "esriFieldTypeDate" ? (
                            <HijriDatePicker
                              disableOnClickOutside
                              placeholder={t("common:selectDate")}
                              name={"value" + row.id}
                              input={{
                                // id:"value" + row.id,
                                value: row["value"],
                                onChange: (e) =>
                                  handleChange(e, row.id, "date"),
                              }}
                            />
                          ) : (
                            <Input
                              placeholder={t("common:value")}
                              onChange={(e) => handleChange(e, row.id, "text")}
                              name={"value" + row.id}
                              className="dont-show"
                              value={row.value}
                            />
                          )}
                        </Form.Item>
                      )}
                  </Col>
                </>
              ) : (
                <Col span={8}>
                  {row?.operator &&
                    !["is null", "is not null"].includes(row?.operator) && (
                      <Form.Item
                        // noStyle={true}

                        rules={[
                          {
                            message: t("common:enterValue"),
                            required: true,
                          },
                        ]}
                        name={"value" + row.id}
                        hasFeedback
                      >
                        {row.field?.withDomain ? (
                          <Select
                            virtual={false}
                            suffixIcon={<DownCircleFilled />}
                            showSearch
                            // allowClear
                            name={"value" + row.id}
                            className="dont-show"
                            value={row.value}
                            onSelect={(e, op) =>
                              handleSelect(e, op, "value", row.id)
                            }
                            placeholder={t("common:value")}
                            getPopupContainer={(trigger) => trigger.parentNode}
                            optionFilterProp="value"
                            filterOption={(input, option) => {
                              return (
                                option.name && option.name.indexOf(input) >= 0
                              );
                            }}
                          >
                            {fieldDistictValues[row.field?.name]
                              ?.filter(
                                (f) =>
                                  f[row.field.name] &&
                                  f[row.field.name + "_Code"]
                              )
                              .sort((a, b) =>
                                a[row.field.name].localeCompare(
                                  b[row.field.name],
                                  "ar"
                                )
                              )
                              .map((field, index) => {
                                return (
                                  <Select.Option
                                    name={field[row.field?.name]}
                                    key={index}
                                    value={field[row.field?.name + "_Code"]}
                                    id="1"
                                  >
                                    {field[row.field?.name]}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        ) : row.field?.dataType === "esriFieldTypeDate" ? (
                          <HijriDatePicker
                            disableOnClickOutside
                            placeholder={t("common:selectDate")}
                            name={"value" + row.id}
                            input={{
                              // id:"value" + row.id,
                              value: row["value"],
                              onChange: (e) => handleChange(e, row.id, "date"),
                            }}
                          />
                        ) : (
                          <Input
                            placeholder={t("common:value")}
                            onChange={(e) => handleChange(e, row.id, "text")}
                            name={"value" + row.id}
                            className="dont-show"
                            value={row.value}
                          />
                        )}
                      </Form.Item>
                    )}
                </Col>
              )}

              <Col span={2}>
                {index ? (
                  <Button
                    title={t("common:removeRow")}
                    onClick={() => removeFilterRow(grID, row.id)}
                  >
                    <FontAwesomeIcon icon={faMinusCircle} />
                  </Button>
                ) : null}
              </Col>
            </Row>
          );
        })}
      </Form>
      {/* </Row> */}
    </div>
  );
}

export default FilterForm;
