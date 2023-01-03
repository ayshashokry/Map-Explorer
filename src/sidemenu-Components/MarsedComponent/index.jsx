import React, { Component } from "react";
import { message, Select } from 'antd';
import {
    clearGraphicLayer, drawText, getFeatureDomainName, getLayerId, groupBy, highlightFeature
    , queryTask, showGeneralDataTable, showLoading, zoomToFeatureByFilter
} from "../../helper/common_func";
// import { layersSetting } from "../../helper/layers";
import { DownCircleFilled } from "@ant-design/icons";
import * as watchUtils from "@arcgis/core/core/watchUtils";
import HijriDatePicker from '../../components/hijriDatePicker/components/HijriDatePicker';
import DefaultPieChart from '../../components/charts/DefaultPieChart'
import DefaultBarChart from '../../components/charts/DefaultBarChart'
import { withTranslation } from "react-i18next";

class MarsedComponent extends Component {

    state = {
        searchLayer: "Eastern_Marsad",
        formValues: {},
        searchFields: [],
        Indicators: [],
        isActiveBufferSearch: false,
        showInfo: false,
        noData: false,
        isShowResult: false,
        INDICATOR_DEFINATION: null,
        pieChartData: null,
        chartTypes: [{ name: "Pie Chart" }, { name: "Range Chart" }],
        chartType: null
    }
    govs_boundry = [];

    self = this;
    mapPoint = null;
    layerdId = getLayerId(this.props.map.__mapInfo, "Eastern_Marsad");

    legendColors = ['#5f6366', '#2b7f42', '#4d6d9a', '#deced1', '#86b3d1', '#99ced3', '	#eecbd1', '#784a62', '#f26666', '#b1945c'];

    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    componentDidMount() {

        watchUtils.whenTrue(this.props.map.view, "ready", () => {
            watchUtils.whenOnce(this.props.map.view, "extent", () => {
                watchUtils.whenTrue(this.props.map.view, "stationary", () => {
                    if (this.state.pieChartData != null) {
                        this.state.pieChartData.forEach((feature) => {
                            var screenPoint = this.props.map.view.toScreen(feature.geometry.centroid);
                            feature.geometry.screenPoint = screenPoint;
                        });
                        this.setState({ pieChartData: [...this.state.pieChartData] });
                    }
                });
            });
        });

        let govLayerId = getLayerId(this.props.map.__mapInfo, "GOV_boundary");
        queryTask({
            url: window.mapUrl + "/" + govLayerId,
            where: "1=1",
            returnGeometry: true,
            outFields: ['GOV_CODE', 'GOVERNORAT'],
            orderByFields: ['GOV_CODE'],
            callbackResult: ({ features }) => {
                this.govs_boundry = features;
                this.getListsValue("Eastern_Marsad");
            }
        });
    }

    handlePrint = () => {
        localStorage.setItem("marsedChart", JSON.stringify(this.marsadChartToPrint));
        window.open(process.env.PUBLIC_URL +'/MarsedStatisticsPrint');
    }

    handleSearchSelect = () => (layer) => {

        this.setState({
            searchLayer: layer, showInfo: false, noData: false,
            formValues: {},
            searchFields: [],
            isActiveBufferSearch: false
        });

        this.getListsValue(layer);

    }

    getListsValue = (layer, getListsAfterFieldName, parentFilter) => {
        let layersSetting = this.props.mainData.layers;
        //get all filters
        let promiseQueries = [];
        let fieldsName = [];

        layersSetting[layer].searchFields.filter((x) => !x.isSearch).forEach((item, index) => {

            if (!getListsAfterFieldName) {
                fieldsName.push(item.field);

                let filterQuery = (parentFilter ? parentFilter + " and " + item.field + " is not null" : "1=1");

                promiseQueries.push(queryTask({
                    url: window.mapUrl + "/" + this.layerdId,
                    where: filterQuery,
                    outFields: item.zoomLayer && item.zoomLayer.filterField && !item.zoomLayer.isNotSameAttributeNameInLayer ? [item.field, item.zoomLayer.filterField] : [item.field],
                    returnGeometry: false,
                    returnExecuteObject: true,
                    returnDistinctValues: true
                }));

            }
            else {
                if (item.field == getListsAfterFieldName)
                    getListsAfterFieldName = null;
            }
        });


        if (promiseQueries.length > 0)
            showLoading(true);
        else {
            this.setState({
                searchFields:
                    layersSetting[layer].searchFields.filter((x) => !x.isSearch)
            });
        }
        Promise.all(promiseQueries).then((resultsData) => {

            this.mapResultWithDomain(resultsData, fieldsName, this.layerdId).then((data) => {

                data.forEach((item, index) => {
                    
                    let searchField = layersSetting[layer].searchFields.find((x => x.field == fieldsName[index]))
                    if (item.features.length > 0)
                        searchField.dataList = fieldsName[index]==="MUNICIPALITY_NAME"?
                        [...item.features.filter(f=>f.attributes['MUNICIPALITY_NAME']).sort((a,b)=>a.attributes['MUNICIPALITY_NAME'].localeCompare(b.attributes['MUNICIPALITY_NAME'],'ar'))]:
                        [...item.features];
                    else {
                        searchField.dataList = [];
                    }
                });
                this.setState({
                    searchFields:
                        layersSetting[layer].searchFields.filter((x) => !x.isSearch),
                    formValues: { ...this.state.formValues }
                });

                showLoading(false);
            });

        });

    }


    mapResultWithDomain = (results, fieldsName, layerId) => {

        return new Promise((resolve, reject) => {

            let count = fieldsName.length;

            results.forEach((item, index) => {

                getFeatureDomainName(item.features, layerId).then(
                    (domainResult) => {

                        item.features = domainResult;

                        --count;
                        if (count < 1) {
                            resolve(results);
                        }

                    });
            })

        });

    }

    selectChange = (name, listData, item) => (e) => {
        let layersSetting = this.props.mainData.layers;

        this.setState({ showInfo: false, noData: false })
        this.setState({ formValues: { ...this.state.formValues, [name]: e } }, () => {
            let searchField = layersSetting[this.state.searchLayer].searchFields.find((i) => i.field == name && !i.isSearch);
            if (searchField) {
                let filterQuery = [];


                if (searchField.zoomLayer) {
                    let item = searchField.dataList.find((x) => (x.attributes[name + "_Code"] || x.attributes[name]) == this.state.formValues[name]);

                    let where = "";
                    if (searchField.zoomLayer.isNotSameAttributeNameInLayer) {
                        where = searchField.zoomLayer.filterField + '=' + "'" +
                            (item.attributes[searchField.field + "_Code"] || item.attributes[searchField.zoomLayer.field]) + "'";
                    }
                    else {
                        where = searchField.zoomLayer.filterField + '=' + "'" +
                            (item.attributes[searchField.zoomLayer.filterField + "_Code"] || item.attributes[searchField.zoomLayer.filterField]) + "'";
                    }
                    zoomToFeatureByFilter(where, searchField.zoomLayer.name, this.props.map);
                }


                this.state.formValues = this.deleteChildValues(name);

                Object.keys(this.state.formValues).forEach((key) => {
                    if (this.state.formValues[key])
                        filterQuery.push(key + "='" + this.state.formValues[key] + "'");
                });

                this.getListsValue(this.state.searchLayer, name, filterQuery.join(' and '));

            }
        });
    }

    deleteChildValues = (name) => {
        let layersSetting = this.props.mainData.layers;

        let found = false;
        layersSetting[this.state.searchLayer].searchFields.forEach((item) => {
            if (found) {
                delete this.state.formValues[item.field];
            }
            if (item.field == name) {
                found = true;
            }
        });

        return this.state.formValues;
    }

    handleChangeInput = (e) => {
        this.setState({ showInfo: false, noData: false, formValues: { ...this.state.formValues, [e.target.name]: e.target.value } });
    };

    handleBufferSearch = (e) => {
        this.setState({ showInfo: false, noData: false, buffer_distance: e.target.value });
    };

    onChange = (e) => {
        this.setState({ isActiveBufferSearch: !this.state.isActiveBufferSearch });
    }
    changeDate = (name) => (e) => {
        this.setState({ formValues: { ...this.state.formValues, [name]: e } });
    }

    interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(color) {
        return "#" + this.componentToHex(color[0]) + this.componentToHex(color[1]) + this.componentToHex(color[2]);
    }

    interpolateColors(color1, color2, steps) {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);

        for (var i = 0; i < steps; i++) {
            interpolatedColorArray.push(this.rgbToHex(this.interpolateColor(color1, color2, stepFactor * i)));
        }

        return interpolatedColorArray;
    }

    componentWillUnmount() {
        showGeneralDataTable({
            type: "marsadTable",
            show: false
        });
        clearGraphicLayer("ThematicGraphicLayer" , this.props.map);
        clearGraphicLayer("MarsedNoGraphicLayer" , this.props.map);
    }

    mapGovsFromIndicatorToGovLayer(govs_boundry, indicatorGov) {

        let govs = [];

        indicatorGov.forEach((gov) => {
            var found = this.govs_boundry.find((x) => {
                return x.attributes.GOV_CODE == gov.attributes.GOV_NAME_Code
            });

            if (found) {
                govs.push(gov);
            }
        })

        return govs;

    }

    showResult = (e) => {

        this.setState({ pieChartData: null });
        clearGraphicLayer('MarsedNoGraphicLayer', this.props.map);

        if (this.state.Indicators.length == 1) {
            queryTask({
                url: window.mapUrl + "/" + this.layerdId,
                where: this.state.Indicators[0]["INDICATOR_SUBTYBE_Code"] ?
                    "INDICATOR_SUBTYBE = " + this.state.Indicators[0]["INDICATOR_SUBTYBE_Code"] : "INDICATOR_NAME = " + this.state.Indicators[0]["INDICATOR_NAME_Code"],
                outFields: ['GOV_NAME', 'INDICATOR_VALUE', 'INDICATOR_MEASURE', 'RGB', 'INDICATOR_DEFINATION'],
                returnGeometry: false,
                callbackResult: ({ features }) => {

                    if (!features[0].attributes["RGB"])
                        features[0].attributes["RGB"] = '0,255,0';

                    let colors = this.interpolateColors("rgb" + features[0].attributes["RGB"], "rgb(255,255,255)", this.govs_boundry.length + 4);
                    colors.splice(0, 2);

                    //set data to govs
                    features.forEach((feature, index) => {

                        var found = this.govs_boundry.find((x) => {
                            return x.attributes.GOV_CODE == feature.attributes.GOV_NAME
                        });
                        if (found) {

                            found.attributes.INDICATOR_VALUE = +feature.attributes.INDICATOR_VALUE;
                            found.attributes.INDICATOR_MEASURE = feature.attributes.INDICATOR_MEASURE;
                        }
                    });

                    this.govs_boundry.sort((a, b) => (a.attributes.INDICATOR_VALUE > b.attributes.INDICATOR_VALUE) ? -1 : 1)

                    highlightFeature(this.govs_boundry, this.props.map, {
                        isZoomOnly: true,
                        isZoom: true,
                        notExpandLevel: true,
                        layerName: 'highlightGraphicLayer',
                    });

                    clearGraphicLayer('MarsedNoGraphicLayer', this.props.map);

                    this.govs_boundry.forEach((feature, index) => {

                        feature.attributes.color = colors[index];

                        drawText(feature.geometry.centroid,
                            feature.attributes.INDICATOR_VALUE, this.props.map,
                            'MarsedNoGraphicLayer', 15)

                        highlightFeature(feature, this.props.map, {
                            layerName: "ThematicGraphicLayer",
                            highlighColor: feature.attributes.color,
                            noclear: index == 0 ? false : true
                        });
                    });

                    this.setState({ isShowResult: true, INDICATOR_DEFINATION: features[0].attributes["INDICATOR_DEFINATION"] });
                    this.myRef.current.scrollIntoView({ behavior: 'smooth' });
                },
                callbackError(error) { }
            })
        }
        else {

            let wherelist = [];

            this.state.Indicators.forEach((indicator) => {
                if (indicator["INDICATOR_SUBTYBE_Code"])
                    wherelist.push("INDICATOR_SUBTYBE = " + indicator["INDICATOR_SUBTYBE_Code"]);
                else
                    wherelist.push("INDICATOR_NAME = " + indicator["INDICATOR_NAME_Code"]);
            });

            this.setState({ pieChartData: [] });
            highlightFeature(this.govs_boundry, this.props.map, {
                isZoomOnly: true,
                isZoom: true,
                notExpandLevel: true,
                layerName: 'highlightGraphicLayer',
            });

            queryTask({
                url: window.mapUrl + "/" + this.layerdId,
                where: wherelist.join(' or '),
                outFields: ['GOV_NAME', 'INDICATOR_VALUE', 'INDICATOR_MEASURE', 'RGB'
                    , 'INDICATOR_DEFINATION', 'INDICATOR_SUBTYBE', 'INDICATOR_NAME'],
                returnGeometry: false,
                callbackResult: ({ features }) => {

                    getFeatureDomainName(features, this.layerdId).then((res) => {

                        let govs = groupBy(res, "GOV_NAME_Code");

                        let partsList = [...res];
                        let ind_parent = partsList.filter((x) => { return !x.attributes.INDICATOR_SUBTYBE });
                        let ind_subType = partsList.filter((x) => { return x.attributes.INDICATOR_SUBTYBE });

                        let indicatorsForMarsadTable = groupBy(ind_parent, "INDICATOR_NAME");
                        let orderedIndicatorsForMarsadTable = {};

                        if (res.find((x) => { return x.attributes.INDICATOR_SUBTYBE_Code != null })) {
                            indicatorsForMarsadTable = { ...indicatorsForMarsadTable, ...groupBy(ind_subType, "INDICATOR_SUBTYBE") };
                        }

                        Object.keys(indicatorsForMarsadTable).forEach((key) => {

                            let mappedGovs = this.mapGovsFromIndicatorToGovLayer(this.govs_boundry, [...indicatorsForMarsadTable[key]]);
                            mappedGovs.sort((a, b) => (a.attributes.GOV_NAME_Code > b.attributes.GOV_NAME_Code) ? 1 : -1)

                            indicatorsForMarsadTable[key] = {
                                color: this.state.Indicators.find((x) => {
                                    return x.INDICATOR_SUBTYBE == key || x.INDICATOR_NAME == key
                                }).color, govs: [...mappedGovs]
                            };
                        });

                        this.state.Indicators.forEach((indicator) => {
                            if (indicator.INDICATOR_SUBTYBE) {
                                orderedIndicatorsForMarsadTable[indicator.INDICATOR_SUBTYBE] = indicatorsForMarsadTable[indicator.INDICATOR_SUBTYBE];
                            }
                            else {
                                orderedIndicatorsForMarsadTable[indicator.INDICATOR_NAME] = indicatorsForMarsadTable[indicator.INDICATOR_NAME];
                            }
                        })

                        Object.keys(govs).forEach((govCode) => {

                            var found = this.govs_boundry.find((x) => {
                                return x.attributes.GOV_CODE == govCode
                            });

                            if (found) {
                                var screenPoint = this.props.map.view.toScreen(found.geometry.centroid);
                                found.geometry.screenPoint = screenPoint;

                                govs[govCode].map((g) => g.attributes.colorHex = this.state.Indicators.find((x) => {
                                    return x.INDICATOR_SUBTYBE_Code ?
                                        (x.INDICATOR_SUBTYBE_Code == g.attributes.INDICATOR_SUBTYBE_Code)
                                        : (x.INDICATOR_NAME_Code == g.attributes.INDICATOR_NAME_Code)
                                }).color);

                                found.chartData = govs[govCode];
                            }
                        });

                        this.setState({ pieChartData: [...this.govs_boundry] });
                        showGeneralDataTable({
                            type: "marsadTable",
                            show: true,
                            data: orderedIndicatorsForMarsadTable,
                            handlePrint: this.handlePrint
                        });

                        this.marsadChartToPrint = {
                            data: { ...orderedIndicatorsForMarsadTable },
                            chart: [...this.govs_boundry.map((gov) => { return { attributes: gov.attributes, chartData: gov.chartData, chartType: this.state.chartType } })]
                        }
                    });
                }
            });
        }
    }

    addIndicator = (e) => {

        let searchField = this.state.searchFields.find((i) => i.field == "INDICATOR_NAME");
        let indicatorField = searchField.dataList.find((x) => (x.attributes["INDICATOR_NAME_Code"] || x.attributes["INDICATOR_NAME"]) == this.state.formValues["INDICATOR_NAME"]);

        let searchSubTypeField = this.state.searchFields.find((i) => i.field == "INDICATOR_SUBTYBE");
        let indicatorSubTypeField = searchSubTypeField.dataList.find((x) => (x.attributes["INDICATOR_SUBTYBE_Code"] || x.attributes["INDICATOR_SUBTYBE"]) == this.state.formValues["INDICATOR_SUBTYBE"]);

        if(indicatorSubTypeField)
        {
            if(this.state.Indicators.find(x=> x.INDICATOR_SUBTYBE_Code ==
                indicatorSubTypeField.attributes.INDICATOR_SUBTYBE_Code))
            {
                message.warning( this.props.t('common:indicatorAddedVefore'));
                return;
            }

        }
        else{

            if(this.state.Indicators.find(x=> x.INDICATOR_NAME_Code ==
                indicatorField.attributes.INDICATOR_NAME_Code))
            {
                message.warning( this.props.t('common:indicatorAddedVefore'));
                return;
            }

        }
        //debugger
        queryTask({
            url: window.mapUrl + "/" + this.layerdId,
            where: this.state.formValues["INDICATOR_SUBTYBE"] ?
                "INDICATOR_SUBTYBE =" + this.state.formValues["INDICATOR_SUBTYBE"] : "INDICATOR_NAME = " + this.state.formValues["INDICATOR_NAME"],
            outFields: ["INDICATOR_DEFINATION"],
            returnGeometry: false,
            start: 0,
            num: 1,
            callbackResult: ({ features }) => {

                if (features.length) {

                    features[0].attributes.color = this.legendColors[this.state.Indicators.length];

                    if (indicatorField) {
                        features[0].attributes.INDICATOR_NAME = indicatorField.attributes.INDICATOR_NAME;
                        features[0].attributes.INDICATOR_NAME_Code = indicatorField.attributes.INDICATOR_NAME_Code;
                    }

                    if (indicatorSubTypeField) {
                        features[0].attributes.INDICATOR_SUBTYBE = indicatorSubTypeField.attributes.INDICATOR_SUBTYBE;
                        features[0].attributes.INDICATOR_SUBTYBE_Code = indicatorSubTypeField.attributes.INDICATOR_SUBTYBE_Code;
                    }

                    this.setState({ isShowResult: false, Indicators: [...this.state.Indicators, { ...features[0].attributes }] });
                }
            },
            callbackError(error) { },
        });

    }

    removeIndicator = (index) => {
        let list = [...this.state.Indicators];
        list.splice(index, 1);
        this.setState({ Indicators: [...list] });

    }


    handleChartChange = () => (type) => {
        this.setState({ chartType: type });
    }


    render() {
const {t}=this.props
        return (<>
            <div class="marsedStyle" style={{ textAlign: 'right', padding: '15px', backgroundColor: '#fff', zIndex: '999' }}>
                <div style={{ display: 'grid' }}>

                    {this.state.searchFields.map((item, index) => {
                        return (
                            <div style={{ display: 'grid' }} key={index}>
                                <label className="selectLabelStyle" >{t(`layers:${item.alias}`)}</label>
                                {item.isDate ? <HijriDatePicker disableOnClickOutside
                                    placeholder={t(`layers:${item.alias}`)}
                                    input={{
                                        value: this.state.formValues[item.field],
                                        onChange: this.changeDate(item.field)
                                    }} />
                                    : <Select virtual={false}
                                        key={index}
                                        suffixIcon={<DownCircleFilled />}
                                        disabled={item.dataList && item.dataList.length == 0}
                                        showSearch
                                        allowClear
                                        onChange={this.selectChange(item.field,
                                            item.dataList, item)}
                                        value={this.state.formValues[item.field]}
                                        placeholder={t(`layers:${item.alias}`)}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        optionFilterProp="v"
                                        filterOption={(input, option) =>
                                            option.v ? option.v.indexOf(input) >= 0 : false
                                        }>
                                        {item.dataList && item.dataList.slice(0, 50).map(m => {
                                            return (<Select.Option
                                                v={m.attributes[item.field]}
                                                value={m.attributes[item.field + "_Code"] || m.attributes[item.field]}>
                                                {m.attributes[item.field]}
                                            </Select.Option>)
                                        })}
                                    </Select>}
                            </div>
                        )
                    })}
                </div>

                {this.state.Indicators.length > 1 && <div style={{ display: 'grid' }}>
                    <label className="selectLabelStyle" >{ t('common:chooseChartType')}</label>
                    <Select virtual={false}
                        suffixIcon={<DownCircleFilled />}
                        showSearch
                        className="dont-show"
                        onChange={this.handleChartChange()}
                        value={this.state.chartType}
                        placeholder={t('common:chooseChartType')}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        optionFilterProp="value"
                        filterOption={(input, option) => option.value.indexOf(input) >= 0}
                    >
                        {this.state.chartTypes.map((s, index) => (
                            <Select.Option value={s.name} id={s.name}>
                                {s.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>}

                {this.state.searchLayer && this.state.searchFields.length > 0 &&

                    <div style={{ display: 'grid' }}>

                        <div style={{ textAlign: 'center' }}>

                            <button
                                onClick={this.showResult}
                                className="SearchBtn"
                                disabled={this.state.Indicators.length == 0 || (this.state.Indicators.length > 1 && this.state.chartType == null)}
                                // style={{ width: '40%', transition: 'none' }}
                                size="large"> { t('common:showres')}</button>

                            <button
                                onClick={this.addIndicator}
                                className="SearchBtn"
                               
                                disabled={
                                    !(this.state.formValues["INDICATOR_NAME"] &&
                                        !this.state.searchFields.find((f) => { return f.field == "INDICATOR_SUBTYBE" }).dataList.length > 0) &&
                                    !this.state.formValues["INDICATOR_SUBTYBE"]
                                }
                                size="large">{t('common:addPointer')}</button>

                        </div>
                    </div>
                }

                {this.state.Indicators.length > 0 &&
                    <div className="indicatorTable">
                        <table className="table table-bordered" style={{ width: '100%' }}>
                            <tr>
                                <th style={{ textAlign: 'center' }}>{ t('common:indicator')}</th>
                                {this.state.Indicators.length > 1 && <th style={{ textAlign: 'center' }}>{t('common:color')}</th>}
                                <th style={{ textAlign: 'center' }}></th>
                            </tr>
                            {this.state.Indicators.map((indicator, index) => {
                                return (
                                    <tr>
                                        <td>{indicator.INDICATOR_SUBTYBE || indicator.INDICATOR_NAME}</td>
                                        {this.state.Indicators.length > 1 &&
                                            <td>
                                                <div style={{
                                                    backgroundColor: indicator.color, margin: '5px',
                                                    width: '30px', height: '30px'
                                                }}></div>
                                            </td>
                                        }
                                        <td>
                                            <button type="primary"  className="SearchBtn mt-3 w-25 marsadDeleteBtn" 
              size="large"
              htmlType="submit"
                                                onClick={this.removeIndicator.bind(this, index)}
                                                style={{ width: 'auto' }}
                                                
                                            > حذف </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>
                        {this.state.Indicators.length == 1 && this.state.isShowResult &&
                            <div ref={this.myRef}>
                                <label style={{ whiteSpace: 'pre-wrap' }} className="indicatorTitle">{this.state.INDICATOR_DEFINATION}</label>
                                <div className="indicatorTable">
                                    <table className="table table-bordered" style={{ width: '100%' }}>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>{t('common:municipality')}</th>
                                            <th style={{ textAlign: 'center' }}>{t('common:value')}</th>
                                            <th style={{ textAlign: 'center' }}> {t('common:measuringUnit')}</th>
                                            <th style={{ textAlign: 'center' }}>{ t('common:code')}</th>
                                        </tr>
                                        {this.govs_boundry.map((indicator, index) => {
                                            return (<tr key={index}
                                                onMouseLeave={(e) => clearGraphicLayer("highlightGraphicLayer", this.props.map)}
                                                onMouseEnter={(e) => highlightFeature(indicator, this.props.map, {
                                                    isHighlighPolygonBorder: true,
                                                    strokeColor: [0, 255, 255, 1],
                                                    highlightWidth: 4,
                                                    layerName: "highlightGraphicLayer",
                                                    isZoom: false
                                                })}>
                                                <td>{indicator.attributes.GOVERNORAT}</td>
                                                <td>{indicator.attributes.INDICATOR_VALUE || 'غير متوفر'}</td>
                                                <td>{indicator.attributes.INDICATOR_MEASURE}</td>
                                                <td style={{ textAlign: 'center' }}><div style={{
                                                    backgroundColor: indicator.attributes.color, margin: '5px',
                                                    width: '30px', height: '30px'
                                                }}></div></td>
                                            </tr>)
                                        })}
                                    </table>
                                </div>

                            </div>}
                    </div>
                }

            </div>

            {this.state.pieChartData && <div>
                {this.state.pieChartData.map((feature) => {
                    return (
                        <div className="chartInfo" style={{
                            position: 'fixed',
                            top: feature.geometry.screenPoint.y - 100,
                            right: this.props.map.view.width - feature.geometry.screenPoint.x - 10
                        }}>
                            {this.state.chartType == "Pie Chart" ? <DefaultPieChart data={feature} /> : <DefaultBarChart data={feature} />}
                            <label style={{ whiteSpace: 'pre-wrap', marginTop: '30px' }} className="indicatorTitle">{feature.attributes.GOVERNORAT}</label>

                        </div>)
                })}
            </div>}

        </>

        )
    }

}
export default withTranslation(['common','layers'])(MarsedComponent)