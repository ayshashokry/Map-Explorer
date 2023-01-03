import React, { useState } from "react";
import { Select, Form, Input } from "antd";
import { Container } from "react-bootstrap";
import { SearchOutlined } from "@ant-design/icons";
import GeneralSearchResultMenu from "./generalSearchComponents/GeneralSearchResultMenu";
import GeneralResultDetails from "./generalSearchComponents/GeneralResultDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import { DownCircleFilled } from "@ant-design/icons";
// import { layersSetting } from "../helper/layers";
import FilterComponent from "./FilterComponent";

export default function GeneralSearch(props) {
  const [searchLayer, setSearchLayer] = useState(undefined);
  // const [searchLayers] = useState(Object.keys(layersSetting).map((key) => {
  //   return { layerName: key, layer: layersSetting[key], name: layersSetting[key].name }
  // }).filter((l) => {
  //   return l.layer.isSearchable
  // }));

  const [formValues, setFormValues] = useState({});

  const handleChangeInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

const generalOpenResultdetails=(data)=>{
  props.map.item = data;
  props.generalOpenResultdetails();

}
  const handleSelect = (name) => (value, e) => setSearchLayer(e.id);

  const searchForFilters = () => {

  }

  return (
    <div className="coordinates mb-4 mt-2">
      <Container>
        {props.generalSearchInputsShown ? (
          <div>
            <FilterComponent 
                languageState={props.languageState}
              map={props.map}
              mainData={props.mainData}
              outerOpenResultMenu={props.outerOpenResultMenu}
              generalOpenResultMenu={props.generalOpenResultMenu}
              setNavRouteName={props.setNavRouteName}
              outerOpenResultdetails={generalOpenResultdetails}
              setOuterSearchResult={props.setOuterSearchResult} />
          </div>
        ) : props.generalResultMenuShown ? (
          <GeneralSearchResultMenu
            mainData={props.mainData}
            map={props.map}
            outerSearchResult={props.outerSearchResult}
            generalOpenSearchInputs={props.generalOpenSearchInputs}
            outerOpenResultdetails={generalOpenResultdetails}
          />
        ) : props.generalResultDetailsShown ? (
          <GeneralResultDetails
          mainData={props.mainData}
            map={props.map}
            data={props.map.item}
            outerSearchResult={props.outerSearchResult}
            generalOpenSearchInputs={props.generalOpenSearchInputs}
            generalOpenResultMenu={props.generalOpenResultMenu}
            outerOpenResultdetails={generalOpenResultdetails}
            setOuterSearchResult={props.setOuterSearchResult}
          />
        ) : null}
      </Container>
    </div>
  );
}
