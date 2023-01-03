import React from "react";
import { Input, Space, Select } from "antd";
import { DownCircleFilled } from "@ant-design/icons";

import { SearchOutlined } from "@ant-design/icons";
import HijriDatePicker from "../../../components/hijriDatePicker/components/HijriDatePicker";
import { useTranslation } from "react-i18next";

function TblColFilter({ Column, colFilterRefs, ...rest }) {
  const { t } = useTranslation("common");

  const filterInput = React.useRef(null);
  const resetFilRef = React.useRef(null);
  const [columnData, setColumnData] = React.useState({});
  React.useEffect(() => {
    if (rest.tblColumns?.length) {
      filterInput.current = null;
    }
  }, [rest.tblColumns]);
  React.useEffect(() => {
    if (rest.colData) {
      console.log({ ...rest.colData, ...setFiltersIntoTable(rest.colData) });
      setColumnData({ ...rest.colData, ...setFiltersIntoTable(rest.colData) });
    }
  }, [rest.colData]);
  React.useEffect(() => {
    //debugger
    if (resetFilRef.current) {
      colFilterRefs.current.push(resetFilRef.current);
    }
  }, [resetFilRef.current]);
  const setFiltersIntoTable = (rowData) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div
          style={{
            padding: 8,
          }}
        >
          {rowData.domain?.codedValues ? (
            <Select
              virtual={false}
              suffixIcon={<DownCircleFilled />}
              showSearch
              // allowClear
              onSelect={(value, input) => {
                setSelectedKeys([
                  {
                    name: input.name,
                    value,
                  },
                ]);
              }}
              ref={filterInput}
              placeholder={`ابحث بـ ${rowData.alias}`}
              value={selectedKeys[0]?.name}
              // onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              style={{
                marginBottom: 8,
                display: "block",
              }}
              // placeholder="القيمة"
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp="name"
              filterOption={(input, option) => {
                return option.name && option.name.indexOf(input) >= 0;
              }}
            >
              {rowData.domain?.codedValues.map((domain, index) => {
                return (
                  <Select.Option
                    key={index}
                    name={domain.name}
                    value={domain.code}
                  >
                    {domain.name}
                  </Select.Option>
                );
              })}
            </Select>
          ) : rowData.type === "esriFieldTypeDate" ? (
            <HijriDatePicker
              disableOnClickOutside
              placeholder={t("selectDate")}
              input={{
                ref: { filterInput },
                // id:"value" + row.id,
                value: selectedKeys,
                onChange: (e) => setSelectedKeys(e),
              }}
            />
          ) : (
            <Input
              ref={filterInput}
              placeholder={`ابحث بـ ${rowData.alias}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleTblFilter(selectedKeys, confirm, rowData.name)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}

          <Space>
            <button
              type="primary"
              className="SearchBtn mt-3 w-25"
              size="large"
              htmlType="submit"
              onClick={() => handleTblFilter(selectedKeys, confirm, rowData)}
              icon={<SearchOutlined />}
              style={{
                width: 90,
              }}
            >
              {t("search")}
            </button>
            <button
              className="SearchBtn mt-3 w-25"
              size="large"
              htmlType="submit"
              onClick={() => clearFilters && handleResetTblFilter(clearFilters)}
              style={{
                width: 90,
              }}
            >
              {t("removeFilter")}
            </button>
            {/* <Button
                type="link"
                size="small"
                onClick={()=>handleClickOnfilter(confirm, rowData.dataIndex)}
              >
                فلترة
              </Button> */}
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1890ff" : undefined,
          }}
        />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => filterInput.current?.select?.(), 100);
        }
      },
      render: (text) => text,
    };
  };

  const handleTblFilter = (selectedKeys, confirm, rowData) => {
    confirm();
  };

  const handleResetTblFilter = (clearFilters) => {
    clearFilters();
  };
  return <Column {...columnData} />;
}

export default TblColFilter;
