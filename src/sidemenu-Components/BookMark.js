import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Button, message, Modal } from "antd";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Extent from "@arcgis/core/geometry/Extent";
import { useTranslation } from "react-i18next";
export default function BookMark(props) {
  const { t } = useTranslation("common");

  const [formValues, setFormValues] = useState({
    bookmark: "",
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeBookMark, setActiveBookMark] = useState(-1);
  const User = localStorage.User ? JSON.parse(localStorage.User) : null;

  const handleChangeInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (User) {
      axios
        .get(window.ApiUrl + "Bookmark/GetAll?filter_key=user_id&q=" + User.id)
        .then(({ data }) => {
          setBookmarks(data.results);
        });
    } else {
      setBookmarks(
        localStorage.bookmarks ? JSON.parse(localStorage.bookmarks) : []
      );
    }
  }, []);

  const zoomToBookmark = (bookmark, index) => {
    setActiveBookMark(index);

    if (typeof bookmark.extent == "string") {
      bookmark.extent = JSON.parse(bookmark.extent);
    }

    props.map.view.goTo(
      new Extent({
        xmin: bookmark.extent.xmin,
        ymin: bookmark.extent.ymin,
        xmax: bookmark.extent.xmax,
        ymax: bookmark.extent.ymax,
        spatialReference: bookmark.extent.spatialReference,
      })
    );
  };

  const addBookMark = (e) => {
    let temp = [...bookmarks];

    if (User) {
      axios
        .post(window.ApiUrl + "api/Bookmark", {
          title: formValues.bookmark,
          extent: JSON.stringify(props.map.view.extent),
          user_id: User.id,
        })
        .then(({ data }) => {
          temp.push(data);
          setBookmarks(temp);
        });
    } else {
      temp.push({
        title: formValues.bookmark,
        extent: JSON.stringify(props.map.view.extent),
      });
      localStorage.bookmarks = JSON.stringify(temp);
      setBookmarks(temp);
    }

    setFormValues({ ...formValues, [e.target.name]: "" });

    message.success(t("saveLocationToBookMark"));
  };

  const removeBookMark = (bookmark, index) => {
    let arr = [...bookmarks];
    arr.splice(index, 1);

    if (User) {
      axios.delete(window.ApiUrl + "Bookmark/" + bookmark.id).then(() => {});
    } else {
      localStorage.bookmarks = JSON.stringify(arr);
    }

    message.success(t("removed"));

    setBookmarks(arr);
  };

  const showEdit = (bookmark, index) => {
    zoomToBookmark(bookmark, index);
    setFormValues({ ...formValues, editName: bookmark.title });
    setEditModalVisible(true);
  };

  const afterEditModal = () => {
    bookmarks[activeBookMark].title = formValues.editName;
    setEditModalVisible(false);

    if (User) {
      axios
        .put(window.ApiUrl + "api/Bookmark/" + bookmarks[activeBookMark].id, {
          ...bookmarks[activeBookMark],
        })
        .then(() => {});
    } else {
      let temp = [...bookmarks];
      temp[activeBookMark].title = formValues.editName;
      localStorage.bookmarks = JSON.stringify(temp);
    }

    message.success(t("edited"));
  };

  return (
    <div className="coordinates mb-4 mt-2">
      <Container>
        <Form
          className="GeneralForm"
          layout="vertical"
          name="validate_other"
          onFinish={addBookMark}
        >
          <Row className="bookmarkRow">
            <Col span={20}>
              <Form.Item
                label={t("bookmark")}
                rules={[
                  {
                    message: t("enterBookmark"),
                    required: true,
                  },
                ]}
                name="bookmark"
              >
                <Input
                  name="bookmark"
                  onChange={handleChangeInput}
                  value={formValues.bookmark}
                  placeholder={t("bookmark")}
                />
              </Form.Item>
            </Col>

            <Col span={3} style={{ margin: "auto" }}>
              <Button
                className="addMark mt-2 "
                size="large"
                htmlType="submit"
                disabled={formValues.bookmark !== "" ? false : true}
              >
                <FontAwesomeIcon icon={faPlus} className="" />
              </Button>
            </Col>
          </Row>
        </Form>

        {bookmarks.map((b, index) => (
          <div className="generalSearchCard" style={{ padding: "15px 5px" }}>
            <Row className="bookmarkRowEnglish">
              <Col span={3}>
                <FontAwesomeIcon
                  icon={faStar}
                  className="starMark"
                  style={
                    activeBookMark == index
                      ? { color: "#0a8eb9" }
                      : { color: "#707070" }
                  }
                />
              </Col>
              <Col
                onClick={() => zoomToBookmark(b, index)}
                span={14}
                style={{
                  whiteSpace: "break-spaces",
                  wordBreak: "break-word",
                  paddingRight: "5px",
                }}
              >
                <p style={{ margin: "10px" }}>{b.title}</p>
              </Col>
              <Col span={7} className='bookmarkColRight'>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="mx-2"
                  style={{ color: "#707070" }}
                  onClick={() => showEdit(b, index)}
                />
                <FontAwesomeIcon
                  style={{ color: "#707070" }}
                  icon={faTrash}
                  className="mx-2"
                  onClick={() => removeBookMark(b, index)}
                />
              </Col>
            </Row>
          </div>
        ))}
      </Container>
      <Modal
        title={t("editBookmarkName")}
        centered
        visible={editModalVisible}
        onOk={() => afterEditModal()}
        onCancel={() => setEditModalVisible(false)}
        okText={t("edit")}
        cancelText={t("cancel")}
      >
        <Input
          name="editName"
          onChange={handleChangeInput}
          value={formValues.editName}
          placeholder={t("bookmarkName")}
        />
      </Modal>
    </div>
  );
}
