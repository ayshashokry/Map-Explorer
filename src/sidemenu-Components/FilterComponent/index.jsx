import React, { Component } from "react";
import { Select, Input, message, Spin } from "antd";
import {
  clearGraphicLayer,
  convertHirjiDateToTimeSpan,
  getFeatureDomainName,
  getLayerId,
  isLayerExist,
  queryTask,
  showLoading,
  zoomToFeatureByFilter,
} from "../../helper/common_func";
// import { layersSetting } from "../../helper/layers";
import { DownCircleFilled } from "@ant-design/icons";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Graphic from "@arcgis/core/Graphic";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import globalStore from "../../helper/globalVarabileStore";
import HijriDatePicker from "../../components/hijriDatePicker/components/HijriDatePicker";
import { withTranslation } from "react-i18next";

class FilterComponent extends Component {
  state = globalStore.searchCriteria || {
    searchLayer: null,
    searchLayers: [],
    formValues: {},
    searchFields: [],
    isActiveBufferSearch: false,
    showInfo: false,
    noData: false,
  };
  self = this;
  mapPoint = null;

  componentDidMount() {
    let layersSetting = this.props.mainData.layers;
    this.setState({
      searchLayers: Object.keys(layersSetting)
        .map((key) => {
          return {
            layerName: key,
            layer: layersSetting[key],
            name: layersSetting[key].name,
          };
        })
        .filter((l) => {
          return (
            l.layer.isPublicSearchable &&
            l.layer.searchFields &&
            isLayerExist(this.props.map.__mapInfo, l.layerName)
          );
        }),
    });
  }
  componentWillUnmount() {
    clearGraphicLayer("ZoomGraphicLayer", this.props.map);
  }
  handleSearchSelect = () => (layer) => {
    this.setState({
      searchLayer: layer,
      showInfo: false,
      noData: false,
      formValues: {},
      searchFields: [],
      isActiveBufferSearch: false,
    });

    this.getListsValue(layer);
  };

  getListsValue = (layer, getListsAfterFieldName, parentFilter) => {
    let layersSetting = this.props.mainData.layers;
    //get all filters
    let promiseQueries = [];
    let fieldsName = [];
    let layerdId = getLayerId(this.props.map.__mapInfo, layer);

    layersSetting[layer]?.searchFields
      ?.filter((x) => !x.isSearch)
      .forEach((item, index) => {
        if (!getListsAfterFieldName) {
          fieldsName.push(item.field);

          let filterQuery = parentFilter
            ? parentFilter + " and " + item.field + " is not null"
            : "1=1";

          promiseQueries.push(
            queryTask({
              url: window.mapUrl + "/" + layerdId,
              where: filterQuery,
              outFields:
                item.zoomLayer &&
                item.zoomLayer.filterField &&
                !item.zoomLayer.isNotSameAttributeNameInLayer
                  ? [item.field, item.zoomLayer.filterField]
                  : [item.field],
              returnGeometry: false,
              returnExecuteObject: true,
              returnDistinctValues: true,
              notShowLoading: true,
            })
          );
        } else {
          if (item.field == getListsAfterFieldName)
            getListsAfterFieldName = null;
        }
      });

    if (promiseQueries.length > 0) showLoading(true);
    else {
      this.setState({
        searchFields: layersSetting[layer]?.searchFields?.filter(
          (x) => !x.isSearch
        ),
      });
    }

    if (!this.state.formValues["MUNICIPALITY_NAME"]) {
      promiseQueries = [promiseQueries[0]];
      fieldsName = [fieldsName[0]];
    }

    Promise.all(promiseQueries).then((resultsData) => {
      this.mapResultWithDomain(resultsData, fieldsName, layerdId).then(
        (data) => {
          showLoading(true);
          data.forEach((item, index) => {
            let searchField = layersSetting[layer]?.searchFields?.find(
              (x) => x.field == fieldsName[index]
            );
            if (item.features.length > 0) {
              searchField.dataList =
                fieldsName[index] === "MUNICIPALITY_NAME"
                  ? [
                      ...item.features
                        .filter(
                          (f) =>
                            typeof f.attributes["MUNICIPALITY_NAME"] ===
                            "string"
                        )
                        .sort((a, b) =>
                          a.attributes["MUNICIPALITY_NAME"].localeCompare(
                            b.attributes["MUNICIPALITY_NAME"],
                            "ar"
                          )
                        ),
                    ]
                  : [...item.features];
            } else {
              searchField.dataList = [];
            }
          });
          this.setState({
            searchFields: this.state.formValues["MUNICIPALITY_NAME"]
              ? layersSetting[layer]?.searchFields?.filter((x) => !x.isSearch)
              : layersSetting[layer]?.searchFields?.filter(
                  (x) => x.field == "MUNICIPALITY_NAME"
                ),
            formValues: { ...this.state.formValues },
          });
          showLoading(false);
        }
      );
    });
  };

  mapResultWithDomain = (results, fieldsName, layerId) => {
    return new Promise((resolve, reject) => {
      let count = fieldsName.length;

      results.forEach((item, index) => {
        getFeatureDomainName(item.features, layerId).then((domainResult) => {
          item.features = domainResult;

          --count;
          if (count < 1) {
            resolve(results);
          }
        });
      });
    });
  };

  selectChange = (name, listData, item) => (e) => {
    let layersSetting = this.props.mainData.layers;
    this.setState({ showInfo: false, noData: false });
    if (!e) {
      clearGraphicLayer("ZoomGraphicLayer", this.props.map);
      this.setState({ [name]: undefined });
    }
    this.setState(
      { formValues: { ...this.state.formValues, [name]: e } },
      () => {
        let searchField = layersSetting[
          this.state.searchLayer
        ].searchFields.find((i) => i.field == name && !i.isSearch);
        if (searchField) {
          let filterQuery = [];

          if (searchField.zoomLayer) {
            let item = searchField.dataList.find(
              (x) =>
                (x.attributes[name + "_Code"] || x.attributes[name]) ==
                this.state.formValues[name]
            );

            if (item) {
              let where = "";
              if (searchField.zoomLayer.isNotSameAttributeNameInLayer) {
                where =
                  searchField.zoomLayer.filterField +
                  "=" +
                  "'" +
                  (item.attributes[searchField.field + "_Code"] ||
                    item.attributes[searchField.zoomLayer.field]) +
                  "'";
              } else {
                where =
                  searchField.zoomLayer.filterField +
                  "=" +
                  "'" +
                  (item.attributes[
                    searchField.zoomLayer.filterField + "_Code"
                  ] || item.attributes[searchField.zoomLayer.filterField]) +
                  "'";
              }

              if (e)
                zoomToFeatureByFilter(
                  where,
                  searchField.zoomLayer.name,
                  this.props.map
                );
            }
          }

          this.state.formValues = this.deleteChildValues(name);

          Object.keys(this.state.formValues).forEach((key) => {
            if (this.state.formValues[key])
              filterQuery.push(key + "='" + this.state.formValues[key] + "'");
          });

          this.getListsValue(
            this.state.searchLayer,
            name,
            filterQuery.join(" and ")
          );
        }
      }
    );
  };

  deleteChildValues = (name) => {
    let layersSetting = this.props.mainData.layers;
    let found = false;
    layersSetting[this.state.searchLayer].searchFields.forEach((item) => {
      if (found) {
        delete this.state.formValues[item.field];
        delete this.state[item.field];
      }
      if (item.field == name) {
        found = true;
      }
    });

    return this.state.formValues;
  };

  handleChangeInput = (e) => {
    this.setState({
      showInfo: false,
      noData: false,
      formValues: { ...this.state.formValues, [e.target.name]: e.target.value },
    });
  };

  handleBufferSearch = (e) => {
    this.setState({
      showInfo: false,
      noData: false,
      buffer_distance: e.target.value,
    });
  };

  searchForData = (e) => {
    if (this.state.isActiveBufferSearch) {
      this.setState({ showInfo: true });
      var handler = this.props.map.view.on("click", (event) => {
        this.props.map.view.graphics.removeAll();
        const buffer = geometryEngine.buffer(
          event.mapPoint,
          +this.state.buffer_distance,
          "meters"
        );
        var bufferGraphic = new Graphic({
          geometry: buffer,
          symbol: {
            type: "simple-fill",
            color: "rgba(255, 0, 0, 0.3)",
          },
        });
        this.props.map.view.graphics.add(bufferGraphic);

        handler.remove();
        this.setState({ showInfo: false });

        this.getSearchData(event.mapPoint);
      });
    } else {
      this.getSearchData();
    }
  };

  getSearchData = (e) => {
    let layersSetting = this.props.mainData.layers;

    let filterQuery = [];

    Object.keys(this.state.formValues).forEach((key) => {
      if (this.state.formValues[key]) {
        let field = layersSetting[this.state.searchLayer].searchFields.find(
          (x) => x.field == key
        );

        if (field.isSearch) {
          filterQuery.push(
            key + " like '%" + this.state.formValues[key] + "%'"
          );
        } else if (field.isDate) {
          filterQuery.push(
            key +
              field.operator +
              convertHirjiDateToTimeSpan(
                this.state.formValues[key],
                field.isEndDate
              )
          );
        } else {
          filterQuery.push(key + "='" + this.state.formValues[key] + "'");
        }
      }
    });

    filterQuery = filterQuery.join(" and ");

    let layerdId = getLayerId(this.props.map.__mapInfo, this.state.searchLayer);

    let queryObj = {
      url: window.mapUrl + "/" + layerdId,
      where: filterQuery ? filterQuery : "1=1",
      outFields: layersSetting[this.state.searchLayer].outFields,
      returnGeometry: true,
      queryWithGemoerty: this.state.isActiveBufferSearch,
      distance: this.state.buffer_distance,
      geometry: e,
      layerdId: layerdId,
      layerName: this.state.searchLayer,
    };

    let paginationObj = {
      ...queryObj,
      start: 0,
      num: window.paginationCount,
    };

    let promiseQueries = [];

    //for query
    promiseQueries.push(
      queryTask({ ...paginationObj, returnExecuteObject: true })
    );

    //for statistics
    promiseQueries.push(
      queryTask({
        ...queryObj,
        returnGeometry: false,
        statistics: layersSetting[this.state.searchLayer].statistics || [
          {
            type: "count",
            field: "OBJECTID",
            name: "count",
          },
        ],
        returnExecuteObject: true,
      })
    );

    // 0 for features
    // 1 for statistics

    showLoading(true);

    Promise.all(promiseQueries)
      .then((resultsData) => {
        let features = resultsData[0].features;
        if (features.length) {
          getFeatureDomainName(features, layerdId).then((res) => {
            showLoading(false);

            globalStore.searchCriteria = { ...this.state };

            let mappingRes = res.map((f) => {
              return {
                layerName: this.state.searchLayer,
                id: f.attributes["OBJECTID"],
                ...f.attributes,
                geometry: f.geometry,
              };
            });

            this.props.setOuterSearchResult({
              list: mappingRes,
              queryObj: paginationObj,
              statisticsInfo: resultsData[1].features[0].attributes,
            });

            if (res.length > 1) {
              this.props.generalOpenResultMenu();
            } else {
              this.props.outerOpenResultdetails(mappingRes[0]);
            }
          });
        } else {
          showLoading(false);
          this.setState({ noData: true });
        }
      })
      .catch((err) => {
        showLoading(false);
        message.error(this.props.t("common:retrievError"));
      });
  };

  onChange = (e) => {
    this.setState({ isActiveBufferSearch: !this.state.isActiveBufferSearch });
  };
  changeDate = (name) => (e) => {
    this.setState({ formValues: { ...this.state.formValues, [name]: e } });
  };

  onSearch = (item, filterValue) => {
    let layersSetting = this.props.mainData.layers;

    if (item.isServerSideSearch) {
      if (this.searchTimeOut) clearTimeout(this.searchTimeOut);

      this.searchTimeOut = setTimeout(() => {
        this.setState({ fetching: true });

        let filterQuery = [];

        Object.keys(this.state.formValues).forEach((key) => {
          if (
            this.state.formValues[key] &&
            key != item.field &&
            key != item.isServerSideSearch
          )
            filterQuery.push(key + "='" + this.state.formValues[key] + "'");
        });

        if (filterValue) {
          filterQuery.push(item.field + " like '" + filterValue + "%'");
        }

        let layerdId = getLayerId(
          this.props.map.__mapInfo,
          this.state.searchLayer
        );

        queryTask({
          url: window.mapUrl + "/" + layerdId,
          where: filterQuery.join(" and "),
          outFields: [item.field],
          orderByFields:[item.field +" ASC"],
          returnDistinctValues: true,
          returnGeometry: false,
          callbackResult: ({ features }) => {
            let searchField = layersSetting[
              this.state.searchLayer
            ].searchFields.find((x) => x.field == item.field);

            if (features.length > 0) searchField.dataList = [...features];

            this.setState({
              searchFields: [
                ...layersSetting[this.state.searchLayer].searchFields.filter(
                  (x) => !x.isSearch
                ),
              ],
              formValues: { ...this.state.formValues },
              fetching: false,
            });
          },
        });
      }, 500);
    }
  };

  render() {
    const { t } = this.props;
    let layersSetting = this.props.mainData.layers;
    const filterText =
      this.state.searchLayer &&
      layersSetting[this.state.searchLayer].searchFields.find(
        (x) => x.isSearch
      );
    return (
      <div style={{ textAlign: "right" }}>
        <div style={{ display: "grid" }}>
          <label className="selectLabelStyle"> {t("common:searchLayer")}</label>
          {/**Layer */}
          <Select
            virtual={false}
            suffixIcon={<DownCircleFilled />}
            showSearch
            className="dont-show"
            onChange={this.handleSearchSelect()}
            value={this.state.searchLayer}
            placeholder={t("common:searchLayerSelect")}
            getPopupContainer={(trigger) => trigger.parentNode}
            optionFilterProp="v"
            filterOption={(input, option) =>
              option.v && option.v.indexOf(input) >= 0
            }
          >
            {this.state.searchLayers.map((s, index) => (
              <Select.Option v={s.name} value={s.layerName} id={s.layerName}>
                {this.props?.languageState === "ar" ? s.name : s.layerName}
              </Select.Option>
            ))}
          </Select>

          {this.state.searchFields.map((item, index) => {
            return (
              <div style={{ display: "grid" }} key={index}>
                {console.log(item)}
                {item.isDate ? (
                  <>
                    <label className="selectLabelStyle">
                      {t(`layers:${item.alias}`)}
                    </label>

                    <HijriDatePicker
                      disableOnClickOutside
                      placeholder={t(`layers:${item.alias}`)}
                      input={{
                        value: this.state.formValues[item.field],
                        onChange: this.changeDate(item.field),
                      }}
                    />
                  </>
                ) : item.dataList && item.dataList.length ? (
                  <>
                    <label className="selectLabelStyle">
                      {t(`layers:${item.alias}`)}
                    </label>
                    <Select
                      virtual={false}
                      disabled={item.dataList && item.dataList.length == 0}
                      showSearch
                      allowClear
                      notFoundContent={
                        this.state.fetching ? <Spin size="small" /> : null
                      }
                      onChange={this.selectChange(
                        item.field,
                        item.dataList,
                        item
                      )}
                      value={this.state.formValues[item.field]}
                      placeholder={t(`layers:${item.alias}`)}
                      onSearch={(e) => {
                        this.setState({ [item.field]: e });
                        this.onSearch(item, e);
                      }}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      optionFilterProp="v"
                    >
                      {item.dataList &&
                        item.dataList
                          .filter((e, i) => {
                            if (this.state[item.field]) {
                              return (
                                e.attributes[item.field] &&
                                e.attributes[item.field]
                                  .toLowerCase()
                                  .indexOf(
                                    this.state[item.field].toLowerCase()
                                  ) >= 0
                              );
                            } else {
                              return i < 100 && e.attributes[item.field];
                            }
                          })
                          .slice(0, 50)
                          .map((m, i) => {
                            return (
                              <Select.Option
                                key={item.field + i}
                                v={m.attributes[item.field]}
                                value={
                                  m.attributes[item.field + "_Code"] ||
                                  m.attributes[item.field]
                                }
                              >
                                {m.attributes[item.field]}
                              </Select.Option>
                            );
                          })}
                    </Select>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>

        {this.state.searchLayer && (
          <div>
            {filterText && (
              <div style={{ display: "grid" }}>
                <label className="selectLabelStyle">
                  {t(`layers:${filterText.alias}`)}
                </label>

                <Input
                  name={filterText.field}
                  onChange={this.handleChangeInput}
                  value={this.state.formValues[filterText.field]}
                  placeholder={t(`layers:${filterText.alias}`)}
                />
              </div>
            )}

            <div style={{ display: "grid" }}>
              <Checkbox
                style={{ marginTop: "20px" }}
                checked={this.state.isActiveBufferSearch}
                onChange={this.onChange}
              >
                {t("common:geoSearch")}
              </Checkbox>

              {this.state.isActiveBufferSearch && (
                <div style={{ display: "grid" }}>
                  <label className="selectLabelStyle">
                    {t("common:distance")}
                  </label>

                  <Input
                    name="buffer_distance"
                    onChange={this.handleBufferSearch}
                    value={this.state.buffer_distance}
                    placeholder={t("common:distance2")}
                  />
                </div>
              )}

              <div className="searchInfoStyle">
                {this.state.showInfo && <p>{t("common:clickMapToSearch")}</p>}
                {this.state.noData && <p>{t("common:noDataAvail")}</p>}
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={this.searchForData}
                  className="SearchBtn mt-3 w-25"
                  size="large"
                  htmlType="submit"
                >
                  {t("common:search")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default withTranslation(["common", "layers"])(FilterComponent);
