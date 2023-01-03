import React, { useState } from "react";
import {  Select, Form, Input } from "antd";
import { Container } from "react-bootstrap";
import { SearchOutlined, DownCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function GeoRange() {  const [t]=useTranslation('common','map')

  const [searchLayer, setSearchLayer] = useState(undefined);
  const [searchLayers] = useState([
    { id: 1, name: "حصر لمبانى الأمانة" },
    { id: 2, name: "الشوارع" },
    { id: 3, name: "الخدمات" },
    { id: 4, name: "بيانات قطع الأرا ضي" },
    { id: 5, name: "حدود المخططات" },
    { id: 6, name: "حدود الأحياء" },
    { id: 7, name: "الدوائر الانتخابية" },
  ]);

  const [formValues, setFormValues] = useState({
    distance: "",
  });
  const handleChangeInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleSelect = (name) => (value, e) => setSearchLayer(e.id);

  const geoRange = (e) => {};
  return (
    <div className="coordinates mb-4 mt-2">
      <Container>
        <Form
          className="GeneralForm"
          layout="vertical"
          name="validate_other"
          onFinish={geoRange}
        >
          <Form.Item
            label={t('common:searchLayer')}
            name="searchLayer"
            rules={[
              {
                message: t('common:searchLayerSelect'),
                required: true,
              },
            ]}
          >
            <Select virtual={false}
              suffixIcon={<DownCircleFilled />}
              showSearch
              allowClear
              className="dont-show"
              onChange={handleSelect("searchLayer")}
              value={searchLayer}
              placeholder={t('common:searchLayerSelect')}
              getPopupContainer={(trigger) => trigger.parentNode}
              onClear={() => setSearchLayer(undefined)}
              optionFilterProp="value"
              filterOption={(input, option) => option.value.indexOf(input) >= 0}
            >
              {searchLayers.map((s, index) => (
                <Select.Option value={s.name} id={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t('common:distance')}
            rules={[
              {
                message: t('common:distanceRule'),
                required: true,
              },
            ]}
            name="streetName"
          >
            <Input
              type="number"
              name="streetName"
              onChange={handleChangeInput}
              value={formValues.distance}
              placeholder={t('map:mapTools.area')}
            />
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <button
              icon={<SearchOutlined />}
              className="SearchBtn mt-3 w-25"
              size="large"
              htmlType="submit"
            >
              {t('common:search')}
            </button>
          </div>
        </Form>
      </Container>
    </div>
  );
}
