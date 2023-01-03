import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import LandDataModal from "./LandDataModal";
import * as watchUtils from "@arcgis/core/core/watchUtils";
import { useTranslation } from "react-i18next";

export default function LandIcons(props) {
  const [landData, setlandData] = useState([]);
  const [position, setPosition] = useState();
  const landSpatialIDRef = React.useRef();
  const wahtchHandlerRef = React.useRef();
  const { t } = useTranslation("common");

  useEffect(() => {
    landSpatialIDRef.current = props.popupInfo.landSpatialID;
    // let wahtchHandler = watchUtils.when(props.map.view, "stationary", () => {
    //   if (props.popupInfo) {
    //     let screenPoint = props.map.view.toScreen(props.popupInfo.mapPoint);
    //     console.log(screenPoint);
    //     setPosition({
    //       right: screenPoint.x,
    //       top: screenPoint.y
    //     });
    //   }
    // });
    // wahtchHandlerRef.current = wahtchHandler;
    fetchServicesData();
    return () => {
      setPosition();
      setlandData([]);
      // props.setPopupInfo(undefined);
      // wahtchHandlerRef.current&&wahtchHandlerRef.current.remove()
    };
  }, []);
  useEffect(() => {
    if (props.popupInfo && props.currentLayer) {
      let screenPoint = props.map.view.toScreen(props.popupInfo.mapPoint);
      console.log(screenPoint);
      setPosition({
        right: screenPoint.x + 100,
        top: screenPoint.y - 150,
      });
      if (
        landSpatialIDRef.current &&
        props.popupInfo.landSpatialID !== landSpatialIDRef.current
      ) {
        fetchServicesData();
      }
    }
  }, [props.popupInfo, props.currentLayer]);

  const [landDataOpened, setshowlandDetails] = useState(null);
  const showlandDataDetails = (id) => {
    setshowlandDetails(id);
  };
  const closePopup = () => {
    props.setPopupInfo(undefined);
    setlandData([]);
  };
  const fetchServicesData = () => {
    axios
      .get(
        window.ApiUrl +
          `/GetUsageData?isCommercial=${props.popupInfo.isCommercial}&isResidential=${props.popupInfo.isResidential}&isStreet=${props.popupInfo.isStreet}`
      )
      .then((res) => {
        if (typeof res.data === "object" && res.data?.length === 0) {
          props.setPopupInfo(undefined);
          setlandData([]);
        } else {
          // رخص الحفريات
          if (res.data.length) {
            let dataInJson = res.data
              .map((d) => {
                let item = JSON.parse(d);
                return item[0];
              })
              .reverse();
            if (["Street_Naming"].includes(props.popupInfo.currentLayer)) {
              setlandData(
                dataInJson.filter((ic) => ic.title === "رخص الحفريات")
              );
            } else if (
              ["Landbase_Parcel"].includes(props.popupInfo.currentLayer)
            ) {
              setlandData(
                dataInJson.filter((ic) => ic.title !== "رخص الحفريات")
              );
            } else setlandData([]);
          }
        }
      });
  };
  if (!position || landData.length === 0) return null;
  else
    return (
      <div
        className="landDataIconsModal"
        id="landDataIconsModal"
        style={{
          position: "fixed",
          right: props.map.view.width - position.right - 10,
          top: position.top - 100,
        }}
      >
        <div style={{ backgroundColor: "white" }}>
          <p className="landmodalTitle">
            <FontAwesomeIcon
              className="closeIconsIcon servCloseIcon"
              icon={faTimes}
              style={{ cursor: "pointer" }}
              onClick={closePopup}
            />

            {t('availableServices')}
          </p>
          <ul className="landIconsUl">
            {landData.map((p) =>
              p !== undefined ? (
                <>
                  <li
                    className="landIconsLi"
                    onClick={() => showlandDataDetails(p.link)}
                    key={p.link}
                  >
                    {/* {console.log(p)} */}
                    <Tooltip title={p.title} placement="bottom">
                      <img
                        src={p.icon.replace("http", "https")}
                        style={{ width: "100%" }}
                        alt="landIcon"
                      />
                    </Tooltip>
                  </li>
                  <LandDataModal
                    popupInfo={props.popupInfo}
                    showlandDataDetails={showlandDataDetails}
                    landDataOpened={landDataOpened}
                    {...p}
                  />
                </>
              ) : null
            )}
          </ul>
        </div>
      </div>
    );
}
