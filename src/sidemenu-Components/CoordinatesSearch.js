import React, { useState } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import { Row, Col, Input, Form, Select, message, Checkbox } from "antd";
// import Loader from "../containers/Loader";
import { SearchOutlined } from "@ant-design/icons";
import { DownCircleFilled } from "@ant-design/icons";
import Point from "@arcgis/core/geometry/Point";
import {
  addPictureSymbol,
  getLayerId,
  highlightFeature,
  project,
  queryTask,
} from "../helper/common_func";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import locationIcon from "../assets/images/location.gif";
import { useTranslation } from "react-i18next";

export default function CoordinatesSearch(props) {
  const { t } = useTranslation("common");

  const [loggedIn] = useState(localStorage.user);
  //const [loggedIn] = useState(localStorage.user);
  const [formValues, setFormValues] = useState({
    coordinateWidth: 0,
    coordinateTall: 0,
    lngInMeters: 0,
    latInMeters: 0,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [WGS_Geographic, setWGS_Geographic] = useState(null);
  const [WGS_Projected, setWGS_Projected] = useState(null);
  const [Ain_El_Abd_Projected, setAin_El_Abd_Projected] = useState(null);
  const [Ain_El_Abd_Geographic, setAin_El_Abd_Geographic] = useState(null);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const CoordinateSearch = (e) => {};
  const degSearch = (e) => {};

  const [dropSystem, setdropSystem] = useState(2);
  const [metersType, setMetersType] = useState(1);
  const [dropType, setdropType] = useState(undefined);

  const onFinish = (values) => {
    values = formValues;
    setWGS_Projected(null);
    setWGS_Geographic(null);

    console.log(dropSystem);

    let point;
    if (values.x && values.y) {
      point = new Point({
        x: values.x,
        y: values.y,
        spatialReference: new SpatialReference({ wkid: 32639 }),
      });

      if (dropSystem == 3) {
        //ain al abd
        point = new Point({
          x: values.x,
          y: values.y,
          spatialReference: new SpatialReference({ wkid: 20439 }),
        });

        //wgs 84 utm
        project([point], 32639, (res) => {
          setWGS_Projected({ x: res[0].x, y: res[0].y });
        });
      }
      project([point], 102100, (res) => {
        setWGS_Geographic({
          latitude: fromLatLngToDegree(res[0].latitude),
          longitude: fromLatLngToDegree(res[0].longitude),
        });

        addPictureSymbol(
          res[0],
          locationIcon,
          "locationGraphicLayer",
          props.map
        );

        highlightFeature(res[0], props.map, {
          layerName: "ZoomGraphicLayer",
          isZoom: true,
          isZoomOnly: true,
          zoomDuration: 1000,
        });
      });
    } else if (values.latitudeDeg || values.latitudeDec) {
      if (values.latitudeDec) {
        point = zoomToLatLng(values.latitudeDec, values.longitudeDec);
      } else {
        point = zoomToDegreePoint(values);
      }

      //wgs 84 utm
      project([point], 32639, (res) => {
        setWGS_Projected({ x: res[0].x, y: res[0].y });
      });

      //Ain el abd utm
      project([point], 20439, (res) => {
        setAin_El_Abd_Projected({ x: res[0].x, y: res[0].y });
      });
    } else {
      setErrorMessage("من فضلك قم بإدخال الحقول");
      return;
    }

    setErrorMessage(null);
    checkPointInAmana(point);

    //wgs84
    if (dropSystem == 2) {
      setWGS_Geographic(null);
      //Ain el abd geographic
      project([point], 4204, (res) => {
        setAin_El_Abd_Geographic({
          latitude: fromLatLngToDegree(res[0].latitude),
          longitude: fromLatLngToDegree(res[0].longitude),
        });
      });
    }
    //Ain el abd
    else if (dropSystem == 3) {
      setAin_El_Abd_Geographic(null);
      //wgs 84 geographic
      project([point], 4326, (res) => {
        setWGS_Geographic({
          latitude: fromLatLngToDegree(res[0].latitude),
          longitude: fromLatLngToDegree(res[0].longitude),
        });
      });
    }
  };

  const checkPointInAmana = (point) => {
    project([point], 102100, (res) => {
      let layerdId = getLayerId(props.map.__mapInfo, "Province_Boundary");

      queryTask({
        url: window.mapUrl + "/" + layerdId,
        geometry: res[0],
        outFields: ["OBJECTID"],
        returnGeometry: false,
        callbackResult: ({ features }) => {
          if (!features.length) message.warning("هذة النقطة خارج حدود الأمانة");
        },
      });
    });
  };

  const fromDegreeToLatLng = (values) => {
    let latitudeResult =
      +values.latitudeDeg +
      +values.latitudeMinutes / 60 +
      +values.latitudeSeconds / 3600;
    let longitudeResult =
      +values.longitudeDeg +
      +values.longitudeMinutes / 60 +
      +values.longitudeSeconds / 3600;

    return { latitude: latitudeResult, longitude: longitudeResult };
  };

  const zoomToDegreePoint = (values) => {
    let latitudeResult =
      +values.latitudeDeg +
      +values.latitudeMinutes / 60 +
      +values.latitudeSeconds / 3600;
    let longitudeResult =
      +values.longitudeDeg +
      +values.longitudeMinutes / 60 +
      +values.longitudeSeconds / 3600;

    return zoomToLatLng(latitudeResult, longitudeResult);
  };

  const zoomToLatLng = (lat, lng) => {
    let point = new Point({
      latitude: lat,
      longitude: lng,
    });

    addPictureSymbol(point, locationIcon, "locationGraphicLayer", props.map);

    highlightFeature(point, props.map, {
      layerName: "ZoomGraphicLayer",
      isZoom: true,
      isZoomOnly: true,
      zoomDuration: 1000,
    });

    return point;
  };

  const onPublicUserDecimalSubmit = (values) => {
    if (values.latitude && values.longitude) {
      let point = new Point({
        latitude: values.latitude,
        longitude: values.longitude,
      });

      addPictureSymbol(point, locationIcon, "locationGraphicLayer", props.map);

      highlightFeature(point, props.map, {
        layerName: "ZoomGraphicLayer",
        isZoom: true,
        isZoomOnly: true,
        zoomDuration: 1000,
      });

      checkPointInAmana(point);
    }
  };

  const fromLatLngToDegree = (angleInDegrees, returnObject) => {
    while (angleInDegrees < -180.0) angleInDegrees += 360.0;

    while (angleInDegrees > 180.0) angleInDegrees -= 360.0;

    var result = {};

    angleInDegrees = Math.abs(angleInDegrees);

    //gets the degree
    result.deg = Math.floor(angleInDegrees);
    var delta = angleInDegrees - result.deg;

    //gets minutes and seconds
    var seconds = 3600.0 * delta;
    result.sec = seconds % 60;
    result.min = Math.floor(seconds / 60.0);

    if (returnObject) {
      return result;
    }

    return (
      "''" +
      (+result.sec).toFixed(3) +
      " '" +
      result.min +
      " " +
      result.deg +
      "° "
    );
    //return result;
  };

  const onPublicUserDegreesSubmit = (values) => {
    // convert (deg, min, sec) to value of (lat,lng)
    let point = zoomToDegreePoint(values);
    checkPointInAmana(point);
  };

  const onChangeCheckBox = (e, type) => {
    setMetersType(type);

    if (type == 1) {
      let latlng = fromDegreeToLatLng(formValues);
      if (latlng.latitude && latlng.longitude) {
        formValues.latitudeDec = latlng.latitude;
        formValues.longitudeDec = latlng.longitude;

        formValues.latitudeDeg = null;
        formValues.latitudeMinutes = null;
        formValues.latitudeSeconds = null;

        formValues.longitudeDeg = null;
        formValues.longitudeMinutes = null;
        formValues.longitudeSeconds = null;
      }
    } else {
      if (formValues.latitudeDec && formValues.longitudeDec) {
        let latdegree = fromLatLngToDegree(formValues.latitudeDec, true);
        let lngdegree = fromLatLngToDegree(formValues.longitudeDec, true);

        formValues.latitudeDeg = latdegree.deg;
        formValues.latitudeMinutes = latdegree.min;
        formValues.latitudeSeconds = latdegree.sec;

        formValues.longitudeDeg = lngdegree.deg;
        formValues.longitudeMinutes = lngdegree.min;
        formValues.longitudeSeconds = lngdegree.sec;

        formValues.latitudeDec = null;
        formValues.longitudeDec = null;
      }
    }
  };

  const handleSelect = (name) => (value, e) =>
    e !== undefined
      ? name === "dropSystem"
        ? (setdropSystem(e.id), setFormValues({}))
        : name === "dropType"
        ? (setdropType(e.id), setFormValues({}))
        : null
      : null;

  return (
    <div className="coordinates mt-2">
      {/* {loading ? <Loader /> : null} */}
      {!localStorage.getItem('user') ? (
        <Tabs
          defaultActiveKey="coord"
          id="uncontrolled-tab-example"
          className=""
        >
          <Tab eventKey="coord" title={t("decimalCoor")}>
            <Form
              onFinish={onPublicUserDecimalSubmit}
              className="coordinateForm"
              layout="vertical"
              name="validate_other"
            >
              <Container>
                <Row>
                  <Col span={24} className="">
                    <h5 className="mt-4 "> {t("Latitude")}</h5>
                    <Form.Item
                      name="latitude"
                      rules={[
                        {
                          message: t("LatitudeSelect"),
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        // type="number"
                        name="latitude"
                        onChange={handleChange}
                        value={formValues.latitude}
                        placeholder={t("Latitude")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="">
                    <h5 className="mt-2"> {t("longitude")}</h5>
                    <Form.Item
                      rules={[
                        {
                          message: t("longitudeSelect"),
                          required: true,
                        },
                      ]}
                      name="longitude"
                    >
                      <Input
                        // type="number"
                        name="longitude"
                        onChange={handleChange}
                        value={formValues.longitude}
                        placeholder={t("longitude")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ textAlign: "center" }}>
                  <button
                    icon={<SearchOutlined />}
                    onClick={CoordinateSearch}
                    className="SearchBtn mt-3 w-25"
                    size="large"
                    htmlType="submit"
                  >
                    {t("search")}
                  </button>
                </div>
              </Container>
            </Form>
          </Tab>

          <Tab eventKey="deg-min" title={t("degMinSec")}>
            <Form
              onFinish={onPublicUserDegreesSubmit}
              className="coordinateForm"
              layout="vertical"
              name="validate_other"
            >
              <Container fluid>
                <h5 className="mt-4 mr-1">{t("Latitude")}</h5>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      name="latitudeSeconds"
                      rules={[
                        {
                          message: t("chooseSec"),
                          required: true,
                        },
                      ]}
                      // help="Should be combination of numbers & alphabets"
                    >
                      <Input
                        // type="number"
                        name="latitudeSeconds"
                        onChange={handleChange}
                        value={formValues.latitudeSeconds}
                        placeholder={t("seconds")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} className="mr-1">
                    <Form.Item
                      rules={[
                        {
                          message: t("chooseMin"),
                          required: true,
                        },
                      ]}
                      name="latitudeMinutes"

                      // help="Should be combination of numbers & alphabets"
                    >
                      <Input
                        // type="number"
                        name="latitudeMinutes"
                        onChange={handleChange}
                        value={formValues.latitudeMinutes}
                        placeholder={t("minutes")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} className="mr-1 ml-2">
                    <Form.Item
                      rules={[
                        {
                          message: t("chooseDeg"),
                          required: true,
                        },
                      ]}
                      name="latitudeDeg"

                      // help="Should be combination of numbers & alphabets"
                    >
                      <Input
                        // type="number"
                        name="latitudeDeg"
                        onChange={handleChange}
                        value={formValues.latitudeDeg}
                        placeholder={t("degrees")}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <h5 className="mt-4 mr-1">{t("longitude")}</h5>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      name="longitudeSeconds"
                      rules={[
                        {
                          message: t("chooseSec"),
                          required: true,
                        },
                      ]}

                      // help="Should be combination of numbers & alphabets"
                    >
                      <Input
                        // type="number"
                        name="longitudeSeconds"
                        onChange={handleChange}
                        value={formValues.longitudeSeconds}
                        placeholder={t("seconds")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} className="mr-1">
                    <Form.Item
                      name="longitudeMinutes"
                      rules={[
                        {
                          message: t("chooseMin"),
                          required: true,
                        },
                      ]}
                      // help="Should be combination of numbers & alphabets"
                    >
                      <Input
                        // type="number"
                        name="longitudeMinutes"
                        onChange={handleChange}
                        value={formValues.longitudeMinutes}
                        placeholder={t("minutes")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} className="mr-1 ml-2">
                    <Form.Item
                      name="longitudeDeg"
                      rules={[
                        {
                          message: t("chooseDeg"),
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        // type="number"
                        name="longitudeDeg"
                        onChange={handleChange}
                        value={formValues.longitudeDeg}
                        placeholder={t("degrees")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ textAlign: "center" }}>
                  <button
                    icon={<SearchOutlined />}
                    onClick={degSearch}
                    className="SearchBtn mt-3 w-25"
                    size="large"
                    htmlType="submit"
                  >
                    {t("search ")}
                  </button>
                </div>
              </Container>
            </Form>
          </Tab>
        </Tabs>
      ) : (
        <Container fluid>
          <Form
            onFinish={onFinish}
            className="coordinateForm"
            layout="vertical"
            name="validate_other"
          >
            <Form.Item label={t("dropSys")} name="dropSystem">
              <Select
                virtual={false}
                suffixIcon={<DownCircleFilled />}
                showSearch
                allowClear
                // defaultValue="WGS-84"
                className="dont-show"
                onChange={handleSelect("dropSystem")}
                value={dropSystem}
                placeholder={t("dropSysSelect")}
                getPopupContainer={(trigger) => trigger.parentNode}
                onClear={() => setdropSystem(undefined)}
                optionFilterProp="value"
                filterOption={(input, option) =>
                  option.value.indexOf(input) >= 0
                }
              >
                <Select.Option value="WGS-84" id={2}>
                  WGS-84
                </Select.Option>
                <Select.Option value="Ain-El-Abd" id={3}>
                  Ain El-Abd
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t("dropType")}
              name="dropType"
              rules={[
                {
                  message: t("dropTypeSelect"),
                  required: true,
                },
              ]}
            >
              <Select
                virtual={false}
                suffixIcon={<DownCircleFilled />}
                showSearch
                allowClear
                className="dont-show"
                onChange={handleSelect("dropType")}
                value={dropType}
                placeholder={t("dropTypeSelect")}
                getPopupContainer={(trigger) => trigger.parentNode}
                optionFilterProp="value"
                filterOption={(input, option) =>
                  option.value.indexOf(input) >= 0
                }
              >
                <Select.Option value={t("geographic")} id={1}>
                  {t("geographic")}
                </Select.Option>
                <Select.Option value={t("metric")} id={2}>
                  {t("metric")}
                </Select.Option>
              </Select>
            </Form.Item>
            {dropType === 1 ? (
              <>
                <h5> {t("Latitude")}</h5>
                {metersType == 2 ? (
                  <Row>
                    <Col span={8}>
                      <Input
                        // type="number"
                        name="latitudeSeconds"
                        onChange={handleChange}
                        value={formValues.latitudeSeconds}
                        placeholder={t("seconds")}
                      />
                    </Col>
                    <Col span={7} className="mx-1">
                      <Input
                        // type="number"
                        name="latitudeMinutes"
                        onChange={handleChange}
                        value={formValues.latitudeMinutes}
                        placeholder={t("minutes")}
                      />
                    </Col>
                    <Col span={7} className="">
                      <Input
                        // type="number"
                        name="latitudeDeg"
                        onChange={handleChange}
                        value={formValues.latitudeDeg}
                        placeholder={t("degrees")}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={21}>
                      <Input
                        // type="number"
                        name="latitudeDec"
                        onChange={handleChange}
                        value={formValues.latitudeDec}
                        placeholder=""
                      />
                    </Col>
                    <Col span={3}>
                      <h5 style={{ fontWeight: "bold", marginRight: "10px" }}>
                        {" "}
                        {t("north")} °
                      </h5>
                    </Col>
                  </Row>
                )}
                <h5> {t("longitude")}</h5>
                {metersType == 2 ? (
                  <Row>
                    <Col span={8}>
                      <Input
                        // type="number"
                        name="longitudeSeconds"
                        onChange={handleChange}
                        value={formValues.longitudeSeconds}
                        placeholder={t("seconds")}
                      />
                    </Col>
                    <Col span={7} className="mx-1">
                      <Input
                        // type="number"
                        name="longitudeMinutes"
                        onChange={handleChange}
                        value={formValues.longitudeMinutes}
                        placeholder={t("minutes")}
                      />
                    </Col>
                    <Col span={7} className="">
                      <Input
                        // type="number"
                        name="longitudeDeg"
                        onChange={handleChange}
                        value={formValues.longitudeDeg}
                        placeholder={t("degrees")}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={21}>
                      <Input
                        // type="number"
                        name="longitudeDec"
                        onChange={handleChange}
                        value={formValues.longitudeDec}
                        placeholder=""
                      />
                    </Col>
                    <Col span={3}>
                      <h5 style={{ fontWeight: "bold", marginRight: "10px" }}>
                        {" "}
                        {t("east")} °
                      </h5>
                    </Col>
                  </Row>
                )}

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Checkbox
                    style={{ fontWeight: "bold" }}
                    onChange={(e) => onChangeCheckBox(e, 1)}
                    checked={metersType == 1}
                  >
                    {t("decimalDeg")}{" "}
                  </Checkbox>
                  <Checkbox
                    style={{ fontWeight: "bold" }}
                    onChange={(e) => onChangeCheckBox(e, 2)}
                    checked={metersType == 2}
                  >
                    {t("degMinSec")}
                  </Checkbox>
                </div>
              </>
            ) : dropType === 2 ? (
              <>
                <Row>
                  <Col span={24} className="">
                    <div style={{ textAlign: "justify" }}>
                      <label style={{ fontWeight: "bold" }}>
                        {" "}
                        {t("xCoor")}
                      </label>
                    </div>
                    <Input
                      // type="number"
                      name="x"
                      onChange={handleChange}
                      value={formValues.x}
                      placeholder={t("xCoor")}
                    />
                  </Col>
                  <Col span={24} className="">
                    <div style={{ textAlign: "justify", marginTop: "10px" }}>
                      <label style={{ fontWeight: "bold" }}>
                        {" "}
                        {t("yCoor")}
                      </label>
                    </div>
                    <Input
                      // type="number"
                      name="y"
                      onChange={handleChange}
                      value={formValues.y}
                      placeholder={t("yCoor")}
                    />
                  </Col>
                </Row>
              </>
            ) : null}
            {dropSystem !== undefined && dropType !== undefined ? (
              <div style={{ textAlign: "center" }}>
                <button
                  icon={<SearchOutlined />}
                  className="SearchBtn mt-3 w-25"
                  size="large"
                  htmlType="submit"
                >
                  {t("search")}
                </button>
              </div>
            ) : null}

            {WGS_Geographic && (
              <div>
                <p className="coordinateData">WGS ( Geographic )</p>
                <table className="table table-bordered">
                  <tr>
                    <td>
                      <span> {t("Latitude")}</span>
                    </td>
                    <td>
                      <span>{WGS_Geographic.latitude}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span> {t("longitude")}</span>
                    </td>
                    <td>
                      <span>{WGS_Geographic.longitude}</span>
                    </td>
                  </tr>
                </table>
              </div>
            )}
            {WGS_Projected && (
              <div>
                <p className="coordinateData">WGS Projected ( UTM )</p>
                <table className="table table-bordered">
                  <tr>
                    <td>
                      <span> {t("xCoor")}</span>
                    </td>
                    <td>
                      <span>{WGS_Projected.x}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>{t("yCoor")}</span>
                    </td>
                    <td>
                      <span>{WGS_Projected.y}</span>
                    </td>
                  </tr>
                </table>
              </div>
            )}

            {Ain_El_Abd_Projected && (
              <div>
                <p className="coordinateData">Ain El-Abd Projected ( UTM )</p>
                <table className="table table-bordered">
                  <tr>
                    <td>
                      <span> {t("xCoor")}</span>
                    </td>
                    <td>
                      <span>{Ain_El_Abd_Projected.x}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span> {t("yCoor")} </span>
                    </td>
                    <td>
                      <span>{Ain_El_Abd_Projected.y}</span>
                    </td>
                  </tr>
                </table>
              </div>
            )}

            {Ain_El_Abd_Geographic && (
              <div>
                <p className="coordinateData">Ain El-Abd ( Geographic )</p>
                <table className="table table-bordered">
                  <tr>
                    <td>
                      <span> {t("Latitude")} </span>
                    </td>
                    <td>
                      <span>{Ain_El_Abd_Geographic.latitude}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span> {t("longitude")}</span>
                    </td>
                    <td>
                      <span>{Ain_El_Abd_Geographic.longitude}</span>
                    </td>
                  </tr>
                </table>
              </div>
            )}
          </Form>
          {errorMessage && (
            <div style={{ textAlign: "center" }}>
              <label style={{ fontSize: "18px", color: "red" }}>
                {errorMessage}
              </label>
            </div>
          )}
        </Container>
      )}
    </div>
  );
}
