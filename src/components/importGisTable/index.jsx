import React, { Component } from 'react';
import { clearCanvasLine, drawLine, highlightFeature, project, zoomToFeatureDefault, showLoading } from '../../helper/common_func';
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import {  Pagination } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { withTranslation } from 'react-i18next';

class ImportGisTable extends Component {

    state = {
        displayFeatures: null,
        totalPage: 0,
        current: 1,
        minIndex: 0,
        maxIndex: 0
    }

    onMouseMoveOnFeature(feature, e) {

        if (feature.geometry) {
            highlightFeature(feature, this.props.data.map, {
                layerName: "SelectGraphicLayer",
            });
        }
        drawLine({
            feature: feature, map: this.props.data.map, event: e,
            hideFromHeight: this.props.searchTableDisplay == "searchTableShown" ? window.innerHeight * 0.6 : 200
        })
    }

    clearFeatures() {
        this.props.data.map.findLayerById("SelectGraphicLayer").removeAll();
        clearCanvasLine();
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.data !== this.props.data) {
            this.addFeaturesToTable(nextProps);
        }
    }

    componentDidMount() {
        this.addFeaturesToTable(this.props);
    }

    addFeaturesToTable(props) {
        showLoading(true);
        let features = [];

        if (props.data.uploadFileType == "cad") {
            let displayFeatures = props.data.data.shapeFeatures;
            if (displayFeatures) {
                Object.keys(displayFeatures).map((key) => {
                    displayFeatures[key] = displayFeatures[key].map((f) => {
                        return {
                            geometry: f, attributes: { ...f.attributes, layerName: key, area: f.area }
                        }
                    });
                    features = features.concat(displayFeatures[key]);
                });
            }
        }
        else if (props.data.uploadFileType == "kmz") {
            features = props.data.data.features;
            if (features) {
                features.forEach((f) => {
                    f.geometry.spatialReference = props.data.data.spatialReference;
                    delete f.attributes["PopupInfo"]
                });
            }
        }

        if (features) {
            project(features, 102100, (res) => {

                this.setState({
                    displayFeatures: res,
                    allCount: res.length,
                    totalPage: res.length / window.paginationCount,
                    minIndex: 0,
                    maxIndex: window.paginationCount
                });

                setTimeout(() => {
                    highlightFeature(res, this.props.data.map, {
                        isHighlighPolygonBorder: true,
                        highlightWidth: 3,
                        layerName: "highlightGraphicLayer",
                        isZoom: true,
                        zoomDuration: 1000
                    });

                }, 1000);

                showLoading(false);
            });
        }
    }

    handleChange = (page) => {
        this.setState({
            current: page,
            minIndex: (page - 1) * window.paginationCount,
            maxIndex: page * window.paginationCount
        });
    };

    render() {
        const {t}=this.props
        const { displayFeatures, current, minIndex, maxIndex } = this.state;
        return (
            <div>
                <div className='tableTitle'>
                    <span className="px-2"> {t('mapTools.resultNum')} </span>
                    <span style={{ fontWeight: "bold" }}> {this.state.allCount}</span>
                </div>

                {displayFeatures && displayFeatures.length > 0 && <div><table class="table table-hover result-table table-bordered" >
                    <thead>

                        <th style={{ textAlign: 'center' }}>{t("element")}</th>

                        {Object.keys(displayFeatures[0].attributes).map((attr) => {
                            return (
                                <th style={{ textAlign: 'center' }}>{attr == "layerName" ? t('layerName') : (attr == "area" ? t('mapTools.area') : attr)}</th>
                            )
                        })}

                    </thead>
                    <tbody>
                        {displayFeatures.slice(minIndex, maxIndex).map((feature, index) => {
                            return (
                                <tr key={index}
                                    onMouseLeave={(e) => this.clearFeatures(e)}
                                    onMouseMove={(e) => this.onMouseMoveOnFeature(feature, e)}>

                                    <td style={{ textAlign: 'center' }}>
                                        {index + 1}
                                    </td>
                                    {Object.keys(displayFeatures[0].attributes).map((attr) => {
                                        return (
                                            <td style={{ textAlign: 'center' }}>
                                                {attr.indexOf('area') > -1 ? feature.attributes[attr].toFixed(2) : feature.attributes[attr]}
                                            </td>
                                        )
                                    })}
                                    <td>
                                        <IconButton style={{ fontSize: '16px' }} onClick={(e) => { zoomToFeatureDefault(feature, this.props.data.map) }}>
                                            <FontAwesomeIcon icon={faSearchPlus} />
                                        </IconButton>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                    <Pagination
                        pageSize={window.paginationCount}
                        current={current}
                        total={displayFeatures.length}
                        onChange={this.handleChange}
                        style={{ bottom: "0px", textAlign: 'center' }}
                    />
                </div>}


            </div>
        );
    }
}

export default withTranslation('map')(ImportGisTable);