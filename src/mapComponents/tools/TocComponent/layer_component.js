import { faCaretSquareLeft } from "@fortawesome/free-regular-svg-icons";
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretSquareDown,
  faCartPlus,
  faPlus,
  faPlusSquare,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import i18n from "../../../i18n";
// import { layersSetting } from "../../../helper/layers";
import { useTranslation } from "react-i18next";

export const LayerComponent = ({ layer, zoomToLayer, expand, changeLayer, mainData, languageState }) => {
  const { t } = useTranslation("map", "layers");

  return (
    <section className={` ${layer.disable}`}>
      <div className="toc-gallery">
        <div onClick={expand} style={{ cursor: "pointer" }}>
          {layer.show ? (
            <FontAwesomeIcon icon={faCaretDown} />
          ) : (
            <FontAwesomeIcon icon={i18n.language === 'ar' ? faCaretLeft : faCaretRight} />
          )}
        </div>
        <input
          type="checkbox"
          style={{ marginTop: "-10px" }}
          checked={layer.visible}
          onChange={changeLayer}
        />
        <label
          style={{
            fontSize: "13px",
            fontWeight: "normal",
          }}
        >


          {languageState === 'ar' && mainData.layers[layer.layerName] ?
            mainData.layers[layer.layerName].arabicName :
            layer.layerName}

        </label>
        <div style={{ cursor: "pointer" }} onClick={zoomToLayer}>
          <FontAwesomeIcon icon={faSearchPlus} style={{ fontSize: "15px" }} />
        </div>
      </div>
      {layer.show &&
        layer.legend.map((legend, key) => {
          return (
            <ul key={key}>
              <img src={"data:image/jpeg;base64," + legend.imageData} />
              <div
                style={{
                  fontSize: "13px",
                  marginBottom: "10px",
                }}
              >
                {legend.label}
              </div>
            </ul>
          );
        })}
    </section>
  );
};
