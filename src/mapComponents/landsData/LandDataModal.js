import React from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
export default function LandDataModal(props) {
  return (
    <Modal
      backdrop="static"
      className="landDetailsModal"
      show={props.landDataOpened === props.link}
      onHide={() => props.showlandDataDetails(null)}
      size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <span
        style={{
          width: "100%",
          float: "left",
          textAlign: "left",
          marginLeft: "5px",
        }}
      >
        <FontAwesomeIcon
          className="landDetailClose"
          icon={faTimes}
          style={{ cursor: "pointer" }}
          onClick={() => props.showlandDataDetails(null)}
        />
      </span>

      {props.data &&
        props.data.length > 0 &&
        props.data.map((landData) => (
          <>
            {landData.title && (
              <p className="landmodalTitle">{landData.title}</p>
            )}

            {landData.details && (
              <p className="landDetails">{landData.details}</p>
            )}
            {landData.bullets && landData.bullets.length > 0 && (
              <ul>
                {landData.bullets.map((b) => (
                  <li>{b}</li>
                ))}
              </ul>
            )}
          </>
        ))}
      {props.data && props.data.length && (
        <section className="arrow-popup-modal">
          {/* <span>
            <i className="fa fa-caret-down serviceIcon"></i>
          </span> */}
        </section>
      )}
    </Modal>
  );
}
