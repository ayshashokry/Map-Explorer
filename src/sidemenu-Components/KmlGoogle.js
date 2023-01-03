import React, { useState } from "react";
import { Container } from "react-bootstrap";
// import { layersSetting } from "../helper/layers";
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { useTranslation } from "react-i18next";
import i18n from "../i18n";
export default function KmlGoogle(props) {
  const { t } = useTranslation("common");

  const [legends, setLegends] = useState(props.map.__mapInfo.info.$legends)

  const changeLayer = (layer, key) => {

    legends[key].isExportGoogle = !legends[key].isExportGoogle;
    setLegends([...legends]);

  }

  const generateKml = () => {
    let fileName = "Kml_file";
    let exportedLayersId = legends.filter((layer) => layer.isExportGoogle)
      .map((d) => d.layerId);

    if (exportedLayersId) {

      saveFile(window.mapUrl + "/generateKml?docName=" + fileName +
        "&layers=" + exportedLayersId.join(",") + "&layerOptions=nonComposite", fileName);
    }
  }

  const saveFile = (res, fileName) => {
    // Get file name from url.
    //var filename = res.substring(res.lastIndexOf("/") + 1).split("?")[0];
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status == 200) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
        a.download = fileName + ".kml"; // Set the file name.
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      }
      else {
        //$rootScope.notifySystem("error", "mapViewer.ERROR");
      }
    };
    xhr.open('GET', res);
    xhr.send();
  }

  const expand = (layer, key) => {

    legends[key].expand = !legends[key].expand;
    setLegends([...legends]);

  }
  return (
    <Container style={{ textAlign: 'center' }}>
      <section >
        <div style={{ marginTop: "10px" }}>
          <ul style={{ padding: "5px" }}>
            {legends.map((layer, key) => {
              return (
                !layer.isHidden && props.mainData.layers[layer.layerName] && (
                  <div style={{ direction: i18n.language === 'ar' ? "rtl" : "ltr" }} key={key}>
                    <div className="toc-gallery">
                      <div onClick={() => expand(layer, key)} style={{ cursor: "pointer" }}>
                        {layer.expand ? (
                          <FontAwesomeIcon icon={faCaretDown} />
                        ) : (
                          <FontAwesomeIcon icon={i18n.language === 'ar' ? faCaretLeft : faCaretRight} />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        style={{ marginTop: "-10px" }}
                        defaultChecked={layer.isExportGoogle}
                        onChange={(e) => changeLayer(layer, key)}
                      />
                      <label
                        style={{
                          fontSize: "13px",
                          fontWeight: "normal",
                          whiteSpace: "break-spaces"
                        }}
                      >
                        {i18n.language === 'ar' && props.mainData.layers[layer.layerName] ?
                          props.mainData.layers[layer.layerName].arabicName :
                          layer.layerName}

                      </label>
                    </div>
                    {layer.expand && layer.legend.map((legend, key) => {

                      return (<ul key={key}>
                        <img src={"data:image/jpeg;base64," + legend.imageData} />
                        <div
                          style={{
                            fontSize: "13px",
                            marginBottom: "10px",
                          }}
                        >
                          {legend.label}
                        </div>
                      </ul>)
                    })}
                  </div>
                ))
            })}
          </ul>
        </div>
      </section>

      <button className="SearchBtn mt-3 w-25"
        size="large"
        htmlType="submit" onClick={() => generateKml()}>
        {t("extractKML")}      </button>

    </Container>
  )
}
