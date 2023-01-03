import { Modal, Button } from "react-bootstrap";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function TableModal({
  modalShow,
  rowID,
  openModal,
  closeModal,
}) {
  return (
    <Modal show={modalShow == rowID} onHide={closeModal}>
      <Modal.Header>
        <FontAwesomeIcon icon={faTimes} onClick={closeModal}style={{cursor:"pointer"}} />
      </Modal.Header>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
