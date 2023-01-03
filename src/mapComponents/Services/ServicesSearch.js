import React, { useEffect, useState } from "react";
import { Select, Form } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Slide from "react-reveal/Slide";
import { DownCircleFilled } from "@ant-design/icons";

import {
  getFeatureDomainName,
  getLayerId,
  queryTask,
} from "../../helper/common_func";
// import { layersSetting } from "../../helper/layers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const inputs = {};
export default function ServicesSearch(props) {
  const { t } = useTranslation("common");

  const [municipality, setMunicipality] = useState(undefined);
  const [districtName, setDistrictName] = useState(undefined);

  const [municipalities, setMunicipalities] = useState([]);
  const [districts, setDistricts] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    setMunicipality(undefined);
    setDistrictName(undefined);

    let layerdId = getLayerId(props.map.__mapInfo, "Serivces_Data");

    queryTask({
      url: window.mapUrl + "/" + layerdId,
      where: props.activeService.where,
      outFields: ["MUNICIPALITY_NAME"],
      returnGeometry: false,
      returnDistinctValues: true,
      callbackResult: ({ features }) => {
        if (features.length) {
          getFeatureDomainName(features, layerdId).then((res) => {
            setMunicipalities(
              res
                .filter((f) => f.attributes["MUNICIPALITY_NAME"])
                .sort((a, b) =>
                  a.attributes["MUNICIPALITY_NAME"].localeCompare(
                    b.attributes["MUNICIPALITY_NAME"],
                    "ar"
                  )
                )
                .map((d) => {
                  return {
                    id: d.attributes["MUNICIPALITY_NAME_Code"],
                    name: d.attributes["MUNICIPALITY_NAME"],
                    code: d.attributes["MUNICIPALITY_NAME_Code"],
                  };
                })
            );
          });
        }
      },
      callbackError(error) {},
    });
  }, [props.activeService.where]);

  const getDistricts = (mun_code) => {
    let layerdId = getLayerId(props.map.__mapInfo, "Serivces_Data");

    queryTask({
      url: window.mapUrl + "/" + layerdId,
      where:
        props.activeService.where +
        " and MUNICIPALITY_NAME = '" +
        mun_code +
        "'",
      outFields: ["DISTRICT_NAME"],
      returnGeometry: false,
      returnDistinctValues: true,
      callbackResult: ({ features }) => {
        if (features.length) {
          getFeatureDomainName(features, layerdId).then((res) => {
            setDistricts(
              res.map((d) => {
                return {
                  id: d.attributes["DISTRICT_NAME_Code"],
                  name: d.attributes["DISTRICT_NAME"],
                  code: d.attributes["DISTRICT_NAME_Code"],
                };
              })
            );
          });
        }
      },
      callbackError(error) {},
    });
  };

  const getServicesData = () => {
    let layerdId = getLayerId(props.map.__mapInfo, "Serivces_Data");
    let layersSetting = props.mainData.layers;
    queryTask({
      url: window.mapUrl + "/" + layerdId,
      where:
        props.activeService.where +
        " and DISTRICT_NAME='" +
        inputs.data.DISTRICT_NAME +
        "'",
      outFields: layersSetting["Serivces_Data"].outFields,
      returnGeometry: false,
      callbackResult: ({ features }) => {
        if (features.length) {
          getFeatureDomainName(features, layerdId).then((res) => {
            let mappingRes = res.map((f) => {
              return {
                layerName: "Serivces_Data",
                id: f.attributes["OBJECTID"],
                ...f.attributes,
              };
            });

            props.setFilteredResult(mappingRes);

            if (mappingRes.length > 1) {
              props.outerOpenResultMenu();
            }

            navigate("/search");
          });
        }
      },
      callbackError(error) {},
    });
  };

  const handleSelect = (name) => (value, e) => {
    if (e !== undefined) {
      if (name === "municipality") {
        setDistrictName(undefined);
        setMunicipality(e.value);
        getDistricts(e.id);
      } else if (name === "districtName") {
        setDistrictName(e.value);
        inputs.data = { DISTRICT_NAME: e.id };
        getServicesData(e.id);
      }
    } else {
      return null;
    }
  };
  return (
    <div className="serviceSearch">
      <span
        style={{
          width: "100%",
          float: "left",
          textAlign: "left",
          marginLeft: "5px",
        }}
      >
        {" "}
        <FontAwesomeIcon
          icon={faTimes}
          style={{ marginTop: "5px", marginRight: "5px", cursor: "pointer" }}
          onClick={props.closeServiceSearch}
        />
      </span>
      <div>
       
        <label className="selectLabelStyle">{t("municipality")}</label>
        <Select
          virtual={false}
          suffixIcon={<DownCircleFilled />}
          showSearch
          allowClear
          className="dont-show"
          onChange={handleSelect("municipality")}
          value={municipality}
          placeholder={t("chooseMunicipality")}
          getPopupContainer={(trigger) => trigger.parentNode}
          optionFilterProp="value"
          filterOption={(input, option) =>
            option.value && option.value.indexOf(input) >= 0
          }
        >
          {municipalities.map((s, index) => (
            <Select.Option value={s.name} id={s.id}>
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <Slide left>
          {" "}
          <label className="selectLabelStyle">{t("district")}</label>
          <Select
            virtual={false}
            suffixIcon={<DownCircleFilled />}
            showSearch
            allowClear
            className="dont-show"
            onChange={handleSelect("districtName")}
            value={districtName}
            placeholder={t("districtName")}
            getPopupContainer={(trigger) => trigger.parentNode}
            onClear={() => setDistrictName(undefined)}
            optionFilterProp="value"
            filterOption={(input, option) =>
              option.value && option.value.indexOf(input) >= 0
            }
          >
            {districts.map((s, index) => (
              <Select.Option value={s.name} id={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Slide>
      </div>
    </div>
  );
}
